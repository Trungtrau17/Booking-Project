// Sample user data - In a real application, this would come from your backend API
let users = [
    {
        _id: '1',
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
        phone: '123-456-7890',
        thumbnail: [],
        status: 'active',
        address: '123 Main St, City',
        deleted: false,
        token: 'abcdef123456',
        createdAt: '2023-09-15T10:30:00Z',
        updatedAt: '2023-10-05T14:20:00Z',
    },
    {
        _id: '2',
        name: 'Jane Smith',
        email: 'jane@example.com',
        password: 'password456',
        phone: '987-654-3210',
        thumbnail: [],
        status: 'inactive',
        address: '456 Oak Ave, Town',
        deleted: false,
        token: 'xyz789012345',
        createdAt: '2023-07-22T08:15:00Z',
        updatedAt: '2023-09-18T11:45:00Z',
    },
    {
        _id: '3',
        name: 'Michael Johnson',
        email: 'michael@example.com',
        password: 'password789',
        phone: '555-123-4567',
        thumbnail: [],
        status: 'active',
        address: '789 Pine Rd, Village',
        deleted: true,
        token: 'qwerty654321',
        createdAt: '2023-08-10T16:20:00Z',
        updatedAt: '2023-10-12T09:30:00Z',
    }
];

// Variables for pagination
let currentPage = 1;
const rowsPerPage = 10;
let filteredUsers = [...users];

// DOM elements
const userList = document.getElementById('userList');
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const refreshBtn = document.getElementById('refreshBtn');
const addUserBtn = document.getElementById('addUserBtn');
const pagination = document.getElementById('pagination');
const userModal = document.getElementById('userModal');
const viewModal = document.getElementById('viewModal');
const userForm = document.getElementById('userForm');
const modalTitle = document.getElementById('modalTitle');
const userDetails = document.getElementById('userDetails');
const togglePasswordBtn = document.getElementById('togglePassword');
const passwordInput = document.getElementById('password');

// Close modal buttons
const closeButtons = document.querySelectorAll('.close');
const cancelBtn = document.getElementById('cancelBtn');
const closeViewBtn = document.getElementById('closeViewBtn');

// Initialize the dashboard
document.addEventListener('DOMContentLoaded', () => {
    renderUsers();
    setupEventListeners();
});

// Set up event listeners
function setupEventListeners() {
    // Search functionality
    searchBtn.addEventListener('click', handleSearch);
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleSearch();
    });

    // Refresh button
    refreshBtn.addEventListener('click', () => {
        searchInput.value = '';
        filteredUsers = [...users];
        currentPage = 1;
        renderUsers();
    });

    // Add user button
    addUserBtn.addEventListener('click', () => openAddUserModal());

    // Close modals
    closeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            userModal.style.display = 'none';
            viewModal.style.display = 'none';
        });
    });

    cancelBtn.addEventListener('click', () => userModal.style.display = 'none');
    closeViewBtn.addEventListener('click', () => viewModal.style.display = 'none');

    // Submit form
    userForm.addEventListener('submit', handleFormSubmit);

    // Toggle password visibility
    togglePasswordBtn.addEventListener('click', togglePasswordVisibility);

    // Close modal when clicking outside
    window.addEventListener('click', (event) => {
        if (event.target === userModal) userModal.style.display = 'none';
        if (event.target === viewModal) viewModal.style.display = 'none';
    });
}

