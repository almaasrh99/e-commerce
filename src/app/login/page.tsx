"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

const handleSubmit = async (event: { preventDefault: () => void; }) => {
    event.preventDefault();
    if (!email || !password) {
    setError("Email atau Password tidak boleh kosong");
    return;

    } else if (!validateEmail(email)) {
    setError("Email tidak valid");
    return;

    }
    localStorage.setItem("loggedIn", "true");
    localStorage.setItem('email', email);
    router.push("/products");
};

  const validateEmail = (email: string) => {
    const emailRegex = /[^\s@]+@[^\s@]+\.[^\s@]+/;
    return emailRegex.test(email);
  };

  return (
    <div className="bg-gradient-to-r from-blue-500 to-purple-500 min-h-screen flex items-center justify-center">
      <div className="bg-white p-8 rounded shadow">
        <h1 className="text-2xl font-bold mb-4">Silahkan Login</h1>
        <div className="p-10 w-96 mx-auto border-2 border-green-900 rounded-lg shadow-md bg-white">
          <form onSubmit={handleSubmit}>
            <label className="block mb-2">Email:</label>
            <input
              type="text"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 mb-4"
            />
            <label className="block mb-2">Password:</label>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 mb-4"
            />
            {error && <p className="text-sm text-red-700 font-semibold">{error}</p>}
            <button
              type="submit"
              className="mt-4 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
export default LoginPage;
