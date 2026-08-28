import { useEffect, useState } from "react";

function App() {
  const [students, setStudents] = useState([]);

  // Form states
  const [studentId, setStudentId] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [editingId, setEditingId] = useState(null); // null = mode thêm mới, có ID = mode cập nhật

  // Load danh sách sinh viên ban đầu
  const fetchStudents = () => {
    fetch("http://localhost:5000/api/students")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Không thể tải danh sách sinh viên");
        }
        return response.json();
      })
      .then((data) => {
        if (Array.isArray(data)) {
          setStudents(data);
        }
      })
      .catch((error) => console.error("Lỗi:", error));
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // Xử lý Thêm mới hoặc Cập nhật sinh viên
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!studentId.trim() || !name.trim() || !email.trim()) {
      alert("Vui lòng nhập đầy đủ thông tin!");
      return;
    }

    try {
      if (editingId) {
        // --- CHẾ ĐỘ CẬP NHẬT (PUT) ---
        const response = await fetch(`http://localhost:5000/api/students/${editingId}`, {
          method: "PUT",
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
          throw new Error(data.message || "Cập nhật sinh viên thất bại");
        }

        alert("Cập nhật sinh viên thành công!");

        // Cập nhật lại danh sách state
        setStudents(
          students.map((st) => (st._id === editingId ? data : st))
        );

        // Reset form và thoát chế độ sửa
        cancelEdit();
      } else {
        // --- CHẾ ĐỘ THÊM MỚI (POST) ---
        const response = await fetch("http://localhost:5000/api/students", {
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

        // Thêm sinh viên mới vào danh sách
        setStudents([...students, data]);

        // Xóa form
        setStudentId("");
        setName("");
        setEmail("");
      }
    } catch (error) {
      console.error("Lỗi:", error);
      alert("Lỗi: " + error.message);
    }
  };

  // Bắt đầu chỉnh sửa sinh viên
  const handleEdit = (student) => {
    setEditingId(student._id);
    setStudentId(student.studentId);
    setName(student.name);
    setEmail(student.email);
  };

  // Hủy chế độ chỉnh sửa
  const cancelEdit = () => {
    setEditingId(null);
    setStudentId("");
    setName("");
    setEmail("");
  };

  // Xử lý Xóa sinh viên (DELETE)
  const handleDelete = async (id, studentName) => {
    const isConfirm = window.confirm(
      `Bạn có chắc chắn muốn xóa sinh viên "${studentName}" không?`
    );
    if (!isConfirm) return;

    try {
      const response = await fetch(`http://localhost:5000/api/students/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Xóa sinh viên thất bại");
      }

      alert("Xóa sinh viên thành công!");

      // Loại bỏ sinh viên đã xóa khỏi danh sách state
      setStudents(students.filter((st) => st._id !== id));

      // Nếu đang sửa chính sinh viên bị xóa thì reset form
      if (editingId === id) {
        cancelEdit();
      }
    } catch (error) {
      console.error("Lỗi:", error);
      alert("Lỗi: " + error.message);
    }
  };

  return (
    <div style={{ maxWidth: "800px", margin: "20px auto", fontFamily: "sans-serif" }}>
      <h1 style={{ textAlign: "center" }}>Quản lý sinh viên</h1>

      {/* FORM THÊM / CẬP NHẬT */}
      <div style={{ background: "#f8f9fa", padding: "20px", borderRadius: "8px", marginBottom: "20px", border: "1px solid #ddd" }}>
        <h2>{editingId ? "Cập nhật sinh viên" : "Thêm sinh viên"}</h2>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "10px" }}>
            <label style={{ display: "inline-block", width: "80px", fontWeight: "bold" }}>MSSV:</label>
            <input
              type="text"
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              placeholder="Nhập MSSV (VD: SV001)"
              style={{ padding: "8px", width: "250px" }}
              required
            />
          </div>

          <div style={{ marginBottom: "10px" }}>
            <label style={{ display: "inline-block", width: "80px", fontWeight: "bold" }}>Họ tên:</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nhập họ tên"
              style={{ padding: "8px", width: "250px" }}
              required
            />
          </div>

          <div style={{ marginBottom: "15px" }}>
            <label style={{ display: "inline-block", width: "80px", fontWeight: "bold" }}>Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Nhập email"
              style={{ padding: "8px", width: "250px" }}
              required
            />
          </div>

          <div>
            <button
              type="submit"
              style={{
                padding: "8px 16px",
                backgroundColor: editingId ? "#28a745" : "#007bff",
                color: "#fff",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                marginRight: "10px",
                fontWeight: "bold"
              }}
            >
              {editingId ? "Lưu cập nhật" : "Thêm sinh viên"}
            </button>

            {editingId && (
              <button
                type="button"
                onClick={cancelEdit}
                style={{
                  padding: "8px 16px",
                  backgroundColor: "#6c757d",
                  color: "#fff",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer"
                }}
              >
                Hủy bỏ
              </button>
            )}
          </div>
        </form>
      </div>

      <hr />

      {/* DANH SÁCH SINH VIÊN */}
      <h2>📋 Danh sách sinh viên ({students.length})</h2>

      <table border="1" cellPadding="10" style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
        <thead>
          <tr style={{ backgroundColor: "#eaeaea" }}>
            <th>MSSV</th>
            <th>Họ tên</th>
            <th>Email</th>
            <th style={{ textAlign: "center", width: "160px" }}>Thao tác</th>
          </tr>
        </thead>

        <tbody>
          {Array.isArray(students) && students.length > 0 ? (
            students.map((student) => (
              <tr key={student._id} style={{ backgroundColor: editingId === student._id ? "#fff3cd" : "transparent" }}>
                <td>{student.studentId}</td>
                <td>{student.name}</td>
                <td>{student.email}</td>
                <td style={{ textAlign: "center" }}>
                  <button
                    onClick={() => handleEdit(student)}
                    style={{
                      padding: "4px 8px",
                      marginRight: "6px",
                      backgroundColor: "#ffc107",
                      border: "1px solid #d39e00",
                      borderRadius: "4px",
                      cursor: "pointer"
                    }}
                  >
                    Sửa
                  </button>
                  <button
                    onClick={() => handleDelete(student._id, student.name)}
                    style={{
                      padding: "4px 8px",
                      backgroundColor: "#dc3545",
                      color: "#fff",
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer"
                    }}
                  >
                    Xóa
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" style={{ textAlign: "center", color: "#888" }}>
                Chưa có sinh viên nào trong danh sách.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default App;