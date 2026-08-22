import { db } from '../firebase';
import { doc, runTransaction, collection, query, where, getDocs, limit, updateDoc, increment, addDoc, getDoc, setDoc } from '../firebase';

/**
 * Generates a sequential professional numeric ID for a new user.
 */
export async function getNextAffiliateId(): Promise<number> {
  try {
    const counterRef = doc(db, 'counters', 'affiliate');
    
    const newId = await runTransaction(db, async (transaction) => {
      const counterDoc = await transaction.get(counterRef);
      if (!counterDoc.exists()) {
        transaction.set(counterRef, { currentId: 100000 });
        return 100000;
      }
      const nextId = (counterDoc.data().currentId || 100000) + 1;
      transaction.update(counterRef, { currentId: nextId });
      return nextId;
    });
    
    return newId;
  } catch (err) {
    console.error("Transaction failed, using fallback random numeric ID", err);
    return 100000 + Math.floor(Math.random() * 899999);
  }
}

/**
 * Ensures a user has a permanent sequential affiliate ID.
 * If user already has one, returns existing ID without generating a new one.
 */
export async function ensureUserAffiliateId(uid: string, userData?: any): Promise<string> {
  if (!uid) return '';

  // 1. Check passed user object first
  let existingCode = userData?.referralCode || userData?.referral_code || userData?.affiliateId || userData?.affiliate_id;
  if (existingCode) {
    return String(existingCode);
  }

  // 2. Check Firestore document
  try {
    const userRef = doc(db, 'users', uid);
    const snap = await getDoc(userRef);
    if (snap.exists()) {
      const data = snap.data();
      existingCode = data.referralCode || data.referral_code || data.affiliateId || data.affiliate_id;
      if (existingCode) {
        return String(existingCode);
      }
    }
  } catch (err) {
    console.warn("Failed to check Firestore for affiliateId:", err);
  }

  // 3. Generate a brand new sequential numeric ID ONLY IF missing
  const newNumericId = await getNextAffiliateId();
  const strId = String(newNumericId);

  // 4. Save permanently to Firestore
  try {
    await setDoc(doc(db, 'users', uid), {
      affiliateId: newNumericId,
      referralCode: strId
    }, { merge: true });
  } catch (err) {
    console.error("Failed to save generated affiliateId to Firestore:", err);
  }

  // 5. Sync to backend SQLite API
  try {
    await fetch(`/api/users/${uid}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ referralCode: strId, affiliateId: newNumericId })
    });
  } catch (err) {
    // network fallback ignored
  }

  return strId;
}

/**
 * Finds a user by their numeric affiliate ID.
 */
export async function getUserByAffiliateId(id: string | number) {
  if (!id) return null;
  const strId = String(id).trim();
  if (!strId) return null;

  // 1. If it is numeric or convertible to a valid integer, search by affiliateId (numeric)
  const numericId = parseInt(strId);
  if (!isNaN(numericId) && String(numericId) === strId) {
    try {
      const q = query(
        collection(db, 'users'), 
        where('affiliateId', '==', numericId), 
        limit(1)
      );
      const snap = await getDocs(q);
      if (!snap.empty) {
        return { uid: snap.docs[0].id, ...snap.docs[0].data() };
      }
    } catch (e) {
      console.warn("Numeric affiliateId query error:", e);
    }
  }

  // 2. Search by referralCode (string)
  try {
    const qStr = query(
      collection(db, 'users'),
      where('referralCode', '==', strId),
      limit(1)
    );
    const snapStr = await getDocs(qStr);
    if (!snapStr.empty) {
      return { uid: snapStr.docs[0].id, ...snapStr.docs[0].data() };
    }
  } catch (e) {
    console.warn("String referralCode query error:", e);
  }

  // 3. Fallback: search by affiliateId as a string
  try {
    const qAffStr = query(
      collection(db, 'users'),
      where('affiliateId', '==', strId),
      limit(1)
    );
    const snapAffStr = await getDocs(qAffStr);
    if (!snapAffStr.empty) {
      return { uid: snapAffStr.docs[0].id, ...snapAffStr.docs[0].data() };
    }
  } catch (e) {
    console.warn("String affiliateId query error:", e);
  }

  // 4. Fallback: search by uid
  try {
    const qUid = query(
      collection(db, 'users'),
      where('uid', '==', strId),
      limit(1)
    );
    const snapUid = await getDocs(qUid);
    if (!snapUid.empty) {
      return { uid: snapUid.docs[0].id, ...snapUid.docs[0].data() };
    }
  } catch (e) {
    console.warn("Uid query error:", e);
  }

  // 5. Backend REST API fallback (SQLite database)
  try {
    const res = await fetch(`/api/users?referralCode=${encodeURIComponent(strId)}`);
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        return data[0];
      }
    }
  } catch (e) {
    console.warn("Backend referral lookup fallback error:", e);
  }

  return null;
}

/**
 * Processes revenue share when a referred user loses a trade.
 * Bivaax model: Referrer gets a share of the lost amount.
 */
export async function processRevenueShare(userId: string, lostAmount: number, currency: string) {
  try {
    const userSnap = await getDocs(query(collection(db, 'users'), where('uid', '==', userId), limit(1)));
    if (userSnap.empty) {
        // If query by uid fails (depending on how it's stored), try direct doc
        const userDoc = await getDocs(query(collection(db, 'users'), where('email', '!=', ''), limit(1))); // dummy but better use standard doc
    }
    
    // Better: just use the userId directly if we have it
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDocs(query(collection(db, 'users'), where('__name__', '==', userId), limit(1)));
    if (userDoc.empty) return;
    
    const userData = userDoc.docs[0].data();
    const referrerUid = userData.referredBy || userData.referredByUid || userData.referred_by_uid;
    if (!referrerUid) return;

    const referrerRef = doc(db, 'users', referrerUid);
    const referrerSnap = await getDocs(query(collection(db, 'users'), where('__name__', '==', referrerUid), limit(1)));
    
    if (referrerSnap.empty) return;
    const referrerData = referrerSnap.docs[0].data();

    // Determine share percentage (default 50% or from tier)
    let sharePercent = 50;
    if (referrerData.customAffiliateShare) {
        sharePercent = referrerData.customAffiliateShare;
    } else {
        // Basic tier logic
        const refCount = referrerData.referralCount || 0;
        if (refCount >= 201) sharePercent = 80;
        else if (refCount >= 51) sharePercent = 70;
        else if (refCount >= 11) sharePercent = 60;
    }

    const shareAmount = lostAmount * (sharePercent / 100);

    // Update referrer balance
    await updateDoc(referrerRef, {
      affiliateBalance: increment(shareAmount),
      totalAffiliateEarnings: increment(shareAmount)
    });

    // Log the commission
    await addDoc(collection(db, 'affiliate_commissions'), {
        referrerUid,
        referredUid: userId,
        amount: shareAmount,
        lostAmount: lostAmount,
        currency: currency,
        percent: sharePercent,
        createdAt: Date.now(),
        type: 'revenue_share'
    });

  } catch (err) {
    console.error("Error processing revenue share:", err);
  }
}
