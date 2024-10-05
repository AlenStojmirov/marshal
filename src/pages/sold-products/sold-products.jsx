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
    const filterSoldItemsByDate = (date) => {
        if (!date) return setFilteredProducts(products);

        // Filter products by the chosen date and retain product info with matching sold items
        const filteredProducts = Object.values(products)
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
                <div className="col-md-6 mx-auto">
                    <input
                        type="date"
                        id="soldDateFilter"
                        className="form-control"
                        onChange={(e) => filterSoldItemsByDate(e.target.value)}
                    />
                </div>
                <div className="col-md-2 mx-auto">
                    <button type="button" className="btn btn-danger w-100" onClick={() => filterSoldItemsByDate(null)}>Ресет</button>
                </div>
            </div>

            <div className="row">
                {Object.values(filteredProducts).map((product, index) => (
                    <div className="col-lg-4 col-md-6 mb-4" key={index}>
                        <div className="card h-100">
                            <div className="card-body">
                                <h5 className="card-title">{product.name}</h5>
                                <p className="card-text">
                                    <strong>Brand:</strong> {product.brand}<br/>
                                    <strong>Category:</strong> {product.category}<br/>
                                    <strong>Price:</strong> {product.price}
                                </p>
                                <h6>Sold Items:</h6>
                                <ul className="list-group list-group-flush">
                                    {product?.sold.map((soldItem, i) => (
                                        <li key={i} className="list-group-item">
                                            <strong>Size:</strong> {soldItem.size},
                                            <strong> Price:</strong> {soldItem.price},
                                            <strong> Sold Date:</strong> {soldItem.soldDate}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SoldProducts;