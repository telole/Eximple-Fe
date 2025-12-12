import { useState, useEffect, useRef } from 'react';

export function useTypingAnimation(texts, options = {}) {
  const {
    typingSpeed = 80,
    deletingSpeed = 40,
    pauseBetweenTexts = 2000,
    initialDelay = 500,
  } = options;

  const [typingText1, setTypingText1] = useState('');
  const [typingText2, setTypingText2] = useState('');
  const [currentLine, setCurrentLine] = useState(0);

  const timerRef = useRef(null);
  const currentLineRef = useRef(0);
  const currentCharIndexRef = useRef(0);
  const isDeletingRef = useRef(false);

  useEffect(() => {
    const typeText = () => {
      const currentLine = currentLineRef.current;
      const currentCharIndex = currentCharIndexRef.current;
      const isDeleting = isDeletingRef.current;

      if (currentLine === 0 && !isDeleting) {
        const text = texts[0];
        if (currentCharIndex < text.length) {
          setTypingText1(text.substring(0, currentCharIndex + 1));
          currentCharIndexRef.current = currentCharIndex + 1;
          timerRef.current = setTimeout(typeText, typingSpeed);
        } else {
          timerRef.current = setTimeout(() => {
            currentLineRef.current = 1;
            currentCharIndexRef.current = 0;
            setCurrentLine(1);
            typeText();
          }, pauseBetweenTexts);
        }
      } else if (currentLine === 1 && !isDeleting) {
        const text = texts[1];
        if (currentCharIndex < text.length) {
          setTypingText2(text.substring(0, currentCharIndex + 1));
          currentCharIndexRef.current = currentCharIndex + 1;
          timerRef.current = setTimeout(typeText, typingSpeed);
        } else {
          timerRef.current = setTimeout(() => {
            isDeletingRef.current = true;
            typeText();
          }, pauseBetweenTexts);
        }
      } else if (isDeleting && currentLine === 1) {
        const text = texts[1];
        if (currentCharIndex > 0) {
          const newIndex = currentCharIndex - 1;
          currentCharIndexRef.current = newIndex;
          setTypingText2(text.substring(0, newIndex));
          timerRef.current = setTimeout(typeText, deletingSpeed);
        } else {
          currentLineRef.current = 0;
          currentCharIndexRef.current = texts[0].length;
          setCurrentLine(0);
          typeText();
        }
      } else if (isDeleting && currentLine === 0) {
        const text = texts[0];
        if (currentCharIndex > 0) {
          const newIndex = currentCharIndex - 1;
          currentCharIndexRef.current = newIndex;
          setTypingText1(text.substring(0, newIndex));
          timerRef.current = setTimeout(typeText, deletingSpeed);
        } else {
          isDeletingRef.current = false;
          currentLineRef.current = 0;
          currentCharIndexRef.current = 0;
          setCurrentLine(0);
          setTypingText1('');
          setTypingText2('');
          timerRef.current = setTimeout(typeText, 300);
        }
      }
    };

    timerRef.current = setTimeout(typeText, initialDelay);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [texts, typingSpeed, deletingSpeed, pauseBetweenTexts, initialDelay]);

  return { typingText1, typingText2, currentLine };
}

