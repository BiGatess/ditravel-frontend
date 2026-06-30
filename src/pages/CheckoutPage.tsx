import React, { useEffect, useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAdminAuth } from '../context/AdminAuthContext';
import CartStep from '../components/checkout/CartStep';
import PaymentStep from '../components/checkout/PaymentStep';
import SuccessStep from '../components/checkout/SuccessStep';
import axiosClient from '../api/axios';

const toBoolean = (value: any, fallback = true) => {
  if (value === null || value === undefined) return fallback;
  if (typeof value === 'boolean') return value;
  if (typeof value === 'number') return value !== 0;
  if (typeof value === 'string') return value.toLowerCase() === 'true' || value === '1' || value.toLowerCase() === 'yes';
  return fallback;
};

export default function CheckoutPage() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPaid, setIsPaid] = useState(false);
  const [contactInfo, setContactInfo] = useState({ name: '', phone: '', email: '', address: '' });
  const [errors, setErrors] = useState({ name: '', phone: '', email: '' });
  const [paymentConfig, setPaymentConfig] = useState({
    enabled: true,
    bank_code: 'VCB',
    bank_name: 'Vietcombank',
    account_number: '0071001060528',
    account_name: 'CT TNHH DI VUI',
    transfer_note_prefix: '119123',
    qr_template: 'compact2',
    webhook_url: '',
    webhook_secret: '',
    support_phone: '1900 0000',
    support_email: 'hotro@ditravel.com',
    description: '',
  });

  const { user } = useAdminAuth();
  const { cartItems, updateQuantity, removeRow, totalItems, totalPrice } = useCart();

  useEffect(() => {
    if (!user) return;

    setContactInfo((prev) => ({
      name: prev.name || user.full_name || '',
      phone: prev.phone || user.phone || '',
      email: prev.email || user.email || '',
      address: prev.address || user.address || '',
    }));
  }, [user]);

  useEffect(() => {
    let isMounted = true;
    const fetchPaymentConfig = async () => {
      try {
        const res = await axiosClient.get(
          '/settings/public?keys=sepay.enabled,sepay.bank_code,sepay.bank_name,sepay.account_number,sepay.account_name,sepay.transfer_note_prefix,sepay.qr_template,sepay.webhook_url,sepay.webhook_secret,sepay.support_phone,sepay.support_email,sepay.description'
        );
        if (!isMounted) return;
        setPaymentConfig(prev => ({
          ...prev,
          enabled: toBoolean(res.data['sepay.enabled'], prev.enabled),
          bank_code: res.data['sepay.bank_code'] || prev.bank_code,
          bank_name: res.data['sepay.bank_name'] || prev.bank_name,
          account_number: res.data['sepay.account_number'] || prev.account_number,
          account_name: res.data['sepay.account_name'] || prev.account_name,
          transfer_note_prefix: res.data['sepay.transfer_note_prefix'] || prev.transfer_note_prefix,
          qr_template: res.data['sepay.qr_template'] || prev.qr_template,
          webhook_url: res.data['sepay.webhook_url'] || prev.webhook_url,
          webhook_secret: res.data['sepay.webhook_secret'] || prev.webhook_secret,
          support_phone: res.data['sepay.support_phone'] || prev.support_phone,
          support_email: res.data['sepay.support_email'] || prev.support_email,
          description: res.data['sepay.description'] || prev.description,
        }));
      } catch {
        // Use defaults if config is missing or the public endpoint is unavailable.
      }
    };
    fetchPaymentConfig();
    return () => {
      isMounted = false;
    };
  }, []);

  const handlePayment = () => {
    let newErrors = { name: '', phone: '', email: '' };
    let hasError = false;

    if (!contactInfo.name.trim()) { newErrors.name = 'Vui lòng nhập họ tên'; hasError = true; }
    if (!contactInfo.phone.trim()) { newErrors.phone = 'Vui lòng nhập số điện thoại'; hasError = true; }
    if (!contactInfo.email.trim()) { newErrors.email = 'Vui lòng nhập email'; hasError = true; }

    setErrors(newErrors);

    if (hasError) return;

    setIsProcessing(true);
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      setStep(3);
    }, 3000);
  };

  const steps = [
    { id: 1, name: 'Giỏ hàng' },
    { id: 2, name: 'Thanh toán' },
    { id: 3, name: 'Hoàn tất' }
  ];

  return (
    <div className="bg-slate-50 min-h-screen pb-16 pt-8">
      <div className="container mx-auto px-2 max-w-[1100px]">
        {/* Timeline */}
        <div className="mb-14 max-w-2xl mx-auto hidden md:block">
          <div className="flex items-center justify-between relative">
            <div className="absolute left-[15px] right-[15px] top-[14px] h-[3px]">
              <div className="w-full bg-slate-200 h-full rounded-full relative overflow-hidden">
                 <div 
                   className="bg-[#ff5b00] h-full transition-all duration-500" 
                   style={{ width: step === 1 ? '0%' : step === 2 ? '50%' : '100%' }} 
                 />
              </div>
            </div>
            {steps.map((s) => (
               <div key={s.id} className="relative z-10 flex flex-col items-center">
                 <div className={`w-[30px] h-[30px] rounded-full flex items-center justify-center font-bold text-[13px] transition-colors duration-500 ${step >= s.id ? 'bg-[#ff5b00] text-white' : 'bg-slate-200 text-slate-500'}`}>
                   {s.id}
                 </div>
                 <span className={`absolute top-[38px] left-1/2 -translate-x-1/2 whitespace-nowrap text-[13px] font-medium transition-colors duration-500 ${step >= s.id ? 'text-slate-800' : 'text-slate-400'}`}>{s.name}</span>
               </div>
            ))}
          </div>
        </div>

        {step === 1 && (
          <CartStep 
            cartItems={cartItems}
            totalItems={totalItems}
            totalPrice={totalPrice}
            removeRow={removeRow}
            updateQuantity={updateQuantity}
            onNextStep={() => setStep(2)}
          />
        )}

        {step === 2 && (
          <PaymentStep 
            contactInfo={contactInfo}
            setContactInfo={setContactInfo}
            errors={errors}
            cartItems={cartItems}
            totalPrice={totalPrice}
            isProcessing={isProcessing}
            onPrevStep={() => setStep(1)}
            onNextStep={handlePayment}
            setIsPaid={setIsPaid}
          />
        )}

        {step === 3 && (
          <SuccessStep 
            isPaid={isPaid}
            setIsPaid={setIsPaid}
            contactInfo={contactInfo}
            cartItems={cartItems}
            totalPrice={totalPrice}
            paymentConfig={paymentConfig}
          />
        )}

      </div>
    </div>
  );
}
