import { useState, useEffect } from 'react';
import {
  Users,
  Trophy,
  ChefHat,
  Flame,
  PlusCircle,
  Sparkles,
  Heart,
  MessageSquare,
  Bookmark,
  BookmarkCheck,
  Star,
  CheckCircle2,
  Clock,
  ArrowRight,
  UserPlus,
  UserCheck,
  Search,
  Filter,
} from 'lucide-react';
import { getRecipesApi, toggleSaveRecipeApi } from '../../api/recipes.js';
import {
  getSocialFeedApi,
  cheerActivityApi,
  getChallengesApi,
  joinChallengeApi,
  getLeaderboardApi,
  getSuggestedChefsApi,
  toggleFollowChefApi,
} from '../../api/social.js';
import CreateCommunityRecipeModal from '../../components/community/CreateCommunityRecipeModal.jsx';
import UserProfileModal from '../../components/community/UserProfileModal.jsx';
import RecipeDetailModal from '../../components/recipes/RecipeDetailModal.jsx';
import './CommunityPage.css';

export default function CommunityPage() {
  const [activeTab, setActiveTab] = useState('recipes'); // 'recipes' | 'challenges' | 'feed'
  const [recipes, setRecipes] = useState([]);
  const [feedItems, setFeedItems] = useState([]);
  const [challenges, setChallenges] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [suggestedChefs, setSuggestedChefs] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals state
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [selectedAuthorId, setSelectedAuthorId] = useState(null);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [recipeModalOpen, setRecipeModalOpen] = useState(false);

  // Loading states
  const [loadingRecipes, setLoadingRecipes] = useState(true);
  const [joiningChallengeId, setJoiningChallengeId] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoadingRecipes(true);
      const [recList, feedList, chList, leadList, chefsList] = await Promise.all([
        getRecipesApi(),
        getSocialFeedApi(),
        getChallengesApi(),
        getLeaderboardApi('c1'),
        getSuggestedChefsApi(),
      ]);

      setRecipes(recList || []);
      setFeedItems(feedList || []);
      setChallenges(chList || []);
      setLeaderboard(leadList || []);
      setSuggestedChefs(chefsList || []);
    } catch (err) {
      console.warn('Error loading community data:', err);
    } finally {
      setLoadingRecipes(false);
    }
  };

  // Recipe Bookmark
  const handleBookmarkToggle = async (recipeId, e) => {
    if (e) e.stopPropagation();
    try {
      await toggleSaveRecipeApi(recipeId);
      setRecipes((prev) =>
        prev.map((r) => (r.id === recipeId ? { ...r, saved: !r.saved } : r))
      );
    } catch (err) {
      setRecipes((prev) =>
        prev.map((r) => (r.id === recipeId ? { ...r, saved: !r.saved } : r))
      );
    }
  };

  // Cheer / Like Activity
  const handleCheer = async (activityId) => {
    try {
      const res = await cheerActivityApi(activityId);
      setFeedItems((prev) =>
        prev.map((item) =>
          item.id === activityId
            ? { ...item, isCheered: res.cheered, likesCount: res.likesCount }
            : item
        )
      );
    } catch (err) {
      setFeedItems((prev) =>
        prev.map((item) =>
          item.id === activityId
            ? {
                ...item,
                isCheered: !item.isCheered,
                likesCount: item.isCheered ? item.likesCount - 1 : item.likesCount + 1,
              }
            : item
        )
      );
    }
  };

  // Join Challenge
  const handleJoinChallenge = async (chId) => {
    setJoiningChallengeId(chId);
    try {
      const res = await joinChallengeApi(chId);
      if (res.challenge) {
        setChallenges((prev) =>
          prev.map((c) => (c.id === chId ? res.challenge : c))
        );
      }
      // Refresh feed
      const updatedFeed = await getSocialFeedApi();
      setFeedItems(updatedFeed);
    } catch (err) {
      setChallenges((prev) =>
        prev.map((c) =>
          c.id === chId
            ? {
                ...c,
                status: 'joined',
                participantCount: c.participantCount + 1,
                currentStreakDays: 1,
                progressPercent: 3,
              }
            : c
        )
      );
    } finally {
      setJoiningChallengeId(null);
    }
  };

  // Follow Chef
  const handleFollowChef = async (chefId, e) => {
    if (e) e.stopPropagation();
    try {
      const res = await toggleFollowChefApi(chefId);
      setSuggestedChefs((prev) =>
        prev.map((c) =>
          c.id === chefId
            ? { ...c, isFollowing: res.isFollowing, followersCount: res.followersCount }
            : c
        )
      );
    } catch (err) {
      setSuggestedChefs((prev) =>
        prev.map((c) =>
          c.id === chefId
            ? {
                ...c,
                isFollowing: !c.isFollowing,
                followersCount: c.isFollowing ? c.followersCount - 1 : c.followersCount + 1,
              }
            : c
        )
      );
    }
  };

  // Open Author Profile
  const handleOpenAuthorProfile = (authorId, e) => {
    if (e) e.stopPropagation();
    setSelectedAuthorId(authorId);
    setProfileModalOpen(true);
  };

  // Callback when a new recipe is published
  const handleRecipePublished = (newRecipe) => {
    setRecipes([newRecipe, ...recipes]);
    getSocialFeedApi().then(setFeedItems);
  };

  // Filtered recipes
  const filteredRecipes = recipes.filter((r) => {
    const matchesCategory =
      selectedCategory === 'All' ||
      r.category === selectedCategory ||
      (r.tags && r.tags.includes(selectedCategory));

    const matchesSearch =
      !searchQuery ||
      r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (r.description && r.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (r.author && r.author.name.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="community-page-container">
      {/* Top Hero Banner */}
      <div className="community-hero-banner">
        <div className="community-hero-content">
          <div className="community-badge-pill">
            <Users size={14} />
            <span>Recip52 Global Community</span>
          </div>
          <h1 className="community-hero-title">
            Fuel Together. Master Your Nutrition.
          </h1>
          <p className="community-hero-desc">
            Discover community-crafted recipes, rate &amp; review culinary creations, join 30-day macro challenges, and celebrate consistency with fellow health enthusiasts.
          </p>
        </div>

        <div className="community-hero-actions">
          <button
            type="button"
            className="btn-create-recipe-hero"
            onClick={() => setCreateModalOpen(true)}
          >
            <PlusCircle size={18} />
            <span>Share Your Recipe</span>
          </button>
        </div>
      </div>

      {/* Suggested Creators / Featured Chefs Row */}
      <div className="suggested-chefs-section">
        <div className="section-subhead">
          <span>Featured Health Creators</span>
          <span style={{ fontSize: '0.8rem', color: '#8C867E' }}>Tap to inspect profile &amp; recipes</span>
        </div>
        <div className="suggested-chefs-scroll">
          {suggestedChefs.map((chef) => (
            <div
              key={chef.id}
              className="chef-pill-card"
              onClick={() => handleOpenAuthorProfile(chef.id)}
            >
              <img src={chef.avatar} alt={chef.name} className="chef-pill-avatar" />
              <div className="chef-pill-info">
                <div className="chef-pill-name">{chef.name}</div>
                <div className="chef-pill-badge">{chef.badge}</div>
              </div>
              <button
                type="button"
                className={`chef-follow-btn ${chef.isFollowing ? 'active' : ''}`}
                onClick={(e) => handleFollowChef(chef.id, e)}
              >
                {chef.isFollowing ? <UserCheck size={14} /> : <UserPlus size={14} />}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Main Tab Navigation Bar */}
      <div className="community-tabs-nav">
        <button
          type="button"
          className={`comm-tab-btn ${activeTab === 'recipes' ? 'active' : ''}`}
          onClick={() => setActiveTab('recipes')}
        >
          <ChefHat size={18} />
          <span>Community Recipes ({recipes.length})</span>
        </button>

        <button
          type="button"
          className={`comm-tab-btn ${activeTab === 'challenges' ? 'active' : ''}`}
          onClick={() => setActiveTab('challenges')}
        >
          <Trophy size={18} />
          <span>30-Day Challenges</span>
          <span className="comm-tab-badge">Active</span>
        </button>

        <button
          type="button"
          className={`comm-tab-btn ${activeTab === 'feed' ? 'active' : ''}`}
          onClick={() => setActiveTab('feed')}
        >
          <Flame size={18} />
          <span>Activity Stream</span>
        </button>
      </div>

      {/* TAB 1: COMMUNITY RECIPES */}
      {activeTab === 'recipes' && (
        <div className="comm-tab-content">
          {/* Filter / Search Bar */}
          <div className="comm-filter-bar">
            <div className="comm-search-input-wrap">
              <Search size={16} color="#8C867E" />
              <input
                type="text"
                placeholder="Search recipes, chefs, ingredients..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="comm-category-pills">
              {['All', 'High-Protein', 'Keto', 'Vegetarian', 'Vegan', 'Breakfast'].map((cat) => (
                <button
                  key={cat}
                  type="button"
                  className={`comm-cat-pill ${selectedCategory === cat ? 'selected' : ''}`}
                  onClick={() => setSelectedCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Recipes Grid */}
          {loadingRecipes ? (
            <div style={{ textAlign: 'center', padding: '60px', color: '#F4C430' }}>
              Loading community recipes...
            </div>
          ) : filteredRecipes.length === 0 ? (
            <div className="comm-empty-state">
              <ChefHat size={44} color="#8C867E" />
              <h3>No recipes found</h3>
              <p>Try searching for a different term or publish the first recipe in this category!</p>
              <button
                type="button"
                className="btn-primary"
                onClick={() => setCreateModalOpen(true)}
                style={{ marginTop: '12px' }}
              >
                Share Your Recipe
              </button>
            </div>
          ) : (
            <div className="comm-recipes-grid">
              {filteredRecipes.map((recipe) => (
                <div
                  key={recipe.id}
                  className="comm-recipe-card"
                  onClick={() => {
                    setSelectedRecipe(recipe);
                    setRecipeModalOpen(true);
                  }}
                >
                  {/* Card Thumbnail */}
                  <div className="comm-recipe-thumb-wrap">
                    <img src={recipe.image} alt={recipe.name} className="comm-recipe-thumb" />
                    <div className="comm-recipe-badges-overlay">
                      <span className="comm-category-tag">{recipe.category}</span>
                      {recipe.rating && (
                        <span className="comm-rating-tag">
                          <Star size={12} fill="#F4C430" /> {recipe.rating} ({recipe.reviewCount || 1})
                        </span>
                      )}
                    </div>
                    <button
                      type="button"
                      className="comm-bookmark-btn"
                      onClick={(e) => handleBookmarkToggle(recipe.id, e)}
                      title={recipe.saved ? 'Remove Bookmark' : 'Save Recipe'}
                    >
                      {recipe.saved ? (
                        <BookmarkCheck size={18} color="#F4C430" />
                      ) : (
                        <Bookmark size={18} color="#ffffff" />
                      )}
                    </button>
                  </div>

                  {/* Card Body */}
                  <div className="comm-recipe-card-body">
                    {/* Author Row */}
                    {recipe.author && (
                      <div
                        className="comm-recipe-author"
                        onClick={(e) => handleOpenAuthorProfile(recipe.author.id, e)}
                      >
                        <img
                          src={recipe.author.avatar}
                          alt={recipe.author.name}
                          className="comm-author-avatar"
                        />
                        <div>
                          <div className="comm-author-name">{recipe.author.name}</div>
                          <div className="comm-author-badge">{recipe.author.badge}</div>
                        </div>
                      </div>
                    )}

                    <h3 className="comm-recipe-card-title">{recipe.name}</h3>
                    <p className="comm-recipe-card-desc">{recipe.description}</p>

                    {/* Macro Breakdown */}
                    <div className="comm-recipe-macro-chips">
                      <div className="comm-macro-chip kcal">
                        <Flame size={12} />
                        <span>{recipe.calories} kcal</span>
                      </div>
                      <div className="comm-macro-chip protein">
                        <span>{recipe.protein}g P</span>
                      </div>
                      <div className="comm-macro-chip carbs">
                        <span>{recipe.carbs}g C</span>
                      </div>
                      <div className="comm-macro-chip fat">
                        <span>{recipe.fat}g F</span>
                      </div>
                    </div>
                  </div>

                  {/* Card Footer */}
                  <div className="comm-recipe-card-footer">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem', color: '#8C867E' }}>
                      <Clock size={13} />
                      <span>{recipe.prepTime} prep</span>
                    </div>
                    <span className="comm-view-recipe-link">
                      View Recipe &amp; Reviews <ArrowRight size={14} />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: 30-DAY CHALLENGES & LEADERBOARDS */}
      {activeTab === 'challenges' && (
        <div className="comm-tab-content">
          <div className="challenges-layout-grid">
            {/* Challenges Cards Column */}
            <div className="challenges-list-col">
              <div style={{ marginBottom: '16px' }}>
                <h2 style={{ fontSize: '1.25rem', color: '#ffffff', margin: '0 0 4px 0' }}>
                  Live 30-Day Nutrition Sprints
                </h2>
                <p style={{ fontSize: '0.85rem', color: '#8C867E', margin: 0 }}>
                  Commit to a macro or hydration standard for 30 consecutive days to earn titan badges and scale the leaderboard.
                </p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {challenges.map((ch) => {
                  const isJoined = ch.status === 'joined';
                  const isJoining = joiningChallengeId === ch.id;

                  return (
                    <div key={ch.id} className={`challenge-card ${isJoined ? 'joined' : ''}`}>
                      <div className="challenge-card-banner-wrap">
                        <img src={ch.bannerUrl} alt={ch.title} className="challenge-banner-img" />
                        <div className="challenge-banner-overlay">
                          <span className="challenge-badge-chip">
                            <Trophy size={13} /> {ch.badgeName}
                          </span>
                          <span className="challenge-participants-chip">
                            <Users size={13} /> {ch.participantCount.toLocaleString()} participants
                          </span>
                        </div>
                      </div>

                      <div className="challenge-card-body">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
                          <div>
                            <h3 className="challenge-title">{ch.title}</h3>
                            <p className="challenge-tagline">{ch.tagline}</p>
                          </div>
                          <div className="challenge-target-box">
                            <div className="target-lbl">Daily Target</div>
                            <div className="target-val">{ch.targetValue}</div>
                          </div>
                        </div>

                        <p className="challenge-desc">{ch.description}</p>

                        {/* Progress Meter if Joined */}
                        {isJoined ? (
                          <div className="challenge-progress-box">
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '6px' }}>
                              <span style={{ color: '#FF6347', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <Flame size={14} /> Active Streak: {ch.currentStreakDays} Days
                              </span>
                              <span style={{ color: '#F4C430', fontWeight: 600 }}>
                                {ch.progressPercent}% Completed ({ch.points} pts)
                              </span>
                            </div>
                            <div className="challenge-progress-track">
                              <div
                                className="challenge-progress-fill"
                                style={{ width: `${ch.progressPercent}%` }}
                              />
                            </div>
                          </div>
                        ) : (
                          <div className="challenge-action-row">
                            <button
                              type="button"
                              className="btn-join-challenge"
                              onClick={() => handleJoinChallenge(ch.id)}
                              disabled={isJoining}
                            >
                              <Trophy size={16} />
                              <span>{isJoining ? 'Enrolling...' : 'Join 30-Day Challenge'}</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Standings & Leaderboard Column */}
            <div className="leaderboard-col">
              <div className="leaderboard-card">
                <div className="leaderboard-header">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Trophy size={20} color="#F4C430" />
                    <div>
                      <h3 style={{ margin: 0, fontSize: '1.05rem', color: '#ffffff' }}>Live Leaderboard</h3>
                      <p style={{ margin: 0, fontSize: '0.78rem', color: '#8C867E' }}>30-Day Protein Power Surge</p>
                    </div>
                  </div>
                  <span className="live-pulse-badge">LIVE</span>
                </div>

                <div className="leaderboard-list">
                  {leaderboard.map((user) => {
                    const isCurrentUser = user.userId === 'user_current';
                    return (
                      <div
                        key={user.userId}
                        className={`leaderboard-row ${isCurrentUser ? 'current-user' : ''}`}
                        onClick={() => !isCurrentUser && handleOpenAuthorProfile(user.userId)}
                      >
                        <div className="rank-num">
                          {user.rank === 1 ? '🥇' : user.rank === 2 ? '🥈' : user.rank === 3 ? '🥉' : `#${user.rank}`}
                        </div>
                        <img src={user.avatar} alt={user.name} className="leaderboard-avatar" />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div className="leaderboard-user-name">
                            {user.name}
                          </div>
                          <div className="leaderboard-streak">
                            <Flame size={12} color="#FF6347" /> {user.streak}d streak • {user.badge}
                          </div>
                        </div>
                        <div className="leaderboard-score">{user.score} pts</div>
                      </div>
                    );
                  })}
                </div>

                <div className="leaderboard-footer-tip">
                  💡 Every day you log all meals hitting target macros adds +100 challenge points!
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: ACTIVITY STREAM */}
      {activeTab === 'feed' && (
        <div className="comm-tab-content">
          <div className="feed-container">
            <div style={{ marginBottom: '16px' }}>
              <h2 style={{ fontSize: '1.25rem', color: '#ffffff', margin: '0 0 4px 0' }}>
                Community Milestones &amp; Cheers
              </h2>
              <p style={{ fontSize: '0.85rem', color: '#8C867E', margin: 0 }}>
                Real-time accomplishments, recipe drops, and cheer celebrations from your fitness circle.
              </p>
            </div>

            <div className="feed-list">
              {feedItems.map((act) => (
                <div key={act.id} className="feed-item-card">
                  <img
                    src={act.user.avatar}
                    alt={act.user.name}
                    className="feed-avatar"
                    onClick={() => handleOpenAuthorProfile(act.user.id)}
                  />

                  <div className="feed-item-content">
                    <div className="feed-header-line">
                      <span
                        className="feed-user-name"
                        onClick={() => handleOpenAuthorProfile(act.user.id)}
                      >
                        {act.user.name}
                      </span>
                      {act.user.badge && (
                        <span className="feed-user-badge">{act.user.badge}</span>
                      )}
                      <span className="feed-time-ago">• {act.timeAgo}</span>
                    </div>

                    <p className="feed-text">{act.title}</p>

                    <div className="feed-item-actions">
                      <button
                        type="button"
                        className={`feed-cheer-btn ${act.isCheered ? 'cheered' : ''}`}
                        onClick={() => handleCheer(act.id)}
                      >
                        <Heart
                          size={16}
                          fill={act.isCheered ? '#FF6347' : 'transparent'}
                          color={act.isCheered ? '#FF6347' : '#8C867E'}
                        />
                        <span>{act.likesCount || 0} Cheers</span>
                      </button>

                      {act.recipeId && (
                        <button
                          type="button"
                          className="feed-recipe-link-btn"
                          onClick={() => {
                            const rec = recipes.find((r) => r.id === act.recipeId);
                            if (rec) {
                              setSelectedRecipe(rec);
                              setRecipeModalOpen(true);
                            }
                          }}
                        >
                          <ChefHat size={14} />
                          <span>View Recipe</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* MODALS */}
      {/* 1. Share Community Recipe Modal */}
      <CreateCommunityRecipeModal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onRecipePublished={handleRecipePublished}
      />

      {/* 2. User Public Profile Modal */}
      <UserProfileModal
        userId={selectedAuthorId}
        isOpen={profileModalOpen}
        onClose={() => setProfileModalOpen(false)}
        onSelectRecipe={(recipe) => {
          setSelectedRecipe(recipe);
          setRecipeModalOpen(true);
        }}
      />

      {/* 3. Recipe Detail & Community Reviews Modal */}
      <RecipeDetailModal
        recipe={selectedRecipe}
        isOpen={recipeModalOpen}
        onClose={() => {
          setRecipeModalOpen(false);
          setSelectedRecipe(null);
        }}
        onBookmarkToggle={handleBookmarkToggle}
      />
    </div>
  );
}
