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
        return code.split('\n').map((line, index) => (
            <div key={index} className="code-line">
                <span className="line-number">{index + 1}</span>
                <span className="line-content">{line}</span>
            </div>
        ));
    };

    return (
        <div className="code-block-display">
            <div className="code-block-header">
                <h3 className="code-block-title">{block.title}</h3>
                <button
                    className="copy-button"
                    onClick={() => copyToClipboard(block.code)}
                >
                    {copied ? "Copied!" : "Copy"}
                </button>
            </div>
            <div className="code-container">
                <pre>
                    <code>{addLineNumbers(block.code)}</code>
                </pre>
            </div>
        </div>
    );
};

const CodeBlockDisplay = ({ codeBlocks }) => {
    return (
        <div className="code-blocks-container">
            {codeBlocks.map((block, index) => (
                <CodeBlock key={index} block={block} />
            ))}
        </div>
    );
};

export default CodeBlockDisplay;