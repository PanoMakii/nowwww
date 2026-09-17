import "./FloatingIngredients.css";

import avocado from "../../assets/images/ingredients/avocado-optimized.webp";
import broccoli from "../../assets/images/ingredients/broccoli-optimized.webp";
import strawberry from "../../assets/images/ingredients/strawberry.webp";
import lemon from "../../assets/images/ingredients/lemon.webp";

import { motion } from "framer-motion";

function FloatingIngredients() {
    return (
        <>
            <motion.img
                src={avocado}
                className="floating avocado"
                alt="Fresh avocado"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                    duration: 0.8,
                    delay: 0.7
                }}
            />
            <motion.img
                src={strawberry}
                className="floating strawberry"
                alt="Fresh strawberry"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                    duration: 0.8,
                    delay: 0.8
                }}
            />
            <motion.img
                src={broccoli}
                className="floating broccoli"
                alt="Fresh broccoli"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                    duration: 0.8,
                    delay: 0.9
                }}
            />
            <motion.img
                src={lemon}
                className="floating lemon"
                alt="Fresh lemon"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                    duration: 0.8,
                    delay: 1.0
                }}
            />
        </>
    );
}

export default FloatingIngredients;
