import "./PhonePlaceholderGoals.css";

import {
    Compass,
    CalendarDays,
    Activity,
    Settings,
    Wifi,
    Battery,
    Target,
    CheckCircle2,
} from "lucide-react";

const goals = [
    { label: "Lose Weight",    active: true  },
    { label: "Build Muscle",   active: false },
    { label: "Eat Cleaner",    active: false },
    { label: "Boost Energy",   active: false },
];

const milestones = [
    { text: "Log 3 meals today",        done: true  },
    { text: "Hit 100g protein",         done: true  },
    { text: "Drink 2L water",           done: false },
    { text: "Stay under 2,200 kcal",    done: false },
];

function PhonePlaceholderGoals() {
    return (
        <>
            <div className="gls-phone-shadow"></div>
            <div className="gls-phone">
                <div className="gls-phone-header">
                    <div className="gls-phone-time">9:41</div>
                    <div className="gls-dynamic-island"></div>
                    <div className="gls-phone-status">
                        <Wifi size={14} strokeWidth={2.5} />
                        <Battery size={18} strokeWidth={2.5} />
                    </div>
                </div>

                <div className="gls-phone-content">
                    <div className="gls-top">
                        <div>
                            <p className="gls-label">Tailored For You</p>
                            <h4 className="gls-title">My Goals</h4>
                        </div>
                        <Target size={20} color="#4F7942" />
                    </div>

                    {/* Goal selector */}
                    <div className="gls-goal-list">
                        {goals.map((g) => (
                            <div key={g.label} className={`gls-goal-chip ${g.active ? "gls-goal-active" : ""}`}>
                                {g.label}
                            </div>
                        ))}
                    </div>

                    {/* Progress ring card */}
                    <div className="gls-progress-card">
                        <div className="gls-ring-wrap">
                            <svg viewBox="0 0 80 80" width="80" height="80">
                                <circle cx="40" cy="40" r="32" fill="none" stroke="#E9ECEF" strokeWidth="6"/>
                                <circle cx="40" cy="40" r="32" fill="none" stroke="#4F7942" strokeWidth="6"
                                    strokeDasharray="134 201" strokeLinecap="round"
                                    transform="rotate(-90 40 40)"/>
                            </svg>
                            <div className="gls-ring-center">
                                <span className="gls-ring-pct">67%</span>
                                <span className="gls-ring-sub">done</span>
                            </div>
                        </div>
                        <div className="gls-ring-info">
                            <p className="gls-ring-title">Weekly Progress</p>
                            <p className="gls-ring-desc">You're on track! Keep it up through the weekend.</p>
                        </div>
                    </div>

                    {/* Milestones */}
                    <div className="gls-milestones">
                        {milestones.map((m) => (
                            <div key={m.text} className="gls-milestone-row">
                                <CheckCircle2
                                    size={16}
                                    color={m.done ? "#4F7942" : "#E9ECEF"}
                                    fill={m.done ? "#DDEFD7" : "none"}
                                />
                                <span className={`gls-milestone-text ${m.done ? "gls-done" : ""}`}>{m.text}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="gls-bottom-nav">
                    <div className="gls-nav-item"><Compass size={18} /><span>Discover</span></div>
                    <div className="gls-nav-item"><CalendarDays size={18} /><span>Plan</span></div>
                    <div className="gls-nav-item gls-active"><Activity size={18} /><span>Track</span></div>
                    <div className="gls-nav-item"><Settings size={18} /><span>Settings</span></div>
                </div>
            </div>
        </>
    );
}

export default PhonePlaceholderGoals;
