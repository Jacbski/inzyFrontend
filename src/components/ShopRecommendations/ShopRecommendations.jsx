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
                <select
                    value={selectedShop}
                    onChange={(e) => setSelectedShop(e.target.value)}
                    className="shop-select"
                >
                    <option value="Amazon">Amazon</option>
                    <option value="Botland">Botland</option>
                </select>
            </div>
            <ul className="item-list">
                {items.map((item, index) => (
                    <li key={index} className="item">
                        <span>{item}</span>
                        <button
                            className={getButtonClass(selectedShop)}
                            onClick={() => window.open(getSearchUrl(selectedShop, item), '_blank')}
                        >
                            Search on {selectedShop}
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ShopRecommendations;