import "./Testimonials.css";
import SectionTitle from "../../ui/SectionTitle/SectionTitle";
import { Users, Star, Trophy, } from "lucide-react";
import TestimonialCard from "./TestimonialCard";
import testimonials from "./testimonialsData";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
// import CountUp from "react-countup";

const stats = [
    {
        value: "150K+",
        label: "Healthy Users",
        icon: Users,
    },
    {
        value: "4.9",
        label: "Average Rating",
        icon: Star,
    },
    {
        value: "92%",
        label: "Goal Success",
        icon: Trophy,
    },
];

function Testimonials() {
    const [testimonialTitle, setTestimonialTitle] = useState("");
    const [isTitleVisible, setIsTitleVisible] = useState(false);

    useEffect(() => {
        if (!isTitleVisible) return;

        const text = "Ready to Eat Smarter?";
        const speed = 3000 / text.length;

        let index = 0;

        const timer = setInterval(() => {
            index++;

            setTestimonialTitle(text.slice(0, index));

            if (index >= text.length) {
                clearInterval(timer);
            }
        }, speed);

        return () => clearInterval(timer);
    }, [isTitleVisible]);
    return (
        <section className="testimonials section" id="testimonials">
            <div className="container">
                <div className="t-review-banner">
                    <div className="t-review-stars">
                        {[...Array(5)].map((_, index) => (
                            <Star key={index} size={16} fill="currentColor" strokeWidth={0} />
                        ))}
                    </div>

                    <p>
                        Rated <strong>4.9</strong> by over
                        <strong> 150,000 healthy eaters</strong>
                    </p>
                </div>
                <SectionTitle
                    badge="TRUSTED BY THOUSANDS"
                    title={
                        <>
                            Loved by
                            <br />
                            <span>Healthy Eaters.</span>
                        </>
                    }
                    subtitle="Real stories from people building healthier habits with Recip52."
                />
                <div className="t-stats">
                    {stats.map((stat) => {
                        const Icon = stat.icon;

                        return (
                            <div className="t-stat" key={stat.label}>
                                <div className="t-icon">
                                    <Icon size={20} />
                                </div>

                                <h3>{stat.value}</h3>

                                <p>{stat.label}</p>
                            </div>
                        );
                    })}
                </div>

                <div className="t-grid">
                    {testimonials.map((item) => (
                        <TestimonialCard key={item.id} {...item} />
                    ))}
                </div>

                <motion.div
                    className="testimonial-cta"
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: .7 }}
                    viewport={{ once: true }}
                >

                    <span className="cta-badge">
                        BUILT FOR REAL LIFE
                    </span>

                    <motion.h2
                        onViewportEnter={() => setIsTitleVisible(true)}
                        viewport={{ once: true, amount: 0.5 }}
                    >
                        {testimonialTitle.slice(0, 12)}
                        <span>{testimonialTitle.slice(12)}</span>
                    </motion.h2>

                    <p>
                        Healthy eating starts with one simple decision.
                        Discover recipes, build meal plans and stay on
                        track with Recip52.
                    </p>

                    <a
                        href="#download"
                        className="cta-btn"
                    >
                        Get Started Free
                    </a>

                    <div className="cta-trust">

                        <div className="cta-stars">

                            {[...Array(5)].map((_, i) => (
                                <Star
                                    key={i}
                                    size={15}
                                    fill="currentColor"
                                    strokeWidth={0}
                                />
                            ))}

                        </div>

                        <span>
                            Trusted by 150,000+ healthy eaters
                        </span>

                    </div>

                </motion.div>
            </div>
        </section>
    );
}

export default Testimonials;
