import './App.css';
import {Route, Routes} from "react-router-dom";
import ProductDetails from "./pages/product-details/product-details";

function App() {
  return (
    <div className="App">
      {
          <Routes>
            <Route path="/products/:productId" element={<ProductDetails/>}></Route>
          </Routes>
      }
    </div>
  );
}

export default App;
