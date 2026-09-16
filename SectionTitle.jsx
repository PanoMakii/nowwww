import "./SectionTitle.css";

function SectionTitle({
    badge,
    title,
    subtitle,
    align = "center",
}) {
    return (
        <div className={`section-title ${align}`}>
            {badge && (
                <span className="section-badge">
                    {badge}
                </span>
            )}

            {title && (
                <h2>
                    {title}
                </h2>
            )}

            {subtitle && (
                <p>
                    {subtitle}
                </p>
            )}
        </div>
    );
}

export default SectionTitle;
