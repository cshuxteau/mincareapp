# MindCare Enhanced Gamification - Phase 1 Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Implement core gamification foundation including XP/level system, 2 character archetypes (Warrior/Healer), 3 mini-games, basic avatar customization, and lifestyle quests.

**Architecture:** Refactor current single-file HTML into modular structure with separate game engine, data persistence layer, and UI components. Build progression system first, then layer mini-games and quests on top.

**Tech Stack:** Vanilla JavaScript (ES6+), HTML5 Canvas for mini-games, LocalStorage for persistence, CSS3 animations

**Starting Point:** `mindcare-between-sessions.html` (existing single-file app)

---

## Phase Overview

**Phase 1A: Core Infrastructure** (Tasks 1-5)
- Refactor to modular structure
- Build XP/level progression engine
- Implement data persistence layer
- Create character archetype system
- Build quest management system

**Phase 1B: Mini-Games** (Tasks 6-8)
- Emotion Waves (surfing game)
- Thought Detective (mystery game)
- Mindfulness Garden (meditation space)

**Phase 1C: Avatar & Quests** (Tasks 9-11)
- Avatar customization system
- Sleep lifestyle quests
- Movement lifestyle quests

**Phase 1D: Integration & Polish** (Tasks 12-13)
- Integrate all systems
- UI/UX polish and testing

---

## Task 1: Refactor to Modular Structure

**Goal:** Split monolithic HTML into organized modules while maintaining functionality

**Files:**
- Modify: `mindcare-between-sessions.html` (backup first)
- Create: `js/gameEngine.js`
- Create: `js/dataManager.js`
- Create: `js/uiManager.js`
- Create: `js/config.js`
- Create: `css/gamification.css`

### Step 1: Backup current file

```bash
cp mindcare-between-sessions.html mindcare-between-sessions.backup.html
```

### Step 2: Create directory structure

```bash
mkdir -p js
mkdir -p css
mkdir -p assets/avatars
mkdir -p assets/minigames
```

### Step 3: Create config file with game constants

**File: `js/config.js`**

```javascript
// Game Configuration
const GAME_CONFIG = {
    // XP Requirements per level (exponential growth)
    xpRequirements: Array.from({length: 100}, (_, i) => {
        return Math.floor(100 * Math.pow(1.15, i));
    }),

    // XP Rewards
    xpRewards: {
        dailyCheckin: 50,
        quickActivity: 25,
        standardActivity: 50,
        miniGame: 75,
        majorChallenge: 100,
        streakBonusPerDay: 0.10,
        maxStreakBonus: 0.50
    },

    // Coin Rewards
    coinRewards: {
        dailyQuest: 10,
        weeklyChallenge: 50,
        levelUp: 25
    },

    // Character Archetypes
    archetypes: {
        warrior: {
            id: 'warrior',
            name: 'Warrior',
            description: 'Face your fears with courage',
            theme: 'courage',
            primaryColor: '#EF4444',
            secondaryColor: '#DC2626'
        },
        healer: {
            id: 'healer',
            name: 'Healer',
            description: 'Nurture yourself with compassion',
            theme: 'selfCare',
            primaryColor: '#10B981',
            secondaryColor: '#059669'
        }
    },

    // Skill Trees
    skillTrees: {
        emotional: { name: 'Emotional Regulation', maxLevel: 20, icon: '❤️' },
        social: { name: 'Social Connection', maxLevel: 20, icon: '👥' },
        mindfulness: { name: 'Mindfulness', maxLevel: 20, icon: '🧘' },
        physical: { name: 'Physical Wellness', maxLevel: 20, icon: '💪' }
    }
};
```

### Step 4: Create data manager for persistence

**File: `js/dataManager.js`**

```javascript
// Data Manager - Handles all localStorage operations
class DataManager {
    constructor() {
        this.storageKey = 'mindcareGameData';
        this.data = this.loadData();
    }

    // Initialize default data structure
    getDefaultData() {
        return {
            version: '2.0.0',
            player: {
                id: this.generateId(),
                name: '',
                archetype: null,
                level: 1,
                xp: 0,
                coins: 0,
                createdAt: new Date().toISOString(),
                lastLogin: new Date().toISOString()
            },
            skillTrees: {
                emotional: { level: 1, xp: 0 },
                social: { level: 1, xp: 0 },
                mindfulness: { level: 1, xp: 0 },
                physical: { level: 1, xp: 0 }
            },
            avatar: {
                bodyType: 0,
                skinTone: 0,
                hairStyle: 0,
                hairColor: '#000000',
                clothing: [],
                accessories: [],
                background: 'default'
            },
            inventory: {
                unlockedItems: ['starter-outfit'],
                equippedItems: []
            },
            quests: {
                daily: [],
                weekly: [],
                story: [],
                completed: []
            },
            activities: {
                completed: [],
                favorites: []
            },
            miniGames: {
                emotionWaves: { highScore: 0, timesPlayed: 0 },
                thoughtDetective: { casesCompleted: 0, accuracy: 0 },
                mindfulnessGarden: { plantsGrown: 0, minutesMeditated: 0 }
            },
            stats: {
                streak: 0,
                lastCheckin: null,
                totalCheckins: 0,
                totalActivities: 0,
                moodHistory: []
            },
            // Preserve existing medication/session data
            medications: [],
            sessionNotes: [],
            sideEffects: []
        };
    }

    // Generate unique ID
    generateId() {
        return 'player_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    // Load data from localStorage
    loadData() {
        try {
            const saved = localStorage.getItem(this.storageKey);
            if (saved) {
                const parsed = JSON.parse(saved);
                // Merge with defaults to handle version updates
                return this.mergeWithDefaults(parsed);
            }
        } catch (error) {
            console.error('Error loading data:', error);
        }
        return this.getDefaultData();
    }

    // Merge saved data with defaults (handles missing fields in old versions)
    mergeWithDefaults(saved) {
        const defaults = this.getDefaultData();
        return this.deepMerge(defaults, saved);
    }

    // Deep merge two objects
    deepMerge(target, source) {
        const output = Object.assign({}, target);
        if (this.isObject(target) && this.isObject(source)) {
            Object.keys(source).forEach(key => {
                if (this.isObject(source[key])) {
                    if (!(key in target)) {
                        Object.assign(output, { [key]: source[key] });
                    } else {
                        output[key] = this.deepMerge(target[key], source[key]);
                    }
                } else {
                    Object.assign(output, { [key]: source[key] });
                }
            });
        }
        return output;
    }

    isObject(item) {
        return item && typeof item === 'object' && !Array.isArray(item);
    }

    // Save data to localStorage
    saveData() {
        try {
            this.data.player.lastLogin = new Date().toISOString();
            localStorage.setItem(this.storageKey, JSON.stringify(this.data));
            return true;
        } catch (error) {
            console.error('Error saving data:', error);
            return false;
        }
    }

    // Get specific data
    get(path) {
        return path.split('.').reduce((obj, key) => obj?.[key], this.data);
    }

    // Set specific data
    set(path, value) {
        const keys = path.split('.');
        const lastKey = keys.pop();
        const target = keys.reduce((obj, key) => {
            if (!obj[key]) obj[key] = {};
            return obj[key];
        }, this.data);
        target[lastKey] = value;
        this.saveData();
    }

    // Update player data
    updatePlayer(updates) {
        Object.assign(this.data.player, updates);
        this.saveData();
    }

    // Export data for backup
    exportData() {
        return JSON.stringify(this.data, null, 2);
    }

    // Import data from backup
    importData(jsonString) {
        try {
            const imported = JSON.parse(jsonString);
            this.data = this.mergeWithDefaults(imported);
            this.saveData();
            return true;
        } catch (error) {
            console.error('Error importing data:', error);
            return false;
        }
    }

    // Clear all data (with confirmation)
    clearAllData() {
        if (confirm('Are you sure you want to delete all your progress? This cannot be undone.')) {
            localStorage.removeItem(this.storageKey);
            this.data = this.getDefaultData();
            return true;
        }
        return false;
    }
}
```

### Step 5: Commit infrastructure

```bash
git add js/config.js js/dataManager.js
git commit -m "feat: add game config and data persistence layer"
```

---

## Task 2: Build XP/Level Progression Engine

**Goal:** Implement core progression mechanics (XP earning, leveling up, skill trees)

**Files:**
- Create: `js/progressionEngine.js`

### Step 1: Create progression engine

**File: `js/progressionEngine.js`**

```javascript
// Progression Engine - Handles XP, leveling, and skill trees
class ProgressionEngine {
    constructor(dataManager) {
        this.dm = dataManager;
        this.config = GAME_CONFIG;
        this.levelUpCallbacks = [];
        this.xpGainCallbacks = [];
    }

    // Register callback for level up events
    onLevelUp(callback) {
        this.levelUpCallbacks.push(callback);
    }

    // Register callback for XP gain events
    onXPGain(callback) {
        this.xpGainCallbacks.push(callback);
    }

    // Award XP to player
    awardXP(amount, source = 'activity') {
        const player = this.dm.data.player;
        const currentLevel = player.level;

        // Apply streak bonus
        const streak = this.dm.data.stats.streak;
        const bonusMultiplier = Math.min(
            1 + (streak * this.config.xpRewards.streakBonusPerDay),
            1 + this.config.xpRewards.maxStreakBonus
        );

        const finalAmount = Math.floor(amount * bonusMultiplier);
        player.xp += finalAmount;

        // Trigger XP gain callbacks
        this.xpGainCallbacks.forEach(cb => cb(finalAmount, source, bonusMultiplier));

        // Check for level up
        while (this.checkLevelUp()) {
            this.levelUp();
        }

        this.dm.saveData();

        return {
            amount: finalAmount,
            bonus: bonusMultiplier > 1,
            bonusMultiplier,
            leveledUp: player.level > currentLevel,
            newLevel: player.level
        };
    }

    // Check if player has enough XP to level up
    checkLevelUp() {
        const player = this.dm.data.player;
        const currentLevel = player.level;

        if (currentLevel >= 100) return false;

        const requiredXP = this.config.xpRequirements[currentLevel - 1];
        return player.xp >= requiredXP;
    }

    // Level up the player
    levelUp() {
        const player = this.dm.data.player;
        const oldLevel = player.level;

        // Increase level
        player.level++;

        // Award coins
        player.coins += this.config.coinRewards.levelUp;

        // Subtract used XP
        const requiredXP = this.config.xpRequirements[oldLevel - 1];
        player.xp -= requiredXP;

        // Unlock rewards
        const rewards = this.getRewardsForLevel(player.level);

        // Trigger level up callbacks
        this.levelUpCallbacks.forEach(cb => cb(player.level, oldLevel, rewards));

        this.dm.saveData();

        return {
            newLevel: player.level,
            rewards
        };
    }

    // Get rewards unlocked at a specific level
    getRewardsForLevel(level) {
        const rewards = [];

        // Every level unlocks something
        if (level % 10 === 0) {
            rewards.push({ type: 'story', description: 'New story chapter unlocked!' });
        }

        if (level === 5 || level === 15 || level === 25) {
            rewards.push({ type: 'minigame', description: 'New mini-game difficulty unlocked!' });
        }

        if (level % 3 === 0) {
            rewards.push({ type: 'avatar', description: 'New avatar items available in shop!' });
        }

        // Always award coins
        rewards.push({
            type: 'coins',
            amount: this.config.coinRewards.levelUp,
            description: `${this.config.coinRewards.levelUp} Wellness Coins!`
        });

        return rewards;
    }

    // Award XP to specific skill tree
    awardSkillXP(skillName, amount) {
        const skill = this.dm.data.skillTrees[skillName];
        if (!skill) {
            console.error('Invalid skill:', skillName);
            return null;
        }

        const currentLevel = skill.level;
        skill.xp += amount;

        // Check for skill level up (100 XP per skill level)
        const xpPerLevel = 100;
        while (skill.xp >= xpPerLevel && skill.level < 20) {
            skill.level++;
            skill.xp -= xpPerLevel;
        }

        this.dm.saveData();

        return {
            skillName,
            amount,
            leveledUp: skill.level > currentLevel,
            newLevel: skill.level
        };
    }

    // Get player's current level info
    getLevelInfo() {
        const player = this.dm.data.player;
        const currentLevel = player.level;

        if (currentLevel >= 100) {
            return {
                level: 100,
                xp: player.xp,
                xpRequired: 0,
                progress: 100,
                maxLevel: true
            };
        }

        const xpRequired = this.config.xpRequirements[currentLevel - 1];
        const progress = (player.xp / xpRequired) * 100;

        return {
            level: currentLevel,
            xp: player.xp,
            xpRequired,
            progress: Math.min(progress, 100),
            maxLevel: false
        };
    }

    // Get skill tree info
    getSkillInfo(skillName) {
        const skill = this.dm.data.skillTrees[skillName];
        const config = this.config.skillTrees[skillName];

        if (!skill || !config) return null;

        const xpPerLevel = 100;
        const xpRequired = skill.level >= config.maxLevel ? 0 : xpPerLevel;
        const progress = skill.level >= config.maxLevel ? 100 : (skill.xp / xpRequired) * 100;

        return {
            name: config.name,
            icon: config.icon,
            level: skill.level,
            maxLevel: config.maxLevel,
            xp: skill.xp,
            xpRequired,
            progress,
            isMaxed: skill.level >= config.maxLevel
        };
    }

    // Get all skill trees info
    getAllSkillsInfo() {
        return Object.keys(this.config.skillTrees).map(skillName =>
            this.getSkillInfo(skillName)
        );
    }
}
```

