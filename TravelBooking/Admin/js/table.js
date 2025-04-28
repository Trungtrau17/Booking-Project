// script.js
document.addEventListener("DOMContentLoaded", function () {
    const customerData = [
        { id: 1, name: "Nguyễn Văn A", phone: "0123456789", room: "101", status: "Đã thanh toán" },
        { id: 2, name: "Trần Thị B", phone: "0987654321", room: "102", status: "Chưa thanh toán" },
        { id: 3, name: "Lê Văn C", phone: "0912345678", room: "103", status: "Đã thanh toán" }
    ];

    function loadCustomers() {
        const tableBody = document.getElementById("customer-table");
        tableBody.innerHTML = ""; // Xóa dữ liệu cũ

        customerData.forEach(customer => {
            const row = document.createElement("tr");

            row.innerHTML = `
                <td>${customer.id}</td>
                <td>${customer.name}</td>
                <td>${customer.phone}</td>
                <td>${customer.room}</td>
                <td class="${customer.status === 'Đã thanh toán' ? 'status-paid' : 'status-unpaid'}">${customer.status}</td>
                <td>
                    <button class="edit-btn" onclick="editCustomer(${customer.id})">Sửa</button>
                    <button class="delete-btn" onclick="deleteCustomer(${customer.id})">Xóa</button>
                </td>
            `;

            tableBody.appendChild(row);
        });
    }

    window.editCustomer = function (id) {
        alert("Chức năng chỉnh sửa khách hàng ID: " + id);
    };

    window.deleteCustomer = function (id) {
        if (confirm("Bạn có chắc muốn xóa khách hàng này?")) {
            const index = customerData.findIndex(c => c.id === id);
            if (index !== -1) {
                customerData.splice(index, 1);
                loadCustomers();
            }
        }
    };

    loadCustomers();
});
