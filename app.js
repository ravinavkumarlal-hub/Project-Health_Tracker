
alert('App.js is loaded!');

// ===== HEALTH TRACKER APP - COMPLETE VERSION =====

// Data Storage
class HealthTrackerStorage {
    constructor() {
        this.initializeStorage();
    }

    initializeStorage() {
        if (!localStorage.getItem('healthData')) {
            localStorage.setItem('healthData', JSON.stringify({
                steps: [],
                water: [],
                calories: [],
                fasting: [],
                workouts: [],
                sleep: [],
                weight: [],
                heartRate: [],
                date: new Date().toLocaleDateString()
            }));
        }
    }

    getData() {
        return JSON.parse(localStorage.getItem('healthData')) || {};
    }

    updateData(data) {
        localStorage.setItem('healthData', JSON.stringify(data));
    }

    addEntry(category, value) {
        const data = this.getData();
        const today = new Date().toLocaleDateString();
        
        if (!data[category]) data[category] = [];
        
        data[category].push({
            value: value,
            timestamp: new Date().toLocaleTimeString(),
            date: today
        });
        
        this.updateData(data);
        return true;
    }
}

// Step Tracker
class StepTracker {
    constructor() {
        this.storage = new HealthTrackerStorage();
    }

    logSteps(steps) {
        return this.storage.addEntry('steps', parseInt(steps));
    }

    getTodaySteps() {
        const data = this.storage.getData();
        const today = new Date().toLocaleDateString();
        return data.steps.reduce((total, entry) => {
            if (entry.date === today) return total + entry.value;
            return total;
        }, 0);
    }
}

// Water Tracker
class WaterTracker {
    constructor() {
        this.storage = new HealthTrackerStorage();
        this.targetMl = 2000;
    }

    addWater(amount) {
        return this.storage.addEntry('water', parseInt(amount));
    }

    getTodayWater() {
        const data = this.storage.getData();
        const today = new Date().toLocaleDateString();
        return data.water.reduce((total, entry) => {
            if (entry.date === today) return total + entry.value;
            return total;
        }, 0);
    }

    getWaterProgress() {
        const consumed = this.getTodayWater();
        return Math.round((consumed / this.targetMl) * 100);
    }
}

// Calorie Tracker
class CalorieTracker {
    constructor() {
        this.storage = new HealthTrackerStorage();
        this.dailyTarget = 2000;
    }

    logCalories(calories, foodName = 'Food') {
        return this.storage.addEntry('calories', {
            calories: parseInt(calories),
            food: foodName
        });
    }

    getTodayCalories() {
        const data = this.storage.getData();
        const today = new Date().toLocaleDateString();
        return data.calories.reduce((total, entry) => {
            if (entry.date === today) return total + entry.value.calories;
            return total;
        }, 0);
    }

    getCalorieStatus() {
        const consumed = this.getTodayCalories();
        if (consumed > this.dailyTarget * 1.1) {
            return { status: 'high', message: '⚠️ You\'ve exceeded your calorie target!' };
        } else if (consumed < this.dailyTarget * 0.8) {
            return { status: 'low', message: '🍽️ Eat more to meet your calorie goal!' };
        }
        return { status: 'good', message: '✅ You\'re on track!' };
    }
}

// Fasting Tracker
class FastingTracker {
    constructor() {
        this.storage = new HealthTrackerStorage();
        this.fastingSchedules = {
            '12:12': {
                hours: 12,
                description: 'Beginner Friendly',
                stages: {
                    '0-4h': 'Digestion Phase',
                    '4-8h': 'Early Fat Burn',
                    '8-12h': 'Fat Burn Increases'
                }
            },
            '14:10': {
                hours: 14,
                description: 'Moderate',
                stages: {
                    '0-4h': 'Digestion Phase',
                    '4-8h': 'Fat Burn Begins',
                    '8-14h': 'Deep Fat Burn'
                }
            },
            '16:8': {
                hours: 16,
                description: 'Most Popular',
                stages: {
                    '0-4h': 'Digestion Phase',
                    '4-8h': 'Fat Burn Begins',
                    '8-16h': 'Ketosis & Fat Burn'
                }
            },
            '20:4': {
                hours: 20,
                description: 'Advanced',
                stages: {
                    '0-4h': 'Digestion Phase',
                    '4-8h': 'Fat Burn',
                    '8-20h': 'Deep Ketosis & Autophagy'
                }
            }
        };
    }

    startFasting(schedule) {
        return this.storage.addEntry('fasting', {
            schedule: schedule,
            startTime: new Date().toLocaleTimeString(),
            info: this.fastingSchedules[schedule]
        });
    }

