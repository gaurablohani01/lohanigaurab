let userScore = 0;
let computerScore = 0;
let gamesPlayed = 0;

const gameMessage = document.querySelector("#gameMessage");
const playerScoreElement = document.querySelector('#playerScore');
const computerScoreElement = document.querySelector('#computerScore');
const playerChoiceDisplay = document.querySelector('#playerChoice');
const computerChoiceDisplay = document.querySelector('#computerChoice');

const choiceIcons = {
    'rock': 'fas fa-hand-rock',
    'paper': 'fas fa-hand-paper', 
    'scissors': 'fas fa-hand-scissors'
};

function displayMessage(userWin, userChoice, computerChoice) {
    gamesPlayed++;
    
    // Update choice displays with animation
    playerChoiceDisplay.innerHTML = `<i class="${choiceIcons[userChoice]}"></i>`;
    computerChoiceDisplay.innerHTML = `<i class="${choiceIcons[computerChoice]}"></i>`;
    
    // Remove previous classes
    playerChoiceDisplay.classList.remove('winner', 'loser');
    computerChoiceDisplay.classList.remove('winner', 'loser');
    
    // Add result classes and update message
    if (userWin === null) {
        gameMessage.innerHTML = `It's a Draw! Both chose ${userChoice}`;
        gameMessage.style.color = "#6c757d";
    } else if (userWin) {
        gameMessage.innerHTML = `🎉 You Win! ${userChoice} beats ${computerChoice}`;
        gameMessage.style.color = "#28a745";
        playerChoiceDisplay.classList.add('winner');
        computerChoiceDisplay.classList.add('loser');
        userScore++;
        playerScoreElement.innerHTML = userScore;
        
        // Celebrate animation
        confetti();
    } else {
        gameMessage.innerHTML = `😢 You Lost! ${computerChoice} beats ${userChoice}`;
        gameMessage.style.color = "#dc3545";
        playerChoiceDisplay.classList.add('loser');
        computerChoiceDisplay.classList.add('winner');
        computerScore++;
        computerScoreElement.innerHTML = computerScore;
    }
    
    // Add animation to result message
    gameMessage.style.transform = "scale(1.1)";
    setTimeout(() => {
        gameMessage.style.transform = "scale(1)";
    }, 300);
}

// Add haptic feedback for mobile devices
function addHapticFeedback() {
    if ('vibrate' in navigator) {
        navigator.vibrate(50);
    }
}

// Add click sound effect simulation
function playClickSound() {
    // Create a simple click sound using Web Audio API
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = 800;
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.1);
}

function getComputerChoice() {
    const choices = ['rock', 'paper', 'scissors'];
    const randomIndex = Math.floor(Math.random() * 3);
    return choices[randomIndex];
}

function playGame(userChoice) {
    const computerChoice = getComputerChoice();
    let userWin = null;
    
    if (userChoice === computerChoice) {
        userWin = null; // Draw
    } else {
        // Determine winner
        const winConditions = {
            'rock': 'scissors',
            'scissors': 'paper', 
            'paper': 'rock'
        };
        
        userWin = winConditions[userChoice] === computerChoice;
    }
    
    displayMessage(userWin, userChoice, computerChoice);
    
    // Add haptic feedback and sound on user action
    addHapticFeedback();
    playClickSound();
}

function resetGame() {
    userScore = 0;
    computerScore = 0;
    gamesPlayed = 0;
    playerScoreElement.innerHTML = userScore;
    computerScoreElement.innerHTML = computerScore;
    gameMessage.innerHTML = "Make your choice!";
    gameMessage.style.color = "";
    playerChoiceDisplay.innerHTML = '<i class="fas fa-question"></i>';
    computerChoiceDisplay.innerHTML = '<i class="fas fa-question"></i>';
    
    // Remove result classes
    playerChoiceDisplay.classList.remove('winner', 'loser');
    computerChoiceDisplay.classList.remove('winner', 'loser');
    
    // Add reset animation
    const resetBtn = document.querySelector('#resetGame');
    resetBtn.style.transform = 'scale(0.95)';
    setTimeout(() => {
        resetBtn.style.transform = 'scale(1)';
    }, 150);
}

// Simple confetti animation
function confetti() {
    const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#ffeaa7', '#dda0dd'];
    
    for (let i = 0; i < 50; i++) {
        createConfettiPiece(colors[Math.floor(Math.random() * colors.length)]);
    }
}

function createConfettiPiece(color) {
    const confetti = document.createElement('div');
    confetti.style.position = 'fixed';
    confetti.style.width = '10px';
    confetti.style.height = '10px';
    confetti.style.backgroundColor = color;
    confetti.style.left = Math.random() * 100 + '%';
    confetti.style.top = '-10px';
    confetti.style.opacity = '1';
    confetti.style.pointerEvents = 'none';
    confetti.style.zIndex = '9999';
    confetti.style.borderRadius = '50%';
    
    document.body.appendChild(confetti);
    
    const fall = confetti.animate([
        { transform: 'translateY(0) rotate(0deg)', opacity: 1 },
        { transform: `translateY(${window.innerHeight + 10}px) rotate(360deg)`, opacity: 0 }
    ], {
        duration: Math.random() * 3000 + 2000,
        easing: 'ease-out'
    });
    
    fall.onfinish = () => confetti.remove();
}

// Initialize the game
document.addEventListener('DOMContentLoaded', function() {
    const choiceCards = document.querySelectorAll('.choice-card');
    choiceCards.forEach(card => {
        card.addEventListener("click", () => {
            const choice = card.getAttribute('data-choice');
            
            // Add haptic feedback and sound
            addHapticFeedback();
            try {
                playClickSound();
            } catch (e) {
                // Ignore audio errors in case of browser restrictions
            }
            
            // Add click animation
            card.style.transform = "scale(0.95)";
            setTimeout(() => {
                card.style.transform = "scale(1)";
            }, 150);
            
            playGame(choice);
        });
        
        // Add hover sound effect
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0) scale(1)';
        });
    });
    
    // Add reset button functionality
    const resetBtn = document.querySelector('#resetGame');
    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            addHapticFeedback();
            resetGame();
        });
    }
});
