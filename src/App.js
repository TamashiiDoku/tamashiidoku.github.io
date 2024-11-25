import Scene from './components/Scene'
import { useState, useEffect } from 'react';
import AgeVerification from './components/AgeVerification';
import Disclaimer from './components/Disclaimer';

function App() {
  const [isAgeVerified, setIsAgeVerified] = useState(false);
  const [isDisclaimerAccepted, setIsDisclaimerAccepted] = useState(false);

  // Check if user has previously verified their age
  useEffect(() => {
    const verified = localStorage.getItem('ageVerified');
    if (verified === 'true') {
      setIsAgeVerified(true);
    }
  }, []);

  const handleAgeVerification = () => {
    setIsAgeVerified(true);
    localStorage.setItem('ageVerified', 'true');
  };

  const handleDisclaimerAccept = () => {
    setIsDisclaimerAccepted(true);
  };

  return (
    <div className="App">
      {!isAgeVerified && <AgeVerification onVerified={handleAgeVerification} />}
      {isAgeVerified && !isDisclaimerAccepted && <Disclaimer onAccept={handleDisclaimerAccept} />}
      {isAgeVerified && isDisclaimerAccepted && <Scene />}
    </div>
  );
}

export default App;
