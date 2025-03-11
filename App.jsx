import { Routes, Route } from "react-router-dom";  // ✅ Correct import (No BrowserRouter)
import LoginPage from "./components/LoginPage";
import AdminPage from "./components/AdminPage";
import SupervisorPage from "./components/SupervisorPage";
import LifeguardPage from "./components/LifeguardPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/admin" element={<AdminPage />} />
      <Route path="/supervisor" element={<SupervisorPage />} />
      <Route path="/lifeguard" element={<LifeguardPage />} />
    </Routes>
  );
}

export default App;
