$(document).ready(function() {
    // Initialize the page with tab functionality
    $('.nav-tabs a').click(function(e) {
        e.preventDefault();
        $(this).tab('show');
    });
    
    // Add Room functionality
    $('#addRoomForm').submit(function(e) {
        // e.preventDefault();
        // Here you would add the AJAX code to submit the form data to your API
        
        // For demonstration, just show the success alert
        // $('#successAlert').fadeIn().delay(3000).fadeOut();
        var formData = new FormData(this);
        
        // Make fetch request with the admin token
        fetch('/api/v1/admin/rooms/room', {
            method: 'POST',
            body: formData,
            headers: {
                'tokenadmin': getAdminToken() // Function to get token from storage
            }
        })
        .then(response => {
            if (!response.ok) {
                return response.json().then(data => {
                    throw new Error(data.message || 'Unknown error occurred');
                });
            }
            return response.json();
        })
        .then(data => {
            $('#successAlert').text('Room added successfully!').fadeIn().delay(3000).fadeOut();
            $('#addRoomForm')[0].reset();
            $('#thumbnailPreview').empty();
            $('#imagePreview').empty();
        })
        .catch(error => {
            $('#errorAlert').text('Error: ' + error.message).fadeIn().delay(3000).fadeOut();
        });
    });
    
    function getAdminToken() {
        return localStorage.getItem('adminToken') || ''; // Replace with how you store the token
    }
    
    // Function to get admin token from localStorage or cookie
    
    
    // Preview thumbnail functionality
    $('#thumbnail').change(function() {
        previewImages(this, '#thumbnailPreview');
    });
    
    // Preview additional images functionality
    $('#imageArray').change(function() {
        previewImages(this, '#imagePreview');
    });
    
    // Function to preview images
    function previewImages(input, previewDiv) {
        $(previewDiv).empty();
        if (input.files && input.files.length > 0) {
            for (let i = 0; i < input.files.length; i++) {
                if (input.files[i]) {
                    let reader = new FileReader();
                    reader.onload = function(e) {
                        $(previewDiv).append('<img src="' + e.target.result + '" class="img-thumbnail" style="max-width: 150px; margin: 5px;">');
                    }
                    reader.readAsDataURL(input.files[i]);
                }
            }
        }
    }
    
    // Room listing functionality
    $('#searchRoom').on('input', function() {
        // Implement search functionality
        let searchTerm = $(this).val().toLowerCase();
        $('#roomsTableBody tr').each(function() {
            let rowText = $(this).text().toLowerCase();
            if (rowText.includes(searchTerm)) {
                $(this).show();
            } else {
                $(this).hide();
            }
        });
    });
    
    // Filter by category
    $('#filterCategory').change(function() {
        filterRooms();
    });
    
    // Filter by status
    $('#filterStatus').change(function() {
        filterRooms();
    });
    
    // Function to filter rooms
    function filterRooms() {
        let categoryFilter = $('#filterCategory').val();
        let statusFilter = $('#filterStatus').val();
        
        $('#roomsTableBody tr').each(function() {
            let category = $(this).find('td:eq(2)').text().toLowerCase();
            let status = $(this).find('td:eq(6)').text().toLowerCase();
            
            let showByCategory = !categoryFilter || category === categoryFilter.toLowerCase();
            let showByStatus = !statusFilter || status === statusFilter.toLowerCase();
            
            if (showByCategory && showByStatus) {
                $(this).show();
            } else {
                $(this).hide();
            }
        });
    }
    
    // Refresh button functionality
    $('#refreshRoomsBtn').click(function() {
        // Here you would add code to fetch fresh data from the API
        
        // For demonstration, just show success message
        $('#listSuccessAlert').text('Room list refreshed!').fadeIn().delay(3000).fadeOut();
    });
    
    // View room details
    $(document).on('click', '.view-room', function() {
        let roomId = $(this).data('id');
        // Implement view room functionality
        alert('View room with ID: ' + roomId);
    });
    
    // Edit room 
    $(document).on('click', '.edit-room', function() {
        let roomId = $(this).data('id');
        // Implement edit room functionality
        alert('Edit room with ID: ' + roomId);
    });
    
    // Delete room
    $(document).on('click', '.delete-room', function() {
        let roomId = $(this).data('id');
        if (confirm('Are you sure you want to delete this room?')) {
            // Implement delete room functionality
            alert('Delete room with ID: ' + roomId);
        }
    });
    
    // Load rooms from server (this would be replaced with actual API call)
    function loadRooms() {
        // Here you would add code to fetch rooms from your API
        console.log('Loading rooms from server...');
    }
    
    // Initial load
    loadRooms();
});