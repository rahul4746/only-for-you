const scrollCards = document.querySelectorAll('.timeline-card');

function processTimelineScrollTracking() {
    const viewportHeight = window.innerHeight;
    
    const scrollTriggerStart = viewportHeight; 
    const scrollTriggerComplete = viewportHeight * 0.40; 

    scrollCards.forEach(card => {
        const cardBoundingBox = card.getBoundingClientRect();
        
        
        let linearProgress = (scrollTriggerStart - cardBoundingBox.top) / (scrollTriggerStart - scrollTriggerComplete);
        linearProgress = Math.max(0, Math.min(1, linearProgress)); 


        const textElement = card.querySelector('.card-caption.main-focus');
        if (textElement) {
            textElement.style.opacity = linearProgress;
            textElement.style.transform = `translateY(${(1 - linearProgress) * 20}px)`;
        }

        
        const photoElement = card.querySelector('.sticky-note-photo');
        if (photoElement) {
            const isLeftCard = card.classList.contains('left-swing-card');
            
            
            const startingAngle = isLeftCard ? -90 : 90;
            const naturalTiltAngle = isLeftCard ? 7 : -6;
            
            
            const computedAngle = startingAngle + ((naturalTiltAngle - startingAngle) * linearProgress);
            const verticalDropOffset = (1 - linearProgress) * 50;

            photoElement.style.transform = `rotate(${computedAngle}deg) translateY(${verticalDropOffset}px)`;
        }

        
        const vinePaths = card.querySelectorAll('.grow-vine-path');
        vinePaths.forEach(vine => {
            
            vine.style.strokeDashoffset = 100 - (100 * linearProgress);
        });

        
        const blossomCluster = card.querySelector('.blooming-blossom');
        if (blossomCluster) {
            blossomCluster.style.opacity = linearProgress >= 0.7 ? (linearProgress - 0.7) / 0.3 : 0;
            blossomCluster.style.transform = `scale(${linearProgress >= 0.6 ? (linearProgress - 0.6) / 0.4 : 0})`;
        }
    });
}


window.addEventListener('scroll', () => requestAnimationFrame(processTimelineScrollTracking));
window.addEventListener('resize', processTimelineScrollTracking);



const trailCanvas = document.getElementById('trail-canvas');
const ctx = trailCanvas.getContext('2d');
let activeParticles = [];

function adjustTrailCanvasBounds() {
    trailCanvas.width = window.innerWidth;
    trailCanvas.height = window.innerHeight;
}
adjustTrailCanvasBounds();
window.addEventListener('resize', adjustTrailCanvasBounds);

class SparkleParticle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = Math.random() * 5 + 2;
        this.speedX = Math.random() * 2 - 1;
        this.speedY = Math.random() * -1.5 - 0.5; 
        this.alpha = 1;
        this.decay = Math.random() * 0.02 + 0.015;
        this.isHeart = Math.random() > 0.75; 
        
        
        const palette = ['#ff85a2', '#ffd700', '#ffe5ec', '#81b29a', '#fef3c7'];
        this.color = palette[Math.floor(Math.random() * palette.length)];
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.alpha -= this.decay;
    }

    draw() {
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.fillStyle = this.color;
        
        if (this.isHeart) {
            
            ctx.beginPath();
            const topY = this.y - this.size / 2;
            ctx.moveTo(this.x, this.y + this.size / 2);
            ctx.bezierCurveTo(this.x - this.size, topY, this.x - this.size * 1.5, topY - this.size / 2, this.x, this.y - this.size);
            ctx.bezierCurveTo(this.x + this.size * 1.5, topY - this.size / 2, this.x + this.size, topY, this.x, this.y + this.size / 2);
            ctx.fill();
        } else {
            
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size / 2, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.restore();
    }
}

function spawnTrailCoordinates(clientX, clientY) {
    for (let i = 0; i < 2; i++) {
        activeParticles.push(new SparkleParticle(clientX, clientY));
    }
}


window.addEventListener('mousemove', (e) => {
    spawnTrailCoordinates(e.clientX, e.clientY);
});


window.addEventListener('touchmove', (e) => {
    if (e.touches.length > 0) {
        spawnTrailCoordinates(e.touches[0].clientX, e.touches[0].clientY);
    }
}, { passive: true });

function animateTrailFrameLoop() {
    ctx.clearRect(0, 0, trailCanvas.width, trailCanvas.height);
    
    for (let i = activeParticles.length - 1; i >= 0; i--) {
        const particle = activeParticles[i];
        particle.update();
        particle.draw();
        
        if (particle.alpha <= 0) {
            activeParticles.splice(i, 1);
        }
    }
    requestAnimationFrame(animateTrailFrameLoop);
}
requestAnimationFrame(animateTrailFrameLoop);



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

document.addEventListener("DOMContentLoaded", () => {
    verifyUserStreakMetric();
    renderFlowerGrowthState(false);
    processTimelineScrollTracking(); 
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

const localThoughtPool = [
    "Challenge for today: Send me a text with your current favorite song. No context. 🎧",
    "You brought me luck from the moment we met. I have zero doubts about that.",
    "Your general vibe instantly carries my entire week. Uncontested fact.",
    "Lucky prompt: A coffee run is highly favored in your near future. ☕",
    "Technical assertion: You are hands-down the most patient listener on my radar.",
    "You have the rare capability of making standard focus hours look actually fun.",
    "If our interactions were compiled, there would be zero runtime errors. Peak optimization.",
    "Unlocking today's mood: Your taste in music remains completely flawless. Carry on. 🎶",
    "Compliment of the day: You have an incredible ability to make even the most boring day turn into special. 🌟"
];

function pullDailyFortune() {
    const fortuneDisplayBox = document.getElementById('fortune-display-box');
    const fortuneTextNode = document.getElementById('fortune-text');
    const calculatedRandomIndex = Math.floor(Math.random() * localThoughtPool.length);
    fortuneTextNode.innerText = `"${localThoughtPool[calculatedRandomIndex]}"`;
    fortuneDisplayBox.classList.remove('hidden-fortune');
}