### Step 2: Test progression engine (manual test in browser console)

Add to HTML temporarily for testing:

```html
<script src="js/config.js"></script>
<script src="js/dataManager.js"></script>
<script src="js/progressionEngine.js"></script>
<script>
// Test in console
const dm = new DataManager();
const pe = new ProgressionEngine(dm);

// Test XP award
console.log('Initial:', pe.getLevelInfo());
const result = pe.awardXP(50, 'test');
console.log('After 50 XP:', result, pe.getLevelInfo());

// Test level up
pe.awardXP(200, 'test');
console.log('After 200 more XP:', pe.getLevelInfo());

// Test skill XP
pe.awardSkillXP('emotional', 50);
console.log('Emotional skill:', pe.getSkillInfo('emotional'));
</script>
```

Expected: Should level up from 1→2 (requires 100 XP), then progress toward level 3

### Step 3: Commit progression engine

```bash
git add js/progressionEngine.js
git commit -m "feat: add XP/level progression engine with skill trees"
```

---

## Task 3: Implement Character Archetype System

**Goal:** Allow player to choose archetype (Warrior/Healer) and track archetype-specific progress

**Files:**
- Create: `js/archetypeSystem.js`
- Create: `js/storyEngine.js`

### Step 1: Create archetype system

**File: `js/archetypeSystem.js`**

```javascript
// Archetype System - Manages character path selection and themed content
class ArchetypeSystem {
    constructor(dataManager) {
        this.dm = dataManager;
        this.config = GAME_CONFIG.archetypes;
    }

    // Check if player has chosen archetype
    hasChosenArchetype() {
        return this.dm.data.player.archetype !== null;
    }

    // Choose archetype (can only be done once, or allow switching?)
    chooseArchetype(archetypeId, allowChange = false) {
        if (this.hasChosenArchetype() && !allowChange) {
            return {
                success: false,
                message: 'You have already chosen your path!'
            };
        }

        const archetype = this.config[archetypeId];
        if (!archetype) {
            return {
                success: false,
                message: 'Invalid archetype'
            };
        }

        this.dm.data.player.archetype = archetypeId;
        this.dm.saveData();

        return {
            success: true,
            archetype,
            message: `You have chosen the path of the ${archetype.name}!`
        };
    }

    // Get current archetype
    getCurrentArchetype() {
        const archetypeId = this.dm.data.player.archetype;
        if (!archetypeId) return null;

        return this.config[archetypeId];
    }

    // Get all available archetypes
    getAllArchetypes() {
        return Object.values(this.config);
    }

    // Get archetype-specific quest flavor text
    getQuestFlavor(baseQuest) {
        const archetype = this.getCurrentArchetype();
        if (!archetype) return baseQuest;

        // Clone quest
        const quest = { ...baseQuest };

        // Add archetype flavor based on theme
        if (archetype.theme === 'courage') {
            quest.description = quest.description.replace(
                /complete/gi,
                'conquer'
            );
            quest.prefix = '⚔️ Warrior Quest: ';
        } else if (archetype.theme === 'selfCare') {
            quest.description = quest.description.replace(
                /complete/gi,
                'nurture through'
            );
            quest.prefix = '🌿 Healer Quest: ';
        }

        return quest;
    }

    // Get themed encouragement message
    getEncouragementMessage() {
        const archetype = this.getCurrentArchetype();
        if (!archetype) return 'Keep going!';

        const messages = {
            warrior: [
                'Your courage grows stronger!',
                'Fear cannot defeat you!',
                'Victory is within reach!',
                'You face challenges with bravery!'
            ],
            healer: [
                'You are worthy of care!',
                'Self-compassion heals all wounds!',
                'You are growing and healing!',
                'Nurture yourself gently!'
            ]
        };

        const archetypeMessages = messages[archetype.id] || ['Great work!'];
        return archetypeMessages[Math.floor(Math.random() * archetypeMessages.length)];
    }
}
```

### Step 2: Create story engine

**File: `js/storyEngine.js`**

```javascript
// Story Engine - Manages narrative progression
class StoryEngine {
    constructor(dataManager, archetypeSystem) {
        this.dm = dataManager;
        this.archetypes = archetypeSystem;
    }

    // Get story chapters for current archetype
    getStoryChapters() {
        const archetype = this.archetypes.getCurrentArchetype();
        if (!archetype) return [];

        // Story structure (5 acts, each with multiple chapters)
        const stories = {
            warrior: [
                {
                    level: 1,
                    title: 'The Awakening',
                    description: 'Discover the warrior within',
                    quests: [
                        { id: 'w1-1', title: 'Recognize Your Strength', activity: 'checkin' },
                        { id: 'w1-2', title: 'First Battle', activity: 'emotion-waves' },
                        { id: 'w1-3', title: 'Training Begins', activity: 'quick-breathing' }
                    ]
                },
                {
                    level: 5,
                    title: 'Ancient Skills',
                    description: 'Learn the warrior arts',
                    quests: [
                        { id: 'w2-1', title: 'Master Your Mind', activity: 'thought-detective' },
                        { id: 'w2-2', title: 'Build Resilience', activity: 'daily-quest-3' },
                        { id: 'w2-3', title: 'Face a Fear', activity: 'behavioral-activation' }
                    ]
                },
                {
                    level: 10,
                    title: 'The Shadow Beast',
                    description: 'Confront your inner demons',
                    quests: [
                        { id: 'w3-1', title: 'Into the Darkness', activity: 'reflection' },
                        { id: 'w3-2', title: 'Stand Your Ground', activity: 'emotion-waves-hard' },
                        { id: 'w3-3', title: 'Victory', activity: 'week-challenge' }
                    ]
                }
                // More chapters at levels 15, 20, 25, 30, 40, 50...
            ],
            healer: [
                {
                    level: 1,
                    title: 'The Wounded Healer',
                    description: 'Begin your journey of self-compassion',
                    quests: [
                        { id: 'h1-1', title: 'Acknowledge Your Pain', activity: 'checkin' },
                        { id: 'h1-2', title: 'First Steps', activity: 'mindfulness-garden' },
                        { id: 'h1-3', title: 'Gentle Care', activity: 'self-soothe' }
                    ]
                },
                {
                    level: 5,
                    title: 'Healing Arts',
                    description: 'Learn to nurture yourself',
                    quests: [
                        { id: 'h2-1', title: 'Self-Compassion Practice', activity: 'loving-kindness' },
                        { id: 'h2-2', title: 'Restore Balance', activity: 'sleep-quest' },
                        { id: 'h2-3', title: 'Nourish Body and Mind', activity: 'nutrition-quest' }
                    ]
                },
                {
                    level: 10,
                    title: 'The Inner Child',
                    description: 'Heal old wounds with compassion',
                    quests: [
                        { id: 'h3-1', title: 'Meet Your Younger Self', activity: 'visualization' },
                        { id: 'h3-2', title: 'Offer Comfort', activity: 'self-compassion' },
                        { id: 'h3-3', title: 'Integration', activity: 'week-challenge' }
                    ]
                }
                // More chapters...
            ]
        };

        return stories[archetype.id] || [];
    }

    // Get current available chapters based on player level
    getAvailableChapters() {
        const chapters = this.getStoryChapters();
        const playerLevel = this.dm.data.player.level;

        return chapters.filter(chapter => playerLevel >= chapter.level);
    }

    // Get next chapter to unlock
    getNextChapter() {
        const chapters = this.getStoryChapters();
        const playerLevel = this.dm.data.player.level;

        return chapters.find(chapter => chapter.level > playerLevel);
    }

    // Check if chapter is completed
    isChapterCompleted(chapterLevel) {
        const completed = this.dm.data.quests.completed;
        const chapter = this.getStoryChapters().find(c => c.level === chapterLevel);

        if (!chapter) return false;

        // Check if all quests in chapter are completed
        return chapter.quests.every(quest =>
            completed.some(c => c.questId === quest.id)
        );
    }

    // Complete a story quest
    completeQuest(questId) {
        const completed = this.dm.data.quests.completed;

        // Don't add duplicates
        if (completed.some(c => c.questId === questId)) {
            return { success: false, message: 'Quest already completed' };
        }

        completed.push({
            questId,
            completedAt: new Date().toISOString()
        });

        this.dm.saveData();

        return { success: true, message: 'Quest completed!' };
    }
}
```

### Step 3: Commit archetype and story systems

```bash
git add js/archetypeSystem.js js/storyEngine.js
git commit -m "feat: add character archetype and story progression systems"
```

---

## Task 4: Build Quest Management System

**Goal:** Create daily/weekly quest generation and tracking

**Files:**
- Create: `js/questManager.js`

### Step 1: Create quest manager

**File: `js/questManager.js`**

