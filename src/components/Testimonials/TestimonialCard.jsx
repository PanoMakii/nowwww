import { Quote, Star, BadgeCheck } from "lucide-react";

function TestimonialCard({
    name,
    role,
    avatar,
    rating,
    review,
    tag,
    date,
}) {
    return (
        <article className="t-card">

            <div className="t-card-top">

                <Quote
                    size={22}
                    className="t-quote"
                />

                <span className="t-store">
                    App Store
                </span>

            </div>

            <div className="t-rating">

    {[...Array(5)].map((_, index) => (

        <Star
            key={index}
            size={16}
            fill={index < rating ? "currentColor" : "none"}
            strokeWidth={1.8}
        />

    ))}

    <span className="t-date">
        {date}
    </span>

</div>

            <p className="t-review">

                {review}

            </p>

            <div className="t-tag">

                {tag}

            </div>

            <div className="t-footer">

                <div className="t-user">

                    <div className="t-avatar">

    <img
        src={avatar}
        alt={name}
        loading="lazy"
    />

</div>

                    <div>

                        <p className="t-user-name">
                            {name}
                        </p>

                        <span>
                            {role}
                        </span>

                        <small className="verified">

    <BadgeCheck
        size={14}
        strokeWidth={2}
    />

    Verified

</small>

                    </div>

                </div>

            </div>

        </article>
    );
}

export default TestimonialCard;
