import { HashRouter, Routes, Route,  Navigate} from "react-router-dom";
import { useEffect, useState } from "react";
import Layout from "./components/Layout";

import Dashboard from "./pages/Dashboard";
import Students from "./pages/Students";
import Attendance from "./pages/Attendance";
import Reports from "./pages/Reports";
import Payments from "./pages/Payments";
import Login from "./pages/Login";

import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";


function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔐 Check login state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) return <h3>Loading...</h3>;


  return (
    <HashRouter>
      <Routes>

        {/* 🔴 Default route */}
        <Route
          path="/"
          element={
            user ? <Navigate to="/dashboard" /> : <Navigate to="/login" />
          }
        />

        {/* 🔐 Login */}
        <Route
          path="/login"
          element={!user ? <Login /> : <Navigate to="/dashboard" />}
        />

        {/* 🔐 Protected Routes */}
        <Route
          path="/dashboard"
          element={
            user ? <Layout><Dashboard /></Layout> : <Navigate to="/login" />
          }
        />

        <Route
          path="/students"
          element={
            user ? <Layout><Students /></Layout> : <Navigate to="/login" />
          }
        />

        <Route
          path="/attendance"
          element={
            user ? <Layout><Attendance /></Layout> : <Navigate to="/login" />
          }
        />

        <Route
          path="/reports"
          element={
            user ? <Layout><Reports /></Layout> : <Navigate to="/login" />
          }
        />

        <Route
          path="/payments"
          element={
            user ? <Layout><Payments /></Layout> : <Navigate to="/login" />
          }
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
