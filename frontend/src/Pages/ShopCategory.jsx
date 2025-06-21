import React, { useContext } from "react";
import "./CSS/ShopCategory.css";
import { ShopContext } from "../Context/ShopContext";
import dropdown_icon from "../Components/Assets/dropdown_icon.png";
import Item from "../Components/Items/Item";
import Footer from "../Components/Footer/Footer";
import Navbar from "../Components/Navbar/Navbar";

const ShopCategory = (props) => {
  const allProducts = useContext(ShopContext);
  // console.log(allProducts);

  return (
    <div>
      <Navbar />
      <div className="shopcategory">
        <img className="shopcategory-banner" src={props.banner} alt="" />
        <div className="shopcategory-indexSort">
          <p>
            <span>Showing 1-12</span> out of 36 products
          </p>
          <div className="shopcategory-sort">
            Sort by <img src={dropdown_icon} alt="Sort dropdown icon" />
          </div>
        </div>
        <div className="shopcategory-products">
          {allProducts &&
            allProducts.all_product.map((item, i) => {
              if (props.category === item.category) {
                return (
                  <Item
                    key={i}
                    id={item.id}
                    slug={item.slug}
                    name={item.name}
                    image={item.image}
                    new_price={item.new_price}
                    old_price={item.old_price}
                  />
                );
              } else {
                return null;
              }
            })}
        </div>
        <div className="shopcategory-loadmore">Explore More</div>
      </div>
      <Footer />
    </div>
  );
};

export default ShopCategory;
