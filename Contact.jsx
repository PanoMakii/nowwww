import "./Contact.css";
import SectionTitle from "../../ui/SectionTitle/SectionTitle";
import { motion } from "framer-motion";
import { ArrowRight, ChevronDown, Mail, MessageCircle } from "lucide-react";

function Contact() {
    return (
        <section
            className="contact section"
            id="contact"
        >
            <div className="container">

                <motion.div
                    className="contact-header"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{
                        duration: 0.6,
                        ease: "easeOut",
                    }}
                    viewport={{
                        once: true,
                        amount: 0.2,
                    }}
                >
                    <SectionTitle
                        badge="GET IN TOUCH"
                        title={
                            <>
                                Let's Make
                                <br />
                                <span>Healthy Eating Easier.</span>
                            </>
                        }
                        subtitle="Have a question about Recip52, need support, or simply want to say hello? We'd love to hear from you."
                    />
                </motion.div>

                <div className="contact-layout">

                    {/* LEFT */}
                    <motion.div
                        className="contact-info"
                        initial={{
                            opacity: 0,
                            x: -40,
                        }}
                        whileInView={{
                            opacity: 1,
                            x: 0,
                        }}
                        transition={{
                            duration: 0.7,
                        }}
                        viewport={{
                            once: true,
                            amount: 0.2,
                        }}
                    >

                        <div className="contact-intro">
                            <div className="contact-icon">
                                <MessageCircle size={22} />
                            </div>

                            <div>
                                <h3>We'd love to hear from you.</h3>

                                <p>
                                    Whether you're exploring Recip52,
                                    need help with something, or have
                                    feedback to share, send us a message.
                                </p>
                            </div>
                        </div>

                        <a
                            href="mailto:hello@recip52.com"
                            className="contact-email"
                        >
                            <Mail size={18} />
                            hello@recip52.com
                        </a>

                        <div className="contact-cta">

                            <span>
                                READY TO GET STARTED?
                            </span>

                            <h3>
                                Build healthier habits
                                <br />
                                one meal at a time.
                            </h3>

                            <a
                                href="#download"
                                className="contact-download"
                            >
                                Get Started Free
                                <ArrowRight size={18} />
                            </a>

                        </div>
                        <div className="contact-newsletter">
                            <span className="contact-newsletter-label">
                                THE WEEKLY GASTRONOME
                            </span>

                            <h3>
                                A little inspiration
                                <br />
                                for your kitchen.
                            </h3>

                            <p>
                                Get seasonal recipes, clever cooking techniques,
                                ingredient inspiration, and occasional invitations
                                from the Recip52 kitchen.
                            </p>

                            <form
                                className="newsletter-form"
                                onSubmit={(event) => event.preventDefault()}
                            >
                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    aria-label="Email address"
                                />

                                <button type="submit">
                                    Join Club
                                </button>
                            </form>
                        </div>

                    </motion.div>

                    {/* RIGHT */}
                    <motion.form
                        className="contact-form"
                        initial={{
                            opacity: 0,
                            x: 40,
                        }}
                        whileInView={{
                            opacity: 1,
                            x: 0,
                        }}
                        transition={{
                            duration: 0.7,
                            delay: 0.1,
                        }}
                        viewport={{
                            once: true,
                            amount: 0.2,
                        }}
                        onSubmit={(event) => {
                            event.preventDefault();
                        }}
                    >

                        <div className="contact-field">
                            <label htmlFor="contact-name">
                                Name
                            </label>

                            <input
                                id="contact-name"
                                name="name"
                                type="text"
                                placeholder="Your name"
                                autoComplete="name"
                            />
                        </div>

                        <div className="contact-field">
                            <label htmlFor="contact-email">
                                Email
                            </label>

                            <input
                                id="contact-email"
                                name="email"
                                type="email"
                                placeholder="you@example.com"
                                autoComplete="email"
                            />
                        </div>

                        <div className="contact-field">
                            <label htmlFor="contact-subject">
                                Subject
                            </label>

                            <div className="contact-select-wrap">
                                <select
                                    id="contact-subject"
                                    name="subject"
                                    defaultValue=""
                                >
                                    <option value="" disabled>
                                        What can we help with?
                                    </option>

                                    <option value="support">
                                        Product Support
                                    </option>

                                    <option value="feedback">
                                        Feedback
                                    </option>

                                    <option value="partnership">
                                        Partnership
                                    </option>

                                    <option value="other">
                                        Something Else
                                    </option>
                                </select>

                                <ChevronDown
                                    className="contact-select-icon"
                                    size={18}
                                    aria-hidden="true"
                                />
                            </div>
                        </div>

                        <div className="contact-field">
                            <label htmlFor="contact-message">
                                Message
                            </label>

                            <textarea
                                id="contact-message"
                                name="message"
                                rows="6"
                                placeholder="Tell us what's on your mind..."
                            />
                        </div>

                        <button
    type="submit"
    className="contact-submit"
>
    <span>Send Message</span>
    <ArrowRight
        className="contact-submit-arrow"
        size={18}
    />
</button>

                    </motion.form>

                </div>
            </div>
        </section>
    );
}

export default Contact;
