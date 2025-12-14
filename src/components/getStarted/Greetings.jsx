import { useNavigate } from 'react-router-dom';

function Greetings() {
  const navigate = useNavigate();

  const handleContinue = () => {
    navigate('/register');
  };

  return (
    <div className="w-screen h-screen bg-gradient-to-r from-[#020c02] to-[#041d05] relative overflow-hidden flex flex-col">
      {/* Header/Navbar */}
      <div className="flex justify-center pt-10 pb-8 z-10">
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

      {/* Main Content Container */}
      <div className="flex-1 flex items-center justify-center px-4 md:px-8 py-8 md:py-0">
        <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-8 lg:gap-12 xl:gap-16 w-full max-w-7xl">
          {/* Left Image */}
          <div className="w-[250px] sm:w-[300px] md:w-[400px] lg:w-[450px] xl:w-[500px] aspect-square relative z-0 animate-[float_3s_ease-in-out_infinite] order-2 md:order-1">
            <div 
              className="w-full h-full bg-cover bg-center bg-no-repeat"
              style={{backgroundImage: 'url(/img/getStartedImg/mascotModel1.png)'}}
            ></div>
          </div>

          {/* Right Text */}
          <div className="flex flex-col items-center z-10 order-1 md:order-2">
            <h1 className="font-['ZT_Nature'] text-2xl sm:text-3xl md:text-4xl font-medium text-white text-center leading-tight px-4">
              Hello, my name is Pyrus<br />and welcome to Eximple!
            </h1>
          </div>
        </div>
      </div>

      {/* Footer Buttons */}
      <div className="flex flex-col sm:flex-row justify-between items-center sm:items-end px-4 sm:px-8 md:px-16 lg:px-24 pb-6 sm:pb-8 md:pb-12 gap-4">
        {/* Go back Button (Left) */}
        <button className="w-full sm:w-auto h-12 sm:h-14 px-6 sm:px-8 py-2 flex justify-center items-center rounded-3xl border-4 border-[#1fb622] bg-transparent hover:bg-[#1fb622]/10 transition-colors cursor-pointer order-2 sm:order-1">
          <span className="font-['ZT_Nature'] text-lg sm:text-xl font-medium text-[#1fb622] whitespace-nowrap">Go back</span>
        </button>

        {/* Continue Button (Right) */}
        <button 
          onClick={handleContinue}
          className="w-full sm:w-auto h-12 sm:h-14 px-6 sm:px-8 py-2 flex justify-center items-center bg-gradient-to-b from-[#168318] to-[#1fb622] rounded-3xl shadow-[0_-2px_4px_0_rgba(255,255,255,0.5)_inset] hover:opacity-90 transition-opacity cursor-pointer order-1 sm:order-2"
        >
          <span className="font-['ZT_Nature'] text-lg sm:text-xl font-medium text-[#eeeeee] whitespace-nowrap">Continue</span>
        </button>
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

export default Greetings;

