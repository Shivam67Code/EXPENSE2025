import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import AuthLayout from "../../components/layouts/AuthLayout";
import Input from "../../components/Inputs/Input";
import { Link } from "react-router-dom";
import { validateEmail } from "../../utils/helper";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { UserContext } from "../../context/userContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const { updateUser } = useContext(UserContext);


  const navigate = useNavigate();
  const handleLogin = async(e) =>{
    e.preventDefault();
    if(!validateEmail(email)){
      setError("Please Enter a Valid Email📩");
      return;
    }
    if(!password){
      setError("Please Enter the Password🔑 !!!");
      return;
    }
    if(password.length<7){
      setError("Password must be at least 7️⃣ characters long !!!");
      return;
    }
    setError("");

    //Login API Call
    try {
      console.log("Login attempt with:", email);
      const response = await axiosInstance.post(API_PATHS.AUTH.LOGIN, {
        email,
        password,
      });
      console.log("Login successful, response:", response.data);
      
      // The data is directly in response.data, not in a nested user object
      const {token, _id, fullName, email: userEmail, profileImageUrl} = response.data;
      
      if (token) {
        localStorage.setItem("token", token);
        // Pass all user data to updateUser
        updateUser({
          _id,
          fullName,
          email: userEmail, // Rename to avoid variable shadowing
          profileImageUrl
        });
        navigate("/dashboard");
      }
    } catch (err) {
      console.error("Login error:", err);
      
      // Log the full error object for debugging
      if (err.response) {
        console.error("Status:", err.response.status);
        console.error("Response data:", err.response.data);
        
        // Check different possible error message formats
        const errorMessage = 
          err.response.data.message || 
          err.response.data.error || 
          err.response.data.msg ||
          (typeof err.response.data === 'string' ? err.response.data : null) ||
          `Error ${err.response.status}: ${err.response.statusText || 'Unknown error'}`;
          
        setError(errorMessage);
      } else if (err.request) {
        // The request was made but no response was received
        console.error("No response received:", err.request);
        setError("No response from server. Please check your connection.");
      } else {
        // Something happened in setting up the request
        console.error("Error setting up request:", err.message);
        setError("Something went wrong. Please try again later.");
      }
    }
  }
  
  return (
    <AuthLayout>
      <div className="lg:w-[78%] h-3/4 md:h-full flex flex-col justify-center">
        <h3 className="text-xl font-semibold text-black">Welcome Back</h3>
        <p className="text-xs text-slate-700 mt-[5px] mb-6">
          Please enter your details to log in
        </p>
        <form onSubmit={handleLogin}>
          <Input 
            value={email}
            onChange={({target})=> setEmail(target.value)}
            label="Email Address"
            placeholder="shiv@example.com"
            type="text"
            />
          <Input 
            value={password}
            onChange={({target})=> setPassword(target.value)}
            label="Password"
            placeholder="Min 7 Characters.."
            type="password"
            />
          {error && <p className="text-red-700 text-xs mt-2 pb-2.5">{error}</p>}

          <button type="submit" className="w-full btn-primary">LOGIN</button>

          <p className="text-xs text-slate-700 mt-4">
            Don't have an account?{" "}
            <Link className="font-medium text-green-600 underline" to="/signup">
              Sign Up
            </Link>
          </p>
        </form>
      </div>
    </AuthLayout>
  );
};

export default Login;