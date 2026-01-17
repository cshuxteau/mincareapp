// MindCare Data Manager
// Handles all data persistence, storage, and retrieval using localStorage
// Provides a robust API for managing player data, activities, quests, and game state

class DataManager {
    constructor() {
        this.storageKey = 'mindcareGameData';
        this.data = null;
        this.initialized = false;
    }

    // Initialize the data manager
    init() {
        if (this.initialized) return;
        this.loadData();
        this.initialized = true;
    }

    // Generate a unique player ID
    generateId() {
        return 'player_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    // Get default data structure
    getDefaultData() {
        return {
            version: '1.0.0',
            lastUpdated: new Date().toISOString(),

            // Player Profile
            player: {
                id: this.generateId(),
                name: 'Adventurer',
                archetype: null,              // Selected character archetype
                level: 1,
                currentXP: 0,
                totalXP: 0,
                coins: 0,
                joinDate: new Date().toISOString(),
                lastLogin: new Date().toISOString(),
                streak: {
                    current: 0,
                    longest: 0,
                    lastCheckin: null
                },
                stats: {
                    activitiesCompleted: 0,
                    questsCompleted: 0,
                    miniGamesPlayed: 0,
                    totalPlayTime: 0,           // in minutes
                    sessionsAttended: 0
                }
            },

            // Skill Trees Progress
            skillTrees: {
                emotional: {
                    level: 0,
                    xp: 0,
                    unlockedSkills: []
                },
                social: {
                    level: 0,
                    xp: 0,
                    unlockedSkills: []
                },
                mindfulness: {
                    level: 0,
                    xp: 0,
                    unlockedSkills: []
                },
                physical: {
                    level: 0,
                    xp: 0,
                    unlockedSkills: []
                }
            },

            // Avatar Customization
            avatar: {
                bodyType: 'default',
                skinTone: 'medium',
                hairStyle: 'short',
                hairColor: 'brown',
                outfit: 'casual',
                accessories: [],
                unlocked: {
                    hairStyles: ['short'],
                    hairColors: ['brown', 'black'],
                    outfits: ['casual'],
                    accessories: []
                }
            },

            // Inventory & Collectibles
            inventory: {
                items: [],
                badges: [],
                achievements: [],
                cosmetics: []
            },

            // Quests & Challenges
            quests: {
                daily: [],
                weekly: [],
                completed: [],
                available: []
            },

            // Activities Log
            activities: {
                completed: [],
                favorites: [],
                history: []
            },

            // Mini-Games Progress
            miniGames: {
                breathing: {
                    played: 0,
                    bestScore: 0,
                    lastPlayed: null
                },
                moodmatcher: {
                    played: 0,
                    bestScore: 0,
                    lastPlayed: null
                },
                gratitude: {
                    played: 0,
                    bestScore: 0,
                    lastPlayed: null
                }
            },

            // Statistics & Analytics
            stats: {
                moodTracking: [],
                energyLevels: [],
                sleepQuality: [],
                activityFrequency: {},
                skillProgress: {},
                weeklyReport: {
                    activitiesCompleted: 0,
                    xpEarned: 0,
                    streakMaintained: false
                }
            },

            // Clinical Data (existing functionality)
            medications: [],
            sessionNotes: [],
            sideEffects: [],

            // Settings
            settings: {
                notifications: true,
                soundEffects: true,
                animations: true,
                theme: 'light',
                privacy: {
                    shareProgress: false,
                    anonymousData: true
                }
            }
        };
    }

    // Load data from localStorage
    loadData() {
        try {
            const stored = localStorage.getItem(this.storageKey);

            if (stored) {
                const parsed = JSON.parse(stored);
                // Merge with defaults to handle new fields in updates
                this.data = this.mergeWithDefaults(parsed);

                // Update last login
                if (this.data.player) {
                    this.data.player.lastLogin = new Date().toISOString();
                }
            } else {
                // First time user - initialize with defaults
                this.data = this.getDefaultData();
            }

            this.saveData();
            return this.data;
        } catch (error) {
            console.error('Error loading data:', error);
            // If data is corrupted, backup and reset
            this.backupCorruptedData();
            this.data = this.getDefaultData();
            this.saveData();
            return this.data;
        }
    }

    // Merge stored data with default structure (handles version updates)
    mergeWithDefaults(stored) {
        const defaults = this.getDefaultData();
        return this.deepMerge(defaults, stored);
    }

    // Deep merge two objects (recursive)
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

    // Check if value is a plain object
    isObject(item) {
        return item && typeof item === 'object' && !Array.isArray(item);
    }

    // Save data to localStorage
    saveData() {
        try {
            if (!this.data) {
                console.error('No data to save');
                return false;
            }

            this.data.lastUpdated = new Date().toISOString();
            localStorage.setItem(this.storageKey, JSON.stringify(this.data));
            return true;
        } catch (error) {
            console.error('Error saving data:', error);

            // Check if quota exceeded
            if (error.name === 'QuotaExceededError') {
                console.error('LocalStorage quota exceeded. Consider cleaning up old data.');
                this.cleanupOldData();
            }

            return false;
        }
    }

    // Get data by path (dot notation)
    // Example: get('player.level') returns player level
    get(path) {
        if (!this.data) {
            this.loadData();
        }

        if (!path) return this.data;

        const keys = path.split('.');
        let current = this.data;

        for (const key of keys) {
            if (current && typeof current === 'object' && key in current) {
                current = current[key];
            } else {
                return undefined;
            }
        }

        return current;
    }

    // Set data by path (dot notation)
    // Example: set('player.level', 5) sets player level to 5
    set(path, value) {
        if (!this.data) {
            this.loadData();
        }

        const keys = path.split('.');
        const lastKey = keys.pop();
        let current = this.data;

        // Navigate to the parent object
        for (const key of keys) {
            if (!(key in current)) {
                current[key] = {};
            }
            current = current[key];
        }

        // Set the value
        current[lastKey] = value;
        this.saveData();

        return true;
    }

    // Update player data
    updatePlayer(updates) {
        if (!this.data || !this.data.player) {
            this.loadData();
        }

        Object.assign(this.data.player, updates);
        this.saveData();

        return this.data.player;
    }

    // Add XP to player
    addXP(amount, source = 'activity') {
        const player = this.get('player');
        if (!player) return null;

        player.currentXP += amount;
        player.totalXP += amount;

        // Check for level up
        const leveledUp = this.checkLevelUp();

        this.saveData();

        return {
            newXP: player.currentXP,
            totalXP: player.totalXP,
            leveledUp: leveledUp,
            newLevel: player.level
        };
    }

    // Check if player should level up
    checkLevelUp() {
        if (typeof GameConfig === 'undefined') {
            console.warn('GameConfig not loaded');
            return false;
        }

        const player = this.get('player');
        const xpRequired = GameConfig.xp.requirements[player.level - 1] || 0;

        if (player.currentXP >= xpRequired && player.level < 100) {
            player.level++;
            player.currentXP -= xpRequired;
            player.coins += GameConfig.coins.rewards.levelUp;

            return true;
        }

        return false;
    }

    // Update daily streak
    updateStreak() {
        const player = this.get('player');
        const now = new Date();
        const lastCheckin = player.streak.lastCheckin ? new Date(player.streak.lastCheckin) : null;

        if (!lastCheckin) {
            // First check-in
            player.streak.current = 1;
            player.streak.lastCheckin = now.toISOString();
        } else {
            const daysDiff = Math.floor((now - lastCheckin) / (1000 * 60 * 60 * 24));

            if (daysDiff === 0) {
                // Same day, no change
                return player.streak;
            } else if (daysDiff === 1) {
                // Next day, increment streak
                player.streak.current++;
                player.streak.lastCheckin = now.toISOString();

                if (player.streak.current > player.streak.longest) {
                    player.streak.longest = player.streak.current;
                }
            } else {
                // Streak broken
                player.streak.current = 1;
                player.streak.lastCheckin = now.toISOString();
            }
        }

        this.saveData();
        return player.streak;
    }

    // Add completed activity
    addActivity(activity) {
        const activities = this.get('activities');

        const activityLog = {
            ...activity,
            completedAt: new Date().toISOString(),
            id: 'activity_' + Date.now()
        };

        activities.completed.push(activityLog);
        activities.history.unshift(activityLog); // Most recent first

        // Keep only last 100 history items
        if (activities.history.length > 100) {
            activities.history = activities.history.slice(0, 100);
        }

        // Update player stats
        const player = this.get('player');
        player.stats.activitiesCompleted++;

        this.saveData();
        return activityLog;
    }

    // Add quest
    addQuest(quest) {
        const quests = this.get('quests');
        const questType = quest.type || 'daily';

        if (!quests[questType]) {
            quests[questType] = [];
        }

        const newQuest = {
            ...quest,
            id: 'quest_' + Date.now(),
            addedAt: new Date().toISOString(),
            completed: false,
            progress: 0
        };

        quests[questType].push(newQuest);
        this.saveData();

        return newQuest;
    }

    // Complete quest
    completeQuest(questId) {
        const quests = this.get('quests');
        let completedQuest = null;

        // Search in all quest types
        ['daily', 'weekly', 'available'].forEach(type => {
            if (quests[type]) {
                const index = quests[type].findIndex(q => q.id === questId);
                if (index !== -1) {
                    completedQuest = quests[type][index];
                    completedQuest.completed = true;
                    completedQuest.completedAt = new Date().toISOString();

                    // Move to completed
                    quests.completed.push(completedQuest);
                    quests[type].splice(index, 1);

                    // Update player stats
                    const player = this.get('player');
                    player.stats.questsCompleted++;
                }
            }
        });

        this.saveData();
        return completedQuest;
    }

    // Export data as JSON
    exportData() {
        if (!this.data) {
            this.loadData();
        }

        return JSON.stringify(this.data, null, 2);
    }

    // Import data from JSON string
    importData(jsonString) {
        try {
            const imported = JSON.parse(jsonString);

            // Validate basic structure
            if (!imported.player || !imported.version) {
                throw new Error('Invalid data format');
            }

            // Backup current data before import
            this.backupData('pre_import');

            // Merge with defaults to ensure all fields exist
            this.data = this.mergeWithDefaults(imported);
            this.saveData();

            return true;
        } catch (error) {
            console.error('Error importing data:', error);
            return false;
        }
    }

    // Backup current data
    backupData(suffix = '') {
        try {
            const backupKey = this.storageKey + '_backup' + (suffix ? '_' + suffix : '');
            const backupData = {
                timestamp: new Date().toISOString(),
                data: this.data
            };
            localStorage.setItem(backupKey, JSON.stringify(backupData));
            return true;
        } catch (error) {
            console.error('Error creating backup:', error);
            return false;
        }
    }

    // Backup corrupted data for debugging
    backupCorruptedData() {
        try {
            const stored = localStorage.getItem(this.storageKey);
            const backupKey = this.storageKey + '_corrupted_' + Date.now();
            localStorage.setItem(backupKey, stored);
            console.warn('Corrupted data backed up to:', backupKey);
        } catch (error) {
            console.error('Could not backup corrupted data:', error);
        }
    }

    // Cleanup old data to free space
    cleanupOldData() {
        // Remove old activity history beyond 100 items
        const activities = this.get('activities');
        if (activities && activities.history && activities.history.length > 100) {
            activities.history = activities.history.slice(0, 100);
        }

        // Remove old mood tracking beyond 90 days
        const stats = this.get('stats');
        if (stats && stats.moodTracking) {
            const ninetyDaysAgo = new Date();
            ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

            stats.moodTracking = stats.moodTracking.filter(entry => {
                return new Date(entry.date) > ninetyDaysAgo;
            });
        }

        this.saveData();
    }

    // Clear all data (with confirmation)
    clearAllData(confirmed = false) {
        if (!confirmed) {
            console.warn('clearAllData requires confirmation. Pass true to confirm.');
            return false;
        }

        // Backup before clearing
        this.backupData('pre_clear');

        // Clear localStorage
        localStorage.removeItem(this.storageKey);

        // Reset to defaults
        this.data = this.getDefaultData();
        this.saveData();

        return true;
    }

    // Get all data (for debugging)
    getAllData() {
        if (!this.data) {
            this.loadData();
        }
        return this.data;
    }

    // Reset specific section
    resetSection(section) {
        const defaults = this.getDefaultData();

        if (section in defaults) {
            this.data[section] = defaults[section];
            this.saveData();
            return true;
        }

        return false;
    }
}

// Create singleton instance
const dataManager = new DataManager();

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DataManager;
    module.exports.dataManager = dataManager;
}
