import React, { useEffect, useState } from 'react';
import { getDatabase, ref, onValue } from 'firebase/database';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import FilterComponent from "../../components/home-filter/home-filter";

const HomePage = () => {
    const [products, setProducts] = useState({});
    const [filteredProducts, setFilteredProducts] = useState({});

    useEffect(() => {
        const db = getDatabase();
        const productsRef = ref(db, 'products');
        onValue(productsRef, (snapshot) => {
            const data = snapshot.val();
            setProducts(data || {});
            setFilteredProducts(data || {});
            const totalSoldPrice = getTotalSoldPrice(data);
            console.log(totalSoldPrice);
        });
    }, []);

    // Function to handle filtered products
    const handleFilteredProducts = (products) => {
        setProducts(products);  // Update the state with filtered products
    };


    // Function to calculate the sum of sold prices
    function getTotalSoldPrice(products) {
        const soldItems = Object.values(products)
            .map(item => {
                if(item?.sold){
                    item.sold["name"] = item.name;
                    return item.sold;
                }
            })
            .filter(item => item !== undefined); // Filter out undefined values

        console.log(soldItems.flat().map(item => item.price == "0" ? item : ""));

        return soldItems.flat() // Flatten the array of arrays
            .reduce((total, item) => total + parseFloat(item.price || 0), 0);
    }

    return (
        Object.keys(products).length && <div className="container my-4">
            <FilterComponent products={products} onFilter={handleFilteredProducts} onClear={() => setProducts(filteredProducts)}/>
            <div className="row">
                {Object.keys(products).map((key) => (
                    <div key={key} className="col-lg-4 col-md-6 col-sm-12 mb-4">
                        <div className="card h-100">
                            <div className="card-body d-flex flex-column">
                                <h5 className="card-title">{products[key].name}</h5>
                                <p className="card-text">Бренд: {products[key].brand}</p>
                                <p className="card-text">Цена: {products[key].price} MKD</p>
                                <Link to={`/products/${key}`} className="btn btn-primary mt-auto">
                                    Прегледај
                                </Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default HomePage;
