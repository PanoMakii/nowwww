import { useState, useEffect } from 'react';
import {
  X,
  UserPlus,
  UserCheck,
  Flame,
  ChefHat,
  Users,
  MapPin,
  Award,
  Sparkles,
  Star,
} from 'lucide-react';
import { getPublicProfileApi, toggleFollowChefApi } from '../../api/social.js';
import './UserProfileModal.css';

export default function UserProfileModal({ userId, isOpen, onClose, onSelectRecipe }) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followersCount, setFollowersCount] = useState(0);

  useEffect(() => {
    if (userId && isOpen) {
      setLoading(true);
      getPublicProfileApi(userId)
        .then((data) => {
          if (data) {
            setProfile(data);
            setIsFollowing(!!data.isFollowing);
            setFollowersCount(data.followersCount || 0);
          }
        })
        .catch((err) => {
          console.warn('Error fetching profile:', err);
        })
        .finally(() => setLoading(false));
    }
  }, [userId, isOpen]);

  if (!isOpen) return null;

  const handleToggleFollow = async () => {
    try {
      const res = await toggleFollowChefApi(userId);
      setIsFollowing(res.isFollowing);
      setFollowersCount(res.followersCount);
    } catch (err) {
      setIsFollowing(!isFollowing);
      setFollowersCount((prev) => (isFollowing ? prev - 1 : prev + 1));
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="user-profile-modal" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="user-modal-close" onClick={onClose}>
          <X size={20} />
        </button>

        {loading || !profile ? (
          <div style={{ padding: '60px', textAlign: 'center', color: '#F4C430' }}>
            Loading creator profile...
          </div>
        ) : (
          <>
            {/* Profile Cover & Header */}
            <div className="user-profile-hero">
              <img
                src={profile.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&h=200&q=80'}
                alt={profile.name}
                className="user-profile-avatar"
              />
              <div className="user-profile-details">
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                  <h2 className="user-profile-name">{profile.name}</h2>
                  {profile.badge && (
                    <span className="user-profile-badge">
                      <Award size={12} /> {profile.badge}
                    </span>
                  )}
                </div>
                <div className="user-profile-sub">
                  <span>{profile.handle || '@chef'}</span>
                  {profile.location && (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      • <MapPin size={12} /> {profile.location}
                    </span>
                  )}
                </div>
              </div>

              {profile.id !== 'user_current' && (
                <button
                  type="button"
                  onClick={handleToggleFollow}
                  className={`btn-follow-creator ${isFollowing ? 'following' : ''}`}
                >
                  {isFollowing ? (
                    <>
                      <UserCheck size={16} />
                      <span>Following</span>
                    </>
                  ) : (
                    <>
                      <UserPlus size={16} />
                      <span>Follow</span>
                    </>
                  )}
                </button>
              )}
            </div>

            {/* Profile Stats Grid */}
            <div className="user-stats-grid">
              <div className="user-stat-card">
                <div className="user-stat-val" style={{ color: '#F4C430' }}>{followersCount.toLocaleString()}</div>
                <div className="user-stat-lbl">Followers</div>
              </div>
              <div className="user-stat-card">
                <div className="user-stat-val">{profile.followingCount || 42}</div>
                <div className="user-stat-lbl">Following</div>
              </div>
              <div className="user-stat-card">
                <div className="user-stat-val" style={{ color: '#FF6347', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                  <Flame size={16} /> {profile.streakDays || 14}d
                </div>
                <div className="user-stat-lbl">Active Streak</div>
              </div>
              <div className="user-stat-card">
                <div className="user-stat-val" style={{ color: '#7BB661' }}>{profile.recipes?.length || profile.recipesCount || 0}</div>
                <div className="user-stat-lbl">Recipes</div>
              </div>
            </div>

            {/* Bio */}
            {profile.bio && (
              <p className="user-profile-bio">
                {profile.bio}
              </p>
            )}

            {/* Authored Community Recipes */}
            <div className="user-recipes-section">
              <h3 style={{ fontSize: '1.05rem', fontWeight: 600, color: '#ffffff', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ChefHat size={18} color="#F4C430" />
                <span>Created Recipes ({profile.recipes?.length || 0})</span>
              </h3>

              {(!profile.recipes || profile.recipes.length === 0) ? (
                <div style={{ textAlign: 'center', padding: '24px', color: '#8C867E', fontSize: '0.85rem' }}>
                  No published community recipes yet.
                </div>
              ) : (
                <div className="user-recipes-list">
                  {profile.recipes.map((r) => (
                    <div
                      key={r.id}
                      className="user-recipe-card"
                      onClick={() => {
                        onClose();
                        if (onSelectRecipe) onSelectRecipe(r);
                      }}
                    >
                      <img src={r.image} alt={r.name} className="user-recipe-thumb" />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#ffffff', marginBottom: '4px' }}>
                          {r.name}
                        </div>
                        <div style={{ display: 'flex', gap: '10px', fontSize: '0.78rem', color: '#8C867E' }}>
                          <span style={{ color: '#F4C430' }}>{r.calories} kcal</span>
                          <span style={{ color: '#FF6347' }}>{r.protein}g protein</span>
                          {r.rating && (
                            <span style={{ display: 'flex', alignItems: 'center', gap: '2px', color: '#F4C430' }}>
                              <Star size={11} fill="#F4C430" /> {r.rating}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
