import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const cardVariants = {
    hidden: {
        opacity: 0,
        y: 50,
    },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.55,
            ease: "easeOut",
        },
    },
};

function FeatureCard({
    icon: Icon,
    title,
    description,
    cta,
}) {
    return (
        <motion.article
            className="feature-card"
            variants={cardVariants}
            initial="hidden"
            animate="visible"
        >
            <div className="feature-icon">
                <Icon size={30} />
            </div>

            <h3>{title}</h3>

            <p>{description}</p>

            <button className="feature-link">
                {cta}
                <ArrowRight size={18} />
            </button>
        </motion.article>
    );
}

export default FeatureCard;
