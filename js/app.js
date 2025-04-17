/**
 * AR Book Experience
 * Handles camera permissions, AR marker detection, and book navigation
 */
(function() {
    // State variables
    let currentPage = 0;
    let totalPages = 0;
    let bookData = null;
    let markerVisible = false;
    
    // DOM elements
    const permissionUI = document.getElementById('permission-ui');
    const permissionButton = document.getElementById('permission-button');
    const loadingIndicator = document.getElementById('loading-indicator');
    const scanningUI = document.getElementById('scanning-ui');
    const arScene = document.getElementById('ar-scene');
    const arControls = document.getElementById('ar-controls');
    const prevButton = document.getElementById('prev-btn');
    const nextButton = document.getElementById('next-btn');
    const bookMarker = document.getElementById('book-marker');
    const bookContainer = document.getElementById('book-container');
    
    // Initialize the application
    function init() {
        console.log('Initializing AR Book Experience');
        
        // Event listeners
        permissionButton.addEventListener('click', requestCameraPermission);
        prevButton.addEventListener('click', showPreviousPage);
        nextButton.addEventListener('click', showNextPage);
        
        // Set up marker detection events
        if (bookMarker) {
            bookMarker.addEventListener('markerFound', onMarkerFound);
            bookMarker.addEventListener('markerLost', onMarkerLost);
        }
        
        // Load book data
        loadBookData();
    }
    
    // Request camera permission when button is clicked
    function requestCameraPermission() {
        console.log('Requesting camera permission');
        
        // Show loading while we set things up
        permissionUI.style.display = 'none';
        loadingIndicator.style.display = 'flex';
        
        // We'll use navigator.getUserMedia as a way to request permissions
        // AR.js will later use this permission for the AR camera
        navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
            .then(function(stream) {
                console.log('Camera permission granted');
                
                // Stop the stream right away, AR.js will handle the camera
                stream.getTracks().forEach(track => track.stop());
                
                // Hide loading and show scanning UI
                loadingIndicator.style.display = 'none';
                scanningUI.style.display = 'flex';
                
                // Initialize AR scene
                initializeAR();
            })
            .catch(function(error) {
                console.error('Error accessing camera:', error);
                
                // Show permission UI again with error message
                loadingIndicator.style.display = 'none';
                permissionUI.style.display = 'flex';
                
                // Update the permission UI to show the error
                const permissionContent = document.querySelector('.permission-content');
                permissionContent.innerHTML = `
                    <h2>Camera Access Denied</h2>
                    <p>This AR experience requires camera access. Please reload the page and grant camera permission.</p>
                    <button id="reload-button" class="main-button">Reload Page</button>
                `;
                
                // Add reload button functionality
                document.getElementById('reload-button').addEventListener('click', function() {
                    window.location.reload();
                });
            });
    }
    
    // Initialize AR scene
    function initializeAR() {
        console.log('Initializing AR scene');
        
        // Display AR scene
        arScene.style.display = 'block';
    }
    
    // Load book data
    function loadBookData() {
        console.log('Loading book data');
        
        // Simulate API call or data loading
        setTimeout(() => {
            bookData = {
                title: 'Sample AR Book',
                pages: [
                    { type: 'cover', imagePath: 'assets/books/book1/cover.jpg' },
                    { type: 'content', imagePath: 'assets/books/book1/page1.jpg' },
                    { type: 'content', imagePath: 'assets/books/book1/page2.jpg' },
                    { type: 'content', imagePath: 'assets/books/book1/page3.jpg' },
                    { type: 'back-cover', imagePath: 'assets/books/book1/back-cover.jpg' }
                ]
            };
            
            totalPages = bookData.pages.length;
            console.log(`Book loaded with ${totalPages} pages`);
        }, 1000);
    }
    
    // Called when the AR marker is found
    function onMarkerFound() {
        console.log('AR marker found');
        markerVisible = true;
        
        // Hide scanning UI
        scanningUI.style.display = 'none';
        
        // Show AR controls
        arControls.style.display = 'flex';
        
        // Create book if it's the first detection
        if (bookContainer.childElementCount === 0) {
            createARBook();
        }
        
        // Show current page
        updateARBookPage(currentPage);
    }
    
    // Called when the AR marker is lost
    function onMarkerLost() {
        console.log('AR marker lost');
        markerVisible = false;
        
        // Show scanning UI
        scanningUI.style.display = 'flex';
        
        // Hide AR controls
        arControls.style.display = 'none';
    }
    
    // Create AR book in the scene
    function createARBook() {
        console.log('Creating AR book');
        
        // Clear any existing content
        while (bookContainer.firstChild) {
            bookContainer.removeChild(bookContainer.firstChild);
        }
        
        // Create a plane for the book page
        const bookPage = document.createElement('a-plane');
        bookPage.setAttribute('id', 'book-page');
        bookPage.setAttribute('width', '1');
        bookPage.setAttribute('height', '1.4142'); // Approximation of A4 ratio
        bookPage.setAttribute('position', '0 0 0.01');
        
        // Add the page to the book container
        bookContainer.appendChild(bookPage);
        
        // Show the first page
        updateARBookPage(0);
    }
    
    // Update AR book page
    function updateARBookPage(pageNum) {
        console.log(`Showing page ${pageNum + 1} of ${totalPages}`);
        
        if (!bookData || pageNum < 0 || pageNum >= totalPages) return;
        
        // Update current page
        currentPage = pageNum;
        
        // Get the page element
        const bookPage = document.getElementById('book-page');
        if (!bookPage) return;
        
        // Update the page content
        const page = bookData.pages[pageNum];
        bookPage.setAttribute('material', `src: ${page.imagePath}; transparent: true`);
    }
    
    // Show next page
    function showNextPage() {
        if (currentPage < totalPages - 1) {
            updateARBookPage(currentPage + 1);
        }
    }
    
    // Show previous page
    function showPreviousPage() {
        if (currentPage > 0) {
            updateARBookPage(currentPage - 1);
        }
    }
    
    // Initialize when DOM is loaded
    document.addEventListener('DOMContentLoaded', init);
})();
