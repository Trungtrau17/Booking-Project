// Xử lý đăng nhập với backend
document.getElementById("loginForm").addEventListener("submit", async function (event) {
    event.preventDefault(); // Ngăn form gửi đi

    // Lấy giá trị từ form
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    try {
        const response = await fetch("http://localhost:5000/api/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password }),
        });

        const data = await response.json();

        if (response.ok) {
            alert("Đăng nhập thành công!");
            localStorage.setItem("token", data.token); // Lưu token vào localStorage

            // Kiểm tra nếu là admin thì chuyển sang Admin.html
            if (username === "admin") {
                window.location.href = "../TravelBooking/Admin/index.html";
            } else {
                window.location.href = "Menu.html"; // Chuyển hướng sau khi đăng nhập thành công
            }
        } else {
            alert(data.message); // Hiển thị lỗi từ backend
        }
    } catch (error) {
        console.error("Lỗi đăng nhập:", error);
        alert("Lỗi kết nối đến server!");
    }
});

document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("signup-form").addEventListener("submit", async function (event) {
        event.preventDefault(); // Ngăn form gửi đi mặc định

        // Lấy giá trị từ form
        const fullName = document.querySelector("#signup-form input[placeholder='Full Name']").value;
        const email = document.querySelector("#signup-form input[placeholder='Username']").value;
        const password = document.querySelector("#signup-form input[placeholder='Password']").value;

        // Gửi dữ liệu đến API backend
        try {
            const response = await fetch("http://localhost:5000/api/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username: email, password }) // Gửi username là email
            });

            const data = await response.json();
            alert(data.message); // Hiển thị thông báo

            if (response.status === 201) {
                window.location.href = "login.html"; // Chuyển về trang đăng nhập sau khi đăng ký thành công
            }
        } catch (error) {
            console.error("Lỗi đăng ký:", error);
            alert("Đăng ký thất bại, thử lại sau!");
        }
    });
});
    // Xử lý gửi yêu cầu quên mật khẩu
    document.getElementById("forgotPasswordForm").addEventListener("submit", async function (event) {
        event.preventDefault();

        const email = document.getElementById("forgot-email").value;

        try {
            const response = await fetch("http://localhost:5000/api/forgot-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email })
            });

            const data = await response.json();
            alert(data.message); // Thông báo từ server
        } catch (error) {
            console.error("Lỗi gửi yêu cầu:", error);
            alert("Không thể gửi yêu cầu, thử lại sau!");
        }
    });