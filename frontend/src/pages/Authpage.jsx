import axios from "axios";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Eye,
  EyeOff,
  Lock,
  Mail,
  Mic2,
  ShieldCheck,
  User,
  Zap
} from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [isVerifyStep, setIsVerifyStep] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [isResetPassword, setIsResetPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    code: "",
    subscription: "Basic",
  });

  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("token")) navigate("/dashboard");
  }, []);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const validate = () => {
    if (!formData.email) return toast.error("Email is required");
    if (isResetPassword) {
      if (!formData.code) return toast.error("Verification code required");
      if (!formData.password) return toast.error("New password required");
      if (formData.password !== formData.confirmPassword)
        return toast.error("Passwords do not match");
    } else if (!isVerifyStep && !formData.password) {
      return toast.error("Password required");
    }
    if (!isLogin && !isVerifyStep && !formData.name)
      return toast.error("Name required");
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setIsLoading(true);
    try {
      if (isLogin) {
        const res = await axios.post("http://localhost:5000/user/login", {
          email: formData.email,
          password: formData.password,
        });
        toast.success(res?.data?.message || "Login Successful");
        const user = res.data.user;
        localStorage.setItem("email", formData.email);
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("role", user.role);
        localStorage.setItem("user", JSON.stringify(user.id));
        if (user?.role === "admin") navigate("/admin-all-users");
        else navigate("/dashboard");
      } else {
        const res = await axios.post("http://localhost:5000/user", {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          subscription: formData.subscription || 'Basic',
        });
        toast.success(res?.data?.message || "Verification code sent to email");
        setIsVerifyStep(true);
      }
    } catch (err) {
      handleError(err);
    } finally {
      setIsLoading(false);
    }
  };

  const verifyCode = async () => {
    if (!formData.code) return toast.error("Verification code required");
    setIsLoading(true);
    try {
      const res = await axios.post("http://localhost:5000/user/verify", {
        email: formData.email,
        code: formData.code,
      });
      toast.success(res?.data?.message || "Email verified!");
      setIsVerifyStep(false);
      setIsLogin(true);
      setFormData((p) => ({ ...p, code: "" }));
    } catch (err) {
      handleError(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!formData.email) return toast.error("Email is required");
    setIsLoading(true);
    try {
      const res = await axios.post(
        "http://localhost:5000/user/forgot-password",
        { email: formData.email }
      );
      toast.success(res?.data?.message || "Reset code sent to your email");
      setIsForgotPassword(false);
      setIsResetPassword(true);
    } catch (err) {
      handleError(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!validate()) return;
    setIsLoading(true);
    try {
      const res = await axios.post(
        "http://localhost:5000/user/reset-password",
        {
          email: formData.email,
          code: formData.code,
          password: formData.password,
        }
      );
      toast.success(res?.data?.message || "Password reset successful!");
      setIsForgotPassword(false);
      setIsResetPassword(false);
      setIsLogin(true);
      setFormData((p) => ({ ...p, code: "", password: "", confirmPassword: "" }));
    } catch (err) {
      handleError(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleError = (err) => {
    const msg = err?.response?.data?.message;
    const status = err?.response?.status;
    if (status === 400) return toast.error(msg || "Bad Request");
    if (status === 404) return toast.error(msg || "Not Found");
    if (status === 401) return toast.error(msg || "Unauthorized");
    if (status === 500) return toast.error("Server Error");
    toast.error(msg || "Something went wrong");
  };

  const resetToLogin = () => {
    setIsForgotPassword(false);
    setIsResetPassword(false);
    setIsLogin(true);
    setFormData((p) => ({ ...p, code: "", password: "", confirmPassword: "" }));
  };

  const step = isResetPassword ? "reset" : isForgotPassword ? "forgot" : isVerifyStep ? "verify" : isLogin ? "login" : "signup";

  const stepMeta = {
    login: { title: "Welcome Back", sub: "Sign in to your Dream Voice account", icon: <ArrowRight /> },
    signup: { title: "Create Account", sub: "Join the vocal intelligence network", icon: <User /> },
    verify: { title: "Verify Email", sub: "Enter the code sent to your inbox", icon: <ShieldCheck /> },
    forgot: { title: "Recover Password", sub: "Request a reset code", icon: <Mail /> },
    reset: { title: "New Password", sub: "Define your new credentials", icon: <Lock /> },
  };

  const { title, sub, icon } = stepMeta[step];

  return (
    <div className="min-h-screen bg-white flex flex-col lg:flex-row relative overflow-hidden font-sans text-black">
      
      {/* Visual Experience (Left Panel) */}
      <div className="hidden lg:flex lg:w-[45%] p-16 flex-col justify-between relative z-10 bg-black">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.05]"></div>
        <div>
          <div className="flex items-center gap-3 mb-16 animate-fade-in">
            <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center shadow-xl">
              <Mic2 className="text-black" size={28} />
            </div>
            <span className="text-2xl font-black text-white tracking-tighter uppercase">Dream Voice</span>
          </div>

          <div className="space-y-6 animate-slide-up">
            <h2 className="text-5xl xl:text-7xl font-black text-white leading-none tracking-tighter">
              PRECISION<br />
              <span className="italic text-slate-500">VOCAL</span><br />
              INTELLIGENCE
            </h2>
            <p className="text-slate-400 text-lg max-w-md font-medium leading-relaxed">
              The professional ecosystem for acoustic profiling, emotional analysis, and character-voice synchronization.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8 animate-fade-in" style={{ animationDelay: '0.4s' }}>
          <div className="space-y-2">
            <p className="text-4xl font-black text-white">99.8%</p>
            <p className="text-xs font-black text-slate-500 uppercase tracking-widest">Match Accuracy</p>
          </div>
          <div className="space-y-2">
            <p className="text-4xl font-black text-white">2.4ms</p>
            <p className="text-xs font-black text-slate-500 uppercase tracking-widest">Inference Latency</p>
          </div>
        </div>
      </div>

      {/* Right Panel: Auth Container */}
      <div className="flex-1 flex items-center justify-center p-6 relative z-10">
        <div className="w-full max-w-[480px] space-y-8">

          {(isForgotPassword || isResetPassword) && (
            <button onClick={resetToLogin} className="flex items-center gap-2 text-slate-500 hover:text-black transition-colors group text-sm font-bold uppercase tracking-widest">
              <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
              Back to Login
            </button>
          )}

          <div className="bg-white rounded-[2.5rem] p-10 lg:p-14 border border-slate-200 shadow-xl animate-slide-up">
            <div className="mb-10">
              <div className="w-14 h-14 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center text-black mb-6">
                {icon}
              </div>
              <h1 className="text-3xl font-black text-black tracking-tight mb-2">{title}</h1>
              <p className="text-slate-500 text-sm font-medium">{sub}</p>
            </div>

            {/* Steps Rendering */}
            <div className="space-y-6">
              {step === "forgot" && (
                <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); handleForgotPassword(); }}>
                  <Input label="Identity Email" name="email" type="email" icon={<Mail size={18} />} value={formData.email} onChange={handleChange} placeholder="user@dreamvoice.ai" />
                  <Button label="Request Reset" loading={isLoading} />
                </form>
              )}

              {step === "reset" && (
                <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); handleResetPassword(); }}>
                  <Input label="Security Token" name="code" type="text" icon={<Zap size={18} />} value={formData.code} onChange={handleChange} placeholder="000000" maxLength={6} centered />
                  <Input label="New Credential" name="password" type={showPassword ? "text" : "password"} icon={<Lock size={18} />} value={formData.password} onChange={handleChange} placeholder="••••••••" toggle={() => setShowPassword(!showPassword)} show={showPassword} />
                  <Input label="Confirm Credential" name="confirmPassword" type={showConfirm ? "text" : "password"} icon={<Lock size={18} />} value={formData.confirmPassword} onChange={handleChange} placeholder="••••••••" toggle={() => setShowConfirm(!showConfirm)} show={showConfirm} />
                  <Button label="Update System" loading={isLoading} />
                </form>
              )}

              {step === "verify" && (
                <div className="space-y-8 text-center">
                  <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                    <Mail className="mx-auto text-black mb-3" size={32} />
                    <p className="text-slate-500 text-sm">Security token dispatched to</p>
                    <p className="text-black font-bold">{formData.email}</p>
                  </div>
                  <Input label="Authentication Token" name="code" type="text" icon={<Zap size={18} />} value={formData.code} onChange={handleChange} placeholder="000000" maxLength={6} centered />
                  <Button label="Confirm Identity" onClick={verifyCode} loading={isLoading} />
                </div>
              )}

              {(step === "login" || step === "signup") && (
                <form className="space-y-6" onSubmit={handleSubmit}>
                  {step === "signup" && (
                    <Input label="Full Designation" name="name" type="text" icon={<User size={18} />} value={formData.name} onChange={handleChange} placeholder="Name" />
                  )}
                  <Input label="Access Email" name="email" type="email" icon={<Mail size={18} />} value={formData.email} onChange={handleChange} placeholder="user@dreamvoice.ai" />
                  <div className="space-y-1">
                    <Input label="Access Password" name="password" type={showPassword ? "text" : "password"} icon={<Lock size={18} />} value={formData.password} onChange={handleChange} placeholder="••••••••" toggle={() => setShowPassword(!showPassword)} show={showPassword} />
                    {step === "login" && (
                      <div className="text-right">
                        <button type="button" onClick={() => setIsForgotPassword(true)} className="text-[10px] font-black text-slate-500 hover:text-indigo-400 uppercase tracking-widest transition-colors">Recover Access?</button>
                      </div>
                    )}
                  </div>
                  {step === "signup" && (
                    <Input label="Confirm Password" name="confirmPassword" type={showConfirm ? "text" : "password"} icon={<Lock size={18} />} value={formData.confirmPassword} onChange={handleChange} placeholder="••••••••" toggle={() => setShowConfirm(!showConfirm)} show={showConfirm} />
                  )}
                  <Button label={step === "login" ? "Sign in" : "Sign up"} loading={isLoading} />
                </form>
              )}
            </div>

            {/* Footer Toggle */}
            {(step === "login" || step === "signup") && (
              <div className="mt-10 text-center space-y-4">
                <div className="h-px bg-gradient-to-r from-transparent via-white/5 to-transparent w-full"></div>
                <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">
                  {step === "login" ? "New Operator?" : "Already Registered?"}{" "}
                  <button type="button" onClick={() => { setIsLogin(!isLogin); setIsForgotPassword(false); setIsResetPassword(false); setIsVerifyStep(false); }} className="text-black hover:underline transition-colors">
                    {step === "login" ? "SIGN UP NOW" : "SIGN IN"}
                  </button>
                </p>
              </div>
            )}
          </div>

         
        </div>
      </div>
    </div>
  );
}

function Input({ label, name, type, icon, value, onChange, placeholder, maxLength, centered, toggle, show }) {
  return (
    <div className="space-y-2 group">
      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 group-focus-within:text-black transition-colors">{label}</label>
      <div className="relative">
        <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-black transition-colors">
          {icon}
        </div>
        <input
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          maxLength={maxLength}
          required
          className={`w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-14 pr-12 text-black placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black/20 transition-all duration-300 font-bold ${centered ? 'text-center tracking-[0.5em] text-2xl' : 'text-sm'}`}
        />
        {toggle && (
          <button type="button" onClick={toggle} className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-600 hover:text-white transition-colors">
            {show ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>
    </div>
  );
}

function Button({ label, onClick, loading, type = "submit" }) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={loading}
      className="w-full relative group"
    >
      <div className="absolute -inset-1 bg-black rounded-2xl blur opacity-0 group-hover:opacity-10 transition duration-1000 group-hover:duration-200"></div>
      <div className="relative w-full py-4.5 bg-black text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-slate-900 transition-all duration-300 shadow-xl">
        {loading ? (
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
            <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
        ) : (
          <>
            {label}
            <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </>
        )}
      </div>
    </button>
  );
}