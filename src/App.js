import './App.css';
import {Route, Routes} from "react-router-dom";
import ProductDetails from "./pages/product-details/product-details";
import Home from "./pages/home/home";
import SoldProducts from "./pages/sold-products/sold-products";
import Login from "./components/login/login";
import Register from "./components/register/register";
import PrivateRoute from './components/private-route/privete-route';
import {AuthProvider} from "./context/AuthContext";
import DashboardLayout from "./components/dashboard-layout/dashboard-layout";

function App() {
    return (
        <AuthProvider>
            <Routes>
                <Route path="/login" element={<Login/>}/>
                <Route path="/register" element={<Register/>}/>
                <Route
                    path="/"
                    element={
                        <PrivateRoute>
                            <DashboardLayout>
                                <Home/>
                            </DashboardLayout>
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/products/:productId"
                    element={
                        <PrivateRoute>
                            <DashboardLayout>
                                <ProductDetails/>
                            </DashboardLayout>
                        </PrivateRoute>
                    }>
                </Route>
                <Route
                    path="/sold-products"
                    element={
                        <PrivateRoute>
                            <DashboardLayout>
                                <SoldProducts/>
                            </DashboardLayout>
                        </PrivateRoute>
                    }>
                </Route>
            </Routes>
        </AuthProvider>
    );
}

export default App;
