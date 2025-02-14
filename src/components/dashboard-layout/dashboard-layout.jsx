import React from 'react';
import Navbar from '../navbar/navbar';

const DashboardLayout = ({ children }) => {
    return (
        <>
            <Navbar />
            <div className="container">
                {children}
            </div>
        </>
    );
};

export default DashboardLayout;