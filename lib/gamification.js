// lib/gamification.js
import Users from '@/models/Users'; // Adjust path if needed

// Helper function: Calculate points required for the increment to reach level N (exponential, medium difficulty)
function pointsForNextLevel(level) {
    // Formula: 100 * (1.5)^{level-1} — starts at 100 for level 2, ramps up moderately
    return Math.floor(100 * Math.pow(1.5, level - 1));
}

// Helper function: Calculate the level based on total points (by accumulating increments)
function calculateLevelFromPoints(totalPoints) {
    let level = 1;
    let cumulativePoints = 0;

    while (true) {
        const nextIncrement = pointsForNextLevel(level + 1);
        if (cumulativePoints + nextIncrement > totalPoints) {
            break;
        }
        cumulativePoints += nextIncrement;
        level += 1;
    }

    return level;
}

// Internal helper: Update level (exponential thresholds) and award milestone badges
function updateLevelAndBadges(userDoc) {
    const newLevel = calculateLevelFromPoints(userDoc.points);
    if (newLevel > userDoc.level) {
        userDoc.level = newLevel;
        console.log(`Level up for ${userDoc.email}: ${userDoc.level} (requires ~${pointsForNextLevel(newLevel + 1)} more points for next)`);

        // Award badge only at milestone levels (every 5 levels: 5,10,15,...)
        if (newLevel % 5 === 0) {
            const milestoneBadgeName = `Level ${newLevel} Milestone`;
            const milestoneBadgeExists = userDoc.badges.some(b => b.name === milestoneBadgeName);
            if (!milestoneBadgeExists) {
                userDoc.badges.push({
                    name: milestoneBadgeName,
                    description: `Reached the ${newLevel} level milestone with ${userDoc.points} total points!`,
                    icon: 'milestone-trophy', // Customize (e.g., special icon for milestones)
                    earnedAt: new Date()
                });
                console.log(`Milestone badge awarded to ${userDoc.email}: Level ${newLevel}`);
            }
        }
    }
    // Removed save() — handled by caller
}

// Internal helper: Check and award achievements/badges based on tasks
function checkAchievements(userDoc) {
    const achievements = [...userDoc.achievements];
    const badges = [...userDoc.badges];

    // Achievements: Task-based milestones (unlocked once)
    if (userDoc.questionAsked >= 10 && !achievements.some(a => a.title === 'Question Master')) {
        achievements.push({
            title: 'Question Master',
            description: 'Asked 10 or more questions',
            unlockedAt: new Date()
        });
    }
    if (userDoc.answerGiven >= 10 && !achievements.some(a => a.title === 'Answer Expert')) {
        achievements.push({
            title: 'Answer Expert',
            description: 'Provided 10 or more answers',
            unlockedAt: new Date()
        });
    }
    if (userDoc.notesGiven >= 5 && !achievements.some(a => a.title === 'Note Sharer')) {
        achievements.push({
            title: 'Note Sharer',
            description: 'Uploaded 5 or more notes',
            unlockedAt: new Date()
        });
    }
    if (userDoc.streak >= 7 && !achievements.some(a => a.title === 'Streak Master')) {
        achievements.push({
            title: 'Streak Master',
            description: 'Maintained a 7-day login streak',
            unlockedAt: new Date()
        });
    }

    // Badges: Other task-based (non-level; e.g., high-volume tasks)
    if (userDoc.notesGiven >= 10 && !badges.some(b => b.name === 'Note Guru')) {
        badges.push({
            name: 'Note Guru',
            description: 'Uploaded 10 notes',
            icon: 'book',
            earnedAt: new Date()
        });
    }
    if (userDoc.questionAsked >= 20 && !badges.some(b => b.name === 'Quiz Master')) {
        badges.push({
            name: 'Quiz Master',
            description: 'Asked 20 questions',
            icon: 'question',
            earnedAt: new Date()
        });
    }
    if (userDoc.answerGiven >= 20 && !badges.some(b => b.name === 'Helper Badge')) {
        badges.push({
            name: 'Helper Badge',
            description: 'Answered 20 questions',
            icon: 'heart',
            earnedAt: new Date()
        });
    }

    userDoc.achievements = achievements;
    userDoc.badges = badges;
    // Removed save() — handled by caller

    console.log(`Achievements/Badges checked for ${userDoc.email}`);
}

