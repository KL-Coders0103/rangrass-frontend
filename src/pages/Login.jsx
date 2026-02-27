import { useState } from "react";
import axios from "axios";

export default function Login({ setRole }) {

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const login = async () => {

    const res = await axios.post(
      "https://rangrass-backend.onrender.com/auth/login",
      { username, password }
    );

    setRole(res.data.role);
  };

  return (
    <div className="flex items-center justify-center h-screen">

      <div className="bg-white p-8 rounded-2xl shadow-2xl w-80">

        <h1 className="text-3xl font-bold mb-6 text-center">
          🌈 RangPass Login
        </h1>

        <input
          className="w-full p-3 border rounded mb-3"
          placeholder="Username"
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          type="password"
          className="w-full p-3 border rounded mb-4"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          className="bg-pink-500 text-white w-full py-3 rounded font-bold"
          onClick={login}
        >
          Login
        </button>

      </div>

    </div>
  );
}