import "./Hero.css";
import FloatingIngredients from "./FloatingIngredients";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
// import LiquidGlass from "../LiquidGlass/LiquidGlass";

import {
    Star,
    Play,
    Compass,
    CalendarDays,
    Activity,
    Settings,
    Flame,
    Wifi,
    Battery,
    Heart,
    SunMedium,
    Apple,
} from "lucide-react";

function Hero() {
    // const text = "Your Health,\nYour Way.";
const [displayText, setDisplayText] = useState("");

useEffect(() => {
    let index = 0;
    const text = "Your Health,\nYour Way.";
    const speed = 3000 / text.length;

    const timer = setInterval(() => {
        index++;

        setDisplayText(text.slice(0, index));

        if (index >= text.length) {
            clearInterval(timer);
        }
    }, speed);

    return () => clearInterval(timer);
}, []);
    return (
  <motion.section
    className="hero"
    id="home"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.6 }}
    viewport={{ once: true }}
>
            <div className="hero-container">
                {/* LEFT */}
                <motion.div
                    className="hero-content"
                    initial={{ opacity: 0, x: -60 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                        duration: 0.8,
                        delay: 0.2,
                    }}
                >
                    <span className="hero-badge">
                        <Star size={18} fill="#F4C430" color="#F4C430" />
                        Trusted by 100K+ Healthy Food Lovers
                    </span>

<h1>
    {displayText.split("\n").map((line, index) => (
        <span key={index}>
            {line}
            {index === 0 && <br />}
        </span>
    ))}
</h1>

                    <p>
                        Track meals, discover healthy recipes, monitor nutrients and achieve
                        your wellness goals effortlessly with Recip52.
                    </p>

                    <div className="hero-buttons">
                        <button className="primary-btn">Download Now</button>

                        <button className="secondary-btn">
                            <Play size={18} />
                            Watch Demo
                        </button>
                    </div>

                    <div className="hero-stats">
                        <div className="stat-card">
                            <Star size={18} fill="#F4C430" color="#F4C430" />

                            <div>
                                <p className="stat-value">4.9★</p>

                                <span>App Rating</span>
                            </div>
                        </div>

                        <div className="stat-card">
                            <Flame size={18} />

                            <div>
                                <p className="stat-value">1M+</p>

                                <span>Meals Logged</span>
                            </div>
                        </div>

                        <div className="stat-card">
                            <Heart size={18} />

                            <div>
                                <p className="stat-value">150K+</p>

                                <span>Happy Users</span>
                            </div>
                        </div>
                    </div>
                </motion.div>
                {/* RIGHT */}

                <motion.div
                    className="hero-image"
                    initial={{
                        opacity: 0,
                        x: 80,
                        rotate: -8,
                    }}
                    animate={{
                        opacity: 1,
                        x: 0,
                        rotate: 0,
                    }}
                    transition={{
                        duration: 0.9,
                        delay: 0.35,
                        type: "spring",
                        stiffness: 80,
                    }}
                >
                    <FloatingIngredients />
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
                                    <p className="greeting-text">Good Morning</p>
                                    <SunMedium size={18} />
                                </div>

                                <p className="welcome-name">Malik</p>
                            </div>

                            <div className="goal-card">
                                <div className="goal-top">
                                    <div className="goal-title">
                                        <Flame size={18} />

                                        <span>Today's Goal</span>
                                    </div>

                                    <span className="goal-percent">84%</span>
                                </div>

                                <p className="goal-value">
                                    1845
                                    <span>/2200 kcal</span>
                                </p>

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
                                        <p className="meal-name">Avocado Bowl</p>

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
                </motion.div>
            </div>
        </motion.section>
    );
}

export default Hero;
