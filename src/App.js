import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Router>
        {/* Navbar component here */}
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/meme-generator" element={<MemeGeneratorPage />} />
          <Route path="/council" element={<CouncilPage />} />
          <Route path="/flash-events" element={<FlashEventsPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/feed" element={<FeedPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
        {/* Footer component here */}
      </Router>
    </AuthProvider>
  );
}

export default App;
