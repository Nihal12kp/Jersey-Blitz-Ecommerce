import React, { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import "./CSS/SearchList.css";
import Footer from "../Components/Footer/Footer";
import Navbar from "../Components/Navbar/Navbar";

const SearchList = () => {
  const location = useLocation();
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(true);

  const query = new URLSearchParams(location.search).get("query");

  useEffect(() => {
    const fetchSearchResults = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `${process.env.REACT_APP_SERVER_URL}/product/searchproducts?query=${query}`
        );
        const data = await response.json();

        if (data.success) {
          setSearchResults(data.products);
        } else {
          console.error(data.message);
        }
      } catch (error) {
        console.error("Error fetching search results:", error);
      } finally {
        setLoading(false);
      }
    };

    if (query) {
      fetchSearchResults();
    }
  }, [query]);

  return (
    <div>
      <Navbar />
      <div className="search-list">
        <h1>Search Results for: "{query}"</h1>
        {loading ? (
          <p>Loading...</p>
        ) : searchResults.length > 0 ? (
          <div className="search-results">
            {searchResults.map((product) => (
              <div key={product._id} className="search-item">
                <Link to={`/product/${product.slug}/${product.id}`} className="product-link">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="product-image"
                  />
                  <div className="product-info">
                    <h3>{product.name}</h3>
                    <p>Category: {product.category}</p>
                    <p>Price: ${product.new_price}</p>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <p>No results found.</p>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default SearchList;
