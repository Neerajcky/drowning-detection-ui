import { Routes, Route } from "react-router-dom";
import LoginPage from "./components/LoginPage";
import AdminPage from "./components/AdminPage";
import SupervisorPage from "./components/SupervisorPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/admin" element={<AdminPage />} />
      <Route path="/supervisor" element={<SupervisorPage />} />
    </Routes>
  );
}

export default App;
