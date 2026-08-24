import fs from 'fs';

const filePath = 'src/pages/TradeTerminal.tsx';
let content = fs.readFileSync(filePath, 'utf8');

const replacements = [
  { from: 'ফিরে যান', to: 'Back' },
  { from: 'নতুন ওটিপি পাঠানো হচ্ছে...', to: 'Sending new OTP...' },
  { from: 'নতুন ওটিপি সফলভাবে পাঠানো হয়েছে!', to: 'New OTP sent successfully!' },
  { from: 'কোড পাননি? রিসেন্ড করুন', to: "Didn't receive code? Resend" },
  { from: 'দয়া করে সঠিক ৬ ডিজিটের ওটিপি কোডটি লিখুন', to: 'Please enter a valid 6-digit OTP code' },
  { from: 'ওটিপি কোড যাচাই করা হচ্ছে...', to: 'Verifying OTP code...' },
  { from: 'ওটিপি কোড পাঠানো হচ্ছে...', to: 'Sending OTP code...' }
];

let changed = false;
for (const r of replacements) {
  if (content.includes(r.from)) {
    content = content.split(r.from).join(r.to);
    console.log(`Replaced: "${r.from}" -> "${r.to}"`);
    changed = true;
  } else {
    console.log(`Not found: "${r.from}"`);
  }
}

if (changed) {
  fs.writeFileSync(filePath, content, 'utf8');
  console.log('Successfully updated TradeTerminal.tsx');
}
