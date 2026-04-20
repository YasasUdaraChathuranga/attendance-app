import { useState, useEffect } from "react";
import { db } from "../firebase";
import {
  collection,
  query,
  where,
  getDocs,
  addDoc
} from "firebase/firestore";
import { onSnapshot } from "firebase/firestore";
import { serverTimestamp } from "firebase/firestore";


function Attendance() {
  const [rfid, setRfid] = useState("");
  const [message, setMessage] = useState("");
  const successSound = new Audio("/success.mp3");
  const errorSound = new Audio("/error.mp3");
  const [todayScans, setTodayScans] = useState([]);
  const [scannedStudent, setScannedStudent] = useState(null);
  const [students, setStudents] = useState([]);


  const handleScan = async (e) => {
    if (e && e.preventDefault) e.preventDefault();

    if (!rfid) return;

    const today = new Date().toISOString().split("T")[0];
    const time = new Date().toLocaleTimeString();

    // 🔍 1. Check student exists
    const studentQuery = query(
      collection(db, "students"),
      where("rfid", "==", rfid)
    );

    const studentSnap = await getDocs(studentQuery);
    const student = studentSnap.docs[0].data();
    setScannedStudent(student);

    if (studentSnap.empty) {
      setMessage("❌ Invalid RFID Card");
      setScannedStudent(null);
      //errorSound.play();
      setRfid("");
      return;
    }


    // 🔍 2. Check already marked today
    const attendanceQuery = query(
      collection(db, "attendance"),
      where("rfid", "==", rfid),
      where("date", "==", today)
    );

    const attendanceSnap = await getDocs(attendanceQuery);

    if (!attendanceSnap.empty) {
      setMessage("⚠ Already marked today");
      setScannedStudent(student); 
      //errorSound.play(); 
      setRfid("");
      return;
    }

    // ✅ 3. Save attendance
    await addDoc(collection(db, "attendance"), {
      name: student.name,
      rfid: rfid,
      class: student.class,
      date: today,
      time: time,
      status: "Present",
      createdAt: serverTimestamp()
    });

    setMessage(`✅ ${student.name} marked present`);
    //successSound.play();
    setRfid("");
  };

  useEffect(() => {
    
    const today = new Date().toISOString().split("T")[0];

    const q = query(
      collection(db, "attendance"),
      where("date", "==", today)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => doc.data());
      console.log("TODAY DATA:", data); // ✅ debug
      setTodayScans(data);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "students"), (snapshot) => {
      const data = snapshot.docs.map(doc => doc.data());
      setStudents(data);
    });

    return () => unsubscribe();
  }, []);

  const presentRfids = todayScans.map(s => s.rfid);
  const absentStudents = students.filter(
    (student) => !presentRfids.includes(student.rfid)
  );

  const sortedScans = [...todayScans].reverse();

  return (
    <div className="container mt-4 text-center">
      <h2 className="mb-4 fw-bold text-primary">RFID Attendance</h2>
      <div className="card p-4 shadow text-center">
        <form onSubmit={handleScan} >
          <input className="form-control form-control-lg text-center"
            autoFocus
            placeholder="Scan RFID card..."
            value={rfid}
            onChange={(e) => {
              setRfid(e.target.value);
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleScan(e);
                  }
            }}
          />
        </form>
      </div>

      <h3 className={`mt-4 ${
          message.includes("✅") ? "green" :
          message.includes("❌") ? "red" : "orange"
      }`}>
        {message}
      </h3>

      {scannedStudent && (
        <div className="d-flex justify-content-center align-items-center">
          <div className="card text-center p-4 shadow">
            
            <img
              src={scannedStudent.photo|| "/default.png"}
              alt="student"
              className="rounded-circle mx-auto d-block"
              style={styles.image}
            />

            <h2>{scannedStudent.name}</h2>
            <p>{scannedStudent.class}</p>
          </div>
        </div>
      )}

      <h3>Today Scanned Students</h3>
        <table className="table table-striped table-hover mt-4 shadow">
          <thead className="table-dark">
            <tr>
              <th>Name</th>
              <th>RFID</th>
              <th>Time</th>
            </tr>
          </thead>

          <tbody>
            {sortedScans.map((s, index) => (
              <tr key={index}>
                <td>{s.name}</td>
                <td>{s.rfid}</td>
                <td>{s.time}</td>
              </tr>
            ))}
          </tbody>
        </table>

      <h3>Absent Students Today</h3>
        <table className="table table-striped table-hover mt-4 shadow">
          <thead className="table-dark">
            <tr>
              <th>Name</th>
              <th>RFID</th>
              <th>Class</th>
            </tr>
          </thead>

          <tbody>
            {absentStudents.map((s, index) => (
              <tr key={index}>
                <td>{s.name}</td>
                <td>{s.rfid}</td>
                <td>{s.class}</td>
              </tr>
            ))}
          </tbody>
        </table>
    </div>
    
  );
}

const styles = {
  image: {
    width: "120px",
    height: "120px",
    borderRadius: "50%",
    objectFit: "cover"
  }
};

export default Attendance;