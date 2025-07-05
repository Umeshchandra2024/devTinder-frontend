import { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/constants";

const Login = () => {

    const [emailId, setEmailId] = useState("Madhu@gmail.com");
    const [password, setPassword] = useState("Madhu@12");
    const dispatch = useDispatch()
    const navigate = useNavigate();
    const handleLogin = async () => {
        try{
            const res = await axios.post(BASE_URL + "/login", {
                emailId,
                password,
            }, {
              withCredentials: true,
            }); 
            // console.log(res.data);
            dispatch(addUser(res.data));
            return navigate("/");

        }
        catch(err) {
            console.error(err);
        }
    }
  return (
    <div className="flex justify-center items-center min-h-screen bg-white text-white">
      <div className="w-96 rounded-xl shadow-lg bg-gray-800 border border-gray-700">
        <div className="p-6 flex flex-col justify-center">
          <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>

          {/* Email Field */}
          <div className="mb-4">
            <label className="block text-gray-200 mb-1">Email ID: </label>
            <input
              type="email"
              placeholder="Enter email"
              value={emailId}
              className="w-full px-4 py-2 rounded bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={(e) => setEmailId(e.target.value)}
            />
          </div>

          {/* Password Field */}
          <div className="mb-6">
            <label className="block text-gray-200 mb-1">Password:</label>
            <input
              type="password"
              placeholder="Enter password"
              value={password}
              className="w-full px-4 py-2 rounded bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {/* Button */}
          <div className="flex justify-center">
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded transition" onClick={handleLogin}>
              Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
