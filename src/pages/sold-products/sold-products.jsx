import React, {useEffect, useState} from 'react';
import {database} from '../../firebase';
import {get, ref} from "firebase/database"; // Firebase config

const SoldProducts = () => {
    const [products, setProducts] = useState({});
    const [filteredProducts, setFilteredProducts] = useState({});

    useEffect(() => {
        const fetchProducts = async () => {
            const productsRef = ref(database, 'products'); // Reference to the 'products' node
            const snapshot = await get(productsRef);

            if (snapshot.exists()) {
                const productsData = snapshot.val();
                const productsList = {};

                // Filter out products that have sold items
                Object.keys(productsData).forEach((key) => {
                    const productData = productsData[key];
                    if (productData.sold && productData.sold.length > 0) {
                        productsList[key] = productData; // Only keep products with sold items
                    }
                });

                setProducts(productsList);
                setFilteredProducts(productsList);

                const currentDate = new Date();

                const formattedDate = currentDate.getFullYear() + '-' +
                    String(currentDate.getMonth() + 1).padStart(2, '0') + '-' +
                    String(currentDate.getDate()).padStart(2, '0');

                filterSoldItemsByDate(productsList, formattedDate);
            } else {
                console.log("No data available");
            }
        };

        fetchProducts();
    }, []);

    // Helper function to extract date (without time)
    const formatDateWithoutTime = (dateString) => {
        return new Date(dateString).toISOString().split('T')[0];
    };

    // Filter sold items by date
    const filterSoldItemsByDate = (productList, date) => {
        if (!date) return setFilteredProducts(products);

        // Filter products by the chosen date and retain product info with matching sold items
        const filteredProducts = Object.values(Object.keys(products).length ? products : productList)
            .map(product => {
                // Filter sold items that match the chosen date
                const matchingSoldItems = product.sold.filter(soldItem => formatDateWithoutTime(soldItem.soldDate) === date);

                // Return product with filtered sold items if any items match
                if (matchingSoldItems.length > 0) {
                    return {
                        ...product,
                        sold: matchingSoldItems
                    };
                }
                return null; // Return null if no sold items match
            })
            .filter(product => product !== null); // Remove products with no matching sold items

        setFilteredProducts(filteredProducts);
    };

    return (
        <div className="container mt-5">
            <h1 className="text-center mb-4">Sold Products</h1>

            <div className="row mb-4">
                <div className="col-md-4 mx-auto">
                    <input
                        type="date"
                        id="soldDateFilter"
                        className="form-control"
                        defaultValue={new Date().toISOString().split('T')[0]}
                        onChange={(e) => filterSoldItemsByDate(null, e.target.value)}
                    />
                </div>
                <div className="col-md-2 mx-auto">
                    <button type="button" className="btn btn-danger w-100" onClick={() => {
                        const currentDate = new Date();

                        const formattedDate = currentDate.getFullYear() + '-' +
                            String(currentDate.getMonth() + 1).padStart(2, '0') + '-' +
                            String(currentDate.getDate()).padStart(2, '0');

                        filterSoldItemsByDate(null, formattedDate);
                    }}>Reset</button>
                </div>
            </div>

            <div className="row">
                <div className="col-md-10 mx-auto">
                    <ul className="list-group">
                        {Object.values(filteredProducts).map((product, index) => (
                            <li className="list-group-item mb-3" key={index}>
                                <div className="d-flex justify-content-between align-items-center">
                                    <h5>{product.name}</h5>
                                    <span className="badge bg-primary">{product.category}</span>
                                </div>
                                <p className="mb-1">
                                    <strong>Brand:</strong> {product.brand} <br />
                                    <strong>Price:</strong> {product.price}
                                </p>
                                <h6 className="mt-2">Sold Items:</h6>
                                <ul className="list-group list-group-flush">
                                    {product.sold.map((soldItem, i) => (
                                        <li key={i} className="list-group-item">
                                            <strong>Size:</strong> {soldItem.size},
                                            <strong> Price:</strong> {soldItem.price},
                                            <strong> Sold Date:</strong> {soldItem.soldDate}
                                        </li>
                                    ))}
                                </ul>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default SoldProducts;