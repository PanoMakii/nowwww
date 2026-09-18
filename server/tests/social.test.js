import assert from 'node:assert';
import {
  getSocialFeed,
  cheerActivity,
  getChallenges,
  joinChallenge,
  getLeaderboard,
  getPublicProfile,
  toggleFollowUser,
} from '../src/controllers/social.controller.js';

export async function runSocialTests() {
  console.log('  ▶ Testing Social & Community Controllers...');

  // 1. Social Feed
  let feedRes = {};
  const mockFeedReq = {};
  const mockFeedRes = {
    json(data) {
      feedRes = data;
      return this;
    },
  };

  await getSocialFeed(mockFeedReq, mockFeedRes, (err) => {
    if (err) throw err;
  });

  assert.strictEqual(feedRes.success, true);
  assert.ok(Array.isArray(feedRes.feed));
  assert.ok(feedRes.feed.length > 0, 'Feed should contain initial activity');

  // 2. Cheer Activity
  const activityId = feedRes.feed[0].id;
  const initialLikes = feedRes.feed[0].likesCount || 0;
  let cheerRes = {};
  const mockCheerReq = { params: { id: activityId } };
  const mockCheerRes = {
    json(data) {
      cheerRes = data;
      return this;
    },
  };

  await cheerActivity(mockCheerReq, mockCheerRes, (err) => {
    if (err) throw err;
  });

  assert.strictEqual(cheerRes.success, true);
  assert.strictEqual(cheerRes.activityId, activityId);
  assert.notStrictEqual(cheerRes.likesCount, initialLikes);

  // 3. 30-Day Challenges
  let challengesRes = {};
  const mockChReq = {};
  const mockChRes = {
    json(data) {
      challengesRes = data;
      return this;
    },
  };

  await getChallenges(mockChReq, mockChRes, (err) => {
    if (err) throw err;
  });

  assert.strictEqual(challengesRes.success, true);
  assert.ok(challengesRes.challenges.length >= 4, 'Should return at least 4 active challenges');
  assert.ok(challengesRes.challenges.some((c) => c.title.includes('Protein')));

  // 4. Join Challenge
  const targetChallenge = challengesRes.challenges.find((c) => c.status !== 'joined') || challengesRes.challenges[0];
  let joinRes = {};
  const mockJoinReq = { params: { id: targetChallenge.id } };
  const mockJoinRes = {
    json(data) {
      joinRes = data;
      return this;
    },
  };

  await joinChallenge(mockJoinReq, mockJoinRes, (err) => {
    if (err) throw err;
  });

  assert.strictEqual(joinRes.success, true);
  assert.strictEqual(joinRes.challenge.status, 'joined');
  assert.ok(joinRes.challenge.participantCount > 0);

  // 5. Challenge Leaderboard
  let leadRes = {};
  const mockLeadReq = { params: { id: targetChallenge.id } };
  const mockLeadRes = {
    json(data) {
      leadRes = data;
      return this;
    },
  };

  await getLeaderboard(mockLeadReq, mockLeadRes, (err) => {
    if (err) throw err;
  });

  assert.strictEqual(leadRes.success, true);
  assert.ok(leadRes.leaderboard.length >= 5, 'Leaderboard should show top athletes');
  assert.ok(leadRes.leaderboard.some((u) => u.rank === 1));

  // 6. Public Profile
  let profRes = {};
  const mockProfReq = { params: { id: 'chef_mateo' } };
  const mockProfRes = {
    json(data) {
      profRes = data;
      return this;
    },
  };

  await getPublicProfile(mockProfReq, mockProfRes, (err) => {
    if (err) throw err;
  });

  assert.strictEqual(profRes.success, true);
  assert.strictEqual(profRes.profile.id, 'chef_mateo');
  assert.strictEqual(profRes.profile.name, 'Chef Mateo Cruz');
  assert.ok(profRes.profile.badge, 'Creator should have badge');
  assert.ok(profRes.profile.followersCount > 0);

  // 7. Follow / Unfollow Toggle
  let followRes = {};
  const mockFollowReq = { params: { id: 'dr_elena' } };
  const mockFollowRes = {
    json(data) {
      followRes = data;
      return this;
    },
  };

  await toggleFollowUser(mockFollowReq, mockFollowRes, (err) => {
    if (err) throw err;
  });

  assert.strictEqual(followRes.success, true);
  assert.strictEqual(followRes.userId, 'dr_elena');
  assert.strictEqual(typeof followRes.isFollowing, 'boolean');

  console.log('  ✔ Social & Community tests passed successfully.');
}

if (process.argv[1] && process.argv[1].endsWith('social.test.js')) {
  runSocialTests()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}