```javascript
// Quest Manager - Generates and tracks daily/weekly quests
class QuestManager {
    constructor(dataManager, progressionEngine) {
        this.dm = dataManager;
        this.progression = progressionEngine;
        this.questTemplates = this.initializeQuestTemplates();
    }

    // Initialize quest templates
    initializeQuestTemplates() {
        return {
            daily: [
                // Always include check-in
                {
                    id: 'daily-checkin',
                    title: 'Daily Check-In',
                    description: 'Complete your mood check-in',
                    xpReward: 50,
                    coinReward: 10,
                    category: 'checkin',
                    required: true
                },
                // Emotional regulation quests
                {
                    id: 'daily-emotion-1',
                    title: 'Ride the Waves',
                    description: 'Play Emotion Waves mini-game',
                    xpReward: 75,
                    coinReward: 10,
                    category: 'emotional',
                    skillTree: 'emotional'
                },
                {
                    id: 'daily-emotion-2',
                    title: 'Breathing Practice',
                    description: 'Complete 4-7-8 breathing exercise',
                    xpReward: 50,
                    coinReward: 10,
                    category: 'emotional',
                    skillTree: 'emotional'
                },
                // Mindfulness quests
                {
                    id: 'daily-mindful-1',
                    title: 'Tend Your Garden',
                    description: 'Spend 5 minutes in Mindfulness Garden',
                    xpReward: 75,
                    coinReward: 10,
                    category: 'mindfulness',
                    skillTree: 'mindfulness'
                },
                {
                    id: 'daily-mindful-2',
                    title: 'Mindful Moment',
                    description: 'Complete a body scan or meditation',
                    xpReward: 50,
                    coinReward: 10,
                    category: 'mindfulness',
                    skillTree: 'mindfulness'
                },
                // Physical wellness quests
                {
                    id: 'daily-physical-1',
                    title: 'Move Your Body',
                    description: 'Complete any movement activity',
                    xpReward: 50,
                    coinReward: 10,
                    category: 'physical',
                    skillTree: 'physical'
                },
                {
                    id: 'daily-physical-2',
                    title: 'Sleep Well',
                    description: 'Log your sleep quality',
                    xpReward: 25,
                    coinReward: 10,
                    category: 'physical',
                    skillTree: 'physical'
                },
                // Social connection quests
                {
                    id: 'daily-social-1',
                    title: 'Reach Out',
                    description: 'Connect with one person today',
                    xpReward: 50,
                    coinReward: 10,
                    category: 'social',
                    skillTree: 'social'
                },
                {
                    id: 'daily-social-2',
                    title: 'Practice Conversation',
                    description: 'Try the Social Simulator',
                    xpReward: 75,
                    coinReward: 10,
                    category: 'social',
                    skillTree: 'social'
                }
            ],
            weekly: [
                {
                    id: 'weekly-mindfulness',
                    title: 'Mindfulness Week',
                    description: 'Complete 5 mindfulness sessions this week',
                    xpReward: 500,
                    coinReward: 50,
                    target: 5,
                    category: 'mindfulness',
                    skillTree: 'mindfulness'
                },
                {
                    id: 'weekly-movement',
                    title: 'Active Week',
                    description: 'Complete 4 movement activities this week',
                    xpReward: 500,
                    coinReward: 50,
                    target: 4,
                    category: 'physical',
                    skillTree: 'physical'
                },
                {
                    id: 'weekly-sleep',
                    title: 'Sleep Champion',
                    description: 'Log sleep for 7 consecutive days',
                    xpReward: 500,
                    coinReward: 50,
                    target: 7,
                    category: 'physical',
                    skillTree: 'physical'
                },
                {
                    id: 'weekly-social',
                    title: 'Connection Challenge',
                    description: 'Connect with others 3 times this week',
                    xpReward: 500,
                    coinReward: 50,
                    target: 3,
                    category: 'social',
                    skillTree: 'social'
                }
            ]
        };
    }

    // Generate daily quests (3 total: check-in + 2 random)
    generateDailyQuests() {
        const quests = this.dm.data.quests.daily;

        // Check if quests already generated today
        const today = new Date().toDateString();
        if (quests.length > 0 && quests[0].date === today) {
            return quests; // Already generated
        }

        // Clear old daily quests
        this.dm.data.quests.daily = [];

        // Always add check-in
        const checkinQuest = this.questTemplates.daily.find(q => q.id === 'daily-checkin');
        this.addDailyQuest(checkinQuest);

        // Add 2 random quests from different categories
        const otherQuests = this.questTemplates.daily.filter(q => q.id !== 'daily-checkin');
        const categories = ['emotional', 'mindfulness', 'physical', 'social'];

        // Shuffle categories
        const shuffled = categories.sort(() => Math.random() - 0.5);

        // Pick one quest from each of first 2 categories
        for (let i = 0; i < 2 && i < shuffled.length; i++) {
            const categoryQuests = otherQuests.filter(q => q.category === shuffled[i]);
            if (categoryQuests.length > 0) {
                const randomQuest = categoryQuests[Math.floor(Math.random() * categoryQuests.length)];
                this.addDailyQuest(randomQuest);
            }
        }

        this.dm.saveData();
        return this.dm.data.quests.daily;
    }

    // Add daily quest
    addDailyQuest(template) {
        this.dm.data.quests.daily.push({
            ...template,
            date: new Date().toDateString(),
            completed: false,
            progress: 0
        });
    }

    // Generate weekly challenge
    generateWeeklyChallenge() {
        const weekly = this.dm.data.quests.weekly;

        // Check if challenge already active
        if (weekly.length > 0) {
            const startDate = new Date(weekly[0].startDate);
            const now = new Date();
            const daysDiff = Math.floor((now - startDate) / (1000 * 60 * 60 * 24));

            if (daysDiff < 7) {
                return weekly[0]; // Challenge still active
            }
        }

        // Generate new weekly challenge
        const templates = this.questTemplates.weekly;
        const randomTemplate = templates[Math.floor(Math.random() * templates.length)];

        const challenge = {
            ...randomTemplate,
            startDate: new Date().toISOString(),
            completed: false,
            progress: 0
        };

        this.dm.data.quests.weekly = [challenge];
        this.dm.saveData();

        return challenge;
    }

    // Complete a daily quest
    completeDailyQuest(questId) {
        const quest = this.dm.data.quests.daily.find(q => q.id === questId);

        if (!quest) {
            return { success: false, message: 'Quest not found' };
        }

        if (quest.completed) {
            return { success: false, message: 'Quest already completed' };
        }

        quest.completed = true;
        quest.completedAt = new Date().toISOString();

        // Award XP and coins
        const xpResult = this.progression.awardXP(quest.xpReward, 'daily-quest');
        this.dm.data.player.coins += quest.coinReward;

        // Award skill tree XP if applicable
        if (quest.skillTree) {
            this.progression.awardSkillXP(quest.skillTree, 25);
        }

        // Check if all daily quests completed
        const allCompleted = this.dm.data.quests.daily.every(q => q.completed);

        this.dm.saveData();

        return {
            success: true,
            xpAwarded: xpResult.amount,
            coinsAwarded: quest.coinReward,
            allDailyCompleted: allCompleted
        };
    }

    // Update weekly challenge progress
    updateWeeklyProgress(amount = 1) {
        const weekly = this.dm.data.quests.weekly;

        if (weekly.length === 0) return null;

        const challenge = weekly[0];
        if (challenge.completed) return null;

        challenge.progress += amount;

        // Check if completed
        if (challenge.progress >= challenge.target) {
            challenge.completed = true;
            challenge.completedAt = new Date().toISOString();

            // Award rewards
            const xpResult = this.progression.awardXP(challenge.xpReward, 'weekly-challenge');
            this.dm.data.player.coins += challenge.coinReward;

            if (challenge.skillTree) {
                this.progression.awardSkillXP(challenge.skillTree, 100);
            }

            this.dm.saveData();

            return {
                completed: true,
                xpAwarded: xpResult.amount,
                coinsAwarded: challenge.coinReward
            };
        }

        this.dm.saveData();
        return { completed: false, progress: challenge.progress, target: challenge.target };
    }

    // Get all active quests
    getActiveQuests() {
        return {
            daily: this.dm.data.quests.daily,
            weekly: this.dm.data.quests.weekly[0] || null
        };
    }
}
```

### Step 2: Commit quest manager

```bash
git add js/questManager.js
git commit -m "feat: add daily and weekly quest management system"
```

---

## Task 5: Emotion Waves Mini-Game (Surfing Game)

**Goal:** Create therapeutic surfing game where emotions are waves and DBT skills are controls

**Files:**
- Create: `js/minigames/emotionWaves.js`
- Create: `css/minigames.css`

### Step 1: Create mini-game base class

**File: `js/minigames/miniGameBase.js`**

```javascript
// Base class for all mini-games
class MiniGameBase {
    constructor(canvasId, dataManager, progressionEngine) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.dm = dataManager;
        this.progression = progressionEngine;

        this.isRunning = false;
        this.score = 0;
        this.difficulty = 1;

        this.setupCanvas();
    }

    setupCanvas() {
        // Set canvas size
        this.canvas.width = 800;
        this.canvas.height = 600;

        // Handle high DPI displays
        const dpr = window.devicePixelRatio || 1;
        this.canvas.style.width = this.canvas.width + 'px';
        this.canvas.style.height = this.canvas.height + 'px';
        this.canvas.width *= dpr;
        this.canvas.height *= dpr;
        this.ctx.scale(dpr, dpr);
    }

    start() {
        this.isRunning = true;
        this.gameLoop();
    }

    stop() {
        this.isRunning = false;
    }

    gameLoop() {
        if (!this.isRunning) return;

        this.update();
        this.draw();

        requestAnimationFrame(() => this.gameLoop());
    }

    update() {
        // Override in subclass
    }

    draw() {
        // Override in subclass
    }

    endGame() {
        this.stop();
        this.saveScore();
        this.showResults();
    }

    saveScore() {
        // Override in subclass
    }

    showResults() {
        // Override in subclass
    }
}
```

### Step 2: Create Emotion Waves game

**File: `js/minigames/emotionWaves.js`**

