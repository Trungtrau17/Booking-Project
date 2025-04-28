document.addEventListener("DOMContentLoaded", function () {
    initSlider();
    initNavLinks();
    initSearchBar();
    loadLocations();
});

// 1️⃣ Hàm khởi tạo slider ảnh
function initSlider() {
    const images = ["/TravelBooking/Anh/AnhLogin.jpg", "/TravelBooking/Anh/slide1.jpg", "/TravelBooking/Anh/slide2.jpg"];
    let index = 0;
    const slideImg = document.getElementById("slide-img");

    if (!slideImg) return;

    function showSlide() {
        slideImg.src = images[index];
    }

    document.querySelector(".prev")?.addEventListener("click", () => {
        index = (index - 1 + images.length) % images.length;
        showSlide();
    });

    document.querySelector(".next")?.addEventListener("click", () => {
        index = (index + 1) % images.length;
        showSlide();
    });

    showSlide();
    setInterval(() => {
        index = (index + 1) % images.length;
        showSlide();
    }, 5000);
}

// 2️⃣ Hàm cuộn mượt khi click vào menu
function initNavLinks() {
    document.querySelectorAll(".nav-link").forEach(link => {
        link.addEventListener("click", function (event) {
            const targetId = this.getAttribute("href").substring(1);
            const targetElement = document.getElementById(targetId);
            if (targetElement) {
                event.preventDefault();
                targetElement.scrollIntoView({ behavior: "smooth", block: "start" });
            }
        });
    });
}

// 3️⃣ Hàm khởi tạo thanh tìm kiếm
function initSearchBar() {
    const locationInput = document.getElementById("location-input");
    const locationDropdown = document.getElementById("location-dropdown");
    const guestInput = document.getElementById("guest-input");
    const guestDropdown = document.getElementById("guest-dropdown");

    if (locationInput) {
        locationInput.addEventListener("click", (event) => {
            event.stopPropagation();
            locationDropdown.style.display = locationDropdown.style.display === "block" ? "none" : "block";
        });

        document.addEventListener("click", (event) => {
            if (!locationInput.contains(event.target) && !locationDropdown.contains(event.target)) {
                locationDropdown.style.display = "none";
            }
        });
    }

    if (guestInput) {
        guestInput.addEventListener("click", (event) => {
            event.stopPropagation();
            guestDropdown.style.display = guestDropdown.style.display === "block" ? "none" : "block";
        });

        document.addEventListener("click", (event) => {
            if (!guestInput.contains(event.target) && !guestDropdown.contains(event.target)) {
                guestDropdown.style.display = "none";
            }
        });

        document.querySelectorAll(".counter").forEach(counter => {
            const minusBtn = counter.querySelector(".minus");
            const plusBtn = counter.querySelector(".plus");
            const countSpan = counter.querySelector(".count");

            minusBtn.addEventListener("click", () => {
                let value = parseInt(countSpan.textContent);
                if (value > 0) {
                    countSpan.textContent = value - 1;
                    updateGuestInput();
                }
            });

            plusBtn.addEventListener("click", () => {
                let value = parseInt(countSpan.textContent);
                countSpan.textContent = value + 1;
                updateGuestInput();
            });
        });
    }

    function updateGuestInput() {
        const counts = document.querySelectorAll("#guest-dropdown .count");
        const adults = counts[0].textContent;
        const children = counts[1].textContent;
        const rooms = counts[2].textContent;
        guestInput.value = `${adults} người lớn, ${children} trẻ em, ${rooms} phòng`;
    }
}

// 4️⃣ Hàm load địa điểm từ file places.js
function loadLocations() {
    const inputField = document.getElementById("location-input");
    const dropdown = document.querySelector(".location-dropdown");

    if (!inputField || !dropdown) return console.warn("Không tìm thấy phần tử dropdown!");

    dropdown.innerHTML = ""; // Xóa dữ liệu cũ

    try {
        const places = getPlaces(); // Lấy danh sách địa điểm từ places.js
        if (!places || places.length === 0) {
            console.warn("Danh sách địa điểm trống!");
            return;
        }

        places.forEach(place => {
            let option = document.createElement("div");
            option.classList.add("option");
            option.textContent = place;
            option.addEventListener("click", function () {
                inputField.value = place;
                dropdown.style.display = "none";
            });
            dropdown.appendChild(option);
        });

        // Sự kiện mở dropdown
        inputField.addEventListener("click", function (event) {
            event.stopPropagation();
            dropdown.style.display = dropdown.style.display === "block" ? "none" : "block";
            console.log("Dropdown hiển thị:", dropdown.style.display);
        });

        // Ẩn dropdown khi click bên ngoài
        document.addEventListener("click", function (event) {
            if (!inputField.contains(event.target) && !dropdown.contains(event.target)) {
                dropdown.style.display = "none";
            }
        });

        console.log("✅ Đã load danh sách địa điểm!");
    } catch (error) {
        console.error("❌ Lỗi khi tải danh sách địa điểm:", error);
    }
}
document.addEventListener("DOMContentLoaded", function () {
    const dropdown = document.querySelector(".location-dropdown");

    if (!dropdown) {
        console.error("Không tìm thấy phần tử .location-dropdown!");
        return;
    }

    dropdown.style.display ="none";
});
document.addEventListener("DOMContentLoaded", initSlider);