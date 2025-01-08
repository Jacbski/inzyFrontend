import React, { useState } from 'react';
import './css/Share.css';

const Share = () => {
    const [copySuccess, setCopySuccess] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const [isCopied, setIsCopied] = useState(false);

    const handleFacebookShare = () => {
        const url = encodeURIComponent(window.location.href);
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank', 'width=600,height=400');
    };

    const handleXShare = () => {
        const url = encodeURIComponent(window.location.href);
        window.open(`https://twitter.com/intent/tweet?url=${url}`, '_blank', 'width=600,height=400');
    };

    const handleCopyLink = () => {
        const projectUrl = window.location.href;
        navigator.clipboard.writeText(projectUrl).then(() => {
            setIsCopied(true);
            setCopySuccess('URL copied!');
            setTimeout(() => {
                setIsCopied(false);
                setCopySuccess('');
            }, 2000);
        }, (err) => {
            console.error('Failed to copy: ', err);
            setCopySuccess('Failed to copy');
        });
    };

    return (
        <div className="social-share">
            <button className="share-button" onClick={() => setIsOpen(!isOpen)}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="18" cy="5" r="3"></circle>
                    <circle cx="6" cy="12" r="3"></circle>
                    <circle cx="18" cy="19" r="3"></circle>
                    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
                    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
                </svg>
                Share
            </button>
            {isOpen && (
                <div className="dropdown-menu">
                    <button onClick={handleFacebookShare}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                        </svg>
                        Share on Facebook
                    </button>
                    <button onClick={handleXShare}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                        </svg>
                        Share on X
                    </button>
                    <button onClick={handleCopyLink}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                        </svg>
                        {isCopied ? 'Copied' : 'Copy Link'}
                    </button>
                </div>
            )}
        </div>
    );
};

export default Share;