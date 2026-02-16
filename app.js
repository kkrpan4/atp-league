document.addEventListener('DOMContentLoaded', () => {
    // Basic setup
    renderRankings(playersData);
    renderPlayerGrid(playersData.slice(0, 3)); // Top 3 players
    renderTournaments(tournamentsData);
    
    // Dynamic Year in Footer
    const yearSpan = document.getElementById('currentYear');
    if (yearSpan) yearSpan.textContent = new Date().getFullYear();

    // Search functionality
    const searchInput = document.getElementById('playerSearch');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const term = e.target.value.toLowerCase();
            const filtered = playersData.filter(p => p.name.toLowerCase().includes(term));
            renderRankings(filtered);
        });
    }

    // Contact Form Validation
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            if (validateForm()) {
                document.getElementById('formSuccess').style.display = 'block';
                contactForm.reset();
                setTimeout(() => {
                    document.getElementById('formSuccess').style.display = 'none';
                }, 5000);
            }
        });
    }

    // Scroll to Top Logic
    const topBtn = document.getElementById('scrollToTopBtn');
    window.onscroll = function() {
        if (document.body.scrollTop > 300 || document.documentElement.scrollTop > 300) {
            topBtn.style.display = "block";
        } else {
            topBtn.style.display = "none";
        }
        highlightNav();
    };

    if (topBtn) { // Ensure button exists before adding listener
        topBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // Simple scroll animation
    const sections = document.querySelectorAll('.section, .hero');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
            }
        });
    }, { threshold: 0.1 });

    sections.forEach(s => observer.observe(s));
});

function validateForm() {
    let isValid = true;
    const name = document.getElementById('name');
    const email = document.getElementById('email');
    const message = document.getElementById('message');

    // Reset errors
    document.querySelectorAll('.error-msg').forEach(e => e.textContent = '');

    if (name && name.value.trim().length < 3) {
        const nameError = document.getElementById('nameError');
        if (nameError) nameError.textContent = 'Ime mora imati barem 3 znaka.';
        isValid = false;
    }

    const emailPattern = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/;
    if (email && !email.value.match(emailPattern)) {
        const emailError = document.getElementById('emailError');
        if (emailError) emailError.textContent = 'Unesite ispravnu e-mail adresu.';
        isValid = false;
    }

    if (message && message.value.trim().length < 10) {
        const messageError = document.getElementById('messageError');
        if (messageError) messageError.textContent = 'Poruka mora imati barem 10 znakova.';
        isValid = false;
    }

    return isValid;
}

function highlightNav() {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-links a');
    
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        // Adjust offset for better highlighting, e.g., 100px from top
        if (window.pageYOffset >= sectionTop - 100) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        // Check if the href contains the current section ID
        if (link.getAttribute('href') && link.getAttribute('href').includes(current)) {
            link.classList.add('active');
        }
    });
}

function renderRankings(data) {
    const tableBody = document.getElementById('rankingBody');
    if (!tableBody) return;

    tableBody.innerHTML = '';
    data.forEach(p => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>#${p.rank}</td>
            <td><strong>${p.name}</strong></td>
            <td>${p.points}</td>
            <td>${p.tournaments}</td>
            <td>${p.winRate}</td>
        `;
        tableBody.appendChild(row);
    });
}

function renderPlayerGrid(data) {
    const grid = document.querySelector('.player-grid');
    if (!grid) return;

    grid.innerHTML = '';
    data.forEach(p => {
        const card = document.createElement('div');
        card.className = 'player-card';
        card.innerHTML = `
            <div class="player-img" style="background-image: url('${p.image}')" role="img" aria-label="Slika igrača ${p.name}"></div>
            <div class="player-info">
                <p class="player-rank">ATP #${p.rank}</p>
                <h3 class="player-name">${p.name}</h3>
                <p>Bodovi: ${p.points}</p>
            </div>
        `;
        grid.appendChild(card);
    });
}

function renderTournaments(data) {
    const list = document.getElementById('scheduleList');
    if (!list) return;

    list.innerHTML = '';
    data.forEach(t => {
        const item = document.createElement('li');
        item.className = 'schedule-item';
        item.innerHTML = `
            <span class="tour-date">${t.date}</span>
            <span class="tour-name">${t.name}</span>
            <span class="tour-location">${t.location} (${t.category})</span>
        `;
        list.appendChild(item);
    });
}

// Table Sorting Logic
let sortDirection = true;
function sortTable(columnIndex) {
    const table = document.getElementById('rankingTable');
    sortDirection = !sortDirection;

    const sortedData = [...playersData].sort((a, b) => {
        const keys = ['rank', 'name', 'points', 'tournaments', 'winRate'];
        const key = keys[columnIndex];

        let valA = a[key];
        let valB = b[key];

        // Clean winRate for numeric comparison
        if (key === 'winRate') {
            valA = parseFloat(valA);
            valB = parseFloat(valB);
        }

        if (valA < valB) return sortDirection ? -1 : 1;
        if (valA > valB) return sortDirection ? 1 : -1;
        return 0;
    });

    renderRankings(sortedData);
}
