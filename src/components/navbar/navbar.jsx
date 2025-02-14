import React from 'react';
import {Link, useNavigate} from 'react-router-dom';
import {signOut} from 'firebase/auth';
import {auth} from '../../firebase';
import {useAuth} from '../../context/AuthContext';

const Navbar = () => {
    const {currentUser} = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await signOut(auth);
            navigate("/login");
        } catch (error) {
            console.error("Error during logout:", error);
        }
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light mb-4">
            <div className="container-fluid">
                <Link className="navbar-brand" to="/">Marshal</Link>
                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarNav"
                    aria-controls="navbarNav"
                    aria-expanded="false"
                    aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <div className="w-100 d-flex flex-column flex-lg-row justify-content-center justify-content-lg-between align-items-center">
                        <ul className="navbar-nav text-center">
                            <li className="nav-item">
                                <Link className="nav-link" to="/sold-products">
                                    Sold Products
                                </Link>
                            </li>
                            {/* Add more nav links as needed */}
                        </ul>
                        {currentUser && (
                            <div className="mt-3 mt-lg-0">
                                <button className="btn btn-outline-danger" onClick={handleLogout}>
                                    Logout
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
