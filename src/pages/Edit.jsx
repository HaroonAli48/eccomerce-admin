import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { backendUrl, currency } from "../App";
import DOMPurify from "dompurify";
import { marked } from "marked";

function Product({ productData }) {
  // Convert markdown to HTML and sanitize it
  const createMarkup = () => {
    if (!productData.description) return { __html: "" };
    const rawMarkup = marked(productData.description);
    const cleanMarkup = DOMPurify.sanitize(rawMarkup);
    return { __html: cleanMarkup };
  };
}
const Edit = ({ token }) => {
  const [list, setList] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [editData, setEditData] = useState({});
  const [loading, setLoading] = useState(false);

  const fetchList = async () => {
    try {
      const response = await axios.get(backendUrl + "/api/product/list");
      if (response.data.success) {
        setList(response.data.products);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleEdit = (index) => {
    const selected = list[index];
    setEditData({
      _id: selected._id,
      name: selected.name || "",
      description: selected.description || "",
      price: selected.price || "",
      category: selected.category || "",
      subCategory: selected.subCategory || "",
      sizes: selected.sizes,
      colours: selected.colours,
      bestseller: selected.bestseller || false,
      stock: selected.stock || false,
    });
    setEditIndex(index);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditData({ ...editData, [name]: value });
  };

  const handleArrayChange = (name, value) => {
    setEditData({ ...editData, [name]: value.split(",").map((v) => v.trim()) });
  };

  const saveUpdate = async () => {
    setLoading(true);
    try {
      const res = await axios.post(
        backendUrl + "/api/product/edit",
        {
          id: editData._id,
          name: editData.name,
          description: editData.description,
          price: editData.price,
          category: editData.category,
          subCategory: editData.subCategory,
          sizes: editData.sizes,
          colours: editData.colours,
          bestseller: editData.bestseller,
          stock: editData.stock,
        },
        {
          headers: { token },
        }
      );

      if (res.data.success) {
        toast.success("Product updated successfully");
        setEditIndex(null);
        fetchList();
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Edit Products</h2>
      <div className="space-y-4">
        {list.map((item, index) => (
          <div key={index} className="border p-4 bg-white rounded-lg shadow-md">
            {editIndex === index ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input
                    type="text"
                    name="name"
                    value={editData.name}
                    onChange={handleChange}
                    placeholder="Name"
                    className="input"
                  />
                  <input
                    type="number"
                    name="price"
                    value={editData.price}
                    onChange={handleChange}
                    placeholder="Price"
                    className="input"
                  />
                  <select
                    name="category"
                    value={editData.category}
                    onChange={handleChange}
                    className="input"
                  >
                    {" "}
                    <option value="Women">Women</option>
                    <option value="Men">Men</option>
                    <option value="Kids">Kids</option>
                    <option value="Footwear">Footwear</option>
                    <option value="Watches">Watch</option>
                    <option value="Jewellery">Jewellery</option>
                    <option value="Makeup">Beauty and cosmetics</option>
                    <option value="Oil">Oil</option>
                  </select>

                  <select
                    name="subCategory"
                    value={editData.subCategory}
                    onChange={handleChange}
                    className="input"
                  >
                    {editData.category === "Oil" ||
                    editData.category === "Makeup" ||
                    editData.category === "Jewellery" ||
                    editData.category === "Watches" ? (
                      <>
                        <option value="Accessories">Accessories</option>{" "}
                      </>
                    ) : (
                      <>
                    <option value="">Select Sub Category</option>
                        <option value="Summerwear">Summerwear</option>
                        <option value="Topwear">Topwear</option>
                        <option value="Bottomwear">Bottomwear</option>
                        <option value="Winterwear">Winterwear</option>
                      </>
                    )}
                  </select>
                  <div>
                    <label className="block mb-2 font-medium text-gray-700">
                      Sizes
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {["S", "M", "L", "XL", "XXL","Customized"].map((size) => (
                        <button
                          key={size}
                          type="button"
                          onClick={() => {
                            const exists = editData.sizes?.includes(size);
                            const updated = exists
                              ? editData.sizes.filter((s) => s !== size)
                              : [...(editData.sizes || []), size];
                            setEditData({ ...editData, sizes: updated });
                          }}
                          className={`px-3 py-1 rounded border ${
                            editData.sizes?.includes(size)
                              ? "bg-blue-500 text-white"
                              : "bg-gray-200 text-gray-700"
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Colours */}
                <div className="mt-4">
                  <label className="block mb-2 font-medium text-gray-700">
                    Colours
                  </label>
                  <div className="flex flex-wrap gap-3">
                    {editData.colours?.map((color, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <input
                          type="color"
                          value={color}
                          onChange={(e) => {
                            const updated = [...editData.colours];
                            updated[idx] = e.target.value;
                            setEditData({ ...editData, colours: updated });
                          }}
                          className="w-10 h-10 border rounded"
                        />
                        <button
                          onClick={() => {
                            const updated = [...editData.colours];
                            updated.splice(idx, 1);
                            setEditData({ ...editData, colours: updated });
                          }}
                          className="text-red-600 hover:text-red-800 text-sm"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                    <button
                      onClick={() =>
                        setEditData({
                          ...editData,
                          colours: [...(editData.colours || []), "#000000"],
                        })
                      }
                      className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded text-sm"
                    >
                      + Add Color
                    </button>
                  </div>
                </div>

                <textarea
                  name="description"
                  value={editData.description}
                  onChange={handleChange}
                  placeholder="Enter description here"
                  className="input mt-4"
                  rows={4}
                />

                <div className="flex flex-wrap items-center gap-4 mt-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={editData.bestseller}
                      onChange={(e) =>
                        setEditData({
                          ...editData,
                          bestseller: e.target.checked,
                        })
                      }
                    />
                    Bestseller
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={editData.stock}
                      onChange={(e) =>
                        setEditData({ ...editData, stock: e.target.checked })
                      }
                    />
                    In Stock
                  </label>
                </div>

                <div className="flex gap-3 mt-4">
                  <button
                    disabled={loading}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
                    onClick={saveUpdate}
                  >
                    {loading ? "Saving..." : "Save"}
                  </button>
                  <button
                    className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded"
                    onClick={() => setEditIndex(null)}
                  >
                    Cancel
                  </button>
                </div>
              </>
            ) : (
              <div className="flex flex-col sm:flex-row items-start gap-4">
                <img
                  src={item.image[0]}
                  alt={item.name}
                  className="w-20 h-20 object-cover rounded border"
                />
                <div className="flex-1">
                  <p className="font-semibold text-lg">{item.name}</p>
                  <p className="text-sm text-gray-600">
                    {currency}
                    {item.price} | {item.category}
                  </p>
                  <p className="text-sm text-gray-500 line-clamp-2">
                    {item.description?.slice(0, 100)}...
                  </p>
                </div>
                <button
                  onClick={() => handleEdit(index)}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded h-fit"
                >
                  Edit
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Edit;