// Main function: Award points and trigger level/achievement updates
// Now accepts optional counters: { questionAsked: 1, answerGiven: 1, etc. }
export async function awardPoints(userDoc, amount, type = 'general', counters = {}) {
    if (!userDoc || !userDoc._id) {
        throw new Error('Invalid user document provided');
    }

    // Increment points
    userDoc.points += amount;
    console.log(`Awarded ${amount} ${type} points to user ${userDoc.email}. Total: ${userDoc.points}`);

    // Increment counters if provided (e.g., { questionAsked: 1 })
    Object.entries(counters).forEach(([key, value]) => {
        if (userDoc[key] !== undefined) {
            userDoc[key] += value;
            console.log(`Incremented ${key} by ${value} for ${userDoc.email}`);
        } else {
            console.warn(`Unknown counter '${key}' for user ${userDoc.email}`);
        }
    });

    // Update level and check achievements (no saves here)
    updateLevelAndBadges(userDoc);
    checkAchievements(userDoc);

    // Single save at the end
    await userDoc.save();
    return userDoc;
}

// Main function: Update streak on login (linear points: 10 * streak)
export async function updateStreak(userDoc) {
    if (!userDoc || !userDoc._id) {
        throw new Error('Invalid user document provided');
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize to start of day (UTC; consider timezone lib for prod)

    const lastLogin = userDoc.lastLogin ? new Date(userDoc.lastLogin) : null;
    let isConsecutive = false;

    if (lastLogin) {
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        yesterday.setHours(0, 0, 0, 0);

        if (lastLogin >= yesterday && lastLogin < today) {  // Ensure it's yesterday, not today (avoid double-count)
            // Consecutive day
            userDoc.streak += 1;
            isConsecutive = true;
        } else if (lastLogin < yesterday) {
            // Reset streak (gap >1 day)
            userDoc.streak = 1;
        } else {
            // Same day: No change
            console.log(`No streak update for ${userDoc.email}: Already logged in today`);
            return userDoc;  // Early return, no points awarded
        }
    } else {
        userDoc.streak = 1;
    }

    // Linear points: 10 * streak (e.g., Day 1: 10, Day 2: 20, Day 3: 30)
    const streakPoints = 10 * userDoc.streak;
    await awardPoints(userDoc, streakPoints, 'streak', {});  // No counters for streak
    userDoc.lastLogin = new Date();

    // Single save (awardPoints already saves, but we set lastLogin after)
    await userDoc.save();

    console.log(`Streak updated for ${userDoc.email}: Day ${userDoc.streak}, +${streakPoints} points (consecutive: ${isConsecutive})`);
    return userDoc;
}

// Optional: Export a function to fetch and return gamification data (for frontend)
export async function getGamificationData(userId) {
    const userDoc = await Users.findById(userId).select(
        'points level streak badges achievements questionAsked answerGiven notesGiven lastLogin'
    );
    if (!userDoc) {
        throw new Error('User  not found');
    }
    return {
        points: userDoc.points,
        level: userDoc.level,
        streak: userDoc.streak,
        badges: userDoc.badges,
        achievements: userDoc.achievements,
        questionAsked: userDoc.questionAsked,
        answerGiven: userDoc.answerGiven,
        notesGiven: userDoc.notesGiven,
        lastLogin: userDoc.lastLogin,
        // Bonus: Next level info for UI (e.g., progress bar)
        pointsToNextLevel: pointsForNextLevel(userDoc.level + 1)
    };
}