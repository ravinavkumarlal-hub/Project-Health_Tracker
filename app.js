
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
            return { status: 'high', message: '⚠️ You exceeded calorie target!' };
        } else if (consumed < this.dailyTarget * 0.8) {
            return { status: 'low', message: '🍽️ Eat more to meet goal!' };
        }
        return { status: 'good', message: '✅ You are on track!' };
    }
}

// Fasting Tracker
class FastingTracker {
    constructor() {
        this.storage = new HealthTrackerStorage();
        this.fastingSchedules = {
            '12:12': { hours: 12, description: 'Beginner Friendly' },
            '14:10': { hours: 14, description: 'Moderate' },
            '16:8': { hours: 16, description: 'Most Popular' },
            '20:4': { hours: 20, description: 'Advanced' }
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
            'Swimming': 11,
            'Gym': 7,
            'Yoga': 3
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

    calculateBMI(weight, height) {
        const heightInMeters = height / 100;
        return (weight / (heightInMeters * heightInMeters)).toFixed(1);
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

    getHeartRateStatus(age = 30) {
        const rate = this.getTodayHeartRate();
        if (!rate) return { status: 'unknown', message: 'No data' };
        
        const maxHR = 220 - age;
        if (rate < 60) {
            return { status: 'low', message: 'Heart rate is low. Rest well!' };
        } else if (rate > maxHR * 0.9) {
            return { status: 'high', message: 'Heart rate is high. Cool down!' };
        }
        return { status: 'normal', message: 'Heart rate is normal!' };
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
            advice.push({ type: 'success', message: '🎉 Great! You reached your step goal!' });
        }
        
        const waterProgress = this.waterTracker.getWaterProgress();
        if (waterProgress < 50) {
            advice.push({ type: 'warning', message: '💧 Drink more water! You are at ' + waterProgress + '% of goal.' });
        } else if (waterProgress >= 100) {
            advice.push({ type: 'success', message: '💧 Excellent! Daily water goal met!' });
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
        alert('✅ Steps logged: ' + input.value);
        input.value = '';
    }
}

function addWater(amount) {
    waterTracker.addWater(amount);
    updateDashboard();
    alert('💧 Water logged: ' + amount + 'ml');
}

function addWaterCustom() {
    const input = document.getElementById('water-input');
    if (input && input.value) {
        addWater(input.value);
        input.value = '';
    }
}

function logCaloriesCustom() {
    const input = document.getElementById('calorie-input');
    if (input && input.value) {
        calorieTracker.logCalories(input.value, 'Food');
        updateDashboard();
        alert('🍽️ Calories logged: ' + input.value);
        input.value = '';
    }
}

function searchFood() {
    const input = document.getElementById('food-input').value;
    console.log('Searching for:', input);
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
        `;
    }
    updateDashboard();
    alert('⏱️ Fasting started: ' + schedule);
}

function toggleFasting() {
    startFasting();
}

function logWorkout() {
    const type = document.getElementById('exercise-type').value;
    const duration = document.getElementById('workout-duration').value;
    if (type && duration) {
        workoutTracker.logWorkout(type, parseInt(duration));
        updateDashboard();
        alert('🏃 Workout logged: ' + type + ' for ' + duration + ' mins!');
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
        alert('😴 Sleep logged!');
        document.getElementById('bedtime').value = '';
        document.getElementById('wakeup').value = '';
    }
}

function logWeight() {
    const input = document.getElementById('weight-input');
    if (input && input.value) {
        weightTracker.logWeight(input.value);
        updateDashboard();
        alert('⚖️ Weight logged: ' + input.value + ' kg');
        input.value = '';
    }
}

function logHeartRate() {
    const input = document.getElementById('heart-rate-input');
    if (input && input.value) {
        heartRateMonitor.logHeartRate(input.value);
        updateDashboard();
        alert('❤️ Heart rate logged: ' + input.value + ' bpm');
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

function changeView(view) {
    document.querySelectorAll('.view-btn').forEach(btn => btn.classList.remove('active'));
    if (event && event.target) {
        event.target.classList.add('active');
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
    
    // Mark button as active
    if (event && event.target) {
        event.target.classList.add('active');
    }
}

// ===== INITIALIZE APP =====
document.addEventListener('DOMContentLoaded', function() {
    // Set up tab navigation
    const navBtns = document.querySelectorAll('.nav-btn');
    navBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const tabName = this.getAttribute('data-tab');
            switchTab(tabName);
        });
    });
    
    // Update dashboard on load
    updateDashboard();
    
    // Set up periodic water reminder (every 2 hours)
    setInterval(() => {
        notificationSystem.send('💧 Water Reminder', { body: 'Time to drink water!' });
    }, 2 * 60 * 60 * 1000);
    
    console.log('✅ Health Tracker App Initialized Successfully!');
});