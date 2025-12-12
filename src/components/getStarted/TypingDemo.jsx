import { useState, useEffect } from 'react';

function TypingDemo() {
  const [typingText, setTypingText] = useState('');
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [currentCharIndex, setCurrentCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  const texts = [
    "You don't want to lose all your progress.",
    "Create a new account!"
  ];

  useEffect(() => {
    const typingSpeed = 50;
    const deletingSpeed = 30;
    const pauseBetweenTexts = 2000;

    const typeText = () => {
      const currentText = texts[currentTextIndex];
      
      if (!isDeleting && currentCharIndex < currentText.length) {
        setTypingText(currentText.substring(0, currentCharIndex + 1));
        setCurrentCharIndex(currentCharIndex + 1);
        setTimeout(typeText, typingSpeed);
      } else if (!isDeleting && currentCharIndex === currentText.length) {
        setTimeout(() => {
          setIsDeleting(true);
          typeText();
        }, pauseBetweenTexts);
      } else if (isDeleting && currentCharIndex > 0) {
        setCurrentCharIndex(currentCharIndex - 1);
        setTypingText(currentText.substring(0, currentCharIndex - 1));
        setTimeout(typeText, deletingSpeed);
      } else if (isDeleting && currentCharIndex === 0) {
        setIsDeleting(false);
        setCurrentTextIndex((currentTextIndex + 1) % texts.length);
        setTimeout(typeText, 300);
      }
    };

    typeText();
  }, [currentTextIndex, currentCharIndex, isDeleting]);

  return (
    <div className="m-0 p-0 overflow-hidden bg-gradient-to-r from-[#020c02] to-[#041d05] min-h-screen flex items-center justify-center">
      <div className="text-center px-4">
        <h1 className="font-['Press_Start_2P'] text-white text-lg md:text-xl lg:text-2xl leading-relaxed">
          <div className="inline-block">
            <span id="typing-text" className="inline-block border-r-2 border-[#1fb622] animate-[blink_0.75s_step-end_infinite] pr-1">
              {typingText}
            </span>
          </div>
        </h1>
      </div>

      <style>{`
        @keyframes blink {
          0%, 50% { border-color: transparent; }
          51%, 100% { border-color: #1fb622; }
        }
      `}</style>
    </div>
  );
}

export default TypingDemo;

