document.addEventListener("DOMContentLoaded", function () {
    // Lấy các phần tử
    const loginBox = document.querySelector(".login-box"); // Form login
    const signupForm = document.getElementById("signup-form"); // Form đăng ký

    // Kiểm tra nếu URL chứa "signup=true" thì mở form đăng ký
    const urlParams = new URLSearchParams(window.location.search);
    
});

document.addEventListener("DOMContentLoaded", function () {
    const images = ["Anh/AnhLogin.jpg", "Anh/slide1.jpg", "Anh/slide2.jpg"];
    let index = 0;

    const slideImg = document.getElementById("slide-img");
    if (!slideImg) {
        console.error("Không tìm thấy phần tử #slide-img");
        return;
    }

    function showSlide() {
        slideImg.src = images[index];
    }

    document.querySelector(".prev").addEventListener("click", function () {
        index = (index - 1 + images.length) % images.length;
        showSlide();
    });

    document.querySelector(".next").addEventListener("click", function () {
        index = (index + 1) % images.length;
        showSlide();
    });

    showSlide(); // Hiển thị ảnh đầu tiên khi tải trang
});


