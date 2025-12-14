import { useOTP } from '../../hooks/useOTP';

function OTP() {
  const {
    otp,
    email,
    error,
    isLoading,
    resendCooldown,
    inputRefs,
    handleInputChange,
    handleKeyDown,
    handleOTPComplete,
    handleResendOTP,
  } = useOTP();

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

      <div className="flex-1 flex items-center justify-center px-4 md:px-8 pb-8 relative overflow-y-auto">
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[200px] sm:w-[300px] md:w-[400px] lg:w-[450px] aspect-square z-0 animate-[floatRealistic_5s_ease-in-out_infinite] hidden sm:block pointer-events-none -mt-8 md:-mt-12 lg:-mt-16 opacity-50 sm:opacity-100">
          <div 
            className="w-full h-full bg-cover bg-center bg-no-repeat"
            style={{backgroundImage: 'url(/img/getStartedImg/mascotModel1.png)'}}
          ></div>
        </div>

        <div className="flex flex-col items-center gap-4 sm:gap-6 z-10 w-full max-w-[400px] relative px-4">
          <div className="text-center w-full">
            <p className="font-['ZT_Nature'] text-base sm:text-lg md:text-xl lg:text-2xl font-medium text-white mb-2 break-words">
              Code sent to <span className="break-all">{email}</span>
            </p>
            <button 
              type="button"
              onClick={handleResendOTP}
              disabled={resendCooldown > 0 || isLoading}
              className="font-['ZT_Nature'] text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl font-medium text-[#1fb622] underline hover:opacity-80 transition-opacity cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed break-words"
            >
              {resendCooldown > 0 ? `Resend code (${resendCooldown}s)` : 'Resend code'}
            </button>
          </div>

          {error && (
            <div className="w-full px-4 py-2 bg-red-500/20 border-2 border-red-500 rounded-lg">
              <p className="font-['ZT_Nature'] text-xs sm:text-sm text-red-400 text-center">{error}</p>
            </div>
          )}

          <div className="flex gap-2 sm:gap-3 md:gap-4 justify-center w-full">
            {otp.map((value, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                maxLength="1"
                value={value}
                onChange={(e) => handleInputChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 text-center text-xl sm:text-2xl md:text-3xl font-medium border-2 sm:border-3 md:border-4 border-[#aaaaaa] rounded-xl sm:rounded-2xl bg-transparent text-white font-['ZT_Nature'] focus:border-[#1fb622] focus:outline-none transition-colors"
              />
            ))}
          </div>

          <button 
            type="button"
            onClick={handleOTPComplete}
            disabled={otp.join('').length !== 6 || isLoading}
            className="w-full h-12 sm:h-14 px-4 py-2 flex justify-center items-center bg-gradient-to-b from-[#168318] to-[#1fb622] rounded-2xl sm:rounded-3xl shadow-[0_-2px_4px_0_rgba(255,255,255,0.5)_inset] hover:opacity-90 transition-opacity cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="font-['ZT_Nature'] text-base sm:text-lg md:text-xl font-medium text-[#eeeeee] whitespace-nowrap">
              {isLoading ? 'Verifying...' : 'Verify'}
            </span>
          </button>

          <button className="w-full h-12 sm:h-14 px-4 py-2 flex justify-center items-center rounded-xl sm:rounded-2xl hover:bg-[#1fb622]/10 transition-colors cursor-pointer">
            <span className="font-['ZT_Nature'] text-base sm:text-lg md:text-xl font-medium text-[#1fb622] whitespace-nowrap">Change email</span>
          </button>
        </div>
      </div>

      <style>{`
        @keyframes floatRealistic {
          0% { transform: translateY(0px) translateX(0px) rotate(0deg) scale(1); filter: drop-shadow(0 0 15px rgba(31, 182, 34, 0.5)); }
          20% { transform: translateY(-12px) translateX(3px) rotate(1.5deg) scale(1.03); filter: drop-shadow(0 0 18px rgba(31, 182, 34, 0.6)); }
          40% { transform: translateY(-20px) translateX(0px) rotate(0deg) scale(1.06); filter: drop-shadow(0 0 25px rgba(31, 182, 34, 0.8)) drop-shadow(0 0 35px rgba(31, 182, 34, 0.4)); }
          60% { transform: translateY(-18px) translateX(-3px) rotate(-1.5deg) scale(1.04); filter: drop-shadow(0 0 20px rgba(31, 182, 34, 0.7)); }
          80% { transform: translateY(-8px) translateX(2px) rotate(0.5deg) scale(1.02); filter: drop-shadow(0 0 16px rgba(31, 182, 34, 0.55)); }
          100% { transform: translateY(0px) translateX(0px) rotate(0deg) scale(1); filter: drop-shadow(0 0 15px rgba(31, 182, 34, 0.5)); }
        }
      `}</style>
    </div>
  );
}

export default OTP;

