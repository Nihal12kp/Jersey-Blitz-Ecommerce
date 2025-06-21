import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Shop from "./Pages/Shop";
import ShopCategory from "./Pages/ShopCategory";
import Product from "./Pages/Product";
import Cart from "./Pages/Cart";
import home_banner from "./Components/Assets/away_kits.png";
import new_banner from "./Components/Assets/new_banner.png";
import Clasic_banner from "./Components/Assets/classic_banner.png";
import LoginSignup from "./Pages/LoginSignup";
import Checkout from "./Components/Checkout/Checkout";
import SearchList from "./Pages/SearchList";
import MyOrders from "./Components/MyOrders/MyOrders";
function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Shop />} />
          <Route
            path="/homekits"
            element={<ShopCategory banner={new_banner} category="homekit" />}
          />
          <Route
            path="/awaykits"
            element={<ShopCategory banner={home_banner} category="awaykit" />}
          />
          <Route
            path="/clasickits"
            element={
              <ShopCategory banner={Clasic_banner} category="classickit" />
            }
          />
          <Route path="/product" element={<Product />}>
            <Route path=":slug/:productId" element={<Product />} />
          </Route>
          <Route path="/cart" element={<Cart />} />
          <Route path="/login" element={<LoginSignup />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/search" element={<SearchList />} />
          <Route path="/myorders" element={<MyOrders />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
