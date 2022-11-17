import './App.css';
import { Routes, Route} from "react-router-dom";
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <div className="App">
      
      <AuthProvider>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage/>} />
        </Routes>
      </AuthProvider>
    </div>
  );
}

export default App;
