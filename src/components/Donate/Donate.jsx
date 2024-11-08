import React from 'react';
import './css/Donate.css';

const Donate = ({ link }) => {
    return (
        <div className="donate">
            <p className="donate-text">Donation link:</p>
            <a
                href={link}
                target="_blank"
                className="donate-button"
            >
                <img
                    src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png"
                    alt="Buy Me A Coffee"
                    className="donate-image"
                />
            </a>
        </div>
    );
};

export default Donate;