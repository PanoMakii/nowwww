import "./Footer.css";
import { motion } from "framer-motion";
import { ArrowRight, Heart, Star } from "lucide-react";
import { FaFacebookF, FaTwitter, FaInstagram, FaYoutube } from "react-icons/fa";
import logo from "../../assets/icons/recip52-icon-horizontal-Green.svg";

function Footer() {
    const currentYear = new Date().getFullYear();

    const navLinks = [
        { label: "Features", href: "#features" },
        { label: "How It Works", href: "#how-it-works" },
        { label: "Testimonials", href: "#testimonials" },
        { label: "Contact", href: "#contact" },
    ];

    const socialLinks = [
        { icon: FaFacebookF, href: "#", label: "Facebook", color: "#1877F2" },
        { icon: FaInstagram, href: "#", label: "Instagram", color: "#E4405F" },
        { icon: FaTwitter, href: "#", label: "Twitter", color: "#1DA1F2" },
        { icon: FaYoutube, href: "#", label: "YouTube", color: "#FF0000" },
    ];

    const footerVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.7, ease: "easeOut" },
        },
    };

    return (
        <motion.footer
            className="footer"
            id="footer"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            variants={footerVariants}
        >
            <div className="footer-glass">
                <div className="footer-inner">
                    <div className="footer-grid">
                        {/* Brand Column */}
                        <div className="footer-brand">
                            <a href="#home" className="footer-logo">
                                <img src={logo} alt="Recip52 Logo" />
                            </a>
                            <p className="footer-description">
                                Your personalized nutrition companion. Track meals, discover
                                healthy recipes, and achieve your wellness goals effortlessly.
                            </p>
                            <div className="footer-social">
                                {socialLinks.map(({ icon: Icon, href, label, color }) => (
                                    <a
                                        key={label}
                                        href={href}
                                        className="footer-social-link"
                                        aria-label={label}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        style={{ "--social-color": color }}
                                    >
                                        <Icon size={18} />
                                    </a>
                                ))}
                            </div>
                        </div>

                        {/* Navigation Columns */}
                        <div className="footer-links">
                            <h4>Quick Links</h4>
                            <ul>
                                {navLinks.map(({ label, href }) => (
                                    <li key={label}>
                                        <a href={href}>{label}</a>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="footer-links">
                            <h4>Resources</h4>
                            <ul>
                                <li>
                                    <a href="#features">Features</a>
                                </li>
                                <li>
                                    <a href="#how-it-works">How It Works</a>
                                </li>
                                <li>
                                    <a href="#testimonials">Testimonials</a>
                                </li>
                                <li>
                                    <a href="#contact">Contact</a>
                                </li>
                            </ul>
                        </div>

                        {/* Newsletter Column */}
                        <div className="footer-newsletter">
                            <h4>Stay Nourished</h4>
                            <p>
                                Subscribe to get weekly recipes, nutrition tips, and exclusive
                                updates from the Recip52 kitchen.
                            </p>
                            <form
                                className="footer-newsletter-form"
                                onSubmit={(e) => e.preventDefault()}
                            >
                                <div className="footer-form-group">
                                    <input
                                        type="email"
                                        placeholder="Enter your email"
                                        aria-label="Email address"
                                        required
                                    />
                                    <button type="submit">
                                        <ArrowRight size={18} />
                                    </button>
                                </div>
                            </form>
                            <div className="footer-trust">
                                <div className="footer-stars">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} size={14} fill="#F4C430" color="#F4C430" />
                                    ))}
                                </div>
                                <span>Trusted by 150,000+ healthy eaters</span>
                            </div>
                        </div>
                    </div>

                    {/* Bottom Bar */}
                    <div className="footer-bottom">
                        <div className="footer-bottom-left">
                            <p>
                                &copy; {currentYear} Recip52. All rights reserved.
                                <span className="footer-heart">
                                    Made with <Heart size={14} fill="#FF6347" color="#FF6347" />{" "}
                                    for healthy living
                                </span>
                            </p>
                        </div>
                        <div className="footer-bottom-right">
                            <a href="#">Privacy Policy</a>
                            <a href="#">Terms of Service</a>
                            <a href="#">Cookies</a>
                        </div>
                    </div>
                </div>
            </div>
        </motion.footer>
    );
}

export default Footer;
