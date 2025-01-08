import React, { useState } from 'react';
import './css/ShopRecommendations.css';

const ShopRecommendations = ({ items }) => {
    const [selectedShop, setSelectedShop] = useState('Amazon');

    const getSearchUrl = (shop, item) => {
        if (shop === 'Amazon') {
            const baseUrl = 'https://www.amazon.com/s';
            const params = new URLSearchParams({
                k: item.itemName
            });
            return `${baseUrl}?${params.toString()}`;
        } else if (shop === 'Botland') {
            return `https://botland.com.pl/szukaj?s=${encodeURIComponent(item.itemName)}`;
        } else if (shop === "Author's links") {
            if (item.itemLink &&
                item.itemLink.length > 0 &&
                item.itemLink[0] &&
                item.itemLink[0].trim() !== '') {
                return item.itemLink[0];
            }
            return null;
        }
        return '#';
    };

    const getButtonClass = (shop) => {
        return `search-button ${
            shop === 'Amazon'
                ? 'amazon-button'
                : shop === 'Botland'
                    ? 'botland-button'
                    : 'author-button'
        }`;
    };

    const isLinkAvailable = (item) => {
        return item.itemLink &&
            item.itemLink.length > 0 &&
            item.itemLink[0] &&
            item.itemLink[0].trim() !== '';
    };

    return (
        <div className="shop-recommendations">
            <div className="shop-header">
                <h4>Required Items:</h4>
                {items.length > 0 && (
                    <select
                        value={selectedShop}
                        onChange={(e) => setSelectedShop(e.target.value)}
                        className="shop-select"
                    >
                        <option value="Amazon">Amazon</option>
                        <option value="Botland">Botland</option>
                        <option value="Author's links">Author's links</option>
                    </select>
                )}
            </div>
            {items.length === 0 ? (
                <p>No required items for this project.</p>
            ) : (
                <ul className="item-list">
                    {items.map((item, index) => (
                        <li key={index} className="item">
                            <span>{item.itemName}</span>
                            <button
                                className={getButtonClass(selectedShop)}
                                onClick={() => {
                                    const url = getSearchUrl(selectedShop, item);
                                    if (url) window.open(url, '_blank');
                                }}
                                disabled={selectedShop === "Author's links" && !isLinkAvailable(item)}
                            >
                                {selectedShop === "Author's links"
                                    ? (isLinkAvailable(item) ? "View Link" : "No link available")
                                    : `Find on ${selectedShop}`}
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default ShopRecommendations;