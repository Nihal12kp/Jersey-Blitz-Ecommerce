import React from "react";
import "./Item.css";
import { Link } from "react-router-dom";

const Item = (props) => {
  return (
    <div className="item">
      <Link to={`/product/${props.slug}/${props.id}`}>
        <img
          className="productimg"
          onClick={() => window.scrollTo(0, 0)}
          src={props.image}
          alt={props.name}
        />
      </Link>
      <p className="item-title">{props.name}</p>
      <div className="item-prices">
        <div className="item-price-new">INR {props.new_price}</div>
        <div className="item-price-old">INR {props.old_price}</div>
      </div>
    </div>
  );
};

export default Item;
