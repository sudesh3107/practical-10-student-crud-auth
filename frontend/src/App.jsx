import { useState, useEffect } from "react";

const API = "http://localhost:5000/api";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [message, setMessage] = useState("");
  const [students, setStudents] = useState([]);
  const [studentForm, setStudentForm] = useState({ name: "", email: "", age: "", course: "" });
  const [editId, setEditId] = useState(null);

  const auth = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`
  };

  const fetchStudents = async () => {
    if (!token) return;
    const res = await fetch(`${API}/students`, { headers: auth });
    const data = await res.json();
    if (res.ok) setStudents(data.data);
    else setMessage(data.message);
  };

  useEffect(() => {
    fetchStudents();
    // eslint-disable-next-line
  }, [token]);

  const handleAuth = async (e) => {
    e.preventDefault();
    const url = isLogin ? `${API}/auth/login` : `${API}/auth/register`;
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });
    const data = await res.json();
    setMessage(data.message);
    if (isLogin && data.token) {
      localStorage.setItem("token", data.token);
      setToken(data.token);
    }
  };

  const saveStudent = async (e) => {
    e.preventDefault();
    const url = editId ? `${API}/students/${editId}` : `${API}/students`;
    const res = await fetch(url, {
      method: editId ? "PUT" : "POST",
      headers: auth,
      body: JSON.stringify(studentForm)
    });
    const data = await res.json();
    setMessage(data.message);
    setStudentForm({ name: "", email: "", age: "", course: "" });
    setEditId(null);
    fetchStudents();
  };

  const deleteStudent = async (id) => {
    const res = await fetch(`${API}/students/${id}`, { method: "DELETE", headers: auth });
    const data = await res.json();
    setMessage(data.message);
    fetchStudents();
  };

  const startEdit = (s) => {
    setEditId(s._id);
    setStudentForm({ name: s.name, email: s.email, age: s.age, course: s.course });
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken("");
    setStudents([]);
  };

  if (!token) {
    return (
      <div style={{ maxWidth: 400, margin: "40px auto", textAlign: "center" }}>
        <h2>Student Management</h2>
        <form onSubmit={handleAuth}>
          {!isLogin && (
            <input placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          )}
          <br />
          <input placeholder="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          <br />
          <input placeholder="Password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
          <br />
          <button type="submit">{isLogin ? "Login" : "Register"}</button>
        </form>
        <p>
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button onClick={() => setIsLogin(!isLogin)}>{isLogin ? "Register" : "Login"}</button>
        </p>
        {message && <p>{message}</p>}
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 700, margin: "40px auto" }}>
      <h2>Student Management System <button onClick={logout}>Logout</button></h2>

      <form onSubmit={saveStudent}>
        <input placeholder="Name" value={studentForm.name} onChange={(e) => setStudentForm({ ...studentForm, name: e.target.value })} required />
        <input placeholder="Email" type="email" value={studentForm.email} onChange={(e) => setStudentForm({ ...studentForm, email: e.target.value })} required />
        <input placeholder="Age" type="number" value={studentForm.age} onChange={(e) => setStudentForm({ ...studentForm, age: e.target.value })} required />
        <input placeholder="Course" value={studentForm.course} onChange={(e) => setStudentForm({ ...studentForm, course: e.target.value })} required />
        <button type="submit">{editId ? "Update Student" : "Add Student"}</button>
      </form>

      {message && <p>{message}</p>}

      <table border="1" cellPadding="8">
        <thead>
          <tr><th>ID</th><th>Name</th><th>Email</th><th>Age</th><th>Course</th><th>Actions</th></tr>
        </thead>
        <tbody>
          {students.map((s, i) => (
            <tr key={s._id}>
              <td>{i + 1}</td>
              <td>{s.name}</td>
              <td>{s.email}</td>
              <td>{s.age}</td>
              <td>{s.course}</td>
              <td>
                <button onClick={() => startEdit(s)}>Edit</button>{" "}
                <button onClick={() => deleteStudent(s._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
