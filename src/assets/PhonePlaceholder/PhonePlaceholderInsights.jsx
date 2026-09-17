import "./PhonePlaceholderInsights.css";

import {
    Compass,
    CalendarDays,
    Activity,
    Settings,
    Wifi,
    Battery,
    TrendingUp,
} from "lucide-react";

const bars = [65, 80, 55, 90, 70, 84, 60];
const days = ["M", "T", "W", "T", "F", "S", "S"];

const nutrients = [
    { label: "Protein", val: "82g", pct: 82, color: "#4F7942" },
    { label: "Carbs",   val: "210g", pct: 68, color: "#F4C430" },
    { label: "Fats",    val: "54g",  pct: 54, color: "#FF6347" },
    { label: "Water",   val: "1.5L", pct: 60, color: "#4FC3F7" },
];

function PhonePlaceholderInsights() {
    return (
        <>
            <div className="ins-phone-shadow"></div>
            <div className="ins-phone">
                <div className="ins-phone-header">
                    <div className="ins-phone-time">9:41</div>
                    <div className="ins-dynamic-island"></div>
                    <div className="ins-phone-status">
                        <Wifi size={14} strokeWidth={2.5} />
                        <Battery size={18} strokeWidth={2.5} />
                    </div>
                </div>

                <div className="ins-phone-content">
                    <div className="ins-top">
                        <div>
                            <p className="ins-label">This Week</p>
                            <p className="ins-title">Nutrition Insights</p>
                        </div>
                        <div className="ins-trend-badge">
                            <TrendingUp size={12} />
                            +12%
                        </div>
                    </div>

                    {/* Calorie summary */}
                    <div className="ins-summary-card">
                        <div className="ins-summary-left">
                            <span className="ins-summary-val">1,845</span>
                            <span className="ins-summary-label">kcal today</span>
                        </div>
                        <div className="ins-ring">
                            <svg viewBox="0 0 44 44" width="52" height="52">
                                <circle cx="22" cy="22" r="18" fill="none" stroke="#E9ECEF" strokeWidth="4"/>
                                <circle cx="22" cy="22" r="18" fill="none" stroke="#4F7942" strokeWidth="4"
                                    strokeDasharray="84 113" strokeLinecap="round"
                                    transform="rotate(-90 22 22)"/>
                            </svg>
                            <span className="ins-ring-label">84%</span>
                        </div>
                    </div>

                    {/* Bar chart */}
                    <div className="ins-chart">
                        {bars.map((h, i) => (
                            <div className="ins-bar-col" key={i}>
                                <div
                                    className="ins-bar"
                                    style={{
                                        height: `${h}%`,
                                        background: i === 5
                                            ? "#4F7942"
                                            : "linear-gradient(180deg,#DDEFD7,#E8F5E9)"
                                    }}
                                />
                                <span className="ins-bar-day">{days[i]}</span>
                            </div>
                        ))}
                    </div>

                    {/* Nutrient bars */}
                    <div className="ins-nutrients">
                        {nutrients.map((n) => (
                            <div className="ins-nutrient-row" key={n.label}>
                                <span className="ins-nutrient-label">{n.label}</span>
                                <div className="ins-nutrient-track">
                                    <div
                                        className="ins-nutrient-fill"
                                        style={{ width: `${n.pct}%`, background: n.color }}
                                    />
                                </div>
                                <span className="ins-nutrient-val">{n.val}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="ins-bottom-nav">
                    <div className="ins-nav-item">
                        <Compass size={18} /><span>Discover</span>
                    </div>
                    <div className="ins-nav-item">
                        <CalendarDays size={18} /><span>Plan</span>
                    </div>
                    <div className="ins-nav-item ins-active">
                        <Activity size={18} /><span>Track</span>
                    </div>
                    <div className="ins-nav-item">
                        <Settings size={18} /><span>Settings</span>
                    </div>
                </div>
            </div>
        </>
    );
}

export default PhonePlaceholderInsights;
