import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

function Layout({ children }) {
  return (
    <div className="d-flex">

      {/* Sidebar */}
      <Sidebar />

      {/* Main Area */}
      <div className="flex-grow-1">

        {/* Navbar */}
        <Navbar />

        {/* Page Content */}
        <div className="container mt-4">
          {children}
        </div>

      </div>
    </div>
  );
}

export default Layout;