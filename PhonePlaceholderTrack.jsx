import "./PhonePlaceholderTrack.css";

import {
    Compass,
    CalendarDays,
    Activity,
    Settings,
    Flame,
    Wifi,
    Battery,
    SunMedium,
    Apple,
} from "lucide-react";

function PhonePlaceholder() {
    return (
        <>
            <div className="phone-shadow"></div>
            <div className="phone">
                        <div className="phone-header">
                            <div className="phone-time">9:41</div>

                            <div className="dynamic-island"></div>

                            <div className="phone-status">
                                <Wifi size={14} strokeWidth={2.5} />
                                <Battery size={18} strokeWidth={2.5} />
                            </div>
                        </div>

                        <div className="phone-content">
                            <div className="welcome">
                                <div className="greeting">
                                    <h4>Good Morning</h4>
                                    <SunMedium size={18} />
                                </div>

                                <h3 className="welcome-name">Malik</h3>
                            </div>

                            <div className="goal-card">
                                <div className="goal-top">
                                    <div className="goal-title">
                                        <Flame size={18} />

                                        <span>Today's Goal</span>
                                    </div>

                                    <span className="goal-percent">84%</span>
                                </div>

                                <h2>
                                    1845
                                    <span>/2200 kcal</span>
                                </h2>

                                <div className="progress">
                                    <div className="progress-fill"></div>
                                </div>

                                <p>355 kcal remaining</p>
                            </div>

                            <div className="meal-card">
                                <div className="meal-info">
                                    <div className="meal-icon">

                                        <Apple size={22} />

                                    </div>

                                    <div>
                                        <h5>Avocado Bowl</h5>

                                        <p className="meal-calories">
                                            <span>High Protein • </span> <i>520 kcal</i>
                                        </p>
                                    </div>
                                </div>

                                <span className="meal-tag">High Protein</span>
                            </div>

                            <div className="nutrition">
                                <div className="nutrition-row">
                                    <span>Protein</span>
                                    <span>82g / 100g</span>
                                </div>

                                <div className="mini-progress">
                                    <div className="protein"></div>
                                </div>

                                <div className="nutrition-row">
                                    <span>Water</span>
                                    <span>1.5L / 2L</span>
                                </div>

                                <div className="mini-progress">
                                    <div className="water"></div>
                                </div>
                            </div>

                            <button className="track-btn">
                                <Flame size={18} />
                                Track Today's Meal
                            </button>
                        </div>

                        <div className="bottom-nav">
                            <div className="nav-item">
                                <Compass size={18} />

                                <span>Discover</span>
                            </div>

                            <div className="nav-item">
                                <CalendarDays size={18} />

                                <span>Plan</span>
                            </div>

                            <div className="nav-item active">
                                <Activity size={18} />

                                <span>Track</span>
                            </div>

                            <div className="nav-item">
                                <Settings size={18} />

                                <span>Settings</span>
                            </div>
                        </div>
                    </div>
                </>
    );
}

export default PhonePlaceholder;
