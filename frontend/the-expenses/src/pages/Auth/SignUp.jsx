import React, { useContext, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AuthLayout from "../../components/layouts/AuthLayout";
import Input from "../../components/Inputs/Input";
import { validateEmail } from "../../utils/helper";
import uploadImage from "../../utils/uploadImage"; // Changed to default import
import ProfilePhotoSelector from "../../components/Inputs/ProfilePhotoSelector";
import { UserContext } from '../../context/userContext';
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";

const SignUp = () => {
  const [profilePic, setProfilePic] = useState(null);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const {updateUser} = useContext(UserContext);
  const navigate = useNavigate();
  
  // Handle Sign Up Form Submit
  const handleSignUp = async (e) => {
    e.preventDefault();
    
    // Basic form validation
    if (!fullName) {
      setError("Please enter your name");
      return;
    }
    
    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }
    if(!password){
      setError("Please Enter Your Password🔑");
      return;
    }
    
    if (!password || password.length < 7) {
      setError("Password must be at least 7 characters");
      return;
    }
    
    setError(null);
    
    //Sign Up API Call   
    try {
      let profileImageUrl = "";
      // Upload image if present
      if(profilePic){
        const imageUploadRes = await uploadImage(profilePic);
        profileImageUrl = imageUploadRes.imageUrl || "";
      }
         
      const response = await axiosInstance.post(API_PATHS.AUTH.REGISTER, {
        fullName,
        email,
        password,
        profileImageUrl
      });
      const {token, user} = response.data;
      
      if(token) {
        localStorage.setItem("token", token);
        updateUser(user);
        navigate("/dashboard");
      }
    } catch(error) {
      if(error.response && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError("Something went Wrong. Please Try Again.");
      }
    }
  };
  
  return (
    <AuthLayout>
      <div className="lg:w-[78%] h-3/4 md:h-full flex flex-col justify-center">
        <h3 className="text-xl font-semibold text-black">Create an Account</h3>
        <p className="text-xs text-slate-700 mt-[5px] mb-6">
          Join us today and start managing your Expenses Efficiently!
        </p>
        <form onSubmit={handleSignUp}>
          <ProfilePhotoSelector image={profilePic} setImage={setProfilePic} />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <Input 
              value={fullName}
              onChange={({target}) => setFullName(target.value)}
              label="Full Name"
              placeholder="Your Name"
              type="text"
            />
            <Input 
              value={email}
              onChange={({target}) => setEmail(target.value)}
              label="Email Address"
              placeholder="example@email.com"
              type="text"
            />
            <div className="col-span-1 md:col-span-2">
              <Input 
                value={password}
                onChange={({target}) => setPassword(target.value)}
                label="Password"
                placeholder="Min 7 Characters.."
                type="password"
              />
            </div>
          </div>
          
          {error && <p className="text-red-500 text-xs mt-2 pb-2.5">{error}</p>}
          
          <button 
            type="submit" 
            className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg transition duration-200 font-medium">
            SIGN UP
          </button>
          
          <p className="text-xs text-slate-700 mt-4 text-center">
            Already have an account?{" "}
            <Link className="font-medium text-green-600 hover:text-green-700 underline" to="/login">
              Log In
            </Link>
          </p>
        </form>
      </div>
    </AuthLayout>
  );
};

export default SignUp;