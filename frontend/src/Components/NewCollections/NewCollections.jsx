import React, { useEffect, useState } from "react";
import "./NewCollections.css";
import Item from "../Items/Item";
const NewCollections = () => {
  const [new_collections, setNew_collection] = useState([]);
  useEffect(() => {
    fetch(`${process.env.REACT_APP_SERVER_URL}/product/newcollection`)
      .then((response) => response.json())
      .then((data) => setNew_collection(data));
  }, []);
  return (
    <div>
      <div className="new-collections">
        <h1>NEW COLLECTIONS</h1>
        <hr />
        <div className="collections">
          {new_collections.map((item, i) => {
            return (
              <Item
                key={i}
                id={item.id}
                name={item.name}
                image={item.image}
                new_price={item.new_price}
                old_price={item.old_price}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default NewCollections;
