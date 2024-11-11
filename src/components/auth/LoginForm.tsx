import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { toast } from 'react-hot-toast';

export const LoginForm: React.FC = () => {
  const navigate = useNavigate();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const { signIn, signUp } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (isSignUp) {
        await signUp(email, password, firstName, lastName);
        toast.success('تم إنشاء الحساب بنجاح! يمكنك الآن تسجيل الدخول');
        setIsSignUp(false);
      } else {
        await signIn(email, password);
        toast.success('تم تسجيل الدخول بنجاح!');
        navigate('/dashboard');
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#1A1A1A] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h1 className="text-center text-4xl font-bold text-neon mb-2">وجيز</h1>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-100">
            {isSignUp ? 'إنشاء حساب جديد' : 'تسجيل الدخول'}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-400">
            {isSignUp ? 'لديك حساب بالفعل؟' : 'ليس لديك حساب؟'}{' '}
            <button
              onClick={() => setIsSignUp(!isSignUp)}
              className="font-medium text-neon hover:text-neon/80"
              disabled={isLoading}
            >
              {isSignUp ? 'تسجيل الدخول' : 'إنشاء حساب'}
            </button>
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-xl shadow-sm -space-y-px bg-[#2A2A2A]">
            {isSignUp && (
              <>
                <div>
                  <label htmlFor="firstName" className="sr-only">
                    الاسم الأول
                  </label>
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    required
                    className="appearance-none rounded-t-xl relative block w-full px-3 py-2 bg-[#2A2A2A] border border-[#3A3A3A] placeholder-gray-500 text-gray-100 focus:outline-none focus:ring-neon focus:border-neon focus:z-10 sm:text-sm"
                    placeholder="الاسم الأول"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    disabled={isLoading}
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="sr-only">
                    اسم العائلة
                  </label>
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    required
                    className="appearance-none relative block w-full px-3 py-2 bg-[#2A2A2A] border border-[#3A3A3A] placeholder-gray-500 text-gray-100 focus:outline-none focus:ring-neon focus:border-neon focus:z-10 sm:text-sm"
                    placeholder="اسم العائلة"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    disabled={isLoading}
                  />
                </div>
              </>
            )}
            <div>
              <label htmlFor="email" className="sr-only">
                البريد الإلكتروني
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className={`appearance-none relative block w-full px-3 py-2 bg-[#2A2A2A] border border-[#3A3A3A] placeholder-gray-500 text-gray-100 focus:outline-none focus:ring-neon focus:border-neon focus:z-10 sm:text-sm ${
                  isSignUp ? '' : 'rounded-t-xl'
                }`}
                placeholder="البريد الإلكتروني"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                كلمة المرور
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="appearance-none rounded-b-xl relative block w-full px-3 py-2 bg-[#2A2A2A] border border-[#3A3A3A] placeholder-gray-500 text-gray-100 focus:outline-none focus:ring-neon focus:border-neon focus:z-10 sm:text-sm"
                placeholder="كلمة المرور"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-xl text-black bg-neon hover:bg-neon/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-neon focus:ring-offset-[#1A1A1A] disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  جاري المعالجة...
                </span>
              ) : (
                isSignUp ? 'إنشاء حساب' : 'تسجيل الدخول'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};