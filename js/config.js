// MindCare Gamification Configuration
// This file contains all game constants, XP/coin rewards, character archetypes, and skill tree definitions

const GameConfig = {
    // XP System Configuration
    xp: {
        // Generate XP requirements for 100 levels with exponential growth
        // Formula: baseXP * (growthRate ^ level)
        requirements: (() => {
            const levels = [];
            const baseXP = 100;
            const growthRate = 1.15;
            for (let level = 0; level < 100; level++) {
                levels.push(Math.floor(baseXP * Math.pow(growthRate, level)));
            }
            return levels;
        })(),

        // XP rewards for different activities
        rewards: {
            dailyCheckin: 50,
            quickActivity: 25,           // 5-10 minute activities
            standardActivity: 50,         // 15-30 minute activities
            miniGame: 75,                 // Completing a mini-game
            majorChallenge: 100,          // Weekly challenges
            streakBonusPerDay: 0.10,      // 10% bonus per day in streak
            maxStreakBonus: 0.50          // Max 50% bonus (5 day streak)
        }
    },

    // Coin/Currency System
    coins: {
        rewards: {
            dailyQuest: 10,
            weeklyChallenge: 50,
            levelUp: 25,
            // Coins can be used for cosmetic items, avatar customization, etc.
        }
    },

    // Character Archetypes
    archetypes: {
        warrior: {
            id: 'warrior',
            name: 'The Warrior',
            description: 'Face challenges head-on with courage and determination',
            theme: 'Strength through adversity',
            primaryColor: '#FF6B6B',      // Bold red
            secondaryColor: '#4ECDC4',
            stats: {
                resilience: 5,
                courage: 5,
                determination: 4
            }
        },
        healer: {
            id: 'healer',
            name: 'The Healer',
            description: 'Find peace through self-care and mindful practices',
            theme: 'Growth through gentleness',
            primaryColor: '#95E1D3',      // Soft teal
            secondaryColor: '#F38181',
            stats: {
                selfCompassion: 5,
                awareness: 5,
                patience: 4
            }
        },
        explorer: {
            id: 'explorer',
            name: 'The Explorer',
            description: 'Discover new perspectives and embrace curiosity',
            theme: 'Learning through discovery',
            primaryColor: '#AA96DA',      // Purple
            secondaryColor: '#FCBAD3',
            stats: {
                curiosity: 5,
                adaptability: 5,
                openness: 4
            }
        },
        guardian: {
            id: 'guardian',
            name: 'The Guardian',
            description: 'Build stability through consistency and structure',
            theme: 'Safety through routine',
            primaryColor: '#6C5CE7',      // Deep purple
            secondaryColor: '#A8E6CF',
            stats: {
                consistency: 5,
                stability: 5,
                protection: 4
            }
        }
    },

    // Skill Trees - Four main branches of personal development
    skillTrees: {
        emotional: {
            id: 'emotional',
            name: 'Emotional Awareness',
            description: 'Develop emotional intelligence and self-awareness',
            maxLevel: 20,
            icon: '❤️',
            color: '#FF6B6B',
            skills: [
                { id: 'emotion_recognition', name: 'Emotion Recognition', description: 'Identify and name emotions' },
                { id: 'emotion_regulation', name: 'Emotion Regulation', description: 'Manage emotional responses' },
                { id: 'emotional_expression', name: 'Emotional Expression', description: 'Communicate feelings effectively' },
                { id: 'empathy', name: 'Empathy', description: 'Understand others\' emotions' }
            ]
        },
        social: {
            id: 'social',
            name: 'Social Connection',
            description: 'Build and maintain meaningful relationships',
            maxLevel: 20,
            icon: '👥',
            color: '#4ECDC4',
            skills: [
                { id: 'communication', name: 'Communication', description: 'Express yourself clearly' },
                { id: 'boundary_setting', name: 'Boundary Setting', description: 'Establish healthy limits' },
                { id: 'conflict_resolution', name: 'Conflict Resolution', description: 'Navigate disagreements' },
                { id: 'active_listening', name: 'Active Listening', description: 'Truly hear others' }
            ]
        },
        mindfulness: {
            id: 'mindfulness',
            name: 'Mindful Practice',
            description: 'Cultivate present-moment awareness',
            maxLevel: 20,
            icon: '🧘',
            color: '#95E1D3',
            skills: [
                { id: 'breathing', name: 'Breathwork', description: 'Master breathing techniques' },
                { id: 'meditation', name: 'Meditation', description: 'Develop meditation practice' },
                { id: 'body_awareness', name: 'Body Awareness', description: 'Connect with physical sensations' },
                { id: 'present_focus', name: 'Present Focus', description: 'Stay grounded in now' }
            ]
        },
        physical: {
            id: 'physical',
            name: 'Physical Wellness',
            description: 'Support mental health through physical care',
            maxLevel: 20,
            icon: '💪',
            color: '#AA96DA',
            skills: [
                { id: 'movement', name: 'Movement', description: 'Regular physical activity' },
                { id: 'sleep_hygiene', name: 'Sleep Hygiene', description: 'Improve sleep quality' },
                { id: 'nutrition', name: 'Nutrition', description: 'Nourish your body' },
                { id: 'energy_management', name: 'Energy Management', description: 'Balance rest and activity' }
            ]
        }
    },

    // Quest Types and Configuration
    quests: {
        types: {
            daily: {
                resetInterval: 'daily',
                maxActive: 3,
                coinReward: 10
            },
            weekly: {
                resetInterval: 'weekly',
                maxActive: 2,
                coinReward: 50
            },
            milestone: {
                resetInterval: 'never',
                unique: true,
                coinReward: 100
            }
        }
    },

    // Mini-Game Configuration
    miniGames: {
        breathingExercise: {
            id: 'breathing',
            name: 'Breathing Circle',
            duration: 300, // 5 minutes
            xpReward: 75,
            difficulty: 'easy'
        },
        moodMatcher: {
            id: 'moodmatcher',
            name: 'Mood Matcher',
            duration: 180, // 3 minutes
            xpReward: 75,
            difficulty: 'medium'
        },
        gratitudeGarden: {
            id: 'gratitude',
            name: 'Gratitude Garden',
            duration: 240, // 4 minutes
            xpReward: 75,
            difficulty: 'easy'
        }
    },

    // Achievement Categories
    achievements: {
        categories: {
            consistency: {
                name: 'Consistency',
                icon: '🔥',
                color: '#FF6B6B'
            },
            exploration: {
                name: 'Exploration',
                icon: '🌟',
                color: '#4ECDC4'
            },
            mastery: {
                name: 'Mastery',
                icon: '👑',
                color: '#AA96DA'
            },
            social: {
                name: 'Connection',
                icon: '💝',
                color: '#F38181'
            }
        }
    },

    // Notification Messages
    messages: {
        levelUp: [
            'Level Up! Your journey continues!',
            'New level achieved! Keep growing!',
            'You\'re making amazing progress!',
            'Level up! Your dedication shows!'
        ],
        streakMilestone: [
            'Incredible dedication! {days} days strong!',
            '{days} day streak! You\'re unstoppable!',
            'Consistency is your superpower! {days} days!'
        ],
        questComplete: [
            'Quest completed! Well done!',
            'Another quest conquered!',
            'You did it! Quest complete!'
        ]
    },

    // UI Configuration
    ui: {
        animations: {
            duration: 300,
            easing: 'ease-in-out'
        },
        colors: {
            primary: '#4ECDC4',
            secondary: '#FF6B6B',
            success: '#95E1D3',
            warning: '#FFE66D',
            danger: '#FF6B6B',
            dark: '#2C3E50',
            light: '#F7F9FC'
        },
        breakpoints: {
            mobile: 768,
            tablet: 1024,
            desktop: 1280
        }
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GameConfig;
}
