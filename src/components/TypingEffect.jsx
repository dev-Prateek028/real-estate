import React, { useEffect, useState } from 'react';

function TypingEffect({ text, speed }) {
  const [displayedText, setDisplayedText] = useState('');

  useEffect(() => {
    let currentText = '';
    let currentIndex = 0;

    const intervalId = setInterval(() => {
      currentText += text[currentIndex];
      setDisplayedText(currentText);
      currentIndex += 1;

      if (currentIndex >= text.length) {
        clearInterval(intervalId);
      }
    }, speed);

    return () => clearInterval(intervalId);
  }, [text, speed]);

  return <span>{displayedText}</span>;
}

export default TypingEffect;