// Render users to the table
function renderUsers() {
    const start = (currentPage - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    const paginatedUsers = filteredUsers.slice(start, end);
    
    userList.innerHTML = '';
    
    if (paginatedUsers.length === 0) {
        userList.innerHTML = '<tr><td colspan="7" style="text-align: center;">No users found</td></tr>';
        pagination.innerHTML = '';
        return;
    }

    paginatedUsers.forEach(user => {
        const row = document.createElement('tr');
        if (user.deleted) row.classList.add('deleted');
        
        row.innerHTML = `
            <td>${user.name}</td>
            <td>${user.email}</td>
            <td>${user.phone || '-'}</td>
            <td class="status-${user.status}">${user.status}</td>
            <td>${user.address || '-'}</td>
            <td>${formatDate(user.createdAt)}</td>
            <td class="action-buttons">
                <button class="btn-view" data-id="${user._id}">View</button>
                <button class="btn-edit" data-id="${user._id}">Edit</button>
                <button class="btn-delete" data-id="${user._id}">${user.deleted ? 'Restore' : 'Delete'}</button>
            </td>
        `;
        
        userList.appendChild(row);
    });

    // Add event listeners to the action buttons
    document.querySelectorAll('.btn-view').forEach(btn => {
        btn.addEventListener('click', () => viewUser(btn.getAttribute('data-id')));
    });
    
    document.querySelectorAll('.btn-edit').forEach(btn => {
        btn.addEventListener('click', () => editUser(btn.getAttribute('data-id')));
    });
    
    document.querySelectorAll('.btn-delete').forEach(btn => {
        btn.addEventListener('click', () => toggleDeleteUser(btn.getAttribute('data-id')));
    });

    renderPagination();
}

// Render pagination controls
function renderPagination() {
    const totalPages = Math.ceil(filteredUsers.length / rowsPerPage);
    pagination.innerHTML = '';
    
    if (totalPages <= 1) return;

    // Previous button
    const prevBtn = document.createElement('button');
    prevBtn.textContent = '←';
    prevBtn.disabled = currentPage === 1;
    prevBtn.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            renderUsers();
        }
    });
    pagination.appendChild(prevBtn);

    // Page buttons
    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, startPage + 4);
    if (endPage - startPage < 4) {
        startPage = Math.max(1, endPage - 4);
    }

    for (let i = startPage; i <= endPage; i++) {
        const pageBtn = document.createElement('button');
        pageBtn.textContent = i;
        if (i === currentPage) pageBtn.classList.add('current-page');
        pageBtn.addEventListener('click', () => {
            currentPage = i;
            renderUsers();
        });
        pagination.appendChild(pageBtn);
    }

    // Next button
    const nextBtn = document.createElement('button');
    nextBtn.textContent = '→';
    nextBtn.disabled = currentPage === totalPages;
    nextBtn.addEventListener('click', () => {
        if (currentPage < totalPages) {
            currentPage++;
            renderUsers();
        }
    });
    pagination.appendChild(nextBtn);
}

// Search users
function handleSearch() {
    const searchTerm = searchInput.value.toLowerCase().trim();
    if (searchTerm === '') {
        filteredUsers = [...users];
    } else {
        filteredUsers = users.filter(user => 
            user.name.toLowerCase().includes(searchTerm) ||
            user.email.toLowerCase().includes(searchTerm) ||
            (user.phone && user.phone.toLowerCase().includes(searchTerm))
        );
    }
    currentPage = 1;
    renderUsers();
}

// Open the add user modal
function openAddUserModal() {
    modalTitle.textContent = 'Add New User';
    userForm.reset();
    document.getElementById('userId').value = '';
    userModal.style.display = 'block';
}

// View user details
function viewUser(userId) {
    const user = users.find(u => u._id === userId);
    if (!user) return;

    userDetails.innerHTML = `
        <div style="margin-bottom: 20px;">
            <p><strong>Name:</strong> ${user.name}</p>
            <p><strong>Email:</strong> ${user.email}</p>
            <p><strong>Phone:</strong> ${user.phone || '-'}</p>
            <p><strong>Status:</strong> <span class="status-${user.status}">${user.status}</span></p>
            <p><strong>Address:</strong> ${user.address || '-'}</p>
            <p><strong>Deleted:</strong> ${user.deleted ? 'Yes' : 'No'}</p>
            <p><strong>Created:</strong> ${formatDate(user.createdAt)}</p>
            <p><strong>Last Updated:</strong> ${formatDate(user.updatedAt)}</p>
            <p><strong>Token:</strong> ${user.token}</p>
        </div>
    `;

    viewModal.style.display = 'block';
}

