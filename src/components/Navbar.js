import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";

import { useEffect, useState } from "react";
import { auth } from "../firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";



function Navbar() {
  const [user, setUser] = useState(null);
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const snap = await getDoc(doc(db, "users", user.uid));
        setUser({ ...user, name: snap.data()?.name });
      }
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <nav className="navbar navbar-dark bg-primary px-3 shadow d-flex justify-content-between">

      {/* Left side */}
      <span className="navbar-brand">RFID Attendance System</span>

      {/* Right side */}
      <div className="d-flex align-items-center gap-3 text-white">

        {/* 👤 User */}
        {user && (
          <span>
            👤 {user.name || user.email}
          </span>
        )}

        {/* 🚪 Logout */}
        <button
          className="btn btn-light btn-sm"
          onClick={handleLogout}
        >
          Logout
        </button>

      </div>
    </nav>
  );
}

export default Navbar;