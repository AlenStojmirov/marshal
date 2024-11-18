import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const FilterComponent = ({products, onFilter, onClear}) => {
    // Extract unique categories, prices, and brands
    const uniqueCategories = [...new Set(Object.values(products).map(product => product.category).sort())];
    const uniquePrices = [...new Set(Object.values(products).map(product => product.price).sort((a, b) => a - b))];
    const uniqueBrands = [...new Set(Object.values(products).map(product => product.brand).sort())];

    // State for selected filters
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedPrice, setSelectedPrice] = useState('');
    const [selectedBrand, setSelectedBrand] = useState('');

    // Function to filter products based on selected filters
    const filterProducts = () => {
        return Object.fromEntries(
            Object.entries(products).filter(([key, product]) => {
                return (
                    (!selectedCategory || product.category === selectedCategory) &&
                    (!selectedPrice || product.price === Number(selectedPrice)) &&
                    (!selectedBrand || product.brand === selectedBrand)
                );
            })
        );
    };

    // Use effect to trigger the onFilter callback whenever the filters change
    React.useEffect(() => {
        const filteredProducts = filterProducts();
        onFilter(filteredProducts); // Pass the filtered products to the parent component
    }, [selectedCategory, selectedPrice, selectedBrand]); // Trigger on any filter change

    // Function to filter products based on selected filters
    const clear = () => {
        setSelectedCategory("");
        setSelectedPrice("");
        setSelectedBrand("");
        onClear();
    };

    return (
        <div className="container mb-3">
            <div className="row">
                {/* Category Filter */}
                <div className="col-md-4">
                    <label htmlFor="categorySelect">Category</label>
                    <select
                        id="categorySelect"
                        className="form-select"
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                    >
                        <option value="">All Categories</option>
                        {uniqueCategories.map(category => (
                            <option key={category} value={category}>
                                {category}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Price Filter */}
                <div className="col-md-4">
                    <label htmlFor="priceSelect">Price</label>
                    <select
                        id="priceSelect"
                        className="form-select"
                        value={selectedPrice}
                        onChange={(e) => setSelectedPrice(e.target.value)}
                    >
                        <option value="">All Prices</option>
                        {uniquePrices.map(price => (
                            <option key={price} value={price}>
                                {price} ден
                            </option>
                        ))}
                    </select>
                </div>

                {/* Brand Filter */}
                <div className="col-md-4">
                    <label htmlFor="brandSelect">Brand</label>
                    <select
                        id="brandSelect"
                        className="form-select"
                        value={selectedBrand}
                        onChange={(e) => setSelectedBrand(e.target.value)}
                    >
                        <option value="">All Brands</option>
                        {uniqueBrands.map(brand => (
                            <option key={brand} value={brand}>
                                {brand}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
            <button className="btn btn-danger mt-3 w-100" onClick={clear}>Clear Filters</button>
        </div>
    );
};

export default FilterComponent;