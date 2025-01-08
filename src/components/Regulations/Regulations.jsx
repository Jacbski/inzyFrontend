import React from "react";
import "./css/Regulations.scss";

const Regulations = () => {
  return (
    <div className="regulations">
      <h1>Regulations of the PIOT</h1>
      <ol>
        <li>
          <strong>Purpose of the Website</strong>
          <p>
            The website aims to facilitate knowledge exchange, support, and
            collaboration in the field of Internet of Things (IoT) technology
            within the spirit of open source.
          </p>
        </li>
        <li>
          <strong>User Registration</strong>
          <p>
            Registration is free. Each user agrees to provide accurate
            information during registration.
          </p>
        </li>
        <li>
          <strong>Rules of Participation</strong>
          <p>
            Respect other users. It is prohibited to post offensive,
            discriminatory, or illegal content.
          </p>
          <p>
            Maintain a professional and polite tone. Posts should align with the
            forum's topics and provide valuable content.
          </p>
        </li>
        <li>
          <strong>Content Publishing Rules</strong>
          <p>
            All materials published by users should comply with open source
            licenses (e.g., MIT, GPL).
          </p>
          <p>
            It is forbidden to post content protected by copyright without
            proper permission.
          </p>
        </li>
        <li>
          <strong>Moderators</strong>
          <p>
            Moderators have the right to remove content that violates the rules
            and block users who breach the terms.
          </p>
          <p>
            Moderator decisions are final, but users may appeal via the contact
            form.
          </p>
        </li>
        <li>
          <strong>Security Guidelines</strong>
          <p>Do not share personal or confidential information publicly.</p>
          <p>
            The website is not responsible for losses resulting from the
            publication of sensitive data by users.
          </p>
        </li>
        <li>
          <strong>Privacy Policy</strong>
          <p>
            User data is processed in accordance with applicable data protection
            laws.
          </p>
        </li>
        <li>
          <strong>Changes to the Regulations</strong>
          <p>The administration reserves the right to amend the regulations.</p>
        </li>
        <li>
          <strong>Contact</strong>
          <p>
            All questions and comments can be submitted via the contact form
            available on the website.
          </p>
        </li>
        <li className="rodo">
          <strong>GDPR and Data Processing</strong>
          <p>
            All personal data of users is processed in accordance with the
            General Data Protection Regulation (GDPR). Data is used solely for
            purposes related to the operation of the website and is not shared
            with third parties without the user's consent.
          </p>
        </li>
      </ol>
    </div>
  );
};

export default Regulations;
