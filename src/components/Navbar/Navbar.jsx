import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useAuth } from "../../context/AuthContext.jsx";
import "./Navbar.css";
import logo from "../../assets/icons/recip52-icon-horizontal-Green.svg";

const navLinks = [
    { href: "#features", label: "Features" },
    { href: "#how-it-works", label: "How it Works" },
    { href: "#testimonials", label: "Testimonials" },
    { href: "#contact", label: "Contact" },
];

function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const { isAuthenticated } = useAuth();

    // lock background scroll while the mobile menu is open
    useEffect(() => {
        document.body.style.overflow = isOpen ? "hidden" : "";
        return () => {
            document.body.style.overflow = "";
        };
    }, [isOpen]);

    // close on Escape
    useEffect(() => {
        function handleKey(e) {
            if (e.key === "Escape") setIsOpen(false);
        }
        window.addEventListener("keydown", handleKey);
        return () => window.removeEventListener("keydown", handleKey);
    }, []);

    const closeMenu = () => setIsOpen(false);

    return (
        <header className="header">
            <nav className="navbar container">
                {/* Logo */}
                <a href="#home" className="logo" onClick={closeMenu}>
                    <img src={logo} alt="Recip52 Logo" />
                </a>

                {/* Desktop Navigation */}
                <ul className="nav-links">
                    {navLinks.map((link) => (
                        <li key={link.href}>
                            <a href={link.href}>{link.label}</a>
                        </li>
                    ))}
                </ul>

                {/* Desktop CTA */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem' }}>
                    {isAuthenticated ? (
                        <Link to="/dashboard" className="download-btn">
                            Open Dashboard
                        </Link>
                    ) : (
                        <>
                            <Link to="/auth/login" style={{ textDecoration: 'none', color: '#222', fontWeight: 600 }}>
                                Sign In
                            </Link>
                            <Link to="/auth/signup" className="download-btn">
                                Get Started
                            </Link>
                        </>
                    )}
                </div>

                {/* Mobile menu toggle */}
                <button
                    type="button"
                    className="menu-toggle"
                    onClick={() => setIsOpen((prev) => !prev)}
                    aria-label={isOpen ? "Close menu" : "Open menu"}
                    aria-expanded={isOpen}
                    aria-controls="mobile-menu"
                >
                    {isOpen ? <X size={22} /> : <Menu size={22} />}
                </button>
            </nav>

            {/* Mobile menu */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        <motion.div
                            key="overlay"
                            className="mobile-overlay"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.25 }}
                            onClick={closeMenu}
                        />
                        <motion.div
                            key="menu"
                            id="mobile-menu"
                            className="mobile-menu"
                            initial={{ opacity: 0, y: -14 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -14 }}
                            transition={{ duration: 0.3, ease: "easeOut" }}
                        >
                            <ul className="mobile-nav-links">
                                {navLinks.map((link) => (
                                    <li key={link.href}>
                                        <a href={link.href} onClick={closeMenu}>
                                            {link.label}
                                        </a>
                                    </li>
                                ))}
                            </ul>

                            {isAuthenticated ? (
                                <Link
                                    to="/dashboard"
                                    className="download-btn mobile-download-btn"
                                    onClick={closeMenu}
                                >
                                    Open Dashboard
                                </Link>
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%' }}>
                                    <Link
                                        to="/auth/login"
                                        style={{ textDecoration: 'none', color: '#222', fontWeight: 600, textAlign: 'center', padding: '10px' }}
                                        onClick={closeMenu}
                                    >
                                        Sign In
                                    </Link>
                                    <Link
                                        to="/auth/signup"
                                        className="download-btn mobile-download-btn"
                                        onClick={closeMenu}
                                    >
                                        Get Started
                                    </Link>
                                </div>
                            )}
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </header>
    );
}

export default Navbar;
