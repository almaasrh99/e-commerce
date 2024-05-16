"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { GoogleLogin } from "react-google-login";
import { gapi } from "gapi-script";
import { FaGoogle } from "react-icons/fa";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const [googleAuth, setGoogleAuth] = useState(null);

  // useEffect(() => {
  //   const initClient = () => {
  //     gapi.client.init({
  //       clientId:
  //         "966773496387-97t4ip3h9tqa5k9d62pujg8qli1k2731.apps.googleusercontent.com",
  //       scope: "email profile",
  //     });
  //   };
  //   gapi.load("client:auth2", initClient);
  // }, []);

  const responseGoogle = (response: {
    tokenId: string;
    profileObj: { email: string };
  }) => {
    console.log(response);
    if (response?.tokenId) {
      // Set the "loggedIn" item in localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem("loggedIn", "true");
        localStorage.setItem("email", response.profileObj.email);
        localStorage.setItem("tokenId", response.tokenId);
      }
      router.push("/products");
    }
  };

  const handleSubmit = async (event: { preventDefault: () => void }) => {
    event.preventDefault();
    if (!email || !password) {
      setError("Email atau Password tidak boleh kosong");
      return;
    } else if (!validateEmail(email)) {
      setError("Email tidak valid");
      return;
    }
    localStorage.setItem("loggedIn", "true");
    // localStorage.setItem('email', email);
    router.push("/products");
  };

  const validateEmail = (email: string) => {
    const emailRegex = /[^\s@]+@[^\s@]+\.[^\s@]+/;
    return emailRegex.test(email);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-500">
      <div className="w-full max-w-md p-8 m-4 bg-white rounded shadow-md">
        <h1 className="mb-4 text-2xl font-bold text-center">Silahkan Login</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-2">Email:</label>
            <input
              type="text"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2">Password:</label>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded"
            />
          </div>
          {error && (
            <p className="text-sm text-red-700 font-semibold">{error}</p>
          )}
          <button
            type="submit"
            className="w-full mt-4 bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
          >
            Login
          </button>
        </form>
        <h1 className="p-4 text-center font-semibold text-lg">
          {" "}
          <span>Atau</span>{" "}
        </h1>
        {/* <button
      onClick={handleGoogleLogin}
      className="w-full mt-4 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded inline-flex items-center justify-center"
    >
      <FaGoogle /> <span className="ml-2">Login with Google</span>
    </button> */}
        {
          <GoogleLogin
            clientId="966773496387-97t4ip3h9tqa5k9d62pujg8qli1k2731.apps.googleusercontent.com"
            buttonText="Login dengan Google"
            onSuccess={responseGoogle}
            onFailure={responseGoogle}
            cookiePolicy={"single_host_origin"}
            render={(renderProps) => (
              <button
                onClick={renderProps.onClick}
                disabled={renderProps.disabled}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded inline-flex items-center justify-center"
              >
                <FaGoogle /> <span className="ml-2">Login dengan Google</span>
              </button>
            )}
          />
        }
      </div>
    </div>
  );
};

export default LoginPage;
