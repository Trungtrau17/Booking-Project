// Sample data - this would be fetched from your API in a real app
const roles = [
    {
        _id: "1",
        title: "Administrator",
        description: "Full system access",
        permissions: ["role_view", "role_create", "role_edit", "category_view", "category_create", "category_edit", "category_delete", "room_view", "room_create", "room_edit", "room_delete", "account_view", "account_create", "account_edit", "account_delete"],
        createdBy: {
            fullName: "System",
            createAt: "2023-01-01"
        }
    },
    {
        _id: "2",
        title: "Manager",
        description: "Can manage most aspects of the system",
        permissions: ["role_view", "category_view", "category_create", "category_edit", "room_view", "room_create", "room_edit", "account_view"],
        createdBy: {
            fullName: "Admin User",
            createAt: "2023-01-15"
        }
    },
    {
        _id: "3",
        title: "Reception",
        description: "Front desk staff with limited access",
        permissions: ["room_view", "account_view"],
        createdBy: {
            fullName: "Admin User",
            createAt: "2023-02-01"
        }
    }
];

// All available permissions in the system
const allPermissions = [
    { value: "role_view", label: "View Roles" },
    { value: "role_create", label: "Create Roles" },
    { value: "role_edit", label: "Edit Roles" },
    { value: "category_view", label: "View Categories" },
    { value: "category_create", label: "Create Categories" },
    { value: "category_edit", label: "Edit Categories" },
    { value: "category_delete", label: "Delete Categories" },
    { value: "room_view", label: "View Rooms" },
    { value: "room_create", label: "Create Rooms" },
    { value: "room_edit", label: "Edit Rooms" },
    { value: "room_delete", label: "Delete Rooms" },
    { value: "account_view", label: "View Accounts" },
    { value: "account_create", label: "Create Accounts" },
    { value: "account_edit", label: "Edit Accounts" },
    { value: "account_delete", label: "Delete Accounts" }
];

// DOM Elements
const roleModal = document.getElementById('roleModal');
const permissionsModal = document.getElementById('permissionsModal');
const closeRoleModal = document.getElementById('closeRoleModal');
const closePermissionsModal = document.getElementById('closePermissionsModal');
const btnAddRole = document.getElementById('btnAddRole');
const btnManagePermissions = document.getElementById('btnManagePermissions');
const btnSaveRole = document.getElementById('btnSaveRole');
const btnCancelRole = document.getElementById('btnCancelRole');
const btnSavePermissions = document.getElementById('btnSavePermissions');
const btnCancelPermissions = document.getElementById('btnCancelPermissions');
const rolesTableBody = document.getElementById('rolesTableBody');
const permissionsContainer = document.getElementById('permissionsContainer');
const roleForm = document.getElementById('roleForm');
const roleTitle = document.getElementById('roleTitle');
const roleDescription = document.getElementById('roleDescription');
const roleId = document.getElementById('roleId');
const roleTabs = document.getElementById('roleTabs');
const roleTabContents = document.getElementById('roleTabContents');
const alertMessage = document.getElementById('alertMessage');

// Format date for display
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
}

// Show alert message
function showAlert(message, type) {
    alertMessage.textContent = message;
    alertMessage.className = `alert alert-${type}`;
    alertMessage.style.display = 'block';
    
    // Hide after 3 seconds
    setTimeout(() => {
        alertMessage.style.display = 'none';
    }, 3000);
}

