import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import image from "../../assets/NothingFound.png";
import { BarLoader } from "react-spinners";
import { useContext } from "react";
import { CartContext } from "../../Context/CartContext";
import toast from "react-hot-toast";
function Spcategory() {
  const { addtocart } = useContext(CartContext);
  async function addProducttocart(productId) {
    const x = await addtocart(productId);
    if (x.data.status === "success") {
      console.log("added");
      toast.success("Product added to cart", {
        position: "bottom-left",
      });
    } else {
      console.log("error");
      toast.error("Product not added to cart", {
        position: "bottom-left",
      });
    }
    console.log(x);
  }
  let { category } = useParams();
  const [Isloading, setIsloading] = useState(true);
  const [relatedProducts, setrelatedProducts] = useState([]);

  function getrelatedproduct(category) {
    setIsloading(true);
    axios
      .get(`https://ecommerce.routemisr.com/api/v1/products`)
      .then(({ data }) => {
        let allproducts = data.data;
        let related = allproducts.filter(
          (product) => product.category.name === category
        );
        setrelatedProducts(related);
        setIsloading(false);
      })
      .catch(() => {
        setIsloading(false);
      });
  }

  useEffect(() => {
    getrelatedproduct(category);
  }, [category]);

  if (Isloading) {
    return (
      <div className="w-[70%] mx-auto flex justify-center items-center">
        <BarLoader color="#36d7b7" />
      </div>
    );
  }
  function addToWishlist(pId) {
    axios
      .post(
        "https://ecommerce.routemisr.com/api/v1/wishlist",
        {
          productId: `${pId}`,
        },
        {
          headers: {
            token: localStorage.getItem("UserToken"),
          },
        }
      )
      .then((res) => {
        if (res.data.status === "success") {
          console.log("added");
          toast.success("Product added to Wishlist", {
            position: "bottom-left",
          });
        }
      })
      .catch((err) => {
        console.log(err);
        toast.error("Product not added to Wishlist", {
          position: "bottom-left",
        });
      });
  }
  return (
    <div className="w-[90%] mx-auto">
      {relatedProducts?.length === 0 ? (
        <img src={image} className="w-[50%] mx-auto h-[500px]"></img>
      ) : (
        <div className="flex flex-wrap md:flex-row flex-col">
          {relatedProducts.map((product) => (
            <div key={product.id} className="md:w-1/6 w-full p-2">
              <div className="product p-3 border-green-600 border-2 rounded-lg">
                <Link
                  to={`/productdetails/${product.id}/${product.category.name}`}
                  onClick={() => {
                    window.location.href = `/productdetails/${product.id}/${product.category.name}`;
                  }}
                >
                  <img
                    className="w-full"
                    src={product.imageCover}
                    alt={product.title}
                  />
                  <span className="block font-light mt-2 text-green-600">
                    {product.category.name}
                  </span>
                  <h3 className="text-lg font-normal text-gray-800 mb-4">
                    {product.title.split(" ").slice(0, 2).join(" ")}
                  </h3>
                  <div className="flex justify-between items-center">
                    <span>{product.price} EGP</span>
                    <span>
                      {product.ratingsAverage}{" "}
                      <i className="fas fa-star text-yellow-400"></i>
                    </span>
                  </div>
                </Link>
                <button
                  onClick={() => addProducttocart(product.id)}
                  className="px-4 py-2 w-full rounded-lg text-white bg-green-600"
                >
                  add to cart
                </button>
                <button
                  onClick={() => {
                    addToWishlist(product.id);
                  }}
                  className="px-4 py-2 mt-2 w-full rounded-lg text-white bg-yellow-600"
                >
                  add to Wishlist
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Spcategory;
