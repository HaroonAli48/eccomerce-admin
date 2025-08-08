import React, { useState, useEffect } from "react";
import { assets } from "../assets/assets";
import axios from "axios";
import { backendUrl } from "../App";
import { toast } from "react-toastify";
import { use } from "react";

const Add = ({ token }) => {
  const [image1, setImage1] = useState(false);
  const [image2, setImage2] = useState(false);
  const [image3, setImage3] = useState(false);
  const [image4, setImage4] = useState(false);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [bestseller, setBestseller] = useState(false);
  const [sizes, setSizes] = useState([]);
  const [colours, setColours] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedColor, setSelected] = useState();
  const [submit, setSubmit] = useState(false);

  useEffect(() => {
    fetchCategories();
    fetchSubCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await axios.get(backendUrl + "/api/category/get");
      if (res.data.success) {
        setCategories(res.data.category);
      }
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  };

  const fetchSubCategories = async () => {
    try {
      const res = await axios.get(
        backendUrl + "/api/category/getSubCategories"
      );
      if (res.data.success) {
        setSubCategories(res.data.subCategory);
      }
    } catch (error) {
      console.error("Error fetching subcategories:", error);
    }
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSubmit(true);
    if (price === 0) {
      toast.error("Add a valid price!");
      setSubmit(false);
      setLoading(false);
      return;
    }
    try {
      const formData = new FormData();

      formData.append("name", name);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("category", category);
      formData.append("subCategory", subCategory);
      formData.append("bestseller", bestseller ? true : false);
      formData.append("sizes", JSON.stringify(sizes));
      formData.append("colours", JSON.stringify(colours));

      image1 && formData.append("image1", image1);
      image2 && formData.append("image2", image2);
      image3 && formData.append("image3", image3);
      image4 && formData.append("image4", image4);

      const response = await axios.post(
        backendUrl + "/api/product/add",
        formData,
        { headers: { token } }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        setName("");
        setDescription("");
        setImage1(false);
        setImage2(false);
        setImage3(false);
        setImage4(false);
        setPrice("");
        setSizes([]);
        setColours([]);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    } finally {
      setLoading(false);
      setSubmit(false);
    }
  };
  if (!token) {
    return <div className="text-center">Please login to add products.</div>;
  }
  return (
    <form
      onSubmit={onSubmitHandler}
      className="flex flex-col w-full items-start gap-3"
    >
      <div>
        <p className="mb-2">Upload Images</p>
        <div className="flex gap-2">
          <label htmlFor="image1">
            <img
              src={!image1 ? assets.upload_area : URL.createObjectURL(image1)}
              className="w-20"
              alt=""
            />
            <input
              onChange={(e) => setImage1(e.target.files[0])}
              type="file"
              id="image1"
              hidden
            />
          </label>
          <label htmlFor="image2">
            <img
              className="w-20"
              src={!image2 ? assets.upload_area : URL.createObjectURL(image2)}
              alt=""
            />
            <input
              onChange={(e) => setImage2(e.target.files[0])}
              type="file"
              id="image2"
              hidden
            />
          </label>
          <label htmlFor="image3">
            <img
              className="w-20"
              src={!image3 ? assets.upload_area : URL.createObjectURL(image3)}
              alt=""
            />
            <input
              onChange={(e) => setImage3(e.target.files[0])}
              type="file"
              id="image3"
              hidden
            />
          </label>
          <label htmlFor="image4">
            <img
              className="w-20"
              src={!image4 ? assets.upload_area : URL.createObjectURL(image4)}
              alt=""
            />
            <input
              onChange={(e) => setImage4(e.target.files[0])}
              type="file"
              id="image4"
              hidden
            />
          </label>
        </div>
        <div className="w-full">
          <p className="mb-2">Product Name</p>
          <input
            onChange={(e) => setName(e.target.value)}
            value={name}
            className="w-full max-w-[500px] px-3 py-2"
            type="text"
            placeholder="Type Here"
            required
          />
        </div>
        <div className="w-full">
          <p className="mb-2">Product Description</p>
          <textarea
            onChange={(e) => setDescription(e.target.value)}
            value={description}
            className="w-full max-w-[500px] px-3 py-2"
            type="text"
            placeholder="Write Content Here"
            required
          />
        </div>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:gap-8">
          <div>
            <p className="mb-2">Product Category</p>
            <select
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2"
            >
              {categories.length > 0 ? (
                categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))
              ) : (
                <option value="">No categories available</option>
              )}
            </select>
          </div>

          <div>
            <p className="mb-2">Sub Category</p>
            <select
              className="w-full px-3 py-2"
              onChange={(e) => setSubCategory(e.target.value)}
            >
              {subCategories.length > 0 ? (
                subCategories.map((subCat) => (
                  <option key={subCat} value={subCat}>
                    {subCat}
                  </option>
                ))
              ) : (
                <option value="">No subcategories available</option>
              )}
            </select>
          </div>
          <div>
            <p className="mb-2">Product Price</p>
            <input
              onChange={(e) => setPrice(e.target.value)}
              value={price}
              className="w-full px-3 py-2 sm:w-[120px]"
              type="number"
              placeholder="Price"
            />
          </div>
        </div>
      </div>
      {subCategory === "Accessories" ? null : (
        <div>
          <p className="mb-2">Product Sizes</p>
          <div className="grid grid-cols-[1fr_1fr_2fr] gap-3">
            <div
              onClick={() =>
                setSizes((prev) =>
                  prev.includes("S")
                    ? prev.filter((item) => item !== "S")
                    : [...prev, "S"]
                )
              }
            >
              <p
                className={`${
                  sizes.includes("S") ? "bg-pink-100" : "bg-slate-200"
                } px-3 py-1 cursor-pointer`}
              >
                S
              </p>
            </div>
            <div
              onClick={() =>
                setSizes((prev) =>
                  prev.includes("M")
                    ? prev.filter((item) => item !== "M")
                    : [...prev, "M"]
                )
              }
            >
              <p
                className={`${
                  sizes.includes("M") ? "bg-pink-100" : "bg-slate-200"
                } px-3 py-1 cursor-pointer`}
              >
                M
              </p>
            </div>
            <div
              onClick={() =>
                setSizes((prev) =>
                  prev.includes("L")
                    ? prev.filter((item) => item !== "L")
                    : [...prev, "L"]
                )
              }
            >
              <p
                className={`${
                  sizes.includes("L") ? "bg-pink-100" : "bg-slate-200"
                } px-3 py-1 cursor-pointer`}
              >
                Large
              </p>
            </div>
            <div
              onClick={() =>
                setSizes((prev) =>
                  prev.includes("XL")
                    ? prev.filter((item) => item !== "XL")
                    : [...prev, "XL"]
                )
              }
            >
              <p
                className={`${
                  sizes.includes("XL") ? "bg-pink-100" : "bg-slate-200"
                } px-3 py-1 cursor-pointer`}
              >
                XL
              </p>
            </div>
            <div
              onClick={() =>
                setSizes((prev) =>
                  prev.includes("XXL")
                    ? prev.filter((item) => item !== "XXL")
                    : [...prev, "XXL"]
                )
              }
            >
              <p
                className={`${
                  sizes.includes("XXL") ? "bg-pink-100" : "bg-slate-200"
                } px-3 py-1 cursor-pointer`}
              >
                XXL
              </p>
            </div>
            <div
              onClick={() =>
                setSizes((prev) =>
                  prev.includes("Customized")
                    ? prev.filter((item) => item !== "Customized")
                    : [...prev, "Customized"]
                )
              }
            >
              <p
                className={`${
                  sizes.includes("Customized") ? "bg-pink-100" : "bg-slate-200"
                } px-3 py-1 cursor-pointer`}
              >
                Customized
              </p>
            </div>
          </div>
        </div>
      )}
      {category === "Jewellery" ||
      category === "Makeup" ||
      category === "Oil" ? (
        ""
      ) : (
        <>
          <p className="mb-2 mt-4">Product Colours:</p>
          <div className="flex items-center gap-2">
            <p>Select Colour:</p>
            <input
              className="rounded-full p-1 h-8 w-8 cursor-pointer"
              type="color"
              value={selectedColor || "#000000"}
              onChange={(e) => setSelected(e.target.value)}
            />
            <button
              type="button"
              className="bg-black text-white px-3 py-1 rounded hover:bg-gray-600"
              onClick={() => {
                if (selectedColor && !colours.includes(selectedColor)) {
                  setColours([...colours, selectedColor]);
                }
              }}
            >
              Add Colour
            </button>
          </div>
        </>
      )}

      <div className="flex flex-wrap gap-2 mt-2">
        {colours.map((color, index) => (
          <div key={index} className="flex items-center gap-1">
            <div
              style={{ backgroundColor: color }}
              className="w-6 h-6 rounded border border-gray-400"
              title={color}
            />
            <button
              type="button"
              onClick={() => setColours(colours.filter((c) => c !== color))}
              className="text-red-500 text-xs hover:text-red-700"
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      <div className="flex gap-2 mt-2">
        <input
          onChange={() => setBestseller((prev) => !prev)}
          checked={bestseller}
          type="checkbox"
          id="bestseller"
        />
        <label htmlFor="bestseller" className="cursor-pointer">
          Add to Bestseller
        </label>
      </div>
      <button
        type="submit"
        disabled={submit}
        className="w-28 py-3 mt-4 bg-black hover:bg-gray-600 rounded text-white"
      >
        {loading ? "Adding..." : "ADD"}
      </button>
    </form>
  );
};

export default Add;
