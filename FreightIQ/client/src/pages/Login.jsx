import { Link } from "react-router-dom";
import { Ship, ArrowLeft, Mail, Lock, ArrowRight } from "lucide-react";

function Login() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 relative overflow-hidden flex items-center justify-center bg-grid-pattern py-12 px-6">
      {/* Ambient Glows */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary-500/5 rounded-full blur-[100px] pointer-events-none animate-glow" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-96 h-96 bg-blue-600/5 rounded-full blur-[120px] pointer-events-none animate-pulse-slow" />

      <div className="relative z-10 w-full max-w-[440px]">
        {/* Back Link */}
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors mb-8 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" /> Back to home
        </Link>

        {/* Form Container */}
        <div className="bg-white rounded-3xl p-8 sm:p-10 shadow-2xl border border-slate-200/80">
          <div className="flex flex-col items-center mb-8">
            <div className="bg-primary-600 text-white p-2.5 rounded-xl mb-4 shadow-lg shadow-primary-500/10">
              <Ship className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Welcome back</h1>
            <p className="text-xs text-slate-500 mt-1.5">Sign in to your FreightIQ dispatcher dashboard</p>
          </div>

          <form onSubmit={(e) => e.preventDefault()} className="space-y-5">
            {/* Email */}
            <div className="space-y-1.5 text-left">
              <label className="text-xs font-bold text-slate-500">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3.5 w-4.5 h-4.5 text-slate-400" />
                <input
                  type="email"
                  required
                  placeholder="name@company.com"
                  className="w-full bg-white border border-slate-200 rounded-xl py-3 pl-11 pr-4 text-sm font-semibold focus:border-primary-500 focus:outline-none transition-colors text-slate-900"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5 text-left">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-slate-500">Password</label>
                <a href="#" className="text-xs text-primary-600 hover:underline">Forgot password?</a>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3.5 w-4.5 h-4.5 text-slate-400" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  className="w-full bg-white border border-slate-200 rounded-xl py-3 pl-11 pr-4 text-sm font-semibold focus:border-primary-500 focus:outline-none transition-colors text-slate-900"
                />
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center text-left py-1">
              <input
                id="remember-me"
                type="checkbox"
                className="w-4.5 h-4.5 rounded border-slate-350 bg-white text-primary-600 focus:ring-primary-500 focus:ring-offset-white focus:outline-none"
              />
              <label htmlFor="remember-me" className="ml-2.5 text-xs text-slate-500 font-semibold cursor-pointer">
                Remember this computer
              </label>
            </div>

            {/* Button */}
            <button
              type="submit"
              className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3.5 rounded-xl shadow-md hover:shadow-lg shadow-primary-500/10 hover:shadow-primary-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
            >
              Sign In
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Register Redirect */}
          <div className="text-center mt-8 pt-6 border-t border-slate-200 text-xs text-slate-500">
            Don't have an enterprise account?{" "}
            <Link to="/register" className="text-primary-650 hover:underline font-bold">
              Register here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;