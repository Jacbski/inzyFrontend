import React from "react";
import "./css/Regulations.scss";

const Regulations = () => {
  return (
    <div className="regulations">
      <h1>PIOT Platform Regulations</h1>
      <ol>
        <li>
          <strong>Purpose of the Platform</strong>
          <p>
            PIOT is a platform designed to support knowledge sharing, inspire
            creativity, and enable meaningful discussions in the field of
            Internet of Things (IoT) technology.
          </p>
        </li>
        <li>
          <strong>User Registration</strong>
          <p>
            Registration is free. By signing up, users agree to provide accurate
            information and abide by the community guidelines.
          </p>
        </li>
        <li>
          <strong>Community Guidelines</strong>
          <p>
            Treat all members with respect. Offensive, discriminatory, or
            illegal content is strictly prohibited.
          </p>
          <p>
            Keep discussions relevant to IoT and contribute valuable,
            constructive content. A professional yet friendly tone is
            encouraged.
          </p>
        </li>
        <li>
          <strong>Content Publishing</strong>
          <p>
            Users are encouraged to share original content. Do not post
            materials that violate copyright or intellectual property laws.
          </p>
          <p>
            If sharing code or resources, ensure compliance with relevant
            licenses and properly credit the authors.
          </p>
        </li>
        <li>
          <strong>Moderation</strong>
          <p>
            Moderators ensure a positive and productive community environment.
            They have the right to remove content that violates the regulations
            and suspend users who break the rules.
          </p>
          <p>
            Users may appeal moderation decisions through the contact form
            provided on the platform.
          </p>
        </li>
        <li>
          <strong>Privacy and Security</strong>
          <p>
            Respect the privacy of others. Do not share personal or sensitive
            information publicly. Users are responsible for protecting their own
            data when participating in the platform.
          </p>
          <p>
            Any personal information shared with the platform is used only to
            support platform operations and will not be shared with third
            parties without the user's explicit consent.
          </p>
        </li>
        <li>
          <strong>Changes to the Regulations</strong>
          <p>
            The administration reserves the right to update the regulations.
          </p>
        </li>
        <li>
          <strong>Contact and Support</strong>
          <p>
            For questions or concerns, users can reach out via the contact form
            available on the platform.
          </p>
        </li>
        {/* <li className="gdpr">
          <strong>GDPR Compliance</strong>
          <p>
            All personal data is processed in compliance with the General Data
            Protection Regulation (GDPR). User data is not shared with third
            parties without explicit consent and is used exclusively for
            platform-related purposes.
          </p>
        </li> */}
      </ol>
    </div>
  );
};

export default Regulations;
