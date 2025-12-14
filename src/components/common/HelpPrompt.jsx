import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

function HelpPrompt({ isVisible, onClose }) {
  const navigate = useNavigate();

  const handleGoToAIAgent = () => {
    onClose();
    navigate('/ai-agent');
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 50 }}
          transition={{ duration: 0.3 }}
          className="fixed bottom-8 right-8 z-40 flex items-end gap-3"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.3 }}
            className="bg-white rounded-2xl rounded-br-sm p-4 shadow-xl border-2 border-[#1fb622] relative min-w-[200px] max-w-[250px]"
          >
            <div 
              className="absolute bottom-0 right-0 translate-x-1/2 translate-y-1/2 w-4 h-4 bg-white border-r-2 border-b-2 border-[#1fb622] transform rotate-45"
              style={{ borderTop: 'none', borderLeft: 'none' }}
            />
            
            <div className="relative z-10">
              <p className="text-sm text-gray-800 mb-3 font-medium">
                Perlu bantuan dengan AI?
              </p>
              
              <div className="flex gap-2">
                <button
                  onClick={handleGoToAIAgent}
                  className="flex-1 px-3 py-1.5 bg-gradient-to-b from-[#168318] to-[#1fb622] rounded-lg text-white text-xs font-medium hover:opacity-90 transition-opacity"
                >
                  Ya, tanya Pyrus
                </button>
                <button
                  onClick={onClose}
                  className="px-3 py-1.5 border border-gray-300 rounded-lg text-gray-700 text-xs font-medium hover:bg-gray-100 transition-colors"
                >
                  Nanti
                </button>
              </div>
            </div>
          </motion.div>
        
          <motion.img
            src="/img/codia/ai-agent-avatar.png"
            alt="Pyrus"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1, duration: 0.3 }}
            className="w-24 h-24 object-contain cursor-pointer hover:scale-105 transition-transform"
            onClick={handleGoToAIAgent}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default HelpPrompt;

