import { useTypingAnimation } from '../../hooks/useTypingAnimation';
import { useRegister } from '../../hooks/useRegister';

const TYPING_TEXTS = [
  "You don't want to lose all your progress.",
  "Create a new account!"
];

function Register() {
  const { typingText1, typingText2, currentLine } = useTypingAnimation(TYPING_TEXTS);
  const {
    formData,
    formError,
    isLoading,
    showPassword,
    showConfirmPassword,
    handleInputChange,
    handleSubmit,
    togglePassword,
    toggleConfirmPassword,
    handleLogin,
  } = useRegister();

  return (
    <div className="w-screen h-screen bg-gradient-to-r from-[#020c02] to-[#041d05] relative overflow-hidden flex flex-col">
   
      <div className="flex justify-center pt-10 pb-6 z-10">
        <div className="flex items-center gap-2 px-4">
          <div className="w-12 h-12 relative">
            <div 
              className="w-full h-full bg-cover bg-center bg-no-repeat"
              style={{backgroundImage: 'url(/img/getStartedImg/icon.png)'}}
            ></div>
          </div>
          <span className="font-['Airlash_Raiders'] text-3xl font-normal bg-gradient-to-b from-[#1fb622] to-[#168318] bg-clip-text text-transparent">
            Eximple
          </span>
        </div>
      </div>

    
      <div className="flex justify-center pb-8 z-10 px-4">
        <h2 className="font-['Press_Start_2P'] text-sm md:text-base lg:text-lg text-white text-center leading-relaxed">
          <span>{typingText1}</span>
          <span className={currentLine === 0 ? 'inline-block w-0.5 h-5 bg-[#1fb622] ml-1 animate-[blink_0.75s_step-end_infinite]' : 'hidden'}></span>
          <br />
          <span>{typingText2}</span>
          <span className={currentLine === 1 ? 'inline-block w-0.5 h-5 bg-[#1fb622] ml-1 animate-[blink_0.75s_step-end_infinite]' : 'hidden'}></span>
        </h2>
      </div>


      <div className="flex-1 flex items-center justify-center px-4 md:px-8 pb-8 relative">
        <div className="flex items-center justify-center gap-8 md:gap-12 lg:gap-16 w-full max-w-7xl relative">
          <form onSubmit={handleSubmit} className="flex flex-col gap-6 z-10 w-full max-w-[400px] relative">
            {formError && (
              <div className="w-full px-4 py-2 bg-red-500/20 border-2 border-red-500 rounded-lg">
                <p className="font-['ZT_Nature'] text-sm text-red-400">{formError}</p>
              </div>
            )}

            <input
              type="text"
              placeholder="Enter your username"
              value={formData.username}
              onChange={(e) => handleInputChange('username', e.target.value)}
              className="w-full h-14 px-6 py-3 font-['ZT_Nature'] text-xl font-medium rounded-2xl border-4 border-[#aaaaaa] bg-transparent text-white placeholder:text-[rgba(170,170,170,0.5)] focus:border-[#1fb622] focus:outline-none transition-colors backdrop-blur-sm bg-black/20"
              required
            />

            <input
              type="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className="w-full h-14 px-6 py-3 font-['ZT_Nature'] text-xl font-medium rounded-2xl border-t border-[#aaaaaa] border-l-4 border-r-4 border-b-4 bg-transparent text-white placeholder:text-[rgba(170,170,170,0.5)] focus:border-[#1fb622] focus:outline-none transition-colors backdrop-blur-sm bg-black/20"
              required
            />

            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                placeholder="Set a secure password"
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                className="w-full h-14 px-6 py-3 pr-12 font-['ZT_Nature'] text-xl font-medium rounded-2xl border-t border-[#aaaaaa] border-l-4 border-r-4 border-b-4 bg-transparent text-white placeholder:text-[rgba(170,170,170,0.5)] focus:border-[#1fb622] focus:outline-none transition-colors backdrop-blur-sm bg-black/20"
                required
              />
              <button
                type="button"
                onClick={togglePassword}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 cursor-pointer z-10"
              >
                <div 
                  className="w-full h-full bg-cover bg-center bg-no-repeat"
                  style={{backgroundImage: 'url(/img/getStartedImg/eyes.svg)'}}
                ></div>
              </button>
            </div>

            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                id="confirmPassword"
                placeholder="Confirm your password"
                value={formData.confirm_password}
                onChange={(e) => handleInputChange('confirm_password', e.target.value)}
                className="w-full h-14 px-6 py-3 pr-12 font-['ZT_Nature'] text-xl font-medium rounded-2xl border-t border-[#aaaaaa] border-l-4 border-r-4 border-b-4 bg-transparent text-white placeholder:text-[rgba(170,170,170,0.5)] focus:border-[#1fb622] focus:outline-none transition-colors backdrop-blur-sm bg-black/20"
                required
              />
              <button
                type="button"
                onClick={toggleConfirmPassword}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 cursor-pointer z-10"
              >
                <div 
                  className="w-full h-full bg-cover bg-center bg-no-repeat"
                  style={{backgroundImage: 'url(/img/getStartedImg/eyes.svg)'}}
                ></div>
              </button>
            </div>

            <button 
              type="submit"
              disabled={isLoading}
              className="w-full h-14 px-4 py-2 flex justify-center items-center bg-gradient-to-b from-[#168318] to-[#1fb622] rounded-3xl shadow-[0_-2px_4px_0_rgba(255,255,255,0.5)_inset] hover:opacity-90 transition-opacity cursor-pointer mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="font-['ZT_Nature'] text-xl font-medium text-[#eeeeee] whitespace-nowrap">
                {isLoading ? 'Registering...' : 'Register'}
              </span>
            </button>

            <button 
              type="button"
              onClick={handleLogin}
              className="w-full h-14 px-4 py-2 flex justify-center items-center rounded-2xl hover:bg-[#1fb622]/10 transition-colors cursor-pointer"
            >
              <span className="font-['ZT_Nature'] text-xl font-medium text-[#1fb622] whitespace-nowrap">I already have an account</span>
            </button>
          </form>

          <div className="w-[300px] md:w-[400px] lg:w-[500px] aspect-square relative z-0 animate-[floatRealistic_5s_ease-in-out_infinite] hidden md:block self-start -mt-8 md:-mt-12 lg:-mt-16">
            <div 
              className="w-full h-full bg-cover bg-center bg-no-repeat"
              style={{backgroundImage: 'url(/img/getStartedImg/mascotmodel3.png)'}}
            ></div>
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes floatRealistic {
          0% { transform: translateY(0px) translateX(0px) rotate(0deg) scale(1); filter: drop-shadow(0 0 15px rgba(31, 182, 34, 0.5)); }
          20% { transform: translateY(-12px) translateX(3px) rotate(1.5deg) scale(1.03); filter: drop-shadow(0 0 18px rgba(31, 182, 34, 0.6)); }
          40% { transform: translateY(-20px) translateX(0px) rotate(0deg) scale(1.06); filter: drop-shadow(0 0 25px rgba(31, 182, 34, 0.8)) drop-shadow(0 0 35px rgba(31, 182, 34, 0.4)); }
          60% { transform: translateY(-18px) translateX(-3px) rotate(-1.5deg) scale(1.04); filter: drop-shadow(0 0 20px rgba(31, 182, 34, 0.7)); }
          80% { transform: translateY(-8px) translateX(2px) rotate(0.5deg) scale(1.02); filter: drop-shadow(0 0 16px rgba(31, 182, 34, 0.55)); }
          100% { transform: translateY(0px) translateX(0px) rotate(0deg) scale(1); filter: drop-shadow(0 0 15px rgba(31, 182, 34, 0.5)); }
        }
        @keyframes blink {
          0%, 50% { border-color: transparent; }
          51%, 100% { border-color: #1fb622; }
        }
      `}} />
    </div>
  );
}

export default Register;

