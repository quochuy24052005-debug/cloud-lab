import { useEffect, useState } from "react";

function App() {
  const [students, setStudents] = useState([]);

  const [studentId, setStudentId] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    fetch("/api/students")
      .then((response) => response.json())
      .then((data) => setStudents(data))
      .catch((error) => console.error("Lỗi:", error));
  }, []);

  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const response = await fetch("/api/students", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        studentId,
        name,
        email,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Thêm sinh viên thất bại");
    }

    alert("Thêm sinh viên thành công!");

    // Thêm sinh viên mới vào danh sách đang hiển thị
    setStudents([...students, data]);

    // Xóa dữ liệu trong form
    setStudentId("");
    setName("");
    setEmail("");
  } catch (error) {
    console.error("Lỗi:", error);
    alert("Lỗi: " + error.message);
  }
};

  return (
    <div>
      <h1>Quản lý sinh viên</h1>

      <h2>Thêm sinh viên</h2>

      <form onSubmit={handleSubmit}>
        <div>
          <label>MSSV: </label>
          <input
            type="text"
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
            placeholder="Nhập MSSV"
          />
        </div>

        <br />

        <div>
          <label>Họ tên: </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nhập họ tên"
          />
        </div>

        <br />

        <div>
          <label>Email: </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Nhập email"
          />
        </div>

        <br />

        <button type="submit">Thêm sinh viên</button>
      </form>

      <hr />

      <h2>Danh sách sinh viên</h2>

      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>MSSV</th>
            <th>Họ tên</th>
            <th>Email</th>
          </tr>
        </thead>

        <tbody>
          {students.map((student) => (
            <tr key={student._id}>
              <td>{student.studentId}</td>
              <td>{student.name}</td>
              <td>{student.email}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;