```javascript
// Emotion Waves - Surfing game teaching emotion regulation
class EmotionWaves extends MiniGameBase {
    constructor(canvasId, dataManager, progressionEngine) {
        super(canvasId, dataManager, progressionEngine);

        this.player = {
            x: 100,
            y: 300,
            width: 40,
            height: 60,
            velocityY: 0,
            surfboard: '🏄'
        };

        this.waves = [];
        this.skills = {
            TIPP: { name: 'TIPP', cooldown: 0, maxCooldown: 30, active: false, duration: 0 },
            oppositeAction: { name: 'Opposite Action', cooldown: 0, maxCooldown: 40, active: false },
            selfSoothe: { name: 'Self-Soothe', cooldown: 0, maxCooldown: 50, active: false, duration: 0 }
        };

        this.gameTime = 0;
        this.gameDuration = 90; // 90 seconds
        this.score = 0;
        this.wavesSurfed = 0;
        this.skillsUsed = 0;

        this.emotionTypes = [
            { name: 'Sadness', color: '#3B82F6', intensity: 1, emoji: '😢' },
            { name: 'Anger', color: '#EF4444', intensity: 2, emoji: '😠' },
            { name: 'Anxiety', color: '#F59E0B', intensity: 2, emoji: '😰' },
            { name: 'Joy', color: '#10B981', intensity: 1, emoji: '😊' },
            { name: 'Fear', color: '#8B5CF6', intensity: 3, emoji: '😨' }
        ];

        this.setupControls();
    }

    setupControls() {
        document.addEventListener('keydown', (e) => {
            if (!this.isRunning) return;

            switch(e.key) {
                case 'ArrowUp':
                    this.player.velocityY = -5;
                    break;
                case 'ArrowDown':
                    this.player.velocityY = 5;
                    break;
                case '1':
                    this.useSkill('TIPP');
                    break;
                case '2':
                    this.useSkill('oppositeAction');
                    break;
                case '3':
                    this.useSkill('selfSoothe');
                    break;
            }
        });

        document.addEventListener('keyup', (e) => {
            if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
                this.player.velocityY = 0;
            }
        });
    }

    useSkill(skillName) {
        const skill = this.skills[skillName];
        if (skill.cooldown > 0) return;

        skill.active = true;
        skill.cooldown = skill.maxCooldown;
        this.skillsUsed++;

        // Skill effects
        if (skillName === 'TIPP') {
            // Slow motion for 3 seconds
            skill.duration = 90; // 3 seconds at 30 fps
        } else if (skillName === 'oppositeAction') {
            // Reverse closest wave direction
            const closest = this.getClosestWave();
            if (closest) {
                closest.velocityX *= -0.5;
            }
        } else if (skillName === 'selfSoothe') {
            // Shield for 2 seconds
            skill.duration = 60;
        }
    }

    getClosestWave() {
        let closest = null;
        let minDist = Infinity;

        this.waves.forEach(wave => {
            const dist = Math.abs(wave.x - this.player.x);
            if (dist < minDist) {
                minDist = dist;
                closest = wave;
            }
        });

        return closest;
    }

    spawnWave() {
        const emotion = this.emotionTypes[Math.floor(Math.random() * this.emotionTypes.length)];
        const baseHeight = 40 + (emotion.intensity * 20) * this.difficulty;

        this.waves.push({
            x: 800,
            y: 300 + (Math.random() - 0.5) * 200,
            width: 60,
            height: baseHeight,
            velocityX: -2 - (this.difficulty * 0.5),
            emotion: emotion
        });
    }

    update() {
        this.gameTime++;

        // Update player position
        this.player.y += this.player.velocityY;
        this.player.y = Math.max(50, Math.min(550, this.player.y));

        // Spawn waves
        if (this.gameTime % 60 === 0) { // Every 2 seconds
            this.spawnWave();
        }

        // Update skills
        Object.values(this.skills).forEach(skill => {
            if (skill.cooldown > 0) skill.cooldown--;
            if (skill.duration > 0) {
                skill.duration--;
                if (skill.duration === 0) skill.active = false;
            }
        });

        // Slow motion from TIPP
        const timeScale = this.skills.TIPP.active ? 0.3 : 1;

        // Update waves
        for (let i = this.waves.length - 1; i >= 0; i--) {
            const wave = this.waves[i];
            wave.x += wave.velocityX * timeScale;

            // Check collision with player
            if (this.checkCollision(this.player, wave)) {
                if (this.skills.selfSoothe.active) {
                    // Protected by shield - wave passes through
                    this.score += 20;
                } else {
                    // Hit by wave
                    this.score += 10;
                }
                this.wavesSurfed++;
                this.waves.splice(i, 1);
                continue;
            }

            // Remove off-screen waves
            if (wave.x < -100) {
                this.waves.splice(i, 1);
            }
        }

        // Check game end
        if (this.gameTime >= this.gameDuration * 30) { // 30 fps assumption
            this.endGame();
        }
    }

    checkCollision(player, wave) {
        return player.x < wave.x + wave.width &&
               player.x + player.width > wave.x &&
               player.y < wave.y + wave.height &&
               player.y + player.height > wave.y;
    }

    draw() {
        // Clear canvas
        this.ctx.fillStyle = '#E0F2FE';
        this.ctx.fillRect(0, 0, 800, 600);

        // Draw water
        this.ctx.fillStyle = '#BAE6FD';
        this.ctx.fillRect(0, 400, 800, 200);

        // Draw waves
        this.waves.forEach(wave => {
            this.ctx.fillStyle = wave.emotion.color;
            this.ctx.globalAlpha = 0.6;
            this.ctx.fillRect(wave.x, wave.y, wave.width, wave.height);
            this.ctx.globalAlpha = 1;

            // Draw emotion emoji
            this.ctx.font = '30px Arial';
            this.ctx.fillText(wave.emotion.emoji, wave.x + 15, wave.y + 35);
        });

        // Draw player
        this.ctx.font = '40px Arial';
        this.ctx.fillText(this.player.surfboard, this.player.x, this.player.y + 40);

        // Draw shield if active
        if (this.skills.selfSoothe.active) {
            this.ctx.strokeStyle = '#10B981';
            this.ctx.lineWidth = 3;
            this.ctx.beginPath();
            this.ctx.arc(this.player.x + 20, this.player.y + 30, 40, 0, Math.PI * 2);
            this.ctx.stroke();
        }

        // Draw UI
        this.drawUI();
    }

    drawUI() {
        // Score
        this.ctx.fillStyle = '#1F2937';
        this.ctx.font = 'bold 24px Arial';
        this.ctx.fillText(`Score: ${this.score}`, 20, 40);
        this.ctx.fillText(`Waves: ${this.wavesSurfed}`, 20, 70);

        // Time remaining
        const timeLeft = Math.max(0, this.gameDuration - Math.floor(this.gameTime / 30));
        this.ctx.fillText(`Time: ${timeLeft}s`, 650, 40);

        // Skills
        const skillY = 500;
        let skillX = 50;

        Object.entries(this.skills).forEach(([name, skill], index) => {
            const cooldownPercent = skill.cooldown / skill.maxCooldown;

            // Skill box
            this.ctx.fillStyle = skill.cooldown > 0 ? '#9CA3AF' : '#6366F1';
            this.ctx.fillRect(skillX, skillY, 80, 60);

            // Cooldown overlay
            if (skill.cooldown > 0) {
                this.ctx.fillStyle = 'rgba(0,0,0,0.5)';
                this.ctx.fillRect(skillX, skillY + (60 * (1 - cooldownPercent)), 80, 60 * cooldownPercent);
            }

            // Active indicator
            if (skill.active) {
                this.ctx.strokeStyle = '#10B981';
                this.ctx.lineWidth = 4;
                this.ctx.strokeRect(skillX, skillY, 80, 60);
            }

            // Label
            this.ctx.fillStyle = '#FFFFFF';
            this.ctx.font = 'bold 12px Arial';
            this.ctx.fillText(`[${index + 1}] ${skill.name}`, skillX + 5, skillY + 15);

            skillX += 100;
        });

        // Instructions (first 5 seconds)
        if (this.gameTime < 150) {
            this.ctx.fillStyle = 'rgba(0,0,0,0.7)';
            this.ctx.fillRect(200, 200, 400, 200);
            this.ctx.fillStyle = '#FFFFFF';
            this.ctx.font = 'bold 20px Arial';
            this.ctx.fillText('Use ↑↓ to move', 250, 240);
            this.ctx.fillText('[1] TIPP - Slow motion', 250, 280);
            this.ctx.fillText('[2] Opposite Action - Reverse wave', 250, 320);
            this.ctx.fillText('[3] Self-Soothe - Shield', 250, 360);
        }
    }

    saveScore() {
        const gameData = this.dm.data.miniGames.emotionWaves;

        // Update stats
        gameData.timesPlayed++;
        if (this.score > gameData.highScore) {
            gameData.highScore = this.score;
        }

        this.dm.saveData();

        // Award XP
        this.progression.awardXP(75, 'minigame-emotion-waves');
        this.progression.awardSkillXP('emotional', 50);
    }

    showResults() {
        const modal = document.getElementById('modal');
        const modalBody = document.getElementById('modalBody');

        modalBody.innerHTML = `
            <div style="text-align: center;">
                <div style="font-size: 5em; margin-bottom: 20px;">🏄</div>
                <h2>Emotion Waves Complete!</h2>
                <div style="margin: 30px 0;">
                    <div class="stat-box-value" style="font-size: 3em; color: var(--primary);">${this.score}</div>
                    <div>Final Score</div>
                </div>
                <div class="stats-grid" style="text-align: center; margin: 20px 0;">
                    <div>
                        <strong style="font-size: 1.5em;">${this.wavesSurfed}</strong>
                        <div>Waves Surfed</div>
                    </div>
                    <div>
                        <strong style="font-size: 1.5em;">${this.skillsUsed}</strong>
                        <div>Skills Used</div>
                    </div>
                </div>
                <p style="margin: 20px 0;">Great job practicing emotion regulation skills!</p>
                <button class="btn btn-success btn-full" onclick="closeModal()">Continue</button>
            </div>
        `;

        modal.style.display = 'block';
    }
}
```

### Step 3: Add mini-game CSS

**File: `css/minigames.css`**

```css
/* Mini-game container */
.minigame-container {
    background: var(--bg-card);
    border-radius: 15px;
    padding: 20px;
    box-shadow: var(--shadow-lg);
}

.minigame-canvas {
    border: 3px solid var(--border);
    border-radius: 10px;
    display: block;
    margin: 0 auto;
    background: #F0F9FF;
    max-width: 100%;
    height: auto;
}

.minigame-instructions {
    background: var(--bg-main);
    padding: 20px;
    border-radius: 10px;
    margin-bottom: 20px;
}

.minigame-instructions h3 {
    margin-bottom: 10px;
    color: var(--text-dark);
}

.minigame-instructions ul {
    margin-left: 20px;
}

.minigame-controls {
    display: flex;
    gap: 10px;
    justify-content: center;
    margin-top: 20px;
}
```

### Step 4: Commit Emotion Waves

```bash
git add js/minigames/ css/minigames.css
git commit -m "feat: add Emotion Waves mini-game teaching DBT skills"
```

---

## Task 6: Thought Detective Mini-Game

**Goal:** Create detective mystery game teaching cognitive distortion identification

**Files:**
- Create: `js/minigames/thoughtDetective.js`

### Step 1: Create Thought Detective game

**File: `js/minigames/thoughtDetective.js`**

