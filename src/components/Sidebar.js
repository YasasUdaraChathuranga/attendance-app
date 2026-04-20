import { Link,NavLink } from "react-router-dom";

function Sidebar() {
  return (
    <div className="bg-dark text-white p-3 vh-100" style={{ width: "240px" }}>
      <h4 className="card text-center p-2 shadow">🎓 SipPro Academy</h4>

      <ul className="nav flex-column">

        <li className="nav-item">
          <NavLink
            to="/"
            className={({ isActive }) =>
              "nav-link " + (isActive ? "bg-primary text-white rounded" : "text-white")
            }
          >
            📊 Dashboard
          </NavLink>
        </li>

        <li className="nav-item">
          <NavLink
            to="/students"
            className={({ isActive }) =>
              "nav-link " + (isActive ? "bg-primary text-white rounded" : "text-white")
            }
          >
            👨‍🎓 Students
          </NavLink>
        </li>

        <li className="nav-item">
          <NavLink
            to="/attendance"
            className={({ isActive }) =>
              "nav-link " + (isActive ? "bg-primary text-white rounded" : "text-white")
            }
          >
            📟 Attendance
          </NavLink>
        </li>

        <li className="nav-item">
          <NavLink
            to="/reports"
            className={({ isActive }) =>
              "nav-link " + (isActive ? "bg-primary text-white rounded" : "text-white")
            }
          >
            📈 Reports
          </NavLink>
        </li>

        <li className="nav-item">
          <NavLink
            to="/payments"
            className={({ isActive }) =>
              "nav-link " + (isActive ? "bg-primary text-white rounded" : "text-white")
            }
          >
            💰 Payments
          </NavLink>
        </li>

      </ul>
    </div>
  );
}

export default Sidebar;