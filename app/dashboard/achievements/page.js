// app/dashboard/achievements/page.js
'use client';
import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
// Optional: For better icons, install `npm install @heroicons/react` and uncomment below:
// import { TrophyIcon, BookOpenIcon, QuestionMarkCircleIcon, HeartIcon, StarIcon } from '@heroicons/react/24/outline';

export default function AchievementsPage() {
  const { data: session, status } = useSession();
  const [data, setData] = useState({
    points: 0,
    level: 1,
    streak: 0,
    badges: [],
    achievements: [],
    progress: 0,
    pointsToNextLevel: 0
  });
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!session?.user?.email) {
      router.push('/dashboard');
      return;
    }
    fetch(`/api/users?email=${session.user.email}`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch user data');
        return res.json();
      })
      .then(userData => {
        // Compute progress client-side (exponential formula: points for next level increment)
        const pointsToNextLevel = Math.floor(50 * Math.pow(1.5, userData.level || 1));
        const progress = Math.min(((userData.points || 0) % pointsToNextLevel) / pointsToNextLevel * 100, 100);
        setData({
          points: userData.points || 0,
          level: userData.level || 1,
          streak: userData.streak || 0,
          badges: userData.badges || [],
          achievements: userData.achievements || [],
          progress,
          pointsToNextLevel,
        });
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching achievements:', err);
        setLoading(false);
      });
  }, [session, router]);

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        <p className="text-xl">Loading achievements...</p>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        <p className="text-xl">Please log in to view achievements.</p>
      </div>
    );
  }

  const { points, level, streak, badges, achievements, progress, pointsToNextLevel } = data;

  return (
    <div className="min-h-screen bg-transparent text-white p-8"> {/* Dark theme matching your dashboard */}
      <div className="max-w-6xl mx-auto">
        {/* Back Link */}
        <Link
          href="/dashboard"
          className="text-blue-400 hover:underline mb-6 inline-block text-lg font-semibold"
        >
          ← Back to Dashboard
        </Link>

        {/* Page Header */}
        <h1 className="text-3xl font-bold mb-6">Achievements & Badges</h1>

        {/* Quick Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 p-6 bg-gray-800 rounded-lg border border-neutral-700">
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-400">{points} Points</p>
            <p className="text-sm text-gray-400">Total Earned</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-green-400">Level {level}</p>
            <div className="w-full bg-neutral-700 rounded-full h-3 mt-2">
              <div
                className="bg-green-500 h-3 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-400 mt-2">
              {Math.floor(points % pointsToNextLevel)} / {pointsToNextLevel} to Level {level + 1}
            </p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-yellow-400">{streak} Day Streak</p>
            <p className="text-sm text-gray-400">Login daily for +{10 * (streak + 1)} points next!</p>
          </div>
        </div>

        {/* Badges Section (Level Milestones + Task Badges) */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4 flex items-center">
            <span className="text-3xl mr-2">🏆</span> {/* Emoji; or <TrophyIcon className="h-7 w-7 text-yellow-400 mr-2" /> */}
            Badges ({badges.length})
          </h2>
          {badges.length === 0 ? (
            <div className="text-center py-8 bg-gray-800 rounded-lg border-2 border-dashed border-neutral-700">
              <p className="text-gray-400 text-lg">No badges yet.</p>
              <p className="text-gray-500 mt-2">Reach level milestones (5, 10, 15...) or complete tasks like uploading 10 notes to earn your first badge!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {badges.map((badge, index) => (
                <div
                  key={index}
                  className="bg-gray-800 p-6 rounded-lg border border-neutral-700 hover:bg-gray-700 transition-colors duration-200"
                >
                  {/* Icon */}
                  <div className="flex items-center mb-3">
                    <span className="text-3xl mr-3">🏆</span> {/* Customize per badge: e.g., if (badge.name.includes('Level')) '🎯' else '📚' */}
                    {/* Or Heroicons: <TrophyIcon className="h-8 w-8 text-yellow-400 mr-3" /> */}
                  </div>
                  {/* Content */}
                  <h3 className="text-xl font-semibold mb-2">{badge.name}</h3>
                  <p className="text-gray-300 mb-3">{badge.description}</p>
                  <p className="text-sm text-gray-500">Earned: {new Date(badge.earnedAt).toLocaleDateString()}</p>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Achievements Section (Task-Based Only) */}
        <section>
          <h2 className="text-2xl font-bold mb-4 flex items-center">
            <span className="text-3xl mr-2">⭐</span> {/* Emoji; or <StarIcon className="h-7 w-7 text-blue-400 mr-2" /> */}
            Achievements ({achievements.length})
          </h2>
          {achievements.length === 0 ? (
            <div className="text-center py-8 bg-gray-800 rounded-lg border-2 border-dashed border-neutral-700">
              <p className="text-gray-400 text-lg">No achievements unlocked.</p>
              <p className="text-gray-500 mt-2">Ask 10 questions, answer 10, upload 5 notes, or maintain a 7-day streak to unlock your first achievement!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {achievements.map((achievement, index) => (
                <div
                  key={index}
                  className="bg-gray-800 p-6 rounded-lg border-l-4 border-blue-500 flex items-start space-x-4 hover:bg-gray-700 transition-colors duration-200"
                >
                  {/* Icon */}
                  <span className="text-3xl mt-1 flex-shrink-0">⭐</span> {/* Or <StarIcon className="h-6 w-6 text-blue-400 mt-1 flex-shrink-0" /> */}
                  {/* Content */}
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-1">{achievement.title}</h3>
                    <p className="text-gray-300 mb-2">{achievement.description}</p>
                    <p className="text-sm text-gray-500">Unlocked: {new Date(achievement.unlockedAt).toLocaleDateString()}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Footer Tip */}
        <div className="mt-12 p-4 bg-blue-900/30 rounded-lg border border-blue-500/50">
          <p className="text-center text-blue-300">
            Tip: Earn more points by asking questions (+10), answering (+10), uploading notes (+20), and logging in daily. Check back after activities!
          </p>
        </div>
      </div>
    </div>
  );
}