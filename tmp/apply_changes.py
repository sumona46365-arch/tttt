import os
import re

filepath = 'src/pages/TradeTerminal.tsx'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# Part 1: Heading replace
old_heading = 'Your withdrawal details</h3>'
new_heading = '''Your withdrawal details</h3>

                    {showWithdrawOtp ? (
                      <div className="animate-in fade-in zoom-in-95 duration-200 bg-[#23242A] border border-[#3b3b3f]/50 rounded-[16px] p-6 text-center mb-8">
                        <div className="w-16 h-16 bg-[#FFE24C]/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-[#FFE24C]/20">
                          <Icons.ShieldAlert className="text-[#FFE24C]" size={30} />
                        </div>
                        <h2 className="text-white text-xl font-bold mb-2">ওটিপি কোড যাচাই করুন</h2>
                        <p className="text-gray-400 text-sm max-w-xs mx-auto mb-6">
                          আমরা আপনার ইমেইলে (<span className="text-white font-medium">{auth?.currentUser?.email || withdrawEmail}</span>) একটি ৬-ডিজিটের ওটিপি কোড পাঠিয়েছি। অনুগ্রহ করে কোডটি এখানে দিন।
                        </p>

                        <div className="relative mb-6 max-w-xs mx-auto">
                          <input 
                            type="text"
                            maxLength={6}
                            value={withdrawOtpValue}
                            onChange={(e) => setWithdrawOtpValue(e.target.value.replace(/[^0-9]/g, ''))}
                            placeholder="000000"
                            className="w-full bg-[#1e1f24] border border-[#4a4a50] rounded-[12px] py-4 text-center text-[#FFE24C] placeholder-gray-600 font-black text-2xl tracking-[10px] focus:outline-none focus:border-[#FFE24C] transition-colors"
                          />
                        </div>

                        <div className="flex flex-col gap-2 max-w-xs mx-auto text-xs mt-4">
                           <button 
                             onClick={() => {
                               setShowWithdrawOtp(false);
                               setWithdrawOtpValue("");
                             }}
                             className="text-gray-400 hover:text-white transition-colors"
                           >
                             ফিরে যান
                           </button>
                           
                           <button 
                             onClick={async () => {
                                setIsRequestingOtp(true);
                                setWithdrawalLoadingText("নতুন ওটিপি পাঠানো হচ্ছে...");
                                try {
                                   const amount = Number(withdrawAmount);
                                   const baseWithdrawAmount = convertToBase(amount, userCurrency);
                                   const numAmount = Number(baseWithdrawAmount);
                                   
                                   const token = await auth.currentUser.getIdToken();
                                   const res = await fetch('/api/wallet/withdraw/send-otp', {
                                       method: 'POST',
                                       headers: {
                                           'Content-Type': 'application/json',
                                           'Authorization': `Bearer ${token}`
                                       },
                                       body: JSON.stringify({ amount: numAmount })
                                   });
                                   const data = await res.json();
                                   if (!res.ok) {
                                       throw new Error(data.error || 'Failed to resend OTP');
                                   }
                                   toast.success('নতুন ওটিপি সফলভাবে পাঠানো হয়েছে!');
                                   setIsRequestingOtp(false);
                                   setWithdrawalLoadingText("");
                                } catch (e: any) {
                                   toast.error(e.message || 'Failed to resend OTP');
                                   setIsRequestingOtp(false);
                                   setWithdrawalLoadingText("");
                                }
                             }}
                             disabled={isRequestingOtp}
                             className="text-[#FFE24C] hover:underline"
                           >
                             কোড পাননি? রিসেন্ড করুন
                           </button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-6 mb-8">'''

if old_heading in content:
    content = content.replace(old_heading, new_heading, 1)
    print("Part 1 Heading replacement successful.")
else:
    print("Part 1 Heading NOT found!")

# Part 2: Close of details fields.
# We find 'Verification Email' inputs block end and match its structural layout
pattern_fields = r'(\s*Verification Email.*?\n\s*.*?\n\s*.*?\n\s*.*?\n\s*.*?\n\s*</div>\s*\n\s*<div>\s*\n\s*<div.*?\n\s*<input.*?\n\s*value=\{withdrawAccountNumber\}.*?\n\s*onChange=.*?;\s*\n\s*\}\s*\n\s*placeholder=.*?\n\s*className=.*?\n\s*/>.*?\n\s*\{withdrawSubmitAttempted && !withdrawAccountNumber && \(\n\s*.*?\n\s*.*?\n\s*\)\}\s*\n\s*</div>\s*\n\s*\{withdrawSubmitAttempted && !withdrawAccountNumber && \(\n\s*.*?\n\s*\)\}\s*\n\s*</div>\s*\n\s*</div>)'

