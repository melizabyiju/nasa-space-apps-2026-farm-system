// Browser Text-to-Speech utility for Farmer Accessibility
export const speakText = (text: string, lang: 'en' | 'ml' = 'en') => {
  if (!('speechSynthesis' in window)) {
    console.warn('Speech synthesis not supported in this browser.');
    return;
  }

  // Cancel any ongoing speech
  window.speechSynthesis.cancel();

  // Strip Markdown symbols for natural reading
  const cleanText = text
    .replace(/[#*_`~>[\]]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  const utterance = new SpeechSynthesisUtterance(cleanText);
  utterance.rate = 0.95; // Slightly slower for clear, comfortable listening
  utterance.pitch = 1.0;

  // Attempt to select language voice
  const voices = window.speechSynthesis.getVoices();
  if (lang === 'ml') {
    const mlVoice = voices.find(v => v.lang.includes('ml') || v.lang.includes('hi') || v.lang.includes('IN'));
    if (mlVoice) utterance.voice = mlVoice;
    utterance.lang = 'ml-IN';
  } else {
    const inVoice = voices.find(v => v.lang === 'en-IN' || v.name.includes('India')) || voices.find(v => v.lang.startsWith('en'));
    if (inVoice) utterance.voice = inVoice;
    utterance.lang = 'en-US';
  }

  window.speechSynthesis.speak(utterance);
};

export const stopSpeech = () => {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
};
