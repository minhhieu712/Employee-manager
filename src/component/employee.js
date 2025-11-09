import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

const Employee = () => {
    const [employees, setEmployees] = useState([]);
    const [search, setSearch] = useState("");
    const [sortBy, setSortBy] = useState("id");

    const [modalOpen, setModalOpen] = useState(false);
    const [isEdit, setIsEdit] = useState(false);

    const [form, setForm] = useState({
        id: null,
        name: "",
        dob: "",
        gender: "",
        email: "",
        address: ""
    });

    // ✅ Load dữ liệu từ localStorage khi component load
    useEffect(() => {
        const saved = localStorage.getItem("employees_data");
        if (saved) {
            setEmployees(JSON.parse(saved));
        }
    }, []);

    // ✅ Lưu vào localStorage mỗi khi employees thay đổi
    useEffect(() => {
        localStorage.setItem("employees_data", JSON.stringify(employees));
    }, [employees]);


    const handleOpenAdd = () => {
        setIsEdit(false);
        setForm({
            id: null,
            name: "",
            dob: "",
            gender: "",
            email: "",
            address: ""
        });
        setModalOpen(true);
    };

    const handleOpenEdit = (emp) => {
        setIsEdit(true);
        setForm(emp);
        setModalOpen(true);
    };

    const handleDelete = (id) => {
        if (window.confirm("Bạn có chắc muốn xóa không?")) {
            setEmployees(employees.filter((e) => e.id !== id));
        }
    };

    const handleSave = () => {
        if (form.name.trim() === "") {
            alert("Tên không được để trống");
            return;
        }

        if (isEdit) {
            setEmployees(
                employees.map((emp) =>
                    emp.id === form.id ? form : emp
                )
            );
        } else {
            const newId =
                employees.length > 0
                    ? Math.max(...employees.map((e) => e.id)) + 1
                    : 1;

            setEmployees([...employees, { ...form, id: newId }]);
        }

        setModalOpen(false);
    };

    const filteredEmployees = employees
        .filter((e) => e.name.toLowerCase().includes(search.toLowerCase()))
        .sort((a, b) => {
            if (sortBy === "id") return a.id - b.id;
            if (sortBy === "name") return a.name.localeCompare(b.name);
            if (sortBy === "address") return a.address.localeCompare(b.address);
            return 0;
        });

    return (
        <div className="container py-4">

            <h2 className="text-center mb-4">Quản lý nhân viên</h2>

            {/* Search + Sort + Add */}
            <div className="d-flex gap-2 mb-3">
                <input
                    type="text"
                    className="form-control"
                    placeholder="Tìm kiếm theo tên..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />

                <select
                    className="form-select"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                >
                    <option value="id">Sắp xếp theo ID</option>
                    <option value="name">Sắp xếp theo Name</option>
                    <option value="address">Sắp xếp theo Address</option>
                </select>

                <button className="btn btn-success" onClick={handleOpenAdd}>
                    Thêm
                </button>
            </div>

            {/* Table */}
            <table className="table table-bordered text-center">
                <thead className="table-light">
                    <tr>
                        <th>ID</th>
                        <th>Tên</th>
                        <th>Ngày sinh</th>
                        <th>Giới tính</th>
                        <th>Email</th>
                        <th>Địa chỉ</th>
                        <th></th>
                    </tr>
                </thead>

                <tbody>
                    {filteredEmployees.map((emp) => (
                        <tr key={emp.id}>
                            <td>{emp.id}</td>
                            <td>{emp.name}</td>
                            <td>{emp.dob}</td>
                            <td>{emp.gender}</td>
                            <td>{emp.email}</td>
                            <td>{emp.address}</td>
                            <td>
                                <button
                                    className="btn btn-primary btn-sm me-2"
                                    onClick={() => handleOpenEdit(emp)}
                                >
                                    Sửa
                                </button>
                                <button
                                    className="btn btn-danger btn-sm"
                                    onClick={() => handleDelete(emp.id)}
                                >
                                    Xóa
                                </button>
                            </td>
                        </tr>
                    ))}

                    {filteredEmployees.length === 0 && (
                        <tr>
                            <td colSpan="7">Không có dữ liệu</td>
                        </tr>
                    )}
                </tbody>
            </table>

            {/* Modal */}
            {modalOpen && (
                <div
                    className="modal show fade"
                    style={{ display: "block", background: "rgba(0,0,0,0.5)" }}
                >
                    <div className="modal-dialog">
                        <div className="modal-content">

                            <div className="modal-header">
                                <h5 className="modal-title">
                                    {isEdit ? "Edit Employee" : "Add Employee"}
                                </h5>
                                <button
                                    className="btn-close"
                                    onClick={() => setModalOpen(false)}
                                ></button>
                            </div>

                            <div className="modal-body">

                                <div className="mb-3">
                                    <label className="form-label">Tên</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={form.name}
                                        onChange={(e) =>
                                            setForm({ ...form, name: e.target.value })
                                        }
                                    />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">Ngày sinh</label>
                                    <input
                                        type="date"
                                        className="form-control"
                                        value={form.dob}
                                        onChange={(e) =>
                                            setForm({ ...form, dob: e.target.value })
                                        }
                                    />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">Giới tính</label>
                                    <select
                                        className="form-select"
                                        value={form.gender}
                                        onChange={(e) =>
                                            setForm({ ...form, gender: e.target.value })
                                        }
                                    >
                                        <option value="">Chọn</option>
                                        <option value="Male">Nam</option>
                                        <option value="Female">Nữ</option>
                                    </select>
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">Email</label>
                                    <input
                                        type="email"
                                        className="form-control"
                                        value={form.email}
                                        onChange={(e) =>
                                            setForm({ ...form, email: e.target.value })
                                        }
                                    />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">Địa chỉ</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={form.address}
                                        onChange={(e) =>
                                            setForm({ ...form, address: e.target.value })
                                        }
                                    />
                                </div>

                            </div>

                            <div className="modal-footer">
                                <button
                                    className="btn btn-secondary"
                                    onClick={() => setModalOpen(false)}
                                >
                                    Hủy
                                </button>

                                <button className="btn btn-success" onClick={handleSave}>
                                    Lưu
                                </button>
                            </div>

                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Employee;