# Let's simplify the search by doing direct string match for:
# `value={withdrawAccountNumber}` block end
old_fields_end = '''                            {withdrawSubmitAttempted && !withdrawAccountNumber && (
                              <p className="text-[#ff4d4f] text-[13px] font-semibold mt-2 px-1">Please specify the required information</p>
                            )}
                          </div>
                        </div>
                      </div>'''

# Wait, let's normalize the carriage returns to perform a simpler search
def normalize_newlines(s):
    return s.replace('\r\n', '\n').replace('\r', '\n')

norm_content = normalize_newlines(content)

# Let's find the block containing:
# value={withdrawAccountNumber}
# and followed by closing tags and the submit button
# Let's find:
# value={withdrawAccountNumber}
# up to the end of that div
# Let's look at lines 14515 to 14537:
#                       <div>
#                         <div className="relative">
#                           <input 
#                             type="text"
#                             value={withdrawAccountNumber}
#                             ...
#                         {withdrawSubmitAttempted && !withdrawAccountNumber && (
#                           <p className="text-[#ff4d4f] text-[13px] font-semibold mt-2 px-1">Please specify the required information</p>
#                         )}
#                       </div>
#                     </div>

# Let's find this exact string pattern:
pattern_fields_end = r'value=\{withdrawAccountNumber\}.*?Please specify the required information.*?\n\s*\}\)\}\s*\n\s*</div>\s*\n\s*</div>'
match_fields_end = re.search(pattern_fields_end, norm_content, re.DOTALL)
if match_fields_end:
    raw_match = match_fields_end.group(0)
    # We want to replace the closing `</div>` of `<div className="space-y-6 mb-8">` with:
    # `</div>\n                      )}`
    # Let's find the original raw index in content
    idx = norm_content.find(raw_match)
    actual_match = content[idx:idx+len(raw_match)]
    
    # Check if Carriage returns are in the file
    cr = '\r' if '\r' in actual_match else ''
    
    new_match = actual_match + cr + '\n                      )}'
    content = content.replace(actual_match, new_match, 1)
    print("Part 2 fields end replacement successful.")
else:
    # Fallback to a simpler replace
    print("Part 2 fields end NOT found! Trying fallback...")
    # Let's find the first instance of 'Please specify the required information' following withdrawAccountNumber
    # and replace the double closing divs.
    target_pattern = r'(value=\{withdrawAccountNumber\}.*?Please specify the required information.*?\n\s*\}\)\}\s*\n\s*</div>\s*\n\s*</div>)'
    match = re.search(target_pattern, content, re.DOTALL)
    if match:
        content = content.replace(match.group(1), match.group(1) + '\n                      )}')
        print("Fallback Part 2 successful.")
    else:
        print("Fallback Part 2 failed.")

# Part 3: Click handler replacement
pattern_click = r'setIsRequestingOtp\(true\);\s*setWithdrawalLoadingText\("Authenticating withdrawal request\.\.\."\);.*?\},\s*800\);'
match_click = re.search(pattern_click, normalize_newlines(content), re.DOTALL)
if match_click:
    idx_click = normalize_newlines(content).find(match_click.group(0))
    raw_click_block = content[idx_click:idx_click+len(match_click.group(0))]
    
    new_click_handler = '''setIsRequestingOtp(true);
                               setWithdrawalLoadingText("ওটিপি কোড পাঠানো হচ্ছে...");
                               
                               setTimeout(async () => {
                                   if (auth?.currentUser) {
                                       try {
                                           const baseWithdrawAmount = convertToBase(amount, userCurrency);
                                           const numAmount = Number(baseWithdrawAmount);
                                           
                                           const token = await auth.currentUser.getIdToken();
                                           const res = await fetch('/api/wallet/withdraw/send-otp', {
                                               method: 'POST',
                                               headers: {
                                                   'Content-Type': 'application/json',
                                                   'Authorization': `Bearer ${token}`
                                               },
                                               body: JSON.stringify({ amount: numAmount })
                                           });
                                           const data = await res.json();
                                           if (!res.ok) {
                                               throw new Error(data.error || 'Failed to send OTP');
                                           }
                                           
                                           toast.success('Verification OTP code sent to your email!');
                                           setShowWithdrawOtp(true);
                                           setIsRequestingOtp(false);
                                           setWithdrawalLoadingText("");
                                       } catch (e: any) {
                                           toast.error(e.message || 'Processing failed');
                                           setIsRequestingOtp(false);
                                           setWithdrawalLoadingText("");
                                       }
                                   }
                               }, 500);'''
    content = content.replace(raw_click_block, new_click_handler)
    print("Part 3 click handler replacement successful.")
else:
    print("Part 3 click handler NOT found!")

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
print("All modifications completed successfully.")
