import { useEffect, useState } from "react";
import { db } from "../firebase";
import {
  collection,
  onSnapshot,
  updateDoc,
  doc
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { getUserRole } from "../utils/getUserRole";
import { auth } from "../firebase";

function Payments() {
  // ✅ Hooks MUST be inside component
  const [students, setStudents] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState("");
  // 🔐 Check role
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const role = await getUserRole(user.uid);
        setIsAdmin(role === "admin");
      }
    });

    return () => unsubscribe();
  }, []);



  // 🔄 Load students
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "students"), (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setStudents(data);
    });

    return () => unsubscribe();
  }, []);

  if (!isAdmin) {
    return <h2>❌ Access Denied (Admin Only)</h2>;
  }

  // 📊 Filter logic
  const paidStudents = students.filter(
    (s) => s.payments?.[selectedMonth] === true
  );

  const unpaidStudents = students.filter(
    (s) => !s.payments?.[selectedMonth]
  );

  // 💾 Mark as paid
  const markPaid = async (id) => {
    if (!selectedMonth) {
      alert("Select month first");
      return;
    }

    const student = students.find(s => s.id === id);

    const prevMonth = getPreviousMonth(selectedMonth);

    /*  // ❌ BLOCK if previous month not paid
    if (prevMonth && student?.payments?.[prevMonth] !== true) {
      alert(`❌ Payment blocked! Previous month (${prevMonth}) is not paid.`);
      return;
    }
    */

    // ⚠️ Check previous month payment
    if (prevMonth && student?.payments?.[prevMonth] !== true) {
      const confirmPay = window.confirm(
        `⚠  ${student.name}  has NOT paid previous month (${prevMonth}). Continue?`
      );

      if (!confirmPay) return;
    }

    const refDoc = doc(db, "students", id);

    await updateDoc(refDoc, {
      [`payments.${selectedMonth}`]: true
    });

    alert("Payment marked successfully!");
  };

  const getPreviousMonth = (month) => {
    if (!month) return null;

    const [year, m] = month.split("-");

    const date = new Date(year, m - 1); // JS month is 0-based
    date.setMonth(date.getMonth() - 1);

    const prevYear = date.getFullYear();
    const prevMonth = String(date.getMonth() + 1).padStart(2, "0");

    return `${prevYear}-${prevMonth}`;
  };

  return (
    <div className="container mt-4 text-center">
      <h2>Monthly Payments</h2>

      {/* Month Picker */}
      <input
        type="month"
        className="form-control mb-3"
        value={selectedMonth}
        onChange={(e) => setSelectedMonth(e.target.value)}
      />
           {/* 📊 Summary */}
      <div className="row g-4 mb-4">

        <div className="col-md-4">
          <div className="card text-white bg-primary shadow">
            <div className="card-body">
              <h6>Total Students:</h6>
              <h3>{students.length}</h3>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card text-white bg-success shadow">
            <div className="card-body">
              <h6>Paid:</h6>
              <h3>{paidStudents.length}</h3>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card text-white bg-danger shadow">
            <div className="card-body">
              <h6>Unpaid:</h6>
              <h3>{unpaidStudents.length}</h3>
            </div>
          </div>
        </div>
      </div>

      {/* Unpaid Table */}
      <h4>Unpaid Students</h4>
      <table className="table table-striped table-hover mt-4 shadow">
        <thead className="table-dark">
          <tr>
            <th>Name</th>
            <th>Class</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {unpaidStudents.map((s) => (
            <tr key={s.id}>
              <td>{s.name}</td>
              <td>{s.class}</td>
              <td>
                <button
                  className="btn btn-success"
                  onClick={() => markPaid(s.id)}
                >
                  Mark Paid
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Paid Table */}
      <h4>Paid Students</h4>
      <table className="table table-striped table-hover mt-4 shadow">
        <thead className="table-dark">
          <tr>
            <th>Name</th>
            <th>Class</th>
          </tr>
        </thead>
        <tbody>
          {paidStudents.map((s) => (
            <tr key={s.id}>
              <td>{s.name}</td>
              <td>{s.class}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Payments;