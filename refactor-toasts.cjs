const fs = require('fs');
const path = require('path');

const adminDir = path.join('f:/ditravel/FE/src/pages/admin');
const files = fs.readdirSync(adminDir).filter(f => f.endsWith('.tsx') && f !== 'BannersPage.tsx' && f !== 'AdminLoginPage.tsx' && f !== 'DashboardPage.tsx');

for (const file of files) {
  const filePath = path.join(adminDir, file);
  let content = fs.readFileSync(filePath, 'utf-8');

  // Add import if not present
  if (!content.includes('Toast, { ToastMessage')) {
    content = content.replace(/import axiosClient from '..\/..\/api\/axios';/, "import axiosClient from '../../api/axios';\nimport Toast, { ToastMessage, ToastType } from '../../components/admin/Toast';");
  }

  // Change toastMessage state definition
  content = content.replace(/const \[toastMessage, setToastMessage\] = useState<string \| null>\(null\);/g, "const [toastMessage, setToastMessage] = useState<ToastMessage | null>(null);");
  content = content.replace(/const \[toastMessage, setToastMessage\] = useState<{title: string, message: string, type\?: 'success' \| 'error'} \| null>\(null\);/g, "const [toastMessage, setToastMessage] = useState<ToastMessage | null>(null);");
  content = content.replace(/const \[toastMessage, setToastMessage\] = useState<{title: string, message: string} \| null>\(null\);/g, "const [toastMessage, setToastMessage] = useState<ToastMessage | null>(null);");

  // Fix showToast functions
  if (content.includes('showToast(msg: string)')) {
    content = content.replace(/const showToast = \(msg: string\) => {[\s\S]*?};/, `const showToast = (title: string, message: string, type: ToastType = 'success') => {
    setToastMessage({ title, message, type });
  };`);
    // And replace all showToast calls that took 1 arg
    content = content.replace(/showToast\(`([^`]+)`\)/g, "showToast('Thành công', `$1`)");
    content = content.replace(/showToast\('([^']+)'\)/g, "showToast('Thành công', '$1')");
    // Also, if message includes "xóa", replace with delete type
    content = content.replace(/showToast\('Thành công', `Đã xóa([^`]+)`\)/g, "showToast('Đã xóa', `Đã xóa$1`, 'delete')");
    content = content.replace(/showToast\('Thành công', 'Đã xóa([^']+)'\)/g, "showToast('Đã xóa', 'Đã xóa$1', 'delete')");
  } else if (content.includes('showToast = (title: string, message: string, type?:')) {
    content = content.replace(/const showToast = \(title: string, message: string, type\?: 'success' \| 'error'\) => {[\s\S]*?};/, `const showToast = (title: string, message: string, type: ToastType = 'success') => {
    setToastMessage({ title, message, type });
  };`);
  } else if (content.includes('showToast = (title: string, message: string, type:')) {
    content = content.replace(/const showToast = \(title: string, message: string, type: 'success' \| 'error' = 'success'\) => {[\s\S]*?};/, `const showToast = (title: string, message: string, type: ToastType = 'success') => {
    setToastMessage({ title, message, type });
  };`);
  }

  // Find the JSX Toast Notification block
  const toastBlockRegex = /{\/\*\s*Toast Notification\s*\*\/}[\s\S]*?{\/\* [A-Za-z ]+ \*\//;
  const match = content.match(toastBlockRegex);
  if (match) {
    const nextComment = match[0].match(/{\/\* [A-Za-z ]+ \*\//)[0];
    content = content.replace(toastBlockRegex, `{/* Toast Notification */}\n      <Toast toast={toastMessage} onClose={() => setToastMessage(null)} />\n\n      ${nextComment}`);
  } else {
    // If we can't find it easily with comments, let's just do a manual replacement if it exists
    const toastBlockAltRegex = /{\/\*\s*Toast Notification\s*\*\/}[\s\S]*?\(null\)} className="ml-auto text-slate-400 hover:text-slate-600">\s*<X className="w-4 h-4" \/>\s*<\/button>\s*<\/div>\s*<\/div>\s*\)}/;
    if (content.match(toastBlockAltRegex)) {
      content = content.replace(toastBlockAltRegex, `{/* Toast Notification */}\n      <Toast toast={toastMessage} onClose={() => setToastMessage(null)} />`);
    }
  }

  fs.writeFileSync(filePath, content, 'utf-8');
}
