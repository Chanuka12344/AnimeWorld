document.addEventListener('DOMContentLoaded', function() {
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

    // Fetch anime data from JSON file
    fetch('anime.json')
        .then(response => response.json())
        .then(data => {
            animeData = data;
            console.log('Anime data loaded successfully');
        })
        .catch(error => {
            console.error('Error loading anime data:', error);
            // Fallback to hardcoded data if fetch fails
            animeData = getAnimeData();
        });

    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.trim().toLowerCase();
        
        if (searchTerm.length === 0) {
            searchResults.style.display = 'none';
            searchResults.innerHTML = '';
            return;
        }
        
        const results = animeData.filter(anime => 
            anime.name.toLowerCase().includes(searchTerm) || 
            anime.description.toLowerCase().includes(searchTerm) ||
            (anime.category && anime.category.some(cat => cat.toLowerCase().includes(searchTerm)))
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
                <img src="${anime.thumbnail}" alt="${anime.name}">
                <div class="search-result-info">
                    <h4>${anime.name}</h4>
                    <p>${anime.description}</p>
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

// Function to get anime data (fallback)
/* function getAnimeData() {
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
                    "url": "
					127.0.0.1:8080/Demon%20Slayer.html"
                },
                {
                    "number": 2,
                    "title": "Yoriichi Type Zero",
                    "url": "127.0.0.1:8080/Demon%20Slayer.html"
                }
            ],
            "rating": 9.2,
            "year": 2023,
            "status": "Ongoing",
            "studio": "Ufotable"
        },
        {
            "id": "jujutsu-kaisen",
            "name": "Jujutsu Kaisen Season 2",
            "description": "The second season adapts the 'Hidden Inventory/Premature Death' arc.",
            "fullDescription": "The second season of Jujutsu Kaisen adapts the 'Hidden Inventory/Premature Death' arc, which focuses on Gojo's past as a student and the events that shaped him into the strongest sorcerer. The story then transitions to the 'Shibuya Incident' arc where the villains make their move to seal Gojo Satoru.",
            "category": ["Action", "Supernatural", "Horror"],
            "thumbnail": "https://cdn.myanimelist.net/images/anime/1792/138022.webp",
            "banner": "https://example.com/banners/jujutsu-kaisen.jpg",
            "episodes": [
                {
                    "number": 1,
                    "title": "Hidden Inventory",
                    "url": "https://example.com/stream/jujutsu-ep1"
                },
                {
                    "number": 2,
                    "title": "Premature Death",
                    "url": "https://example.com/stream/jujutsu-ep2"
                }
            ],
            "rating": 9.5,
            "year": 2023,
            "status": "Airing",
            "studio": "MAPPA"
        }
    ];
}
 */
 
async function getAnimeData() {
    try {
        const response = await fetch('anime-data.json');
        if (!response.ok) {
            throw new Error('Failed to fetch anime data');
        }
        return await response.json();
    } catch (error) {
        console.error('Error loading anime data:', error);
        // Fallback to empty array if fetch fails
        return [];
    }
}
 
// Function to show anime details
function showAnimeDetails(animeId) {
    // First try to use the fetched data
    if (window.animeData && window.animeData.length > 0) {
        const anime = window.animeData.find(item => item.id === animeId);
        if (anime) {
            displayAnimeModal(anime);
            return;
        }
    }
    
    // Fallback to hardcoded data if needed
    const animeData = getAnimeData();
    const anime = animeData.find(item => item.id === animeId);
    if (anime) {
        displayAnimeModal(anime);
    }
}

// Function to display anime in modal
function displayAnimeModal(anime) {
    document.getElementById('modalThumbnail').src = anime.thumbnail;
    document.getElementById('modalTitle').textContent = anime.name;
    document.getElementById('modalRating').textContent = `⭐ ${anime.rating}/10`;
    document.getElementById('modalYear').textContent = `📅 ${anime.year}`;
    document.getElementById('modalStatus').textContent = `🔵 ${anime.status}`;
    document.getElementById('modalStudio').textContent = `🎬 ${anime.studio}`;
    document.getElementById('modalDescription').textContent = anime.fullDescription;
    
    // Set categories
    const categoriesContainer = document.getElementById('modalCategories');
    categoriesContainer.innerHTML = '';
    if (anime.category) {
        anime.category.forEach(cat => {
            const span = document.createElement('span');
            span.textContent = cat;
            categoriesContainer.appendChild(span);
        });
    }
    
    // Set episodes
    const episodesContainer = document.getElementById('modalEpisodes');
    episodesContainer.innerHTML = '';
    if (anime.episodes) {
        anime.episodes.forEach(ep => {
            const div = document.createElement('div');
            div.className = 'episode-item';
            const a = document.createElement('a');
            a.href = ep.url;
            a.textContent = `Episode ${ep.number}: ${ep.title}`;
            div.appendChild(a);
            episodesContainer.appendChild(div);
        });
    }
    
    // Show modal
    document.getElementById('animeModal').style.display = 'block';
}