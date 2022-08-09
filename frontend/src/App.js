import './App.css';
import { Routes, Route} from "react-router-dom";
import HomePage from './pages/HomePage';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <div className="App">
      
      <AuthProvider>
        <Routes>
            <Route path="/" element={<HomePage />} />
        </Routes>
      </AuthProvider>
    </div>
  );
}

export default App;
