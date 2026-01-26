// Smooth scrolling function
function scrollToSection(sectionId) {
    const element = document.getElementById(sectionId);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

// Update status indicator
function updateStatus() {
    const statusIndicator = document.getElementById('status-indicator');
    const statusText = document.getElementById('status-text');
    
    // Check if the page is loaded and functional
    if (document.readyState === 'complete') {
        statusIndicator.style.color = '#10b981'; // Green
        statusText.textContent = 'Online';
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    updateStatus();
    
    // Add smooth scroll to all navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            scrollToSection(targetId);
        });
    });
    
    // Add fade-in animation to cards
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe all cards for animation
    document.querySelectorAll('.about-card, .feature-card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });
    
    console.log('A1.j7.no - Autonomous website initialized successfully');
});

// Check for updates periodically (placeholder for future autonomous features)
function checkForUpdates() {
    console.log('Checking for autonomous updates...');
    // This will be implemented with GitHub Actions integration
    // Future: Fetch from GitHub API or custom endpoint
}

// Initialize periodic checks (every 30 minutes to conserve resources)
// Reduced frequency for better performance and battery life
setInterval(checkForUpdates, 1800000);
