import {
  COMMUNITY_CREATORS,
  CHALLENGES_DATABASE,
  CHALLENGE_LEADERBOARDS,
  ACTIVITY_FEED,
  RECIPES_DATABASE,
} from '../data/mockData.js';
import { pool } from '../config/db.js';

// In-memory state store for responsive demo / offline DB mode
let activityFeedState = [...ACTIVITY_FEED];
let challengesState = [...CHALLENGES_DATABASE];
let creatorsState = [...COMMUNITY_CREATORS];
let leaderboardsState = [...CHALLENGE_LEADERBOARDS];
const followedUserIds = new Set(['chef_mateo', 'marcus_vance']);
const cheeredActivityIds = new Set(['act2']);

/**
 * GET /api/social/feed
 * Returns the community activity stream
 */
export async function getSocialFeed(req, res, next) {
  try {
    const feed = activityFeedState.map((act) => ({
      ...act,
      isCheered: cheeredActivityIds.has(act.id),
    }));

    res.json({
      success: true,
      count: feed.length,
      feed,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/social/feed/:id/cheer
 * Toggle cheer/like on an activity item
 */
export async function cheerActivity(req, res, next) {
  try {
    const { id } = req.params;
    const itemIndex = activityFeedState.findIndex((a) => a.id === id);

    if (itemIndex === -1) {
      return res.status(404).json({ success: false, message: 'Activity not found' });
    }

    const isCurrentlyCheered = cheeredActivityIds.has(id);
    if (isCurrentlyCheered) {
      cheeredActivityIds.delete(id);
      activityFeedState[itemIndex].likesCount = Math.max(0, activityFeedState[itemIndex].likesCount - 1);
    } else {
      cheeredActivityIds.add(id);
      activityFeedState[itemIndex].likesCount += 1;
    }

    res.json({
      success: true,
      activityId: id,
      cheered: !isCurrentlyCheered,
      likesCount: activityFeedState[itemIndex].likesCount,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/social/challenges
 * Retrieve 30-day macro challenges & user enrollment
 */
export async function getChallenges(req, res, next) {
  try {
    res.json({
      success: true,
      count: challengesState.length,
      challenges: challengesState,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/social/challenges/:id/join
 * Join an active challenge
 */
export async function joinChallenge(req, res, next) {
  try {
    const { id } = req.params;
    const chIdx = challengesState.findIndex((c) => c.id === id);

    if (chIdx === -1) {
      return res.status(404).json({ success: false, message: 'Challenge not found' });
    }

    if (challengesState[chIdx].status !== 'joined') {
      challengesState[chIdx] = {
        ...challengesState[chIdx],
        status: 'joined',
        participantCount: challengesState[chIdx].participantCount + 1,
        currentStreakDays: 1,
        progressPercent: 3,
        points: 50,
      };

      // Also append to activity feed
      const newActivity = {
        id: `act_${Date.now()}`,
        user: {
          id: 'user_current',
          name: 'Alex Johnson (You)',
          avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&h=120&q=80',
          badge: 'Rising Contender',
        },
        action: 'challenge_joined',
        title: `joined the ${challengesState[chIdx].title} challenge! Let's go!`,
        timeAgo: 'Just now',
        likesCount: 0,
        isCheered: false,
      };
      activityFeedState.unshift(newActivity);
    }

    res.json({
      success: true,
      message: `Successfully joined ${challengesState[chIdx].title}!`,
      challenge: challengesState[chIdx],
    });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/social/challenges/:id/leaderboard
 * Return live ranking and scores for challenge
 */
export async function getLeaderboard(req, res, next) {
  try {
    const { id } = req.params;
    res.json({
      success: true,
      challengeId: id,
      leaderboard: leaderboardsState,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/social/profile/:id
 * Return public profile for any user or chef
 */
export async function getPublicProfile(req, res, next) {
  try {
    const { id } = req.params;
    let creator = creatorsState.find((c) => c.id === id);

    if (!creator) {
      if (id === 'user_current' || id === 'current') {
        creator = {
          id: 'user_current',
          name: 'Alex Johnson',
          handle: '@alexj_macros',
          avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&h=200&q=80',
          badge: 'Rising Contender',
          bio: 'Data engineer by day, amateur marathoner & macro tracker by night. Passionate about optimal nutrition.',
          followersCount: 142,
          followingCount: 38,
          recipesCount: 2,
          streakDays: 14,
          location: 'San Francisco, CA',
          isFollowing: false,
        };
      } else {
        return res.status(404).json({ success: false, message: 'User profile not found' });
      }
    }

    // Find authored recipes
    const authoredRecipes = RECIPES_DATABASE.filter(
      (r) => r.author && r.author.id === creator.id
    );

    res.json({
      success: true,
      profile: {
        ...creator,
        isFollowing: followedUserIds.has(creator.id),
        recipes: authoredRecipes,
      },
    });
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/social/follow/:id
 * Toggle follow/unfollow for a community creator
 */
export async function toggleFollowUser(req, res, next) {
  try {
    const { id } = req.params;
    const isCurrentlyFollowing = followedUserIds.has(id);

    if (isCurrentlyFollowing) {
      followedUserIds.delete(id);
    } else {
      followedUserIds.add(id);
    }

    // Update creator stats
    const cIdx = creatorsState.findIndex((c) => c.id === id);
    if (cIdx !== -1) {
      creatorsState[cIdx].followersCount += isCurrentlyFollowing ? -1 : 1;
      creatorsState[cIdx].isFollowing = !isCurrentlyFollowing;
    }

    res.json({
      success: true,
      userId: id,
      isFollowing: !isCurrentlyFollowing,
      followersCount: cIdx !== -1 ? creatorsState[cIdx].followersCount : 0,
      message: !isCurrentlyFollowing ? 'Now following creator' : 'Unfollowed creator',
    });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/social/suggested-chefs
 * Discover suggested health creators
 */
export async function getSuggestedChefs(req, res, next) {
  try {
    const suggested = creatorsState.map((c) => ({
      ...c,
      isFollowing: followedUserIds.has(c.id),
    }));

    res.json({
      success: true,
      creators: suggested,
    });
  } catch (err) {
    next(err);
  }
}
