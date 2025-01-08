import React from 'react';
import './css/donate.css';

const Donate = ({ link }) => {
    const openDonateWindow = () => {
        const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

        if (isMobile) {
            window.open(link, '_blank', 'noopener,noreferrer');
        } else {
            const width = 500;
            const height = 700;
            const left = (window.innerWidth - width) / 2;
            const top = (window.innerHeight - height) / 2;

            window.open(
                link,
                'StripeCheckout',
                `width=${width},height=${height},top=${top},left=${left},toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars=yes,resizable=yes`
            );
        }
    };

    return (
        <div className="donate-section">
            <p className="donate-text">Donation link:</p>
            {link ? (
                <button onClick={openDonateWindow} className="donate-button">
                    Donate
                </button>
            ) : (
                <p>Donation link not attached</p>
            )}
        </div>
    );
};

export default Donate;