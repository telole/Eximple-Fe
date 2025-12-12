import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import { Start, Greetings, Login, Register, OTP, ChooseSubject, ClassGrade, ClassNow, Leaderboard, MainJourney, Level, AIAgent, Profile, Achievement, Teams } from './components';
import AchievementContainer from './components/hooks/UseToast';
import useAuthStore from './stores/authStore';

function App() {
  const { checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <BrowserRouter>
      <AchievementContainer />
      <Routes>
        <Route path="/" element={<Start />} />
        <Route path="/greetings" element={<Greetings />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/otp" element={<OTP />} />
        <Route path="/choose-subject" element={<ChooseSubject />} />
        <Route path="/class-grade" element={<ClassGrade />} />
        <Route path="/class-now" element={<ClassNow />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/journey" element={<MainJourney />} />
        <Route path="/level/:levelId" element={<Level />} />
        <Route path="/ai-agent" element={<AIAgent />} />
        <Route path="/achievement" element={<Achievement />} />
        <Route path="/teams" element={<Teams />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
