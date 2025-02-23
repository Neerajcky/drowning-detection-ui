import { Routes, Route } from "react-router-dom";
import LoginPage from "./components/LoginPage";
import AdminPage from "./components/AdminPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/admin" element={<AdminPage />} />
    </Routes>
  );
}

export default App;
