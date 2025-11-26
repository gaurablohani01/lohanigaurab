// BIM Questions Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Search functionality
    const searchInput = document.getElementById('searchInput');
    const questionCards = document.querySelectorAll('.question-card');
    const semesterGroups = document.querySelectorAll('.semester-group');
    const noResults = document.getElementById('noResults');
    
    if (searchInput) {
        searchInput.addEventListener('input', function(e) {
            const searchTerm = e.target.value.toLowerCase();
            filterQuestions(searchTerm);
        });
    }
    
    // Filter buttons functionality
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');
            
            const semester = this.getAttribute('data-semester');
            filterBySemester(semester);
        });
    });
    
    function filterQuestions(searchTerm) {
        let visibleCount = 0;
        
        questionCards.forEach(card => {
            const subjectName = card.getAttribute('data-subject').toLowerCase();
            const subjectText = card.textContent.toLowerCase();
            
            if (subjectName.includes(searchTerm) || subjectText.includes(searchTerm)) {
                card.style.display = 'block';
                visibleCount++;
            } else {
                card.style.display = 'none';
            }
        });
        
        // Show/hide semester groups based on visible cards
        semesterGroups.forEach(group => {
            const visibleCards = group.querySelectorAll('.question-card[style="display: block;"], .question-card:not([style*="display: none"])');
            if (searchTerm && visibleCards.length === 0) {
                group.style.display = 'none';
            } else {
                group.style.display = 'block';
            }
        });
        
        // Show no results message if no cards are visible
        if (visibleCount === 0) {
            noResults.style.display = 'block';
        } else {
            noResults.style.display = 'none';
        }
    }
    
    function filterBySemester(semester) {
        // Reset search input
        if (searchInput) {
            searchInput.value = '';
        }
        
        if (semester === 'all') {
            // Show all semester groups
            semesterGroups.forEach(group => {
                group.style.display = 'block';
            });
            questionCards.forEach(card => {
                card.style.display = 'block';
            });
            noResults.style.display = 'none';
        } else {
            // Show only selected semester
            let visibleCount = 0;
            
            semesterGroups.forEach(group => {
                if (group.getAttribute('data-semester') === semester) {
                    group.style.display = 'block';
                    visibleCount++;
                } else {
                    group.style.display = 'none';
                }
            });
            
            if (visibleCount === 0) {
                noResults.style.display = 'block';
            } else {
                noResults.style.display = 'none';
            }
        }
        
        // Scroll to questions section smoothly
        const questionsSection = document.querySelector('.questions-section');
        if (questionsSection) {
            questionsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }
});

// Download question function
function downloadQuestion(questionId) {
    // Show alert - in real implementation, this would download the PDF
    alert(`Download functionality for ${questionId} will be implemented. The PDF file will be downloaded to your device.`);
    
    // In a real implementation, you would do something like:
    // window.location.href = `/static/pdfs/${questionId}.pdf`;
    
    console.log(`Downloading question: ${questionId}`);
}

// View question function
function viewQuestion(questionId) {
    // Show alert - in real implementation, this would open the PDF in a new tab
    alert(`View functionality for ${questionId} will be implemented. The PDF will open in a new tab.`);
    
    // In a real implementation, you would do something like:
    // window.open(`/static/pdfs/${questionId}.pdf`, '_blank');
    
    console.log(`Viewing question: ${questionId}`);
}

// Add smooth scroll behavior to all internal links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add animation on scroll for question cards
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

// Observe all question cards
document.querySelectorAll('.question-card').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(card);
});
