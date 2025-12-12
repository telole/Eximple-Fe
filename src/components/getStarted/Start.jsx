import { useNavigate } from 'react-router-dom';
import { triggerAchievement } from '../../hooks/useAchievement.jsx';

function Start() {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/greetings');
    triggerAchievement(
      'Welcome Aboard!',
      'You started your learning journey',
      '🎉',
      50
    );
  };

  const handleLogin = () => {
    navigate('/login');
  };

  return (
    <div className="w-screen h-screen bg-gradient-to-r from-[#020c02] to-[#041d05] relative overflow-hidden">
      <div className="absolute top-10 left-0 right-0 flex justify-center z-10">
        <div className="flex items-center gap-2 px-4">
          <div className="w-12 h-12 relative">
            <img 
              src="/img/getStartedImg/icon.png"
              alt="Eximple Icon"
              className="w-full h-full object-cover"
            />
          </div>
          <span className="font-['Airlash_Raiders'] text-3xl font-normal bg-gradient-to-b from-[#1fb622] to-[#168318] bg-clip-text text-transparent">
            Eximple
          </span>
        </div>
      </div>

      <div className="w-full h-full flex items-center justify-center">
        <div className="flex items-center justify-center gap-8 md:gap-12 lg:gap-16 px-4 md:px-8">
          <div className="w-[350px] md:w-[500px] lg:w-[600px] aspect-square relative z-0 animate-[float_3s_ease-in-out_infinite]">
            <img 
              src="/img/getStartedImg/mascotmodel2.png"
              alt="Mascot"
              className="w-full h-full object-cover"
            />
          </div>  
    
          <div className="flex flex-col items-center gap-8 z-10">
            <h1 className="font-['ZT_Nature'] text-3xl md:text-4xl font-medium text-white text-center leading-tight">
              A fun way to learn<br />and compete!
            </h1>

            <div className="flex flex-col gap-4 w-full max-w-[320px]">
              <button 
                onClick={handleGetStarted}
                className="w-full h-14 px-4 py-2 flex justify-center items-center bg-gradient-to-b from-[#168318] to-[#1fb622] rounded-3xl shadow-[0_-2px_4px_0_rgba(255,255,255,0.5)_inset] hover:opacity-90 transition-opacity cursor-pointer"
              >
                <span className="font-['ZT_Nature'] text-xl font-medium text-[#eeeeee] whitespace-nowrap">Get Started</span>
              </button>
              <button 
                onClick={handleLogin}
                className="w-full h-14 px-4 py-2 flex justify-center items-center rounded-3xl border-4 border-[#1fb622] bg-transparent hover:bg-[#1fb622]/10 transition-colors cursor-pointer"
              >
                <span className="font-['ZT_Nature'] text-xl font-medium text-[#1fb622] whitespace-nowrap">I already have an account</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
      `}</style>
    </div>
  );
}

export default Start;
