import "./PhonePlaceholderPlan.css";

import {
    Compass,
    CalendarDays,
    Activity,
    Settings,
    Wifi,
    Battery,
    Sparkles,
    ChevronRight,
} from "lucide-react";

const weekDays = [
    { day: "Mon", meal: "Oat Bowl", kcal: 420, color: "#4F7942" },
    { day: "Tue", meal: "Grilled Salmon", kcal: 510, color: "#F4C430" },
    { day: "Wed", meal: "Veggie Wrap", kcal: 380, color: "#4F7942" },
    { day: "Thu", meal: "Chicken Rice", kcal: 540, color: "#F4C430" },
    { day: "Fri", meal: "Avocado Toast", kcal: 350, color: "#4F7942" },
];

function PhonePlaceholderPlan() {
    return (
        <>
            <div className="pln-phone-shadow"></div>
            <div className="pln-phone">
                <div className="pln-phone-header">
                    <div className="pln-phone-time">9:41</div>
                    <div className="pln-dynamic-island"></div>
                    <div className="pln-phone-status">
                        <Wifi size={14} strokeWidth={2.5} />
                        <Battery size={18} strokeWidth={2.5} />
                    </div>
                </div>

                <div className="pln-phone-content">
                    <div className="pln-top">
                        <div>
                            <p className="pln-label">This Week</p>
                            <p className="pln-title">Meal Plan</p>
                        </div>
                        <div className="pln-ai-badge">
                            <Sparkles size={12} />
                            AI
                        </div>
                    </div>

                    <div className="pln-macro-row">
                        <div className="pln-macro">
                            <span className="pln-macro-val">1,850</span>
                            <span className="pln-macro-label">Avg kcal</span>
                        </div>
                        <div className="pln-macro-divider" />
                        <div className="pln-macro">
                            <span className="pln-macro-val">120g</span>
                            <span className="pln-macro-label">Protein</span>
                        </div>
                        <div className="pln-macro-divider" />
                        <div className="pln-macro">
                            <span className="pln-macro-val">5</span>
                            <span className="pln-macro-label">Days</span>
                        </div>
                    </div>

                    <div className="pln-day-list">
                        {weekDays.map((d) => (
                            <div className="pln-day-row" key={d.day}>
                                <span className="pln-day-tag" style={{ background: `${d.color}18`, color: d.color }}>
                                    {d.day}
                                </span>
                                <div className="pln-day-info">
                                    <span className="pln-day-meal">{d.meal}</span>
                                    <span className="pln-day-kcal">{d.kcal} kcal</span>
                                </div>
                                <ChevronRight size={14} color="#ccc" />
                            </div>
                        ))}
                    </div>

                    <button className="pln-regen-btn">
                        <Sparkles size={14} />
                        Regenerate Plan
                    </button>
                </div>

                <div className="pln-bottom-nav">
                    <div className="pln-nav-item">
                        <Compass size={18} />
                        <span>Discover</span>
                    </div>
                    <div className="pln-nav-item pln-active">
                        <CalendarDays size={18} />
                        <span>Plan</span>
                    </div>
                    <div className="pln-nav-item">
                        <Activity size={18} />
                        <span>Track</span>
                    </div>
                    <div className="pln-nav-item">
                        <Settings size={18} />
                        <span>Settings</span>
                    </div>
                </div>
            </div>
        </>
    );
}

export default PhonePlaceholderPlan;