// Edit user
function editUser(userId) {
    const user = users.find(u => u._id === userId);
    if (!user) return;

    modalTitle.textContent = 'Edit User';
    document.getElementById('userId').value = user._id;
    document.getElementById('name').value = user.name;
    document.getElementById('email').value = user.email;
    document.getElementById('password').value = user.password;
    document.getElementById('phone').value = user.phone || '';
    document.getElementById('status').value = user.status;
    document.getElementById('address').value = user.address || '';

    userModal.style.display = 'block';
}

// Toggle delete/restore user
function toggleDeleteUser(userId) {
    const userIndex = users.findIndex(u => u._id === userId);
    if (userIndex === -1) return;

    users[userIndex].deleted = !users[userIndex].deleted;
    users[userIndex].updatedAt = new Date().toISOString();
    
    // Update filtered users
    filteredUsers = [...users];
    if (searchInput.value.trim() !== '') {
        handleSearch();
    } else {
        renderUsers();
    }
}

// Handle form submission
function handleFormSubmit(e) {
    e.preventDefault();
    
    const userId = document.getElementById('userId').value;
    const newUser = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        password: document.getElementById('password').value,
        phone: document.getElementById('phone').value,
        status: document.getElementById('status').value,
        address: document.getElementById('address').value,
        updatedAt: new Date().toISOString()
    };

    // Update or add user
    if (userId) {
        // Edit existing user
        const userIndex = users.findIndex(u => u._id === userId);
        if (userIndex !== -1) {
            users[userIndex] = { ...users[userIndex], ...newUser };
        }
    } else {
        // Add new user
        const newId = (parseInt(users[users.length - 1]?._id || '0') + 1).toString();
        users.push({
            _id: newId,
            ...newUser,
            deleted: false,
            thumbnail: [],
            token: generateToken(),
            createdAt: new Date().toISOString()
        });
    }

    // Update filtered users
    filteredUsers = [...users];
    if (searchInput.value.trim() !== '') {
        handleSearch();
    } else {
        renderUsers();
    }

    // Close the modal
    userModal.style.display = 'none';
}

// Toggle password visibility
function togglePasswordVisibility() {
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        togglePasswordBtn.textContent = 'Hide';
    } else {
        passwordInput.type = 'password';
        togglePasswordBtn.textContent = 'Show';
    }
}

// Format date for display
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
}


// Function to handle closing modals
function setupCloseButtons() {
    // Get all modal elements
    const userModal = document.getElementById('userModal');
    const viewModal = document.getElementById('viewModal');
    
    // Get all close buttons (× symbols)
    const closeButtons = document.querySelectorAll('.close');
    
    // Get specific buttons
    const cancelBtn = document.getElementById('cancelBtn');
    const closeViewBtn = document.getElementById('closeViewBtn');
    
    // Add event listeners to all close buttons
    closeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            userModal.style.display = 'none';
            viewModal.style.display = 'none';
        });
    });
    
    // Add event listeners to specific buttons
    if (cancelBtn) {
        cancelBtn.addEventListener('click', () => {
            userModal.style.display = 'none';
        });
    }
    
    if (closeViewBtn) {
        closeViewBtn.addEventListener('click', () => {
            viewModal.style.display = 'none';
        });
    }
    
    // Close modals when clicking outside
    window.addEventListener('click', (event) => {
        if (event.target === userModal) {
            userModal.style.display = 'none';
        }
        if (event.target === viewModal) {
            viewModal.style.display = 'none';
        }
    });
}

// Call this function when the document is loaded
document.addEventListener('DOMContentLoaded', () => {
    setupCloseButtons();
    // Your other initialization code...
});