    getFastingInfo(schedule) {
        return this.fastingSchedules[schedule];
    }
}

// Workout Tracker
class WorkoutTracker {
    constructor() {
        this.storage = new HealthTrackerStorage();
    }

    logWorkout(exerciseType, duration) {
        const calorieRates = {
            'Running': 10,
            'Walking': 4,
            'Cycling': 8,
            'Gym': 7
        };
        
        const calories = (calorieRates[exerciseType] || 5) * duration;
        
        return this.storage.addEntry('workouts', {
            type: exerciseType,
            duration: duration,
            caloriesBurned: calories
        });
    }

    getTodayWorkouts() {
        const data = this.storage.getData();
        const today = new Date().toLocaleDateString();
        return data.workouts.filter(entry => entry.date === today);
    }
}

// Sleep Tracker
class SleepTracker {
    constructor() {
        this.storage = new HealthTrackerStorage();
    }

    logSleep(bedtime, wakeupTime) {
        const bed = new Date(`2026-01-01 ${bedtime}`);
        const wake = new Date(`2026-01-02 ${wakeupTime}`);
        const hours = (wake - bed) / (1000 * 60 * 60);
        
        return this.storage.addEntry('sleep', {
            bedtime: bedtime,
            wakeupTime: wakeupTime,
            hours: Math.round(hours * 10) / 10
        });
    }

    getTodaySleep() {
        const data = this.storage.getData();
        const today = new Date().toLocaleDateString();
        const sleepEntry = data.sleep.find(entry => entry.date === today);
        return sleepEntry ? sleepEntry.value.hours : 0;
    }
}

// Weight Tracker
class WeightTracker {
    constructor() {
        this.storage = new HealthTrackerStorage();
    }

    logWeight(weight) {
        return this.storage.addEntry('weight', parseFloat(weight));
    }

    getLatestWeight() {
        const data = this.storage.getData();
        if (data.weight.length === 0) return null;
        return data.weight[data.weight.length - 1].value;
    }
}

// Heart Rate Monitor
class HeartRateMonitor {
    constructor() {
        this.storage = new HealthTrackerStorage();
    }

    logHeartRate(rate) {
        return this.storage.addEntry('heartRate', parseInt(rate));
    }

    getTodayHeartRate() {
        const data = this.storage.getData();
        const today = new Date().toLocaleDateString();
        const entries = data.heartRate.filter(entry => entry.date === today);
        if (entries.length === 0) return null;
        const avg = entries.reduce((sum, entry) => sum + entry.value, 0) / entries.length;
        return Math.round(avg);
    }
}

// Advice System
class AdviceSystem {
    constructor(trackers) {
        this.stepTracker = trackers.stepTracker;
        this.waterTracker = trackers.waterTracker;
        this.calorieTracker = trackers.calorieTracker;
    }

    generateAdvice() {
        const advice = [];
        
        const steps = this.stepTracker.getTodaySteps();
        if (steps < 5000) {
            advice.push({ type: 'warning', message: '👟 Try to walk more! Aim for 10,000 steps daily.' });
        } else if (steps >= 10000) {
            advice.push({ type: 'success', message: '🎉 Great! You\'ve reached your daily step goal!' });
        }
        
        const waterProgress = this.waterTracker.getWaterProgress();
        if (waterProgress < 50) {
            advice.push({ type: 'warning', message: '💧 Drink more water! You\'re at ' + waterProgress + '% of goal.' });
        } else if (waterProgress >= 100) {
            advice.push({ type: 'success', message: '💧 Excellent! Daily water intake goal met!' });
        }
        
        const calorieStatus = this.calorieTracker.getCalorieStatus();
        advice.push({ type: calorieStatus.status, message: calorieStatus.message });
        
        return advice;
    }
}

// Notification System
class NotificationSystem {
    constructor() {
        this.requestPermission();
    }

    requestPermission() {
        if ('Notification' in window && Notification.permission === 'default') {
            Notification.requestPermission();
        }
    }

    send(title, options = {}) {
        if ('Notification' in window && Notification.permission === 'granted') {
            new Notification(title, {
                icon: '💪',
                ...options
            });
        }
    }
}

// ===== INITIALIZE ALL TRACKERS =====
const stepTracker = new StepTracker();
const waterTracker = new WaterTracker();
const calorieTracker = new CalorieTracker();
const fastingTracker = new FastingTracker();
const workoutTracker = new WorkoutTracker();
const sleepTracker = new SleepTracker();
const weightTracker = new WeightTracker();
const heartRateMonitor = new HeartRateMonitor();
const notificationSystem = new NotificationSystem();

