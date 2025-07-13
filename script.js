document.addEventListener('DOMContentLoaded', async function() {
    // Get modal elements
    const modal = document.getElementById('animeModal');
    const closeBtn = document.querySelector('.close-modal');
    
    // Close modal when clicking X
    closeBtn.addEventListener('click', function() {
        modal.style.display = 'none';
    });
    
    // Close modal when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
    
    // Handle anime card clicks
    document.querySelectorAll('[data-anime-id]').forEach(card => {
        card.addEventListener('click', function() {
            const animeId = this.getAttribute('data-anime-id');
            showAnimeDetails(animeId);
        });
    });

    // Scroll animation
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });
    
    document.querySelectorAll('.animate-on-scroll').forEach(el => {
        observer.observe(el);
    });
    
    // Add floating animation to cards
    document.querySelectorAll('.anime-card, .category-card').forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
    });

    // Search functionality
    const searchInput = document.getElementById('searchInput');
    const searchResults = document.getElementById('searchResults');
    let animeData = [];

    // Load anime data
    try {
        const response = await fetch('anime.json');
        if (!response.ok) throw new Error('Failed to load anime data');
        animeData = await response.json();
        window.animeData = animeData; // Store in window for global access
    } catch (error) {
        console.error('Error loading anime data:', error);
        animeData = await getFallbackAnimeData();
        window.animeData = animeData;
    }

    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.trim().toLowerCase();
        
        if (searchTerm.length === 0) {
            searchResults.style.display = 'none';
            searchResults.innerHTML = '';
            return;
        }
        
        const results = animeData.filter(anime => 
            anime.name.toLowerCase().includes(searchTerm) || 
            (anime.description && anime.description.toLowerCase().includes(searchTerm)) ||
            (anime.category && anime.category.some(cat => cat.toLowerCase().includes(searchTerm))
        );
        
        displaySearchResults(results);
    });

    function displaySearchResults(results) {
        searchResults.innerHTML = '';
        
        if (results.length === 0) {
            searchResults.innerHTML = '<div class="no-results">No anime found</div>';
            searchResults.style.display = 'block';
            return;
        }
        
        results.forEach(anime => {
            const resultItem = document.createElement('div');
            resultItem.className = 'search-result-item';
            resultItem.setAttribute('data-anime-id', anime.id);
            
            resultItem.innerHTML = `
                <img src="${anime.thumbnail}" alt="${anime.name}" onerror="this.src='fallback-image.jpg'">
                <div class="search-result-info">
                    <h4>${anime.name}</h4>
                    <p>${anime.description || 'No description available'}</p>
                    <div class="search-categories">
                        ${anime.category ? anime.category.map(cat => `<span>${cat}</span>`).join('') : ''}
                    </div>
                </div>
            `;
            
            resultItem.addEventListener('click', function() {
                showAnimeDetails(anime.id);
                searchResults.style.display = 'none';
                searchInput.value = '';
            });
            
            searchResults.appendChild(resultItem);
        });
        
        searchResults.style.display = 'block';
    }

    // Hide search results when clicking outside
    document.addEventListener('click', function(event) {
        if (!searchInput.contains(event.target) && !searchResults.contains(event.target)) {
            searchResults.style.display = 'none';
        }
    });
});

// Fallback data function
async function getFallbackAnimeData() {
    return [
        {
            "id": "demon-slayer",
            "name": "Demon Slayer: Swordsmith Village",
            "description": "Tanjiro ventures to the Swordsmith Village to repair his sword after intense battles.",
            "fullDescription": "After his intense battles in the Entertainment District, Tanjiro journeys to the Swordsmith Village to repair his Nichirin Blade. There he meets the Love Hashira Mitsuri Kanroji and the Mist Hashira Muichiro Tokito. As the demons target the village, Tanjiro must protect the swordsmiths while uncovering secrets about his blade.",
            "category": ["Action", "Fantasy", "Shounen"],
            "thumbnail": "https://m.media-amazon.com/images/M/MV5BMWU1OGEwNmQtNGM3MS00YTYyLThmYmMtN2FjYzQzNzNmNTE0XkEyXkFqcGc@._V1_QL75_UX190_CR0,2,190,281_.jpg",
            "banner": "https://example.com/banners/demon-slayer.jpg",
            "episodes": [
                {
                    "number": 1,
                    "title": "Someone's Dream",
                    "url": "/Demon-Slayer.html"
                },
                {
                    "number": 2,
                    "title": "Yoriichi Type Zero",
                    "url": "/Demon-Slayer.html"
                }
            ],
            "rating": 9.2,
            "year": 2023,
            "status": "Ongoing",
            "studio": "Ufotable"
        }
    ];
}

// Function to show anime details
async function showAnimeDetails(animeId) {
    try {
        if (!window.animeData) {
            window.animeData = await getFallbackAnimeData();
        }
        
        const anime = window.animeData.find(item => item.id === animeId);
        if (anime) {
            displayAnimeModal(anime);
        } else {
            console.error('Anime not found:', animeId);
            // You might want to show an error message to the user here
        }
    } catch (error) {
        console.error('Error showing anime details:', error);
    }
}

// Function to display anime in modal
function displayAnimeModal(anime) {
    const modal = document.getElementById('animeModal');
    if (!modal) return;

    // Set basic info
    document.getElementById('modalThumbnail').src = anime.thumbnail || 'fallback-image.jpg';
    document.getElementById('modalTitle').textContent = anime.name || 'Unknown Title';
    document.getElementById('modalRating').textContent = `⭐ ${anime.rating || 'N/A'}/10`;
    document.getElementById('modalYear').textContent = `📅 ${anime.year || 'Unknown'}`;
    document.getElementById('modalStatus').textContent = `🔵 ${anime.status || 'Unknown'}`;
    document.getElementById('modalStudio').textContent = `🎬 ${anime.studio || 'Unknown'}`;
    document.getElementById('modalDescription').textContent = anime.fullDescription || 'No description available';
    
    // Set categories
    const categoriesContainer = document.getElementById('modalCategories');
    categoriesContainer.innerHTML = '';
    if (anime.category && anime.category.length > 0) {
        anime.category.forEach(cat => {
            const span = document.createElement('span');
            span.textContent = cat;
            categoriesContainer.appendChild(span);
        });
    }
    
    // Set episodes
    const episodesContainer = document.getElementById('modalEpisodes');
    episodesContainer.innerHTML = '';
    if (anime.episodes && anime.episodes.length > 0) {
        anime.episodes.forEach(ep => {
            const div = document.createElement('div');
            div.className = 'episode-item';
            const a = document.createElement('a');
            a.href = ep.url || '#';
            a.textContent = `Episode ${ep.number || '0'}: ${ep.title || 'Untitled'}`;
            div.appendChild(a);
            episodesContainer.appendChild(div);
        });
    } else {
        episodesContainer.innerHTML = '<div class="no-episodes">No episodes available</div>';
    }
    
    // Show modal
    modal.style.display = 'block';
}