```javascript
// Thought Detective - Mystery game teaching CBT cognitive restructuring
class ThoughtDetective extends MiniGameBase {
    constructor(canvasId, dataManager, progressionEngine) {
        super(canvasId, dataManager, progressionEngine);

        this.currentCase = null;
        this.cases = this.initializeCases();
        this.selectedDistortion = null;
        this.phase = 'intro'; // intro, investigate, identify, reframe, complete

        this.casesCompleted = 0;
        this.accuracy = 0;
    }

    initializeCases() {
        return [
            {
                id: 1,
                scenario: 'Party Scene',
                thought: "Nobody at the party talked to me. I'm completely unlikable.",
                evidence: [
                    { text: 'Two people were in deep conversation when I arrived', helpful: true },
                    { text: 'I was wearing the same shirt as last week', helpful: false },
                    { text: 'Sarah waved at me when she saw me', helpful: true },
                    { text: 'I left early because I felt awkward', helpful: true }
                ],
                correctDistortion: 'all-or-nothing',
                distortions: [
                    { id: 'all-or-nothing', name: 'All-or-Nothing Thinking', hint: 'Using extreme words like "nobody" or "completely"' },
                    { id: 'overgeneralization', name: 'Overgeneralization', hint: 'One event means everything will be this way' },
                    { id: 'mind-reading', name: 'Mind Reading', hint: 'Assuming you know what others think' },
                    { id: 'catastrophizing', name: 'Catastrophizing', hint: 'Expecting the worst possible outcome' }
                ],
                balancedThought: "Some people were busy at the party, but Sarah noticed me. I left early which limited my chances to connect."
            },
            {
                id: 2,
                scenario: 'Work Project',
                thought: "I made one mistake in my presentation. I'm going to get fired.",
                evidence: [
                    { text: 'My boss said the presentation was strong overall', helpful: true },
                    { text: 'I mispronounced a word on slide 7', helpful: true },
                    { text: 'No one has been fired for a small mistake before', helpful: true },
                    { text: 'I keep thinking about it', helpful: false }
                ],
                correctDistortion: 'catastrophizing',
                distortions: [
                    { id: 'all-or-nothing', name: 'All-or-Nothing Thinking', hint: 'Perfect or complete failure' },
                    { id: 'catastrophizing', name: 'Catastrophizing', hint: 'Jumping to the worst outcome' },
                    { id: 'magnification', name: 'Magnification', hint: 'Making small things bigger than they are' },
                    { id: 'fortune-telling', name: 'Fortune Telling', hint: 'Predicting negative futures' }
                ],
                balancedThought: "I made a small mistake, but my boss said the presentation was strong. One mistake doesn't lead to getting fired."
            },
            {
                id: 3,
                scenario: 'Text Message',
                thought: "They haven't responded to my text. They must be mad at me.",
                evidence: [
                    { text: 'They usually respond within an hour', helpful: true },
                    { text: "It's been 3 hours", helpful: true },
                    { text: 'They mentioned being busy with family today', helpful: true },
                    { text: 'Last week they responded right away', helpful: false }
                ],
                correctDistortion: 'mind-reading',
                distortions: [
                    { id: 'mind-reading', name: 'Mind Reading', hint: 'Assuming their thoughts without evidence' },
                    { id: 'personalization', name: 'Personalization', hint: 'Taking responsibility for things outside your control' },
                    { id: 'catastrophizing', name: 'Catastrophizing', hint: 'Expecting the worst' },
                    { id: 'jumping-to-conclusions', name: 'Jumping to Conclusions', hint: 'Deciding without enough information' }
                ],
                balancedThought: "They mentioned being busy today. There are many reasons why someone might not respond right away."
            }
        ];
    }

    start() {
        this.isRunning = true;
        this.loadCase();
    }

    loadCase() {
        // Get random case
        this.currentCase = this.cases[Math.floor(Math.random() * this.cases.length)];
        this.phase = 'intro';
        this.selectedDistortion = null;
        this.draw();
    }

    update() {
        // This game is turn-based, so update is minimal
    }

    draw() {
        // Clear canvas
        this.ctx.fillStyle = '#1F2937';
        this.ctx.fillRect(0, 0, 800, 600);

        // Draw detective aesthetic
        this.drawBackground();

        // Draw phase-specific content
        switch(this.phase) {
            case 'intro':
                this.drawIntro();
                break;
            case 'investigate':
                this.drawInvestigation();
                break;
            case 'identify':
                this.drawIdentification();
                break;
            case 'reframe':
                this.drawReframing();
                break;
        }
    }

    drawBackground() {
        // Noir aesthetic background
        this.ctx.fillStyle = '#374151';
        this.ctx.fillRect(50, 50, 700, 500);

        this.ctx.strokeStyle = '#F59E0B';
        this.ctx.lineWidth = 3;
        this.ctx.strokeRect(50, 50, 700, 500);

        // Detective icon
        this.ctx.font = '40px Arial';
        this.ctx.fillText('🕵️', 360, 100);
    }

    drawIntro() {
        this.ctx.fillStyle = '#F3F4F6';
        this.ctx.font = 'bold 28px Arial';
        this.ctx.fillText('Case #' + this.currentCase.id + ': ' + this.currentCase.scenario, 100, 150);

        this.ctx.font = '18px Arial';
        this.ctx.fillStyle = '#D1D5DB';
        this.ctx.fillText('Detective, we need your help...', 100, 200);

        // Wrap text for thought
        this.ctx.font = 'italic 20px Arial';
        this.ctx.fillStyle = '#FDE047';
        const words = this.currentCase.thought.split(' ');
        let line = '';
        let y = 250;

        words.forEach((word, i) => {
            const testLine = line + word + ' ';
            const metrics = this.ctx.measureText(testLine);
            if (metrics.width > 600 && i > 0) {
                this.ctx.fillText(line, 100, y);
                line = word + ' ';
                y += 30;
            } else {
                line = testLine;
            }
        });
        this.ctx.fillText(line, 100, y);

        // Instructions
        this.ctx.font = '16px Arial';
        this.ctx.fillStyle = '#9CA3AF';
        this.ctx.fillText('Your mission: Find the cognitive distortion and reframe this thought', 100, 420);

        // Start button
        this.drawButton('Start Investigation', 300, 470, 200, 50, () => {
            this.phase = 'investigate';
            this.draw();
        });
    }

    drawInvestigation() {
        this.ctx.fillStyle = '#F3F4F6';
        this.ctx.font = 'bold 24px Arial';
        this.ctx.fillText('Examine the Evidence', 100, 140);

        // Evidence list
        let y = 180;
        this.currentCase.evidence.forEach((evidence, i) => {
            this.ctx.font = '16px Arial';
            this.ctx.fillStyle = evidence.helpful ? '#10B981' : '#6B7280';
            this.ctx.fillText('• ' + evidence.text, 120, y);
            y += 40;
        });

        // Continue button
        this.drawButton('Identify Distortion', 250, 470, 300, 50, () => {
            this.phase = 'identify';
            this.draw();
        });
    }

    drawIdentification() {
        this.ctx.fillStyle = '#F3F4F6';
        this.ctx.font = 'bold 24px Arial';
        this.ctx.fillText('What is the cognitive distortion?', 100, 140);

        // Distortion options
        let y = 200;
        this.currentCase.distortions.forEach((distortion, i) => {
            const isSelected = this.selectedDistortion === distortion.id;
            const isCorrect = distortion.id === this.currentCase.correctDistortion;

            this.drawButton(
                distortion.name,
                100,
                y,
                600,
                50,
                () => {
                    this.selectedDistortion = distortion.id;
                    this.checkAnswer();
                },
                isSelected ? (isCorrect ? '#10B981' : '#EF4444') : '#6366F1'
            );

            y += 70;
        });
    }

    checkAnswer() {
        const correct = this.selectedDistortion === this.currentCase.correctDistortion;

        this.casesCompleted++;
        if (correct) {
            this.accuracy++;
            this.score += 100;
        } else {
            this.score += 20; // Partial credit for trying
        }

        setTimeout(() => {
            this.phase = 'reframe';
            this.draw();
        }, 1000);
    }

    drawReframing() {
        const correct = this.selectedDistortion === this.currentCase.correctDistortion;

        this.ctx.fillStyle = '#F3F4F6';
        this.ctx.font = 'bold 24px Arial';
        this.ctx.fillText(correct ? 'Correct! 🎉' : 'Not quite...', 100, 140);

        // Show balanced thought
        this.ctx.font = 'bold 20px Arial';
        this.ctx.fillText('Balanced Thought:', 100, 200);

        this.ctx.font = 'italic 18px Arial';
        this.ctx.fillStyle = '#10B981';
        const words = this.currentCase.balancedThought.split(' ');
        let line = '';
        let y = 240;

        words.forEach((word, i) => {
            const testLine = line + word + ' ';
            const metrics = this.ctx.measureText(testLine);
            if (metrics.width > 600 && i > 0) {
                this.ctx.fillText(line, 100, y);
                line = word + ' ';
                y += 30;
            } else {
                line = testLine;
            }
        });
        this.ctx.fillText(line, 100, y);

        // Next buttons
        this.drawButton('Next Case', 100, 470, 250, 50, () => {
            this.loadCase();
        });

        this.drawButton('Finish', 400, 470, 250, 50, () => {
            this.endGame();
        });
    }

    drawButton(text, x, y, width, height, onClick, color = '#6366F1') {
        this.ctx.fillStyle = color;
        this.ctx.fillRect(x, y, width, height);

        this.ctx.fillStyle = '#FFFFFF';
        this.ctx.font = 'bold 18px Arial';
        const textWidth = this.ctx.measureText(text).width;
        this.ctx.fillText(text, x + (width - textWidth) / 2, y + height / 2 + 6);

        // Store button for click detection
        if (!this.buttons) this.buttons = [];
        this.buttons.push({ x, y, width, height, onClick });
    }

    saveScore() {
        const gameData = this.dm.data.miniGames.thoughtDetective;

        gameData.casesCompleted += this.casesCompleted;
        gameData.accuracy = Math.round((this.accuracy / this.casesCompleted) * 100);

        this.dm.saveData();

        // Award XP
        this.progression.awardXP(75, 'minigame-thought-detective');
        this.progression.awardSkillXP('emotional', 50);
    }

    showResults() {
        const accuracyPercent = Math.round((this.accuracy / this.casesCompleted) * 100);

        const modal = document.getElementById('modal');
        const modalBody = document.getElementById('modalBody');

        modalBody.innerHTML = `
            <div style="text-align: center;">
                <div style="font-size: 5em; margin-bottom: 20px;">🕵️</div>
                <h2>Case Closed!</h2>
                <div class="stats-grid" style="text-align: center; margin: 20px 0;">
                    <div>
                        <strong style="font-size: 2em;">${this.casesCompleted}</strong>
                        <div>Cases Solved</div>
                    </div>
                    <div>
                        <strong style="font-size: 2em;">${accuracyPercent}%</strong>
                        <div>Accuracy</div>
                    </div>
                </div>
                <p style="margin: 20px 0;">Excellent work identifying cognitive distortions!</p>
                <button class="btn btn-success btn-full" onclick="closeModal()">Continue</button>
            </div>
        `;

        modal.style.display = 'block';
    }
}
```

### Step 2: Add click handler for buttons

Update HTML to include click detection on canvas:

```javascript
// Add to initialization
canvas.addEventListener('click', (e) => {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Check button clicks
    game.buttons?.forEach(button => {
        if (x >= button.x && x <= button.x + button.width &&
            y >= button.y && y <= button.y + button.height) {
            button.onClick();
        }
    });
});
```

### Step 3: Commit Thought Detective

```bash
git add js/minigames/thoughtDetective.js
git commit -m "feat: add Thought Detective mini-game teaching CBT"
```

---

## Task 7: Mindfulness Garden Mini-Game

**Goal:** Create peaceful meditation space that grows based on mindfulness practice

**Files:**
- Create: `js/minigames/mindfulnessGarden.js`

### Step 1: Create Mindfulness Garden game

**File: `js/minigames/mindfulnessGarden.js`**