const adviceSystem = new AdviceSystem({
    stepTracker,
    waterTracker,
    calorieTracker
});

// ===== UI FUNCTIONS =====
function logStepsCustom() {
    const input = document.getElementById('steps-input');
    if (input && input.value) {
        stepTracker.logSteps(input.value);
        updateDashboard();
        input.value = '';
        notificationSystem.send('✅ Steps Logged');
    }
}

function addWater(amount) {
    waterTracker.addWater(amount);
    updateDashboard();
    notificationSystem.send('💧 Water Added', { body: amount + 'ml logged!' });
}

function logCaloriesCustom() {
    const input = document.getElementById('calorie-input');
    if (input && input.value) {
        calorieTracker.logCalories(input.value, 'Food');
        updateDashboard();
        input.value = '';
    }
}

function startFasting() {
    const schedule = document.getElementById('fasting-schedule').value;
    fastingTracker.startFasting(schedule);
    const info = fastingTracker.getFastingInfo(schedule);
    const infoBox = document.getElementById('fasting-info');
    if (infoBox) {
        infoBox.innerHTML = `
            <h4>${schedule} Fasting</h4>
            <p>${info.description}</p>
            <ul>
                ${Object.entries(info.stages).map(([time, stage]) => `<li>${time}: ${stage}</li>`).join('')}
            </ul>
        `;
    }
    updateDashboard();
}

function logWorkout() {
    const type = document.getElementById('exercise-type').value;
    const duration = document.getElementById('workout-duration').value;
    if (type && duration) {
        workoutTracker.logWorkout(type, parseInt(duration));
        updateDashboard();
        notificationSystem.send('🏃 Workout Logged');
        document.getElementById('exercise-type').value = '';
        document.getElementById('workout-duration').value = '';
    }
}

function logSleep() {
    const bedtime = document.getElementById('bedtime').value;
    const wakeup = document.getElementById('wakeup').value;
    if (bedtime && wakeup) {
        sleepTracker.logSleep(bedtime, wakeup);
        updateDashboard();
        notificationSystem.send('😴 Sleep Logged');
        document.getElementById('bedtime').value = '';
        document.getElementById('wakeup').value = '';
    }
}

function logWeight() {
    const input = document.getElementById('weight-input');
    if (input && input.value) {
        weightTracker.logWeight(input.value);
        updateDashboard();
        input.value = '';
    }
}

function logHeartRate() {
    const input = document.getElementById('heart-rate-input');
    if (input && input.value) {
        heartRateMonitor.logHeartRate(input.value);
        updateDashboard();
        input.value = '';
    }
}

function updateDashboard() {
    const stepsEl = document.getElementById('today-steps');
    const waterEl = document.getElementById('today-water');
    const caloriesEl = document.getElementById('today-calories');
    
    if (stepsEl) stepsEl.textContent = stepTracker.getTodaySteps();
    if (waterEl) waterEl.textContent = waterTracker.getTodayWater() + 'ml';
    if (caloriesEl) caloriesEl.textContent = calorieTracker.getTodayCalories();
    
    const waterProgress = waterTracker.getWaterProgress();
    const waterBar = document.getElementById('water-progress');
    if (waterBar) waterBar.style.width = Math.min(waterProgress, 100) + '%';
    
    const calorieProgress = (calorieTracker.getTodayCalories() / calorieTracker.dailyTarget) * 100;
    const calorieBar = document.getElementById('calories-progress');
    if (calorieBar) calorieBar.style.width = Math.min(calorieProgress, 100) + '%';
    
    const stepProgress = (stepTracker.getTodaySteps() / 10000) * 100;
    const stepsBar = document.getElementById('steps-progress');
    if (stepsBar) stepsBar.style.width = Math.min(stepProgress, 100) + '%';
    
    generateAdviceCards();
}

function generateAdviceCards() {
    const advice = adviceSystem.generateAdvice();
    const container = document.getElementById('advice-container');
    if (container) {
        container.innerHTML = advice.map(a => `
            <div class="advice-card ${a.type}">
                <p>${a.message}</p>
            </div>
        `).join('');
    }
}

// ===== TAB NAVIGATION =====
function switchTab(tabName) {
    // Hide all tabs
    const allTabs = document.querySelectorAll('.tab-content');
    allTabs.forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Remove active class from all buttons
    const allBtns = document.querySelectorAll('.nav-btn');
    allBtns.forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Show selected tab
    const selectedTab = document.getElementById(tabName);
    if (selectedTab) {
        selectedTab.classList.add('active');
    }
    `*