// Populate roles table
function populateRolesTable() {
    rolesTableBody.innerHTML = '';
    
    roles.forEach(role => {
        const tr = document.createElement('tr');
        
        tr.innerHTML = `
            <td>${role.title}</td>
            <td>${role.description || '-'}</td>
            <td>${role.permissions.length} permissions</td>
            <td>${role.createdBy.fullName}</td>
            <td>${formatDate(role.createdBy.createAt)}</td>
            <td class="actions">
                <button class="btn btn-primary btn-sm" onclick="editRole('${role._id}')">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-danger btn-sm" onclick="deleteRole('${role._id}')">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        
        rolesTableBody.appendChild(tr);
    });
}

// Populate permissions checkboxes in role modal
function populatePermissionsCheckboxes(selectedPermissions = []) {
    permissionsContainer.innerHTML = '';
    
    allPermissions.forEach(permission => {
        const permissionDiv = document.createElement('div');
        permissionDiv.className = 'permission-item';
        
        const checked = selectedPermissions.includes(permission.value) ? 'checked' : '';
        
        permissionDiv.innerHTML = `
            <input type="checkbox" id="perm_${permission.value}" name="permissions" 
                   value="${permission.value}" ${checked}>
            <label for="perm_${permission.value}">${permission.label}</label>
        `;
        
        permissionsContainer.appendChild(permissionDiv);
    });
}

// Populate role tabs and contents in permissions modal
function populateRoleTabs() {
    roleTabs.innerHTML = '';
    roleTabContents.innerHTML = '';
    
    roles.forEach((role, index) => {
        // Create tab
        const tabLink = document.createElement('div');
        tabLink.className = `tab-link ${index === 0 ? 'active' : ''}`;
        tabLink.setAttribute('data-tab', `role-${role._id}`);
        tabLink.textContent = role.title;
        tabLink.onclick = () => switchTab(role._id);
        roleTabs.appendChild(tabLink);
        
        // Create tab content
        const tabContent = document.createElement('div');
        tabContent.className = `tab-content ${index === 0 ? 'active' : ''}`;
        tabContent.id = `role-${role._id}`;
        
        // Create permissions checkboxes container
        const permContainer = document.createElement('div');
        permContainer.className = 'permissions-container';
        
        // Add permissions checkboxes
        allPermissions.forEach(permission => {
            const permItem = document.createElement('div');
            permItem.className = 'permission-item';
            
            const checked = role.permissions.includes(permission.value) ? 'checked' : '';
            
            permItem.innerHTML = `
                <input type="checkbox" id="role_${role._id}_perm_${permission.value}" 
                       name="role_${role._id}_permissions" 
                       value="${permission.value}" ${checked}>
                <label for="role_${role._id}_perm_${permission.value}">${permission.label}</label>
            `;
            
            permContainer.appendChild(permItem);
        });
        
        tabContent.appendChild(permContainer);
        roleTabContents.appendChild(tabContent);
    });
}

// Switch between tabs in permissions modal
function switchTab(roleId) {
    // Remove active class from all tabs and contents
    document.querySelectorAll('.tab-link').forEach(tab => {
        tab.classList.remove('active');
    });
    
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    
    // Add active class to selected tab and content
    document.querySelector(`[data-tab="role-${roleId}"]`).classList.add('active');
    document.getElementById(`role-${roleId}`).classList.add('active');
}

// Open role modal for adding new role
function openAddRoleModal() {
    roleModalTitle.textContent = 'Add New Role';
    roleForm.reset();
    roleId.value = '';
    populatePermissionsCheckboxes();
    roleModal.classList.add('show');
}

// Open role modal for editing existing role
function editRole(id) {
    const role = roles.find(r => r._id === id);
    
    if (role) {
        roleModalTitle.textContent = 'Edit Role';
        roleId.value = role._id;
        roleTitle.value = role.title;
        roleDescription.value = role.description || '';
        populatePermissionsCheckboxes(role.permissions);
        roleModal.classList.add('show');
    }
}

// Delete role (would be connected to your API)
function deleteRole(id) {
    if (confirm('Are you sure you want to delete this role?')) {
        // In a real app, you would call your API here
        // For demo, we'll just remove from our array and refresh
        const index = roles.findIndex(r => r._id === id);
        if (index !== -1) {
            roles.splice(index, 1);
            populateRolesTable();
            showAlert('Role deleted successfully', 'success');
        }
    }
}

// Save role (add new or update existing)
function saveRole() {
    const title = roleTitle.value.trim();
    const description = roleDescription.value.trim();
    const id = roleId.value;
    
    if (!title) {
        showAlert('Title is required', 'danger');
        return;
    }
    
    // Get selected permissions
    const selectedPermissions = [];
    document.querySelectorAll('#permissionsContainer input[type="checkbox"]:checked').forEach(checkbox => {
        selectedPermissions.push(checkbox.value);
    });
    
    if (id) {
        // Update existing role
        const roleIndex = roles.findIndex(r => r._id === id);
        
        if (roleIndex !== -1) {
            roles[roleIndex].title = title;
            roles[roleIndex].description = description;
            roles[roleIndex].permissions = selectedPermissions;
            // In a real app, you would also update the editBy field
        }
        
        showAlert('Role updated successfully', 'success');
    } else {
        // Add new role
        const newRole = {
            _id: Date.now().toString(), // In a real app, this would come from your API
            title,
            description,
            permissions: selectedPermissions,
            createdBy: {
                fullName: "Current User", // In a real app, this would be the logged-in user
                createAt: new Date().toISOString()
            }
        };
        
        roles.push(newRole);
        showAlert('Role created successfully', 'success');
    }
    
    populateRolesTable();
    closeRoleModal.click();
}

// Save all permissions from permissions modal
function saveAllPermissions() {
    roles.forEach(role => {
        const permissions = [];
        
        document.querySelectorAll(`#role-${role._id} input[type="checkbox"]:checked`).forEach(checkbox => {
            permissions.push(checkbox.value);
        });
        role.permissions = permissions;
        
    });
    showAlert('All permissions updated successfully', 'success');
}