```javascript
// Mindfulness Garden - Peaceful meditation space
class MindfulnessGarden extends MiniGameBase {
    constructor(canvasId, dataManager, progressionEngine) {
        super(canvasId, dataManager, progressionEngine);

        this.gardenData = this.dm.data.miniGames.mindfulnessGarden;
        this.plants = this.loadPlants();
        this.mode = 'menu'; // menu, breathing, bodyscan, meditation
        this.exerciseTimer = 0;
        this.exerciseDuration = 300; // 5 minutes in seconds
        this.breathPhase = 'inhale'; // inhale, hold, exhale
        this.breathTimer = 0;
    }

    loadPlants() {
        // Load from saved data or create new
        const saved = this.dm.get('miniGames.mindfulnessGarden.plants') || [];
        if (saved.length === 0) {
            // Start with one small plant
            return [{
                type: 'flower',
                growth: 0.1,
                x: 400,
                y: 300,
                emoji: '🌱'
            }];
        }
        return saved;
    }

    start() {
        this.isRunning = true;
        this.draw();
    }

    update() {
        if (this.mode === 'breathing') {
            this.updateBreathing();
        } else if (this.mode === 'bodyscan' || this.mode === 'meditation') {
            this.exerciseTimer++;

            if (this.exerciseTimer >= this.exerciseDuration * 30) { // 30 fps
                this.completeExercise();
            }
        }
    }

    updateBreathing() {
        this.breathTimer++;

        const patterns = {
            inhale: 4 * 30,  // 4 seconds
            hold: 7 * 30,    // 7 seconds
            exhale: 8 * 30   // 8 seconds
        };

        switch(this.breathPhase) {
            case 'inhale':
                if (this.breathTimer >= patterns.inhale) {
                    this.breathPhase = 'hold';
                    this.breathTimer = 0;
                }
                break;
            case 'hold':
                if (this.breathTimer >= patterns.hold) {
                    this.breathPhase = 'exhale';
                    this.breathTimer = 0;
                }
                break;
            case 'exhale':
                if (this.breathTimer >= patterns.exhale) {
                    this.breathPhase = 'inhale';
                    this.breathTimer = 0;
                    this.exerciseTimer++;

                    // Complete after 4 cycles (about 80 seconds)
                    if (this.exerciseTimer >= 4) {
                        this.completeExercise();
                    }
                }
                break;
        }
    }

    completeExercise() {
        // Grow plants
        this.plants.forEach(plant => {
            plant.growth = Math.min(1, plant.growth + 0.2);

            // Evolve plant as it grows
            if (plant.growth >= 1 && plant.emoji === '🌱') {
                plant.emoji = '🌻'; // Flower blooms
            }
        });

        // Add new plant sometimes
        if (this.plants.length < 10 && Math.random() > 0.5) {
            this.plants.push({
                type: 'flower',
                growth: 0.1,
                x: 200 + Math.random() * 400,
                y: 350 + Math.random() * 100,
                emoji: '🌱'
            });
        }

        // Save progress
        this.dm.set('miniGames.mindfulnessGarden.plants', this.plants);
        this.gardenData.plantsGrown++;
        this.gardenData.minutesMeditated += Math.floor(this.exerciseDuration / 60);

        // Award XP
        this.progression.awardXP(75, 'minigame-mindfulness-garden');
        this.progression.awardSkillXP('mindfulness', 50);

        this.dm.saveData();

        // Return to menu
        this.mode = 'menu';
        this.exerciseTimer = 0;
        this.breathTimer = 0;
    }

    draw() {
        // Sky gradient
        const gradient = this.ctx.createLinearGradient(0, 0, 0, 600);
        gradient.addColorStop(0, '#E0F2FE');
        gradient.addColorStop(1, '#BAE6FD');
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, 800, 600);

        // Ground
        this.ctx.fillStyle = '#86EFAC';
        this.ctx.fillRect(0, 350, 800, 250);

        // Draw plants
        this.plants.forEach(plant => {
            const size = 20 + (plant.growth * 60);
            this.ctx.font = `${size}px Arial`;
            this.ctx.fillText(plant.emoji, plant.x, plant.y);
        });

        // Draw mode-specific content
        switch(this.mode) {
            case 'menu':
                this.drawMenu();
                break;
            case 'breathing':
                this.drawBreathing();
                break;
            case 'bodyscan':
                this.drawBodyScan();
                break;
            case 'meditation':
                this.drawMeditation();
                break;
        }
    }

    drawMenu() {
        // Title
        this.ctx.fillStyle = '#1F2937';
        this.ctx.font = 'bold 32px Arial';
        this.ctx.fillText('Mindfulness Garden', 250, 60);

        // Stats
        this.ctx.font = '18px Arial';
        this.ctx.fillText(`Plants: ${this.plants.length}`, 320, 100);
        this.ctx.fillText(`Minutes: ${this.gardenData.minutesMeditated}`, 480, 100);

        // Exercise buttons
        this.buttons = [];

        this.drawButton('🌬️ Breathing (4-7-8)', 250, 180, 300, 60, () => {
            this.mode = 'breathing';
            this.breathPhase = 'inhale';
            this.breathTimer = 0;
            this.exerciseTimer = 0;
        });

        this.drawButton('🧘 Body Scan (5 min)', 250, 260, 300, 60, () => {
            this.mode = 'bodyscan';
            this.exerciseTimer = 0;
        });

        this.drawButton('✨ Meditation (5 min)', 250, 340, 300, 60, () => {
            this.mode = 'meditation';
            this.exerciseTimer = 0;
        });

        this.drawButton('Exit', 350, 500, 100, 40, () => {
            this.endGame();
        }, '#6B7280');
    }

    drawBreathing() {
        // Breathing circle
        const centerX = 400;
        const centerY = 250;
        const baseRadius = 80;

        // Animate radius based on breath phase
        let radius = baseRadius;
        let instruction = '';
        let color = '#3B82F6';

        const progress = this.breathTimer / (this.breathPhase === 'inhale' ? 120 : this.breathPhase === 'hold' ? 210 : 240);

        if (this.breathPhase === 'inhale') {
            radius = baseRadius + (40 * progress);
            instruction = 'Inhale...';
            color = '#3B82F6';
        } else if (this.breathPhase === 'hold') {
            radius = baseRadius + 40;
            instruction = 'Hold...';
            color = '#F59E0B';
        } else {
            radius = baseRadius + 40 - (40 * progress);
            instruction = 'Exhale...';
            color = '#10B981';
        }

        // Draw circle
        this.ctx.beginPath();
        this.ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        this.ctx.fillStyle = color;
        this.ctx.globalAlpha = 0.3;
        this.ctx.fill();
        this.ctx.globalAlpha = 1;

        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = 4;
        this.ctx.stroke();

        // Instruction
        this.ctx.fillStyle = '#1F2937';
        this.ctx.font = 'bold 36px Arial';
        const textWidth = this.ctx.measureText(instruction).width;
        this.ctx.fillText(instruction, centerX - textWidth / 2, centerY + 10);

        // Progress
        this.ctx.font = '20px Arial';
        this.ctx.fillText(`Cycle ${this.exerciseTimer + 1}/4`, 340, 450);

        // Exit button
        this.buttons = [];
        this.drawButton('Exit', 350, 500, 100, 40, () => {
            this.mode = 'menu';
        }, '#6B7280');
    }

    drawBodyScan() {
        // Body illustration
        this.ctx.font = '120px Arial';
        this.ctx.fillText('🧘', 320, 200);

        // Instructions
        const timeLeft = Math.max(0, this.exerciseDuration - Math.floor(this.exerciseTimer / 30));
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;

        this.ctx.fillStyle = '#1F2937';
        this.ctx.font = 'bold 28px Arial';
        this.ctx.fillText('Body Scan Meditation', 250, 280);

        this.ctx.font = '20px Arial';
        this.ctx.fillStyle = '#6B7280';
        this.ctx.fillText('Notice sensations in your body', 250, 320);
        this.ctx.fillText('From your toes to your head', 260, 350);
        this.ctx.fillText('Without judgment', 320, 380);

        // Timer
        this.ctx.font = 'bold 32px Arial';
        this.ctx.fillStyle = '#3B82F6';
        this.ctx.fillText(`${minutes}:${seconds.toString().padStart(2, '0')}`, 350, 450);

        // Exit button
        this.buttons = [];
        this.drawButton('Exit', 350, 500, 100, 40, () => {
            this.completeExercise();
        }, '#6B7280');
    }

    drawMeditation() {
        // Peaceful scene
        this.ctx.font = '80px Arial';
        this.ctx.fillText('🌅', 340, 150);

        // Instructions
        const timeLeft = Math.max(0, this.exerciseDuration - Math.floor(this.exerciseTimer / 30));
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;

        this.ctx.fillStyle = '#1F2937';
        this.ctx.font = 'bold 28px Arial';
        this.ctx.fillText('Open Meditation', 300, 240);

        this.ctx.font = '20px Arial';
        this.ctx.fillStyle = '#6B7280';
        this.ctx.fillText('Let your thoughts come and go', 240, 280);
        this.ctx.fillText('Like clouds in the sky', 290, 310);
        this.ctx.fillText('Rest in awareness', 310, 340);

        // Timer
        this.ctx.font = 'bold 32px Arial';
        this.ctx.fillStyle = '#8B5CF6';
        this.ctx.fillText(`${minutes}:${seconds.toString().padStart(2, '0')}`, 350, 420);

        // Exit button
        this.buttons = [];
        this.drawButton('Exit', 350, 500, 100, 40, () => {
            this.completeExercise();
        }, '#6B7280');
    }

    drawButton(text, x, y, width, height, onClick, color = '#6366F1') {
        this.ctx.fillStyle = color;
        this.ctx.fillRect(x, y, width, height);

        this.ctx.fillStyle = '#FFFFFF';
        this.ctx.font = 'bold 18px Arial';
        const textWidth = this.ctx.measureText(text).width;
        this.ctx.fillText(text, x + (width - textWidth) / 2, y + height / 2 + 6);

        if (!this.buttons) this.buttons = [];
        this.buttons.push({ x, y, width, height, onClick });
    }

    endGame() {
        this.stop();
        this.showResults();
    }

    showResults() {
        const modal = document.getElementById('modal');
        const modalBody = document.getElementById('modalBody');

        modalBody.innerHTML = `
            <div style="text-align: center;">
                <div style="font-size: 5em; margin-bottom: 20px;">🧘</div>
                <h2>Mindfulness Practice Complete</h2>
                <div class="stats-grid" style="text-align: center; margin: 20px 0;">
                    <div>
                        <strong style="font-size: 2em;">${this.plants.length}</strong>
                        <div>Plants in Garden</div>
                    </div>
                    <div>
                        <strong style="font-size: 2em;">${this.gardenData.minutesMeditated}</strong>
                        <div>Total Minutes</div>
                    </div>
                </div>
                <p style="margin: 20px 0;">Your garden grows with each practice!</p>
                <button class="btn btn-success btn-full" onclick="closeModal()">Continue</button>
            </div>
        `;

        modal.style.display = 'block';
    }
}
```

### Step 2: Commit Mindfulness Garden

```bash
git add js/minigames/mindfulnessGarden.js
git commit -m "feat: add Mindfulness Garden mini-game for meditation"
```

---

## Task 8: Avatar Customization System

**Goal:** Build avatar creator with 50 unlockable items

**Files:**
- Create: `js/avatarSystem.js`
- Create: `assets/avatar-data.json`

### Step 1: Create avatar data structure

**File: `assets/avatar-data.json`**

```json
{
  "bodyTypes": [
    { "id": 0, "name": "Type A", "unlocked": true },
    { "id": 1, "name": "Type B", "unlocked": true },
    { "id": 2, "name": "Type C", "unlocked": true }
  ],
  "skinTones": [
    { "id": 0, "color": "#FFDBB5", "name": "Light", "unlocked": true },
    { "id": 1, "color": "#E8B895", "name": "Medium Light", "unlocked": true },
    { "id": 2, "color": "#D4A276", "name": "Medium", "unlocked": true },
    { "id": 3, "color": "#B87D4B", "name": "Medium Dark", "unlocked": true },
    { "id": 4, "color": "#8B5A2B", "name": "Dark", "unlocked": true }
  ],
  "hairStyles": [
    { "id": 0, "emoji": "👱", "name": "Short", "unlocked": true },
    { "id": 1, "emoji": "👩", "name": "Long", "unlocked": true },
    { "id": 2, "emoji": "🧑\u200d🦱", "name": "Curly", "unlocked": true },
    { "id": 3, "emoji": "👨\u200d🦲", "name": "Bald", "unlocked": true }
  ],
  "clothing": [
    {
      "id": "starter-tshirt",
      "name": "Basic T-Shirt",
      "emoji": "👕",
      "category": "casual",
      "cost": 0,
      "unlocked": true
    },
    {
      "id": "warrior-armor",
      "name": "Warrior Armor",
      "emoji": "🛡️",
      "category": "warrior",
      "cost": 200,
      "requiredLevel": 5,
      "unlocked": false
    },
    {
      "id": "healer-robe",
      "name": "Healer Robe",
      "emoji": "🧘",
      "category": "healer",
      "cost": 200,
      "requiredLevel": 5,
      "unlocked": false
    },
    {
      "id": "hoodie",
      "name": "Comfy Hoodie",
      "emoji": "🧥",
      "category": "casual",
      "cost": 100,
      "requiredLevel": 3,
      "unlocked": false
    },
    {
      "id": "formal-suit",
      "name": "Formal Suit",
      "emoji": "🤵",
      "category": "formal",
      "cost": 300,
      "requiredLevel": 10,
      "unlocked": false
    }
  ],
  "accessories": [
    {
      "id": "glasses",
      "name": "Glasses",
      "emoji": "👓",
      "cost": 50,
      "requiredLevel": 1,
      "unlocked": false
    },
    {
      "id": "crown",
      "name": "Crown",
      "emoji": "👑",
      "cost": 500,
      "requiredLevel": 20,
      "unlocked": false
    },
    {
      "id": "headphones",
      "name": "Headphones",
      "emoji": "🎧",
      "cost": 150,
      "requiredLevel": 7,
      "unlocked": false
    }
  ],
  "backgrounds": [
    {
      "id": "default",
      "name": "Sky",
      "gradient": ["#E0F2FE", "#BAE6FD"],
      "cost": 0,
      "unlocked": true
    },
    {
      "id": "forest",
      "name": "Forest",
      "gradient": ["#86EFAC", "#4ADE80"],
      "cost": 200,
      "requiredLevel": 10,
      "unlocked": false
    },
    {
      "id": "sunset",
      "name": "Sunset",
      "gradient": ["#FCA5A5", "#F59E0B"],
      "cost": 300,
      "requiredLevel": 15,
      "unlocked": false
    }
  ]
}
```

### Step 2: Create avatar system

**File: `js/avatarSystem.js`**

