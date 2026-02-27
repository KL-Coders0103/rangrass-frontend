import { useState } from "react";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import VerifierPanel from "./pages/VerifierPanel";

function App() {

  const [role, setRole] = useState(null);

  if (!role)
    return <Login setRole={setRole} />;

  if (role === "admin")
    return <AdminDashboard />;

  return <VerifierPanel />;
}

export default App;