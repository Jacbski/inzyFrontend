import React, { useState } from 'react';
import './css/ShopRecommendations.css';

const ShopRecommendations = ({ items }) => {
    const [selectedShop, setSelectedShop] = useState('Amazon');

    const getSearchUrl = (shop, itemName) => {
        if (shop === 'Amazon') {
            const baseUrl = 'https://www.amazon.com/s';
            const params = new URLSearchParams({
                k: itemName
            });
            return `${baseUrl}?${params.toString()}`;
        } else {
            return `https://botland.com.pl/szukaj?s=${encodeURIComponent(itemName)}`;
        }
    };

    const getButtonClass = (shop) => {
        return `search-button ${shop === 'Amazon' ? 'amazon-button' : 'botland-button'}`;
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
                                onClick={() => window.open(getSearchUrl(selectedShop, item.itemName), '_blank')}
                            >
                                Search on {selectedShop}
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default ShopRecommendations;