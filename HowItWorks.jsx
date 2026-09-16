import "./HowItWorks.css";
import SectionTitle from "../../ui/SectionTitle/SectionTitle";
import { motion } from "framer-motion";
import { Camera, Sparkles, Globe, ChartColumn, Target, Watch } from "lucide-react";

import PhonePlaceholderTrack    from "../../assets/PhonePlaceholder/PhonePlaceholderTrack";
import PhonePlaceholderPlan     from "../../assets/PhonePlaceholder/PhonePlaceholderPlan";
import PhonePlaceholderDiscover from "../../assets/PhonePlaceholder/PhonePlaceholderDiscover";
import PhonePlaceholderInsights from "../../assets/PhonePlaceholder/PhonePlaceholderInsights";
import PhonePlaceholderGoals    from "../../assets/PhonePlaceholder/PhonePlaceholderGoals";
import PhonePlaceholderWearable from "../../assets/PhonePlaceholder/PhonePlaceholderWearable";

const steps = [
    {
        number: "01",
        icon: Camera,
        title: "Smart Meal Tracking",
        description:
            "Snap a photo of your meal or log it manually. Recip52 instantly estimates calories, macros, and nutrients in seconds — no guesswork, no tedious entry.",
        cta: "Start Tracking",
        Phone: PhonePlaceholderTrack,
    },
    {
        number: "02",
        icon: Sparkles,
        title: "AI Meal Planner",
        description:
            "Tell us your goals, preferences, and household size. Our AI builds a balanced weekly meal plan around your life — not the other way around.",
        cta: "Plan My Week",
        Phone: PhonePlaceholderPlan,
    },
    {
        number: "03",
        icon: Globe,
        title: "Discover Global Recipes",
        description:
            "Explore thousands of healthy recipes from cuisines around the world, all personalised to your taste and nutritional targets.",
        cta: "Explore Recipes",
        Phone: PhonePlaceholderDiscover,
    },
    {
        number: "04",
        icon: ChartColumn,
        title: "Nutrition Insights",
        description:
            "Monitor your calories, protein, water intake, and trends over time through beautiful, easy-to-read analytics that actually make sense.",
        cta: "View Insights",
        Phone: PhonePlaceholderInsights,
    },
    {
        number: "05",
        icon: Target,
        title: "Personalized Plans",
        description:
            "Whether you're losing weight, building muscle, or simply eating cleaner — receive meal suggestions that adapt as your goals evolve.",
        cta: "Set My Goals",
        Phone: PhonePlaceholderGoals,
    },
    {
        number: "06",
        icon: Watch,
        title: "Wearable Sync",
        description:
            "Connect Apple Health, Google Fit, or your fitness wearable. Everything stays in sync automatically so your nutrition data is always complete.",
        cta: "Connect Device",
        Phone: PhonePlaceholderWearable,
    },
];

function StepRow({ step, index }) {
    const isEven = index % 2 !== 0;
    const Icon = step.icon;
    const Phone = step.Phone;

    const textBlock = (
        <motion.div
            className="hiw-text"
            initial={{ opacity: 0, x: isEven ? 60 : -60 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            viewport={{ once: true }}
        >
            <span className="hiw-step-number">{step.number}</span>
            <div className="hiw-icon-wrap">
                <Icon size={26} />
            </div>
            <h3>{step.title}</h3>
            <p>{step.description}</p>
            <button className="hiw-cta-btn">{step.cta}</button>
        </motion.div>
    );

    const phoneBlock = (
        <motion.div
            className="hiw-phone-wrap"
            initial={{ opacity: 0, x: isEven ? -60 : 60 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.1 }}
            viewport={{ once: true }}
        >
            <Phone />
        </motion.div>
    );

    return (
        <div className={`hiw-row ${isEven ? "hiw-row--reverse" : ""}`}>
            {textBlock}
            {phoneBlock}
        </div>
    );
}

function HowItWorks() {
    return (
        <section className="hiw section section-glass" id="how-it-works">
            <div className="container">
                <motion.div
                    initial={{ opacity: 0, y: 35 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                >
                    <SectionTitle
                        badge="HOW IT WORKS"
                        title={
                            <>
                                Healthy Eating,
                                <br />
                                <span>Made <b>Effortless.</b></span>
                            </>
                        }
                        subtitle="Six simple steps to transform the way you eat, plan, and feel — powered by AI and built around your life."
                    />
                </motion.div>

                <div className="hiw-steps">
                    {steps.map((step, i) => (
                        <StepRow key={step.number} step={step} index={i} />
                    ))}
                </div>
            </div>
        </section>
    );
}

export default HowItWorks;
