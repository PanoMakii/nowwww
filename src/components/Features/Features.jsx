import "./Features.css";
import FeatureCard from "./FeatureCard";
import SectionTitle from "../../ui/SectionTitle/SectionTitle";

import { motion } from "framer-motion";

import {
Camera,
Sparkles,
Globe,
ChartColumn,
Target,
Watch,
} from "lucide-react";

const features = [
{
    icon: Camera,
    title: "Smart Meal Tracking",
    description:
    "Snap a meal or log it manually. Recip52 instantly estimates calories, macros and nutrients in seconds.",
    cta: "Built for You",
},
{
    icon: Sparkles,
    title: "AI Meal Planner",
    description:
    "Let AI do the thinking. Generate balanced meal plans around your household, goals and food preferences.",
    cta: "Smart & Simple",
},
{
    icon: Globe,
    title: "Discover Global Recipes",
    description:
    "Explore healthy recipes from different cultures and cuisines personalized to your taste.",
    cta: "Discover More",
},
{
    icon: ChartColumn,
    title: "Nutrition Insights",
    description:
    "Monitor calories, protein, water intake and nutrition trends with beautiful analytics.",
    cta: "Explore Insights",
},
{
    icon: Target,
    title: "Personalized Plans",
    description:
    "Receive meal suggestions tailored to your health goals whether losing weight or building muscle.",
    cta: "Learn More",
},
{
    icon: Watch,
    title: "Wearable Sync",
    description:
    "Connect Apple Health, Google Fit and fitness wearables to keep everything in sync.",
    cta: "See How It Works",
},
];

const containerVariants = {
hidden: {},
visible: {
    transition: {
    staggerChildren: 0.15,
    },
},
};

function Features() {
return (
    <section className="features section-glass" id="features">
    <div className="container">
        <motion.div
    initial={{
        opacity: 0,
        y: 35,
    }}
    whileInView={{
        opacity: 1,
        y: 0,
    }}
    transition={{
        duration: 0.6,
    }}
    viewport={{
        once: true,
    }}
>
    <SectionTitle
        badge="WHY cHOOSE RECIP52?"
        title={
    <>
        Everything You Need
        <br />
        <span>to Eat <b>Smarter</b>.</span>
    </>
}
        subtitle="Powerful nutrition tools designed to help you build healthier habits every single day."
    />
</motion.div>

        <motion.div
        className="features-grid"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{
            once: true,
            amount: 0.25,
        }}
        >
        {features.map((feature) => (
            <FeatureCard key={feature.title} {...feature} />
        ))}
        </motion.div>
    </div>
    </section>
);
}

export default Features;
