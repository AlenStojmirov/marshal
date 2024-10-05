import './App.css';
import {Route, Routes} from "react-router-dom";
import ProductDetails from "./pages/product-details/product-details";
import Home from "./pages/home/home";
import SoldProducts from "./pages/sold-products/sold-products";

function App() {
  return (
    <div className="App">
      {
          <Routes>
            <Route path="/" element={<Home/>}></Route>
            <Route path="/products/:productId" element={<ProductDetails/>}></Route>
            <Route path="/sold-products" element={<SoldProducts/>}></Route>
          </Routes>
      }
    </div>
  );
}

export default App;
