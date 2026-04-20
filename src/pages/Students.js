import { useEffect, useState } from "react";
import { db } from "../firebase";
import {
  collection,
  addDoc,
  onSnapshot,
  deleteDoc,
  doc
} from "firebase/firestore";
import { query, where, getDocs } from "firebase/firestore";


/*
function Students() {
  return (
    <div>
      <h2>Students Page</h2>
      <p>This is where Students will be shown.</p>
    </div>
  );
}
*/
function Students() {
  const [students, setStudents] = useState([]);

  // Form state
  const [name, setName] = useState("");
  const [rfid, setRfid] = useState("");
  const [studentClass, setStudentClass] = useState("");

  // 🔄 Load students in real-time
  useEffect(() => {
    const unsub = onSnapshot(collection(db, "students"), (snapshot) => {
      setStudents(snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })));
    });

    return () => unsub();
  }, []);

  {/* ➕ Add student*/}
  const addStudent = async (e) => {
    e.preventDefault();

    if (!name || !rfid || !studentClass) {
      alert("Please fill all fields");
      return;
    }

    // 🔍 Check duplicate in Firestore
    const q = query(
      collection(db, "students"),
      where("rfid", "==", rfid)
    );

    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      alert("RFID already exists!");
      return;
    }

    await addDoc(collection(db, "students"), {
      name,
      rfid,
      class: studentClass
    });

    setName("");
    setRfid("");
    setStudentClass("");

  };

  // ❌ Delete student
  const deleteStudent = async (id) => {
    await deleteDoc(doc(db, "students", id));
  };

  return (
    <div className="text-center">
      <h2 className="mb-4 fw-bold text-primary">Students Management</h2>

      {/* ➕ ADD FORM */} 

      <form onSubmit={addStudent} className="card p-4 mb-4 shadow">

        <h4 className="mb-3">Add Student</h4>

        <div className="row g-3">
          
          <div className="col-md-4">
            <input
              className="form-control"
              placeholder="Student Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="col-md-4">
            <input
              className="form-control"
              placeholder="RFID UID"
              value={rfid}
              onChange={(e) => setRfid(e.target.value)}
            />
          </div>

          <div className="col-md-4">
            <input
              className="form-control"
              placeholder="Class"
              value={studentClass}
              onChange={(e) => setStudentClass(e.target.value)}
            />
          </div>

          {/*<div className="col-md-6">
            <input
              type="file"
              className="form-control"
              onChange={(e) => setImage(e.target.files[0])}
            />
          </div>*/}

          <div>
            <button className="btn btn-primary w-50">
              Add Student
            </button>
          </div>

        </div>
      </form>



      {/*📋 STUDENT TABLE*/}
      <table className="table table-bordered table-hover shadow">
        <thead className="table-dark">
          <tr>
            <th>Photo</th>
            <th>Name</th>
            <th>RFID</th>
            <th>Class</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {students.map((s) => (
            <tr key={s.id}>
              <td>
                <img
                  src={s.photo || "/default.png"}
                  width="50"
                  height="50"
                  style={{ borderRadius: "50%" }}
                />
              </td>
              <td>{s.name}</td>
              <td>{s.rfid}</td>
              <td>{s.class}</td>
              <td>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => deleteStudent(s.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const styles = {
  form: {
    display: "flex",
    gap: "10px",
    marginBottom: "20px"
  },
  table: {
    width: "100%",
    borderCollapse: "collapse"
  }
};

export default Students;