```javascript
// Avatar System - Character customization
class AvatarSystem {
    constructor(dataManager, progressionEngine) {
        this.dm = dataManager;
        this.progression = progressionEngine;
        this.avatarData = null;
        this.loadAvatarData();
    }

    async loadAvatarData() {
        try {
            const response = await fetch('assets/avatar-data.json');
            this.avatarData = await response.json();
        } catch (error) {
            console.error('Error loading avatar data:', error);
            this.avatarData = this.getDefaultAvatarData();
        }
    }

    getDefaultAvatarData() {
        // Fallback if JSON fails to load
        return {
            bodyTypes: [{ id: 0, name: 'Default', unlocked: true }],
            skinTones: [{ id: 0, color: '#FFDBB5', name: 'Light', unlocked: true }],
            hairStyles: [{ id: 0, emoji: '👱', name: 'Short', unlocked: true }],
            clothing: [{ id: 'starter-tshirt', name: 'T-Shirt', emoji: '👕', cost: 0, unlocked: true }],
            accessories: [],
            backgrounds: [{ id: 'default', name: 'Sky', gradient: ['#E0F2FE', '#BAE6FD'], cost: 0, unlocked: true }]
        };
    }

    // Get current avatar configuration
    getCurrentAvatar() {
        return this.dm.data.avatar;
    }

    // Update avatar part
    updateAvatar(part, value) {
        this.dm.data.avatar[part] = value;
        this.dm.saveData();
    }

    // Get available items for shop
    getShopItems() {
        if (!this.avatarData) return { clothing: [], accessories: [], backgrounds: [] };

        const playerLevel = this.dm.data.player.level;
        const playerCoins = this.dm.data.player.coins;
        const inventory = this.dm.data.inventory.unlockedItems;

        const filterItems = (items) => {
            return items.map(item => ({
                ...item,
                canAfford: playerCoins >= item.cost,
                meetsLevel: !item.requiredLevel || playerLevel >= item.requiredLevel,
                isOwned: inventory.includes(item.id),
                isEquipped: this.isEquipped(item.id)
            }));
        };

        return {
            clothing: filterItems(this.avatarData.clothing),
            accessories: filterItems(this.avatarData.accessories),
            backgrounds: filterItems(this.avatarData.backgrounds)
        };
    }

    // Check if item is equipped
    isEquipped(itemId) {
        const avatar = this.dm.data.avatar;
        return avatar.clothing.includes(itemId) ||
               avatar.accessories.includes(itemId) ||
               avatar.background === itemId;
    }

    // Purchase item
    purchaseItem(itemId, cost) {
        const playerCoins = this.dm.data.player.coins;

        if (playerCoins < cost) {
            return { success: false, message: 'Not enough coins!' };
        }

        // Deduct coins
        this.dm.data.player.coins -= cost;

        // Add to inventory
        this.dm.data.inventory.unlockedItems.push(itemId);

        this.dm.saveData();

        return { success: true, message: 'Item purchased!' };
    }

    // Equip item
    equipItem(itemId, category) {
        const inventory = this.dm.data.inventory.unlockedItems;

        if (!inventory.includes(itemId)) {
            return { success: false, message: 'Item not owned!' };
        }

        const avatar = this.dm.data.avatar;

        if (category === 'clothing') {
            // Can wear multiple clothing items
            if (!avatar.clothing.includes(itemId)) {
                avatar.clothing.push(itemId);
            }
        } else if (category === 'accessory') {
            // Can wear multiple accessories
            if (!avatar.accessories.includes(itemId)) {
                avatar.accessories.push(itemId);
            }
        } else if (category === 'background') {
            // Only one background
            avatar.background = itemId;
        }

        this.dm.saveData();

        return { success: true, message: 'Item equipped!' };
    }

    // Unequip item
    unequipItem(itemId, category) {
        const avatar = this.dm.data.avatar;

        if (category === 'clothing') {
            avatar.clothing = avatar.clothing.filter(id => id !== itemId);
        } else if (category === 'accessory') {
            avatar.accessories = avatar.accessories.filter(id => id !== itemId);
        } else if (category === 'background') {
            avatar.background = 'default';
        }

        this.dm.saveData();

        return { success: true, message: 'Item unequipped!' };
    }

    // Render avatar (for display in UI)
    renderAvatar(canvasId, size = 200) {
        const canvas = document.getElementById(canvasId);
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        canvas.width = size;
        canvas.height = size;

        const avatar = this.getCurrentAvatar();

        // Draw background
        const bgData = this.avatarData?.backgrounds.find(b => b.id === avatar.background);
        if (bgData) {
            const gradient = ctx.createLinearGradient(0, 0, 0, size);
            gradient.addColorStop(0, bgData.gradient[0]);
            gradient.addColorStop(1, bgData.gradient[1]);
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, size, size);
        }

        // Draw body (circle with skin tone)
        ctx.fillStyle = this.avatarData?.skinTones[avatar.skinTone]?.color || '#FFDBB5';
        ctx.beginPath();
        ctx.arc(size / 2, size / 2, size / 3, 0, Math.PI * 2);
        ctx.fill();

        // Draw hair
        const hairData = this.avatarData?.hairStyles[avatar.hairStyle];
        if (hairData) {
            ctx.font = `${size / 3}px Arial`;
            ctx.fillText(hairData.emoji, size / 3, size / 3);
        }

        // Draw clothing
        avatar.clothing.forEach(itemId => {
            const item = this.avatarData?.clothing.find(c => c.id === itemId);
            if (item) {
                ctx.font = `${size / 4}px Arial`;
                ctx.fillText(item.emoji, size / 2.5, size / 1.5);
            }
        });

        // Draw accessories
        avatar.accessories.forEach(itemId => {
            const item = this.avatarData?.accessories.find(a => a.id === itemId);
            if (item) {
                ctx.font = `${size / 5}px Arial`;
                ctx.fillText(item.emoji, size / 1.8, size / 2.5);
            }
        });
    }
}
```

### Step 3: Commit avatar system

```bash
git add js/avatarSystem.js assets/avatar-data.json
git commit -m "feat: add avatar customization system with shop"
```

---

## Task 9-10: Lifestyle Quests (Sleep & Movement)

**Goal:** Implement sleep and movement quest chains

**Files:**
- Create: `js/lifestyleQuests.js`

### Step 1: Create lifestyle quest system

**File: `js/lifestyleQuests.js`**

```javascript
// Lifestyle Quests - Sleep and Movement quest chains
class LifestyleQuests {
    constructor(dataManager, progressionEngine, questManager) {
        this.dm = dataManager;
        this.progression = progressionEngine;
        this.quests = questManager;

        this.sleepQuests = this.initializeSleepQuests();
        this.movementQuests = this.initializeMovementQuests();
    }

    initializeSleepQuests() {
        return [
            // Week 1: Foundation
            {
                id: 'sleep-week1-day1',
                title: 'Sleep Awareness',
                description: 'Log what time you went to bed and woke up',
                week: 1,
                day: 1,
                xpReward: 25,
                coinReward: 10
            },
            {
                id: 'sleep-week1-day2',
                title: 'Sleep Quality Check',
                description: 'Rate your sleep quality (1-10)',
                week: 1,
                day: 2,
                xpReward: 25,
                coinReward: 10
            },
            {
                id: 'sleep-week1-day3',
                title: 'Set Bedtime Alarm',
                description: 'Set a consistent bedtime alarm for tonight',
                week: 1,
                day: 3,
                xpReward: 50,
                coinReward: 10
            },
            // Week 2: Screen-Free Challenge
            {
                id: 'sleep-week2-day1',
                title: 'Screen-Free Hour',
                description: 'No screens 1 hour before bed',
                week: 2,
                day: 1,
                xpReward: 50,
                coinReward: 15
            },
            // Add more sleep quests...
        ];
    }

    initializeMovementQuests() {
        return [
            {
                id: 'move-explore-1',
                title: 'Neighborhood Explorer',
                description: 'Walk for 10 minutes and notice something new',
                xpReward: 50,
                coinReward: 10,
                category: 'exploration'
            },
            {
                id: 'move-stretch-1',
                title: 'Morning Stretch',
                description: 'Complete a 5-minute stretching routine',
                xpReward: 50,
                coinReward: 10,
                category: 'flexibility'
            },
            {
                id: 'move-dance-1',
                title: 'Dance Break',
                description: 'Move to music for 3 minutes',
                xpReward: 50,
                coinReward: 10,
                category: 'fun'
            },
            {
                id: 'move-nature-1',
                title: 'Nature Connection',
                description: 'Go outside and observe nature for 5 minutes',
                xpReward: 50,
                coinReward: 10,
                category: 'mindful'
            }
        ];
    }

    // Start sleep quest chain
    startSleepChallenge() {
        const progress = this.dm.get('lifestyleQuests.sleepProgress') || { week: 1, day: 1, completed: [] };

        const currentQuest = this.sleepQuests.find(q => q.week === progress.week && q.day === progress.day);

        return currentQuest;
    }

    // Complete sleep quest
    completeSleepQuest(questId, data) {
        const quest = this.sleepQuests.find(q => q.id === questId);
        if (!quest) return { success: false };

        // Award rewards
        this.progression.awardXP(quest.xpReward, 'sleep-quest');
        this.progression.awardSkillXP('physical', 25);
        this.dm.data.player.coins += quest.coinReward;

        // Save sleep data
        if (!this.dm.data.lifestyleQuests) {
            this.dm.data.lifestyleQuests = { sleepProgress: { week: 1, day: 1, completed: [], sleepLog: [] } };
        }

        this.dm.data.lifestyleQuests.sleepProgress.completed.push({
            questId,
            completedAt: new Date().toISOString(),
            data
        });

        // Log sleep data
        this.dm.data.lifestyleQuests.sleepProgress.sleepLog.push({
            date: new Date().toISOString(),
            ...data
        });

        // Advance to next day
        this.dm.data.lifestyleQuests.sleepProgress.day++;

        // Advance to next week if needed
        if (this.dm.data.lifestyleQuests.sleepProgress.day > 7) {
            this.dm.data.lifestyleQuests.sleepProgress.week++;
            this.dm.data.lifestyleQuests.sleepProgress.day = 1;
        }

        this.dm.saveData();

        return { success: true, xpAwarded: quest.xpReward, coinsAwarded: quest.coinReward };
    }

    // Get random movement quest
    getMovementQuest() {
        const available = this.movementQuests.filter(q => {
            const completed = this.dm.get('lifestyleQuests.movementCompleted') || [];
            return !completed.includes(q.id);
        });

        if (available.length === 0) {
            // Reset if all completed
            this.dm.set('lifestyleQuests.movementCompleted', []);
            return this.movementQuests[0];
        }

        return available[Math.floor(Math.random() * available.length)];
    }

    // Complete movement quest
    completeMovementQuest(questId) {
        const quest = this.movementQuests.find(q => q.id === questId);
        if (!quest) return { success: false };

        // Award rewards
        this.progression.awardXP(quest.xpReward, 'movement-quest');
        this.progression.awardSkillXP('physical', 25);
        this.dm.data.player.coins += quest.coinReward;

        // Mark as completed
        const completed = this.dm.get('lifestyleQuests.movementCompleted') || [];
        completed.push(questId);
        this.dm.set('lifestyleQuests.movementCompleted', completed);

        // Log activity
        if (!this.dm.data.lifestyleQuests) {
            this.dm.data.lifestyleQuests = { movementLog: [] };
        }
        if (!this.dm.data.lifestyleQuests.movementLog) {
            this.dm.data.lifestyleQuests.movementLog = [];
        }

        this.dm.data.lifestyleQuests.movementLog.push({
            questId,
            completedAt: new Date().toISOString()
        });

        this.dm.saveData();

        return { success: true, xpAwarded: quest.xpReward, coinsAwarded: quest.coinReward };
    }
}
```

### Step 2: Commit lifestyle quests

```bash
git add js/lifestyleQuests.js
git commit -m "feat: add sleep and movement lifestyle quest chains"
```

---

## Task 11: Integration & Main App Assembly

**Goal:** Integrate all systems into main HTML file and create UI

**Files:**
- Modify: `mindcare-between-sessions.html`
- Create: `js/app.js` (main application controller)

### Step 1: Create main app controller

**File: `js/app.js`**

