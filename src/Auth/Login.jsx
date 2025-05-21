import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../globals.css";
import { ShieldAlert } from "lucide-react";

function Login({ setIsLoggedIn, setAuthToken }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate(); 

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
  
    try {
      const response = await fetch(
        "https://smart-vote-backend.vercel.app/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        }
      );
  
      const data = await response.json();
     
      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }
  
      const token = data.token;
      setAuthToken(token);
      localStorage.setItem("authToken", token);
      console.log("Token:", token);
  
      setIsLoggedIn(true);
      navigate("/home");
    } catch (err) {
      const customError =
        err.message === "Login failed"
          ? "Only authorized admin can login"
          : err.message;
      setError(customError);
    } finally {
      setIsLoading(false);
    }
  };
  

  return (
    <div className="flex min-h-screen flex-row justify-center items-center">
      <div className="absolute w-screen h-screen top-0 left-0 bg-[url(./images/auth_login_bg.jpg)] bg-cover -z-50 brightness-50" />
      <div className="max-w-4xl flex flex-row w-full">
        <form
          onSubmit={handleSubmit}
          className="flex flex-1 flex-col gap-6 bg-white p-12 rounded-tl-3xl rounded-bl-3xl"
        >
          <div className="flex flex-col gap-2">
            <h1 className="font-bold text-4xl">Login as Admin</h1>
            <p className="text-sm">
              Access your account as an admin to manage and oversee the voting
              process.
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <input
              type="email"
              id="email"
              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-gray-500 focus:border-gray-500 p-3"
              placeholder="Email"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              required
            />
            <input
              type="password"
              id="password"
              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-gray-500 focus:border-gray-500 p-3"
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              required
            />
          </div>
          <button
            type="submit"
            className="bg-[#111B56D4] text-white p-4 rounded-3xl cursor-pointer"
            disabled={isLoading}
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>
          {error && (
            <div className="p-4 rounded-3xl bg-red-200 text-center flex flex-row items-center gap-4">
              <ShieldAlert />
              <p>{error}</p>
            </div>
          )}
        </form>
        <div className="flex-1 p-12 bg-blue-200/75 rounded-tr-3xl rounded-br-3xl" />
      </div>
    </div>
  );
}

export default Login;
