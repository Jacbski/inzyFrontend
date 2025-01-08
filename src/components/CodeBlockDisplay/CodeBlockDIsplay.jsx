import React, { useState } from 'react';
import './css/CodeBlockDisplay.css';

const CodeBlock = ({ block }) => {
    const [copied, setCopied] = useState(false);

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };

    const addLineNumbers = (code) => {
        if (typeof code !== 'string') {
            return <div className="code-line">Invalid code format</div>;
        }
        return code.split('\n').map((line, index) => (
            <div key={index} className="code-line">
                <span className="line-number">{index + 1}</span>
                <span className="line-content">{line}</span>
            </div>
        ));
    };

    if (!block || typeof block !== 'object') {
        return <span>No valid code block provided</span>;
    }

    const title = block.title || 'Untitled Code Block';
    const code = block.code || '';

    return (
        <div className="code-block-display">
            <div className="code-block-header">
                <h3 className="code-block-title">{title}</h3>
                <button
                    className="copy-button"
                    onClick={() => copyToClipboard(code)}
                >
                    {copied ? "Copied!" : "Copy"}
                </button>
            </div>
            <div className="code-container">
                <pre>
                    <code>{addLineNumbers(code)}</code>
                </pre>
            </div>
        </div>
    );
};

const CodeBlockDisplay = ({ codeBlocks }) => {
    if (!Array.isArray(codeBlocks) || codeBlocks.length === 0) {
        return <div className="code-blocks-container">No code attached</div>;
    }

    return (
        <div className="code-blocks-container">
            {codeBlocks.map((block, index) => (
                <CodeBlock key={index} block={block} />
            ))}
        </div>
    );
};

export default CodeBlockDisplay;