```javascript
// Main Application Controller
class MindCareApp {
    constructor() {
        this.dm = null;
        this.progression = null;
        this.archetypes = null;
        this.story = null;
        this.quests = null;
        this.avatar = null;
        this.lifestyle = null;

        this.initialize();
    }

    async initialize() {
        // Initialize core systems
        this.dm = new DataManager();
        this.progression = new ProgressionEngine(this.dm);
        this.archetypes = new ArchetypeSystem(this.dm);
        this.story = new StoryEngine(this.dm, this.archetypes);
        this.quests = new QuestManager(this.dm, this.progression);
        this.avatar = new AvatarSystem(this.dm, this.progression);
        this.lifestyle = new LifestyleQuests(this.dm, this.progression, this.quests);

        // Set up event listeners
        this.progression.onLevelUp((newLevel, oldLevel, rewards) => {
            this.showLevelUpModal(newLevel, rewards);
        });

        this.progression.onXPGain((amount, source, bonusMultiplier) => {
            this.showXPNotification(amount, bonusMultiplier);
        });

        // Check if first time user
        if (!this.archetypes.hasChosenArchetype()) {
            this.showArchetypeSelection();
        } else {
            this.loadDashboard();
        }

        // Generate daily quests
        this.quests.generateDailyQuests();
        this.quests.generateWeeklyChallenge();

        // Render UI
        this.renderUI();
    }

    showArchetypeSelection() {
        const modal = document.getElementById('modal');
        const modalBody = document.getElementById('modalBody');

        const archetypes = this.archetypes.getAllArchetypes();

        modalBody.innerHTML = `
            <h2>Choose Your Path</h2>
            <p style="margin: 20px 0; color: var(--text-medium);">
                Select a character archetype that resonates with you. This will shape your journey's narrative.
            </p>
            <div class="grid-2">
                ${archetypes.map(arch => `
                    <div class="education-card" onclick="app.selectArchetype('${arch.id}')" style="cursor: pointer;">
                        <div class="education-header" style="background: linear-gradient(135deg, ${arch.primaryColor}, ${arch.secondaryColor});">
                            <div class="education-icon" style="font-size: 4em;">${arch.id === 'warrior' ? '⚔️' : '🌿'}</div>
                            <div class="education-title" style="color: white;">${arch.name}</div>
                            <div class="education-subtitle" style="color: white; opacity: 0.9;">${arch.theme}</div>
                        </div>
                        <div class="education-body">
                            <p>${arch.description}</p>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;

        modal.style.display = 'block';
    }

    selectArchetype(archetypeId) {
        const result = this.archetypes.chooseArchetype(archetypeId);

        if (result.success) {
            closeModal();
            this.loadDashboard();
            this.showWelcomeMessage(result.archetype);
        }
    }

    showWelcomeMessage(archetype) {
        showModal('Welcome!', `
            <div style="text-align: center;">
                <div style="font-size: 5em; margin-bottom: 20px;">${archetype.id === 'warrior' ? '⚔️' : '🌿'}</div>
                <h2>${archetype.name}</h2>
                <p style="margin: 20px 0;">${this.archetypes.getEncouragementMessage()}</p>
                <p style="color: var(--text-medium);">Your journey begins now!</p>
                <button class="btn btn-success btn-full" style="margin-top: 25px;" onclick="closeModal()">
                    Begin
                </button>
            </div>
        `);
    }

    loadDashboard() {
        // Update header stats
        const player = this.dm.data.player;
        const levelInfo = this.progression.getLevelInfo();

        document.getElementById('headerStreak').textContent = this.dm.data.stats.streak;
        document.getElementById('headerLevel').textContent = player.level;
        document.getElementById('headerXP').textContent = `${levelInfo.xp}/${levelInfo.xpRequired}`;
        document.getElementById('headerCoins').textContent = player.coins;

        // Render daily quests
        this.renderDailyQuests();

        // Render avatar
        this.avatar.renderAvatar('avatarCanvas', 150);
    }

    renderDailyQuests() {
        const quests = this.quests.getActiveQuests();
        const container = document.getElementById('dailyQuestsList');

        container.innerHTML = quests.daily.map(quest => `
            <div class="checklist-item ${quest.completed ? 'checked' : ''}" onclick="app.completeQuest('${quest.id}')">
                <div class="checkbox">${quest.completed ? '✓' : ''}</div>
                <div class="checklist-label">
                    <strong>${quest.title}</strong>
                    <div style="font-size: 0.9em; color: var(--text-medium);">${quest.description}</div>
                </div>
                <div style="margin-left: auto; display: flex; gap: 10px;">
                    <span class="badge badge-primary">${quest.xpReward} XP</span>
                    <span class="badge badge-warning">${quest.coinReward} coins</span>
                </div>
            </div>
        `).join('');
    }

    completeQuest(questId) {
        const result = this.quests.completeDailyQuest(questId);

        if (result.success) {
            this.renderDailyQuests();

            if (result.allDailyCompleted) {
                showModal('All Daily Quests Complete!', `
                    <div style="text-align: center;">
                        <div style="font-size: 5em;">🎉</div>
                        <h2>Amazing Work!</h2>
                        <p style="margin: 20px 0;">You completed all your daily quests!</p>
                        <button class="btn btn-success btn-full" onclick="closeModal()">Continue</button>
                    </div>
                `);
            }
        }
    }

    showLevelUpModal(newLevel, rewards) {
        showModal(`Level ${newLevel}!`, `
            <div style="text-align: center;">
                <div style="font-size: 5em; margin-bottom: 20px;">🎉</div>
                <h2>Level Up!</h2>
                <div style="font-size: 3em; color: var(--primary); margin: 20px 0;">${newLevel}</div>
                <h3>Rewards:</h3>
                <div style="margin: 20px 0;">
                    ${rewards.map(r => `<div class="badge badge-success" style="margin: 5px;">${r.description}</div>`).join('')}
                </div>
                <button class="btn btn-success btn-full" onclick="closeModal()">Continue</button>
            </div>
        `);
    }

    showXPNotification(amount, bonusMultiplier) {
        // Simple toast notification
        const toast = document.createElement('div');
        toast.className = 'xp-toast';
        toast.innerHTML = `+${amount} XP${bonusMultiplier > 1 ? ' 🔥' : ''}`;
        toast.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: var(--primary);
            color: white;
            padding: 15px 25px;
            border-radius: 10px;
            box-shadow: var(--shadow-lg);
            z-index: 1000;
            animation: slideIn 0.3s ease;
        `;

        document.body.appendChild(toast);

        setTimeout(() => {
            toast.style.animation = 'fadeOut 0.3s ease';
            setTimeout(() => toast.remove(), 300);
        }, 2000);
    }

    renderUI() {
        // Update all UI elements
        this.loadDashboard();
    }
}

// Global app instance
let app;

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    app = new MindCareApp();
});
```

### Step 2: Update HTML to include all scripts

Add to `mindcare-between-sessions.html` before closing `</body>`:

```html
<!-- Game Systems -->
<script src="js/config.js"></script>
<script src="js/dataManager.js"></script>
<script src="js/progressionEngine.js"></script>
<script src="js/archetypeSystem.js"></script>
<script src="js/storyEngine.js"></script>
<script src="js/questManager.js"></script>
<script src="js/avatarSystem.js"></script>
<script src="js/lifestyleQuests.js"></script>

<!-- Mini-games -->
<script src="js/minigames/miniGameBase.js"></script>
<script src="js/minigames/emotionWaves.js"></script>
<script src="js/minigames/thoughtDetective.js"></script>
<script src="js/minigames/mindfulnessGarden.js"></script>

<!-- Main App -->
<script src="js/app.js"></script>

<!-- Link CSS -->
<link rel="stylesheet" href="css/minigames.css">
<link rel="stylesheet" href="css/gamification.css">
```

### Step 3: Add header stats to HTML

Update header section:

```html
<div class="header-stats">
    <div class="stat-card">
        <div class="stat-value" id="headerLevel">1</div>
        <div class="stat-label">Level</div>
    </div>
    <div class="stat-card">
        <div class="stat-value" id="headerXP">0/100</div>
        <div class="stat-label">XP</div>
    </div>
    <div class="stat-card">
        <div class="stat-value" id="headerCoins">0</div>
        <div class="stat-label">Coins 💰</div>
    </div>
    <div class="stat-card">
        <div class="stat-value" id="headerStreak">0</div>
        <div class="stat-label">Streak 🔥</div>
    </div>
</div>
```

### Step 4: Commit integration

```bash
git add js/app.js mindcare-between-sessions.html
git commit -m "feat: integrate all game systems into main app"
```

---

## Task 12: Final Polish & Testing

**Goal:** Test all systems, fix bugs, add final UI polish

### Step 1: Manual testing checklist

Test each system:
- [ ] Create new player account
- [ ] Choose archetype (Warrior/Healer)
- [ ] Complete daily check-in (earn XP)
- [ ] Complete daily quest (earn XP and coins)
- [ ] Level up (verify rewards)
- [ ] Play Emotion Waves mini-game
- [ ] Play Thought Detective mini-game
- [ ] Visit Mindfulness Garden
- [ ] Purchase avatar item from shop
- [ ] Equip avatar item
- [ ] Start sleep quest
- [ ] Complete movement quest
- [ ] Check data persistence (reload page)

### Step 2: Bug fixes

Document and fix any bugs found during testing.

### Step 3: UI polish

Add CSS for gamification elements:

**File: `css/gamification.css`**

```css
/* Level progress bar */
.level-progress {
    background: var(--bg-main);
    height: 8px;
    border-radius: 10px;
    overflow: hidden;
    margin: 10px 0;
}

.level-progress-fill {
    height: 100%;
    background: linear-gradient(90deg, var(--primary), var(--purple));
    transition: width 0.5s ease;
}

/* XP Toast animation */
@keyframes slideIn {
    from { transform: translateX(100%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
}

@keyframes fadeOut {
    from { opacity: 1; }
    to { opacity: 0; }
}

/* Quest cards */
.quest-card {
    background: var(--bg-card);
    border-left: 4px solid var(--primary);
    padding: 20px;
    border-radius: 10px;
    margin: 10px 0;
    transition: all 0.3s ease;
}

.quest-card:hover {
    box-shadow: var(--shadow-md);
    transform: translateX(5px);
}

.quest-card.completed {
    opacity: 0.7;
    border-left-color: var(--secondary);
}

/* Shop items */
.shop-item {
    background: var(--bg-card);
    border: 2px solid var(--border);
    border-radius: 10px;
    padding: 15px;
    text-align: center;
    transition: all 0.3s ease;
}

.shop-item:hover {
    border-color: var(--primary);
    transform: translateY(-3px);
    box-shadow: var(--shadow-lg);
}

.shop-item.locked {
    opacity: 0.5;
    filter: grayscale(100%);
}

.shop-item.owned {
    border-color: var(--secondary);
}
```

### Step 4: Final commit

```bash
git add css/gamification.css
git commit -m "feat: add final UI polish and complete Phase 1"
```

---

## Plan Complete!

**Plan saved to:** `docs/plans/2026-01-17-phase1-implementation.md`

**Phase 1 Implementation Summary:**
- ✅ Core gamification (XP, levels, quests)
- ✅ 2 character archetypes (Warrior, Healer)
- ✅ 3 mini-games (Emotion Waves, Thought Detective, Mindfulness Garden)
- ✅ Avatar customization system
- ✅ Daily/weekly quest management
- ✅ Sleep & movement lifestyle quests
- ✅ Full integration and UI

**Next Steps:**
Choose how to execute this plan:

**Option 1: Subagent-Driven (this session)**
- I dispatch fresh subagent per task
- Review between tasks
- Fast iteration with oversight

**Option 2: Parallel Session (separate)**
- Open new Claude session
- Use `/execute-plan docs/plans/2026-01-17-phase1-implementation.md`
- Batch execution with checkpoints

Which execution approach would you like?