import { useLogin } from '../../hooks/useLogin';

function Login() {
  const {
    formData,
    formError,
    isLoading,
    showPassword,
    handleInputChange,
    handleSubmit,
    togglePassword,
    handleCreateAccount,
  } = useLogin();

  return (
    <div className="w-screen h-screen bg-gradient-to-r from-[#020c02] to-[#041d05] relative overflow-hidden flex flex-col">
   
      <div className="flex justify-center pt-10 pb-6 z-10">
        <div className="flex items-center gap-2 px-4">
          <div className="w-12 h-12 relative">
            <div 
              className="w-full h-full bg-cover bg-center bg-no-repeat"
              style={{backgroundImage: 'url(/img/getStartedImg/logo-eximple.png)'}}
            ></div>
          </div>
          <span className="font-['Airlash_Raiders'] text-3xl font-normal bg-gradient-to-b from-[#1fb622] to-[#168318] bg-clip-text text-transparent">
            Eximple
          </span>
        </div>
      </div>

    
      <div className="flex-1 flex items-center justify-center px-4 md:px-8 pb-8">
        
        <form onSubmit={handleSubmit} className="flex flex-col items-center gap-6 z-10 w-full max-w-[400px]">
          
          <h2 className="font-['ZT_Nature'] text-2xl md:text-3xl font-medium text-white text-center">
            Welcome back!
          </h2>

          {/* Error Message */} 
          {formError && (
            <div className="w-full px-4 py-2 bg-red-500/20 border-2 border-red-500 rounded-lg">
              <p className="font-['ZT_Nature'] text-sm text-red-400">{formError}</p>
            </div>
          )}

          <input
            type="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            className="w-full h-14 px-6 py-3 font-['ZT_Nature'] text-xl font-medium rounded-lg border-t border-[#aaaaaa] border-l border-r border-b bg-transparent text-white placeholder:text-[rgba(170,170,170,0.5)] focus:border-[#1fb622] focus:outline-none transition-colors backdrop-blur-sm bg-black/20"
            required
          />

          <div className="relative w-full">
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              className="w-full h-14 px-6 py-3 pr-12 font-['ZT_Nature'] text-xl font-medium rounded-lg border-t border-[#aaaaaa] border-l border-r border-b bg-transparent text-white placeholder:text-[rgba(170,170,170,0.5)] focus:border-[#1fb622] focus:outline-none transition-colors backdrop-blur-sm bg-black/20"
              required
            />
            <button
              type="button"
              onClick={togglePassword}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 cursor-pointer z-10"
            >
              <img 
                src="/img/getStartedImg/eye.svg"
                alt="Toggle password visibility"
                className="w-full h-full object-contain"
              />
            </button>
          </div>

          <button 
            type="submit"
            disabled={isLoading}
            className="w-full h-14 px-4 py-2 flex justify-center items-center bg-gradient-to-b from-[#168318] to-[#1fb622] rounded-3xl shadow-[0_-2px_4px_0_rgba(255,255,255,0.5)_inset] hover:opacity-90 transition-opacity cursor-pointer mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="font-['ZT_Nature'] text-xl font-medium text-[#eeeeee] whitespace-nowrap">
              {isLoading ? 'Logging in...' : 'Login'}
            </span>
          </button>

          <button 
            type="button"
            onClick={handleCreateAccount}
            className="w-full h-14 px-4 py-2 flex justify-center items-center rounded-2xl hover:bg-[#1fb622]/10 transition-colors cursor-pointer"
          >
            <span className="font-['ZT_Nature'] text-xl font-medium text-[#1fb622] whitespace-nowrap">Create a new account</span>
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
