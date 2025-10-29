import { useState, useEffect, useRef } from 'react';

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

export const useVoiceRecorder = (onResult: (result: string) => void) => {
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const recognition = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
    if (!SpeechRecognition) {
      setError('Speech recognition is not supported in this browser.');
      return;
    }

    recognition.current = new SpeechRecognition();
    recognition.current.continuous = false;
    recognition.current.interimResults = false;
    recognition.current.lang = 'en-US';

    recognition.current.onresult = (event) => {
      const speechResult = event.results[0][0].transcript;
      onResult(speechResult);
      stopListening();
    };

    recognition.current.onerror = (event) => {
      if (event.error === 'aborted') {
        setIsListening(false);
        return;
      }
      setError(event.error);
      stopListening();
    };

  }, [onResult]);

  const startListening = () => {
    if (recognition.current) {
      setIsListening(true);
      setError(null);
      recognition.current.start();
    }
  };

  const stopListening = () => {
    if (recognition.current) {
      setIsListening(false);
      recognition.current.stop();
    }
  };

  return { isListening, error, startListening, stopListening };
};
