
document.addEventListener('DOMContentLoaded', () => {
    // State management
    let currentCategory = {
        name: 'TV/Movies',
        fileType: 'mkv|mp4|avi|mov|mpg|wmv|divx|mpeg'
    };
    let currentEngine = 'google';
    const searchHistory = JSON.parse(localStorage.getItem('searchHistory') || '[]');

    // DOM Elements
    const categoryDropdown = document.getElementById('categoryDropdown');
    const engineDropdown = document.getElementById('engineDropdown');
    const searchInput = document.getElementById('searchInput');
    const searchButton = document.getElementById('searchButton');
    const historyList = document.getElementById('historyList');

    // Initialize dropdowns
    document.querySelectorAll('.dropdown-button').forEach(button => {
        button.addEventListener('click', function() {
            const menu = this.nextElementSibling;
            document.querySelectorAll('.dropdown-menu.show').forEach(openMenu => {
                if (openMenu !== menu) openMenu.classList.remove('show');
            });
            menu.classList.toggle('show');
        });
    });

    // Close dropdowns when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.dropdown')) {
            document.querySelectorAll('.dropdown-menu.show').forEach(menu => {
                menu.classList.remove('show');
            });
        }
    });

    // Category selection
    document.querySelectorAll('[data-filetype]').forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const fileType = e.currentTarget.dataset.filetype;
            const name = e.currentTarget.querySelector('span:last-child').textContent;
            const icon = e.currentTarget.querySelector('span:first-child').textContent;
            
            currentCategory = { name, fileType };
            categoryDropdown.querySelector('.text').textContent = name;
            categoryDropdown.querySelector('.icon').textContent = icon;
            e.currentTarget.closest('.dropdown-menu').classList.remove('show');
        });
    });

    // Engine selection
    document.querySelectorAll('[data-engine]').forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            currentEngine = e.currentTarget.dataset.engine;
            const engineName = e.currentTarget.textContent;
            engineDropdown.querySelector('.text').textContent = engineName;
            e.currentTarget.closest('.dropdown-menu').classList.remove('show');
        });
    });

    // Search functionality
    function performSearch() {
        const query = searchInput.value.trim();
        if (!query) return;

        // Add to search history
        const searchData = {
            query,
            category: currentCategory.name,
            timestamp: new Date().toISOString()
        };
        
        searchHistory.unshift(searchData);
        if (searchHistory.length > 10) searchHistory.pop();
        localStorage.setItem('searchHistory', JSON.stringify(searchHistory));

        // Build search URL based on engine
        let searchUrl;
        const encodedQuery = encodeURIComponent(query);
        const fileType = currentCategory.fileType;
        
        switch (currentEngine) {
            case 'google':
                searchUrl = `https://www.google.com/search?q=${encodedQuery}`;
                if (fileType !== '-1') {
                    searchUrl += `:(${fileType})`;
                }
                break;
            case 'bing':
                searchUrl = `https://www.bing.com/search?q=${encodedQuery}`;
                if (fileType !== '-1') {
                    searchUrl += `:(${fileType})`;
                }
                break;
            case 'duckduckgo':
                searchUrl = `https://duckduckgo.com/?q=${encodedQuery}`;
                if (fileType !== '-1') {
                    searchUrl += `:(${fileType})`;
                }
                break;
            case 'ecosia':
                searchUrl = `https://www.ecosia.org/search?q=${encodedQuery}`;
                if (fileType !== '-1') {
                    searchUrl += `:(${fileType})`;
                }
                break;
        }

        // Open search in new tab
        window.open(searchUrl, '_blank');
        
        // Update history display
        updateHistoryDisplay();
    }

    // Handle search button click
    searchButton.addEventListener('click', performSearch);

    // Handle enter key in search input
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            performSearch();
        }
    });

    // Update history display
    function updateHistoryDisplay() {
        historyList.innerHTML = '';
        searchHistory.forEach((item, index) => {
            const historyItem = document.createElement('div');
            historyItem.className = 'history-item';
            
            const timeAgo = getTimeAgo(new Date(item.timestamp));
            
            historyItem.innerHTML = `
                <div class="history-content">
                    <span class="history-query">${escapeHtml(item.query)}</span>
                    <small class="history-meta">
                        ${item.category} • ${timeAgo}
                    </small>
                </div>
                <button class="history-delete" aria-label="Delete search" 
                    onclick="deleteHistoryItem(${index})">×</button>
            `;
            
            historyItem.addEventListener('click', (e) => {
                if (!e.target.classList.contains('history-delete')) {
                    searchInput.value = item.query;
                    performSearch();
                }
            });
            
            historyList.appendChild(historyItem);
        });
    }

    // Helper function to get time ago string
    function getTimeAgo(date) {
        const seconds = Math.floor((new Date() - date) / 1000);
        
        let interval = Math.floor(seconds / 31536000);
        if (interval > 1) return interval + ' years ago';
        if (interval === 1) return 'a year ago';
        
        interval = Math.floor(seconds / 2592000);
        if (interval > 1) return interval + ' months ago';
        if (interval === 1) return 'a month ago';
        
        interval = Math.floor(seconds / 86400);
        if (interval > 1) return interval + ' days ago';
        if (interval === 1) return 'yesterday';
        
        interval = Math.floor(seconds / 3600);
        if (interval > 1) return interval + ' hours ago';
        if (interval === 1) return 'an hour ago';
        
        interval = Math.floor(seconds / 60);
        if (interval > 1) return interval + ' minutes ago';
        if (interval === 1) return 'a minute ago';
        
        return 'just now';
    }

    // Helper function to escape HTML
    function escapeHtml(unsafe) {
        return unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    // Delete history item
    window.deleteHistoryItem = function(index) {
        searchHistory.splice(index, 1);
        localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
        updateHistoryDisplay();
    };

    // Initial history display
    updateHistoryDisplay();

    // Add touch support for mobile devices
    let touchStartY = 0;
    searchInput.addEventListener('touchstart', (e) => {
        touchStartY = e.touches[0].clientY;
    });

    searchInput.addEventListener('touchmove', (e) => {
        const touchY = e.touches[0].clientY;
        const scrollUp = touchY > touchStartY;
        const scrollDown = touchY < touchStartY;
        const scrollingToTop = scrollUp && window.scrollY > 0;
        
        if (scrollingToTop || scrollDown) {
            e.preventDefault();
        }
    });

    // Add responsive handling for viewport changes
    const mediaQuery = window.matchMedia('(min-width: 768px)');
    function handleViewportChange(e) {
        if (e.matches) {
            // Reset mobile-specific styles when switching to desktop
            document.querySelectorAll('.dropdown-menu').forEach(menu => {
                menu.style.maxHeight = '';
            });
        } else {
            // Apply mobile-specific styles
            document.querySelectorAll('.dropdown-menu').forEach(menu => {
                menu.style.maxHeight = '50vh';
            });
        }
    }
    mediaQuery.addListener(handleViewportChange);
    handleViewportChange(mediaQuery);
});