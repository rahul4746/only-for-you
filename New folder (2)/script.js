// SECTION 1: INTERSECTION OBSERVATION AUTOMATION FOR QUARTER CIRCLE SWINGS
const timelineCards = document.querySelectorAll('.timeline-card');

const viewConfigOptions = {
    root: null,
    threshold: 0.12,
    rootMargin: "0px 0px -20px 0px"
};

const internalScrollObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target); 
        }
    });
}, viewConfigOptions);

timelineCards.forEach(card => internalScrollObserver.observe(card));


// SECTION 2: SPOTIFY STYLE DOCK EXPANSION UTILITY
function toggleMobileMusic() {
    const musicDock = document.getElementById('app-music-dock');
    const statusText = document.getElementById('dock-status-text');
    
    if (musicDock.classList.contains('dock-expanded')) {
        musicDock.classList.remove('dock-expanded');
        statusText.innerText = "Tap to open media player";
    } else {
        musicDock.classList.add('dock-expanded');
        statusText.innerText = "Now Streaming Aesthetic Track 🎧";
    }
}


// SECTION 3: CORE DAILY LOCALSTORAGE RETENTION MECHANICS
document.addEventListener("DOMContentLoaded", () => {
    verifyUserStreakMetric();
    renderFlowerGrowthState(false);
});

function verifyUserStreakMetric() {
    const calendarTodayStr = new Date().toDateString();
    let clientStoredStreak = parseInt(localStorage.getItem('app_streak_val')) || 0;
    let clientLastVisitStr = localStorage.getItem('app_visit_date_stamp');

    if (!clientLastVisitStr) {
        clientStoredStreak = 1;
        localStorage.setItem('app_streak_val', 1);
        localStorage.setItem('app_visit_date_stamp', calendarTodayStr);
    } else if (clientLastVisitStr !== calendarTodayStr) {
        const calendarYesterdayStr = new Date(Date.now() - 86400000).toDateString();
        if (clientLastVisitStr === calendarYesterdayStr) {
            clientStoredStreak += 1;
            localStorage.setItem('app_streak_val', clientStoredStreak);
        } else {
            clientStoredStreak = 1; 
            localStorage.setItem('app_streak_val', 1);
        }
        localStorage.setItem('app_visit_date_stamp', calendarTodayStr);
    }
    document.getElementById('streak-count').innerText = clientStoredStreak;
}

function renderFlowerGrowthState(applyWateringIncrement) {
    let internalGrowthStage = parseInt(localStorage.getItem('flower_growth_stage_val')) || 10;
    
    if (applyWateringIncrement) {
        internalGrowthStage = Math.min(internalGrowthStage + 15, 65);
        localStorage.setItem('flower_growth_stage_val', internalGrowthStage);
    }

    const stemPathNode = document.getElementById('grow-stem');
    const headGroupNode = document.getElementById('grow-head');

    const runtimeYAxisCoordinate = 90 - internalGrowthStage;
    stemPathNode.setAttribute('d', `M50 90 Q46 ${runtimeYAxisCoordinate + (internalGrowthStage / 2)}, 50 ${runtimeYAxisCoordinate}`);

    if (internalGrowthStage > 20) {
        const structuralScalingFactor = (internalGrowthStage - 20) / 45;
        headGroupNode.setAttribute('transform', `translate(50, ${runtimeYAxisCoordinate}) scale(${structuralScalingFactor})`);
    }
}

function waterPlant() {
    const calendarTodayStr = new Date().toDateString();
    const runtimeLastWateredStr = localStorage.getItem('flower_water_stamp');
    const waterControlBtn = document.getElementById('water-btn');

    if (runtimeLastWateredStr === calendarTodayStr) {
        waterControlBtn.innerText = "Already Fed Today! 🌱";
        waterControlBtn.disabled = true;
        return;
    }

    localStorage.setItem('flower_water_stamp', calendarTodayStr);
    renderFlowerGrowthState(true);
    waterControlBtn.innerText = "Nourished! See Growth Tomorrow ✨";
    waterControlBtn.disabled = true;
}


// SECTION 4: UNPREDICTABLE CAPSULE POOL LOOPS
const localThoughtPool = [
    "Challenge for today: Send me a text with your current favorite song. No context. 🎧",
    "Your general vibe instantly carries my entire week. Uncontested fact.",
    "Lucky prompt: A coffee run is highly favored in your near future. ☕",
    "Technical assertion: You are hands-down the most patient listener on my radar.",
    "You have the rare capability of making standard focus hours look actually fun.",
    "If our interactions were compiled, there would be zero runtime errors. Peak optimization.",
    "Unlocking today's mood: Your taste in music remains completely flawless. Carry on. 🎶",
    "Fun reminder: Let's absolutely make that weekend window work. Pick the day. ✨"
];

function pullDailyFortune() {
    const fortuneDisplayBox = document.getElementById('fortune-display-box');
    const fortuneTextNode = document.getElementById('fortune-text');

    const calculatedRandomIndex = Math.floor(Math.random() * localThoughtPool.length);
    
    fortuneTextNode.innerText = `"${localThoughtPool[calculatedRandomIndex]}"`;
    fortuneDisplayBox.classList.remove('hidden-fortune');
}