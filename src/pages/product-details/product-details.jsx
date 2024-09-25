import React, {useState, useEffect} from 'react';
import {useParams} from 'react-router-dom';
import {database} from '../../firebase';
import {ref, get, update} from 'firebase/database';
import './product-details.css';

const formatDate = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleString('en-GB', {
        day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
    }).replace(',', '');
};

const ProductDetails = () => {
    const {productId} = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedSize, setSelectedSize] = useState('');
    const [salePrice, setSalePrice] = useState('');
    const [saleError, setSaleError] = useState('');
    const [firstLoad, setFirstLoad] = useState(true);
    const [role, setRole] = useState("user");

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const productRef = ref(database, `products/${productId}`);
                const snapshot = await get(productRef);

                if (snapshot.exists()) {
                    setProduct(snapshot.val());
                } else {
                    console.log('No product found with the given ID');
                }
                setLoading(false);
            } catch (error) {
                console.error('Error fetching product data:', error);
                setLoading(false);
            }
        };

        fetchProduct();
    }, [productId]);

    const handleSellProduct = async (e) => {
        e.preventDefault();
        setSaleError('');

        if (!selectedSize || !salePrice) {
            setSaleError('Изберете големина и внесете продажна цена.');
            return;
        }

        const sizeToSell = product.sizes.find(sizeObj => sizeObj.size === selectedSize);

        if (!sizeToSell || sizeToSell.quantity <= 0) {
            setSaleError('Оваа големина не е на залиха.');
            return;
        }

        const updatedSizes = product.sizes.map(sizeObj => {
            if (sizeObj.size === selectedSize) {
                return {...sizeObj, quantity: sizeObj.quantity - 1};
            }
            return sizeObj;
        }).filter(sizeObj => sizeObj.quantity > 0); // Remove sizes with 0 quantity

        const newSoldEntry = {
            size: selectedSize,
            price: salePrice,
            soldDate: new Date().toISOString(),
        };

        const updatedSold = product.sold ? [...product.sold, newSoldEntry] : [newSoldEntry];

        const updates = {
            [`products/${productId}/sizes`]: updatedSizes,
            [`products/${productId}/sold`]: updatedSold,
        };

        try {
            await update(ref(database), updates);
            setProduct({
                ...product,
                sizes: updatedSizes,
                sold: updatedSold,
            });
            setSelectedSize('');
            setSalePrice('');
            setSaleError('Производот е успешно продаден!');
        } catch (error) {
            console.error('Error updating product:', error);
            setSaleError('Не успеа да се ажурира продажбата на производот.');
        }
    };

    const handleRestoreProduct = async (soldIndex) => {
        try {
            const soldItem = product.sold[soldIndex];

            const updatedSold = [...product.sold];
            updatedSold.splice(soldIndex, 1);

            const sizeExists = product.sizes.find(sizeObj => sizeObj.size === soldItem.size);

            let updatedSizes;
            if (sizeExists) {
                updatedSizes = product.sizes.map(sizeObj => {
                    if (sizeObj.size === soldItem.size) {
                        return {...sizeObj, quantity: sizeObj.quantity + 1};
                    }
                    return sizeObj;
                });
            } else {
                updatedSizes = [...product.sizes, {size: soldItem.size, quantity: 1}];
            }

            const updates = {
                [`products/${productId}/sizes`]: updatedSizes,
                [`products/${productId}/sold`]: updatedSold,
            };

            await update(ref(database), updates);
            setProduct({
                ...product,
                sizes: updatedSizes,
                sold: updatedSold,
            });

            setSaleError('Производот е успешно обновен!');
        } catch (error) {
            console.error('Error restoring product:', error);
            setSaleError('Не успеа да се врати производот.');
        }
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        if(e.target.value === process.env.ADMIN){
            setRole("admin");
            setFirstLoad(false);
        } else if(e.target.value === process.env.USER) {
            setRole("user");
            setFirstLoad(false);
        }
    };

    if (loading) {
        return <div className="text-center mt-5">Loading...</div>;
    }

    if (!product) {
        return <div className="text-center mt-5">Product not found.</div>;
    }

    return (
        firstLoad ?
            <div className="container my-4">
                <div className="row">
                    <div className="col-12 col-md-8 mx-auto">
                        <div className="card shadow-sm">
                            <div className="card-body">
                                <div className="sell-product-form mt-4">
                                    <h4 className="text-center">Внеси лозинка</h4>
                                    <form onSubmit={handleLogin}>
                                        <div className="mb-3">
                                            <label htmlFor="sizeSelect" className="form-label">Select Size</label>
                                            <select
                                                id="sizeSelect"
                                                className="form-select"
                                                value={selectedSize}
                                                onChange={(e) => setSelectedSize(e.target.value)}
                                            >
                                                <option value="">Choose size...</option>
                                                {product.sizes?.map((sizeObj, index) => (
                                                    <option key={index} value={sizeObj.size}>
                                                        {sizeObj.size} (Qty: {sizeObj.quantity})
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        <div className="mb-3">
                                            <label htmlFor="salePrice" className="form-label">Sale Price</label>
                                            <input
                                                type="number"
                                                className="form-control"
                                                id="salePrice"
                                                value={salePrice}
                                                onChange={(e) => setSalePrice(e.target.value)}
                                            />
                                        </div>

                                        <button type="submit" className="btn btn-success w-100">Најви се</button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            :
            <div className="container my-4">
                <div className="row">
                    <div className="col-12 col-md-8 mx-auto">
                        <div className="card shadow-sm">
                            <div className="card-body">
                                <h1 className="card-title text-center mb-4">{product.name}</h1>
                                <h5 className="card-subtitle mb-2 text-muted text-center">Brand: {product.brand}</h5>

                                {/* Available Sizes Section */}
                                <div className="available-sizes mt-4">
                                    <h4 className="text-center">Available Sizes</h4>
                                    <ul className="list-group">
                                        {product.sizes?.map((sizeObj, index) => (
                                            <li
                                                key={index}
                                                className={`list-group-item d-flex justify-content-between align-items-center ${sizeObj.quantity > 0 ? 'bg-light' : 'bg-danger text-white'}`}
                                            >
                                                Size: {sizeObj.size}
                                                <span
                                                    className={`badge ${sizeObj.quantity > 0 ? 'bg-success' : 'bg-danger'}`}>
                        {sizeObj.quantity > 0 ? `Qty: ${sizeObj.quantity}` : 'Sold out'}
                      </span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {/* Sold Sizes Section */}
                                {(product.sold?.length > 0 && role === "admin")(
                                    <div className="sold-sizes mt-4">
                                        <h4 className="text-center">Продадени величини</h4>
                                        <ul className="list-group">
                                            {product.sold.map((soldObj, index) => (
                                                <li key={index}
                                                    className="list-group-item d-flex justify-content-between align-items-center">
                                                    <div>
                                                        <strong>Величина:</strong> {soldObj.size}<br/>
                                                        <strong>Цена:</strong> {soldObj.price} ден.<br/>
                                                        <strong>Дата:</strong> {formatDate(soldObj.soldDate)}
                                                    </div>
                                                    <button
                                                        className="btn btn-warning btn-sm"
                                                        onClick={() => handleRestoreProduct(index)}
                                                    >
                                                        Врати
                                                    </button>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {/* Sell Product Form */}
                                <div className="sell-product-form mt-4">
                                    <h4 className="text-center">Продаден продукт</h4>
                                    <form onSubmit={handleSellProduct}>
                                        <div className="mb-3">
                                            <label htmlFor="sizeSelect" className="form-label">Избери величина</label>
                                            <select
                                                id="sizeSelect"
                                                className="form-select"
                                                value={selectedSize}
                                                onChange={(e) => setSelectedSize(e.target.value)}
                                            >
                                                <option value="">Избери величина...</option>
                                                {product.sizes?.map((sizeObj, index) => (
                                                    <option key={index} value={sizeObj.size}>
                                                        {sizeObj.size} (Количина: {sizeObj.quantity})
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        <div className="mb-3">
                                            <label htmlFor="salePrice" className="form-label">Продажна цена</label>
                                            <input
                                                type="number"
                                                className="form-control"
                                                id="salePrice"
                                                value={salePrice}
                                                onChange={(e) => setSalePrice(e.target.value)}
                                            />
                                        </div>

                                        {saleError &&
                                            <p className={`text-${saleError.includes('successfully') ? 'success' : 'danger'}`}>{saleError}</p>}

                                        <button type="submit" className="btn btn-primary w-100">Потврди</button>
                                    </form>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
    );
};

export default ProductDetails;
