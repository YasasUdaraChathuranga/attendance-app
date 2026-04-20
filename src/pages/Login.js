import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
    }, 1500);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/"); // redirect after login
    } catch (error) {
      alert("Login Failed: " + error.message);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-primary bg-gradient">
    
      {/* Glass Card */}
      <div className="card p-4 shadow-lg border-0 glass-card" style={{ width: "360px" }}>

        {/* Logo */}
        <div className="text-center mb-3">          
          <img class="rounded" src="https://z-p3-scontent.fcmb9-1.fna.fbcdn.net/v/t39.30808-6/598833055_122101049871167421_1944017774513004653_n.jpg?_nc_cat=102&ccb=1-7&_nc_sid=1d70fc&_nc_eui2=AeH009TYBaJ0cngKfzBomnAJLegKtJc4A0gt6Aq0lzgDSGUpDKwobokdNqrBJOnJUK3NmPMMEUd5T4uldN1xdS2c&_nc_ohc=cW0Ad9K1ZVIQ7kNvwHeaQ6q&_nc_oc=Adqfz3hebgyFnOPqxlurpN4PREyekHkGgoXOmdtkLCctMyTZ7xnE2uovWpa3gQuy0-g&_nc_zt=23&_nc_ht=z-p3-scontent.fcmb9-1.fna&_nc_gid=WTX7a1RW8h4j7XFWljLMxg&_nc_ss=7a3a8&oh=00_Af2_wzBqrTdfK1beWlb34abKYlKMyKXE9DbOm8ESJOVLNQ&oe=69EC3102" alt="logo" width="70" />
        </div>


        <form onSubmit={handleLogin}>

          {/* Email */}
          <input
            type="email"
            className="form-control mb-3"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          {/* Password */}
          <div className="input-group mb-3">
            <input
              type={showPassword ? "text" : "password"}
              className="form-control"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <span
              className="input-group-text bg-white"
              style={{ cursor: "pointer" }}
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "🙈" : "👁"}
            </span>
          </div>

          {/* Button */}
          <button
            className="btn btn-primary w-100 d-flex justify-content-center align-items-center"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2"></span>
                Loading...
              </>
            ) : (
              "Login"
            )}
          </button>

        </form>
      </div>
    </div>
  );
}

export default Login;
