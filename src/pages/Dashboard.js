import { useEffect, useState } from "react";
import { db } from "../firebase";
import {  collection,  onSnapshot} from "firebase/firestore";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS,  ArcElement,  Tooltip,  Legend} from "chart.js";
ChartJS.register(ArcElement, Tooltip, Legend);


function Dashboard() {
  const [attendance, setAttendance] = useState([]);
  const [students, setStudents] = useState([]);
  const getToday = () => new Date().toISOString().split("T")[0];
  const [selectedDate, setSelectedDate] = useState(getToday());
  
  const [selectedStudent, setSelectedStudent] = useState("");
  const [selectedGrade, setSelectedGrade] = useState("");

  // 🔄 Load all attendance
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "attendance"), (snapshot) => {
      const data = snapshot.docs.map(doc => doc.data());
      setAttendance(data);
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
 
  // 🔍 Filter logic
  const filteredData = attendance.filter((a) => {
    return (
      (!selectedDate || a.date === selectedDate) &&
      (!selectedStudent || a.name === selectedStudent) &&
      (!selectedGrade || a.class === selectedGrade)
    );
  }).sort((a, b) => b.createdAt?.seconds - a.createdAt?.seconds);

  // 📊 Get unique values
  const presentstudents = [...new Set(attendance.map(a => a.name))];
  const grades = [...new Set(attendance.map(a => a.class))];

  // 📊 Calculate stats
  const total = students.length;
  const present = filteredData.filter(a => a.status === "Present").length;

  const percentage = total === 0 ? 0 : ((present / total) * 100).toFixed(1);

  // 📊 Chart data
  const chartData = {
    labels: ["Present", "Absent"],
    datasets: [
      {
        data: [present, total - present],
        backgroundColor: ["#28a745", "#dc3545"],
        borderWidth: 1,
        hoverOffset: 10
      }
    ]
  };
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          font: {
            size: 14
          },
          padding: 20
        }
      }
    },
    cutout: "40%",

    animation: {
      animateRotate: true,   // 🔄 smooth spin animation
      animateScale: true,    // 🔍 grow effect on load
      duration: 5000,        // ⏱ animation speed (1.5s)
      easing: "easeOutQuart" // 🎯 smooth professional feel
    }
  };

  return (
    <div className="container mt-4 text-center">
      <div className="mt-4">
        <h2 className="mb-4 fw-bold text-primary">DashBoard</h2>
      </div>

      {/* 📊 Summary */}
      <div className="row g-3 mb-4">

        <div className="col-md-3">
          <div className="card text-white bg-primary shadow">
            <div className="card-body">
              <h6>Total Records</h6>
              <h3>{total}</h3>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card text-white bg-success shadow">
            <div className="card-body">
              <h6>Present</h6>
              <h3>{present}</h3>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card text-white bg-danger shadow">
            <div className="card-body">
              <h6>Absent</h6>
              <h3>{total - present}</h3>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card text-white bg-dark shadow">
            <div className="card-body">
              <h6>Attendance %</h6>
              <h3>{percentage}%</h3>
            </div>
          </div>
        </div>

      </div>

      {/* 📊 Chart */}
        <div className="card p-4 shadow" style={{ height: "500px" }}>
          <h5 className="mb-3">Attendance Overview</h5>
          <Doughnut className="p-4" data={chartData} options={chartOptions} />
        </div>  
    </div>
  );
}

export default Dashboard;