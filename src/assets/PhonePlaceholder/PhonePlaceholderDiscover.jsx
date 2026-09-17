import "./PhonePlaceholderDiscover.css";

import {
    Compass,
    CalendarDays,
    Activity,
    Settings,
    Wifi,
    Battery,
    Search,
    Heart,
    CookingPot,
    Fish,
    Egg,
    Salad,
} from "lucide-react";

const recipes = [
    { name: "Jollof Rice Bowl", cuisine: "West African", kcal: 480, icon: Salad, color: "#D96B27", liked: true },
    { name: "Miso Salmon", cuisine: "Japanese", kcal: 410, icon: Fish, color: "#D96A78", liked: false },
    { name: "Shakshuka", cuisine: "Middle Eastern", kcal: 320, icon: Egg, color: "#C9573F", liked: true },
];

const tags = ["All", "African", "Asian", "Mediterranean"];

function PhonePlaceholderDiscover() {
    return (
        <>
            <div className="dsc-phone-shadow"></div>
            <div className="dsc-phone">
                <div className="dsc-phone-header">
                    <div className="dsc-phone-time">9:41</div>
                    <div className="dsc-dynamic-island"></div>
                    <div className="dsc-phone-status">
                        <Wifi size={14} strokeWidth={2.5} />
                        <Battery size={18} strokeWidth={2.5} />
                    </div>
                </div>

                <div className="dsc-phone-content">
                    <div className="dsc-top">
                        <div>
                            <p className="dsc-label">Explore</p>
                            <h4 className="dsc-title">Global Recipes</h4>
                        </div>
                        <div className="dsc-search-icon">
                            <Search size={16} color="#4F7942" />
                        </div>
                    </div>

                    {/* Filter tags */}
                    <div className="dsc-tags">
                        {tags.map((t, i) => (
                            <span key={t} className={`dsc-tag ${i === 0 ? "dsc-tag-active" : ""}`}>{t}</span>
                        ))}
                    </div>

                    {/* Featured card */}
                    <div className="dsc-featured">
                        <div className="dsc-featured-emoji">
                            <CookingPot size={26} strokeWidth={1.8} color="#B86B3D" />
                        </div>
                        <div className="dsc-featured-info">
                            <span className="dsc-featured-badge">Featured</span>
                            <h5>Moroccan Tagine</h5>
                            <p>North African · 520 kcal</p>
                        </div>
                        <Heart size={16} fill="#FF6347" color="#FF6347" className="dsc-featured-heart" />
                    </div>

                    {/* Recipe list */}
                    <div className="dsc-recipe-list">
                        {recipes.map((r) => (
                            <div className="dsc-recipe-row" key={r.name}>
                                <span className="dsc-recipe-emoji">
                                    <r.icon size={20} strokeWidth={1.8} color={r.color} />
                                </span>
                                <div className="dsc-recipe-info">
                                    <span className="dsc-recipe-name">{r.name}</span>
                                    <span className="dsc-recipe-meta">{r.cuisine} · {r.kcal} kcal</span>
                                </div>
                                <Heart
                                    size={14}
                                    fill={r.liked ? "#FF6347" : "none"}
                                    color={r.liked ? "#FF6347" : "#ccc"}
                                />
                            </div>
                        ))}
                    </div>
                </div>

                <div className="dsc-bottom-nav">
                    <div className="dsc-nav-item dsc-active">
                        <Compass size={18} />
                        <span>Discover</span>
                    </div>
                    <div className="dsc-nav-item">
                        <CalendarDays size={18} />
                        <span>Plan</span>
                    </div>
                    <div className="dsc-nav-item">
                        <Activity size={18} />
                        <span>Track</span>
                    </div>
                    <div className="dsc-nav-item">
                        <Settings size={18} />
                        <span>Settings</span>
                    </div>
                </div>
            </div>
        </>
    );
}

export default PhonePlaceholderDiscover;
