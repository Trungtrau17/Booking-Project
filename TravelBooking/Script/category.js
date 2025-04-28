document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const tabs = document.querySelectorAll('.tab');
    const tabContents = document.querySelectorAll('.tab-content');
    const addForm = document.getElementById('addCategoryForm');
    const editForm = document.getElementById('editCategoryForm');
    const resetBtn = document.getElementById('resetBtn');
    const cancelEditBtn = document.getElementById('cancelEditBtn');
    const successAlert = document.getElementById('successAlert');
    const errorAlert = document.getElementById('errorAlert');
    const thumbnailInput = document.getElementById('thumbnail');
    const thumbnailPreview = document.getElementById('thumbnailPreview');
    const editThumbnailInput = document.getElementById('editThumbnail');
    const editThumbnailPreview = document.getElementById('editThumbnailPreview');
    const categoryTableBody = document.getElementById('categoryTableBody');
    const pagination = document.getElementById('pagination');
    const categorySearch = document.getElementById('categorySearch');
    
    // Variables
    let currentPage = 1;
    let totalPages = 1;
    let limit = 5;
    let categories = [];
    let parentCategories = [];
    
    // Tab functionality
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            
            // Remove active class from all tabs and contents
            tabs.forEach(t => t.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Add active class to clicked tab and corresponding content
            this.classList.add('active');
            document.getElementById(tabId).classList.add('active');
            
            // If list tab is clicked, load categories
            if (tabId === 'list-categories') {
                loadCategories();
            }
        });
    });
    
    // Load parent categories for dropdowns
    function loadParentCategories() {
        fetch('/api/v1/admin/category-rooms?limit=100')
            .then(response => response.json())
            .then(data => {
                if (data.code === 200) {
                    parentCategories = data.data;
                    
                    // Populate parent dropdowns
                    const parentDropdowns = document.querySelectorAll('#parentId, #editParentId');
                    parentDropdowns.forEach(dropdown => {
                        // Clear existing options except first one
                        const firstOption = dropdown.options[0];
                        dropdown.innerHTML = '';
                        dropdown.appendChild(firstOption);
                        
                        // Add new options
                        parentCategories.forEach(category => {
                            const option = document.createElement('option');
                            option.value = category._id;
                            option.textContent = category.title;
                            dropdown.appendChild(option);
                        });
                    });
                }
            })
            .catch(error => {
                console.error('Error loading parent categories:', error);
            });
    }
    
    // Load categories for the list tab
    function loadCategories() {
        fetch(`/api/v1/admin/category-rooms?page=${currentPage}&limit=${limit}`)
            .then(response => response.json())
            .then(data => {
                if (data.code === 200) {
                    categories = data.data;
                    totalPages = Math.ceil(data.pagination.total / limit);
                    
                    // Render categories in table
                    renderCategoryTable();
                    
                    // Render pagination
                    renderPagination();
                }
            })
            .catch(error => {
                console.error('Error loading categories:', error);
                showErrorAlert('Failed to load categories');
            });
    }
    
    // Render category table
    function renderCategoryTable() {
        categoryTableBody.innerHTML = '';
        
        if (categories.length === 0) {
            const row = document.createElement('tr');
            row.innerHTML = '<td colspan="5" style="text-align: center;">No categories found</td>';
            categoryTableBody.appendChild(row);
            return;
        }
        
        categories.forEach(category => {
            const row = document.createElement('tr');
            
            // Find parent category name if exists
            let parentName = 'None';
            if (category.parentId) {
                const parent = parentCategories.find(p => p._id === category.parentId);
                if (parent) {
                    parentName = parent.title;
                }
            }
            
            row.innerHTML = `
                <td>${category.title}</td>
                <td>${parentName}</td>
                <td>${category.position || '-'}</td>
                <td>${category.status || 'Active'}</td>
                <td class="actions">
                    <button class="action-btn edit-btn" data-id="${category._id}">Edit</button>
                    <button class="action-btn delete-btn" data-id="${category._id}">Delete</button>
                </td>
            `;
            
            categoryTableBody.appendChild(row);
        });
        
        // Add event listeners to action buttons
        document.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const categoryId = this.getAttribute('data-id');
                loadCategoryForEdit(categoryId);
            });
        });
        
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const categoryId = this.getAttribute('data-id');
                deleteCategory(categoryId);
            });
        });
    }
    
    // Render pagination controls
    function renderPagination() {
        pagination.innerHTML = '';
        
        // Previous button
        const prevBtn = document.createElement('div');
        prevBtn.classList.add('pagination-item');
        prevBtn.textContent = '←';
        prevBtn.addEventListener('click', function() {
            if (currentPage > 1) {
                currentPage--;
                loadCategories();
            }
        });
        pagination.appendChild(prevBtn);
        
        // Page numbers
        for (let i = 1; i <= totalPages; i++) {
            const pageBtn = document.createElement('div');
            pageBtn.classList.add('pagination-item');
            if (i === currentPage) {
                pageBtn.classList.add('active');
            }
            pageBtn.textContent = i;
            pageBtn.addEventListener('click', function() {
                currentPage = i;
                loadCategories();
            });
            pagination.appendChild(pageBtn);
        }
        
        // Next button
        const nextBtn = document.createElement('div');
        nextBtn.classList.add('pagination-item');
        nextBtn.textContent = '→';
        nextBtn.addEventListener('click', function() {
            if (currentPage < totalPages) {
                currentPage++;
                loadCategories();
            }
        });
        pagination.appendChild(nextBtn);
    }
    
    // Load category for editing
    function loadCategoryForEdit(categoryId) {
        fetch(`/api/v1/admin/category-rooms/edit/${categoryId}`)
            .then(response => response.json())
            .then(data => {
                if (data.code === 200) {
                    const category = data.data;
                    
                    // Fill form fields
                    document.getElementById('editCategoryId').value = category._id;
                    document.getElementById('editTitle').value = category.title;
                    document.getElementById('editParentId').value = category.parentId || '';
                    document.getElementById('editPosition').value = category.position || '';
                    document.getElementById('editStatus').value = category.status || 'active';
                    document.getElementById('editFeature').value = category.feature || '';
                    document.getElementById('editDescription').value = category.description || '';
                    
                    // Display thumbnails if any
                    editThumbnailPreview.innerHTML = '';
                    if (category.thumbnail && category.thumbnail.length > 0) {
                        category.thumbnail.forEach(image => {
                            const div = document.createElement('div');
                            div.className = 'thumbnail-item';
                            
                            const img = document.createElement('img');
                            img.src = image;
                            
                            const removeBtn = document.createElement('span');
                            removeBtn.className = 'remove-thumbnail';
                            removeBtn.innerHTML = '×';
                            removeBtn.dataset.src = image;
                            removeBtn.addEventListener('click', function() {
                                div.remove();
                            });
                            
                            div.appendChild(img);
                            div.appendChild(removeBtn);
                            editThumbnailPreview.appendChild(div);
                        });
                    }
                    
                    // Show edit form and hide other tabs
                    tabs.forEach(t => t.classList.remove('active'));
                    tabContents.forEach(content => content.classList.remove('active'));
                    document.getElementById('edit-category').classList.add('active');
                } else {
                    showErrorAlert('Failed to load category details');
                }
            })
            .catch(error => {
                console.error('Error loading category for edit:', error);
                showErrorAlert('Failed to load category details');
            });
    }
    
    // Delete category
    function deleteCategory(categoryId) {
        if (confirm('Are you sure you want to delete this category?')) {
            fetch(`/api/v1/admin/category-rooms/delete/${categoryId}`, {
                method: 'PATCH'
            })
                .then(response => response.json())
                .then(data => {
                    if (data.code === 200) {
                        showSuccessAlert('Category deleted successfully');
                        loadCategories();
                    } else {
                        showErrorAlert('Failed to delete category');
                    }
                })
                .catch(error => {
                    console.error('Error deleting category:', error);
                    showErrorAlert('Failed to delete category');
                });
        }
    }
    
    // Add category form submission
    addForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = new FormData(addForm);
        const categoryData = {};
        
        formData.forEach((value, key) => {
            if (value !== '') {
                categoryData[key] = value;
            }
        });
        
        // Handle thumbnail images
        // In a real implementation, you would upload files to a server
        // and get URLs to store in the category data
        
        fetch('/api/v1/admin/category-rooms/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(categoryData)
        })
            .then(response => response.json())
            .then(data => {
                if (data.code === 200) {
                    showSuccessAlert('Category added successfully');
                    addForm.reset();
                    thumbnailPreview.innerHTML = '';
                    loadParentCategories(); // Refresh parent categories
                } else {
                    showErrorAlert('Failed to add category');
                }
            })
            .catch(error => {
                console.error('Error adding category:', error);
                showErrorAlert('Failed to add category');
            });
    });
    
    // Edit category form submission
    editForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = new FormData(editForm);
        const categoryData = {};
        const categoryId = document.getElementById('editCategoryId').value;
        
        formData.forEach((value, key) => {
            if (value !== '') {
                categoryData[key] = value;
            }
        });
        
        // Handle thumbnail images
        // In a real implementation, you would upload files to a server
        // and update the category data
        
        fetch(`/api/v1/admin/category-rooms/edit/${categoryId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(categoryData)
        })
            .then(response => response.json())
            .then(data => {
                if (data.code === 200) {
                    showSuccessAlert('Category updated successfully');
                    
                    // Switch back to list tab
                    tabs.forEach(t => {
                        if (t.getAttribute('data-tab') === 'list-categories') {
                            t.click();
                        }
                    });
                    
                    loadParentCategories(); // Refresh parent categories
                } else {
                    showErrorAlert('Failed to update category');
                }
            })
            .catch(error => {
                console.error('Error updating category:', error);
                showErrorAlert('Failed to update category');
            });
    });
    
    // Reset button
    resetBtn.addEventListener('click', function() {
        addForm.reset();
        thumbnailPreview.innerHTML = '';
        hideAlerts();
    });
    
    // Cancel edit button
    cancelEditBtn.addEventListener('click', function() {
        // Switch back to list tab
        tabs.forEach(t => {
            if (t.getAttribute('data-tab') === 'list-categories') {
                t.click();
            }
        });
    });
    
    // Search functionality
    document.querySelector('.search-btn').addEventListener('click', function() {
        const searchTerm = categorySearch.value.trim();
        if (searchTerm) {
            // In a real implementation, you would add search params to API call
            // For now, we'll just filter the existing categories
            fetch(`/api/v1/admin/category-rooms?keyword=${searchTerm}`)
                .then(response => response.json())
                .then(data => {
                    if (data.code === 200) {
                        categories = data.data;
                        totalPages = Math.ceil(data.pagination.total / limit);
                        currentPage = 1;
                        renderCategoryTable();
                        renderPagination();
                    }
                })
                .catch(error => {
                    console.error('Error searching categories:', error);
                });
        } else {
            loadCategories();
        }
    });
    
    // Preview thumbnails
    thumbnailInput.addEventListener('change', function() {
        previewImages(this.files, thumbnailPreview);
    });
    
    editThumbnailInput.addEventListener('change', function() {
        previewImages(this.files, editThumbnailPreview);
    });
    
    // Helper functions
    function previewImages(files, container) {
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            if (!file.type.startsWith('image/')) continue;
            
            const reader = new FileReader();
            reader.onload = function(e) {
                const div = document.createElement('div');
                div.className = 'thumbnail-item';
                
                const img = document.createElement('img');
                img.src = e.target.result;
                
                const removeBtn = document.createElement('span');
                removeBtn.className = 'remove-thumbnail';
                removeBtn.innerHTML = '×';
                removeBtn.addEventListener('click', function() {
                    div.remove();
                });
                
                div.appendChild(img);
                div.appendChild(removeBtn);
                container.appendChild(div);
            }
            
            reader.readAsDataURL(file);
        }
    }
    
    function showSuccessAlert(message) {
        successAlert.textContent = message;
    }
})