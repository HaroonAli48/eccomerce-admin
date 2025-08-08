import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { backendUrl } from "../App";

const AddCategory = ({ token }) => {
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [subCategory, setSubCategory] = useState("");
  const [subCategories, setSubCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [heading, setHeading] = useState("");
  const [headings, setHeadings] = useState([]);

  useEffect(() => {
    fetchCategories();
    fetchHeadings();
    fetchSubCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${backendUrl}/api/category/get`, {
        headers: { token },
      });
      setCategories(res.data.category || []);
    } catch (err) {
      toast.error("Failed to fetch categories");
    }
  };

  const fetchSubCategories = async () => {
    try {
      const res = await axios.get(
        backendUrl + "/api/category/getSubCategories",
        {
          headers: { token },
        }
      );
      if (res.data.success) {
        setSubCategories(res.data.subCategory || []);
      }
    } catch (err) {
      toast.error("Failed to fetch subcategories");
      console.log(err);
    }
  };

  const fetchHeadings = async () => {
    try {
      const res = await axios.get(backendUrl + "/api/category/getHeadings", {
        headers: { token },
      });
      if (res.data.success) {
        setHeadings(res.data.heading || []);
      }
    } catch (err) {
      toast.error("Failed to fetch headings");
      console.log(err);
    }
  };

  const handleAddHeading = async (e) => {
    e.preventDefault();
    if (!heading.trim()) {
      toast.warn("Please enter a heading name.");
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post(
        `${backendUrl}/api/category/addHeading`,
        { name: heading },
        {
          headers: { token },
        }
      );
      if (res.data.success) {
        toast.success("Heading added!");
        setHeading("");
        fetchHeadings();
      } else {
        toast.error("Failed to add heading.");
      }
    } catch (err) {
      toast.error("Failed to add heading. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();

    if (!category.trim()) {
      toast.warn("Please enter a category name.");
      return;
    }

    setLoading(true);

    try {
      const res = await axios.post(
        `${backendUrl}/api/category/add`,
        { name: category },
        {
          headers: { token },
        }
      );
      toast.success(res.data.message || "Category added!");
      setCategory("");
      fetchCategories(); // Refresh list
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          "Failed to add category. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleAddSubCategory = async (e) => {
    e.preventDefault();
    if (!subCategory.trim()) {
      toast.warn("Please enter a subcategory name.");
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post(
        `${backendUrl}/api/category/addSubCategory`,
        { name: subCategory },
        {
          headers: { token },
        }
      );
      if (res.data.success) {
        toast.success("Subcategory added!");
        setSubCategory("");
        fetchSubCategories();
      } else {
        toast.error("Failed to add subcategory.");
      }
    } catch (err) {
      toast.error("Failed to add subcategory. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCategory = async (name) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"?`)) return;

    try {
      await axios.delete(`${backendUrl}/api/category/delete/${name}`, {
        headers: { token },
      });
      toast.success("Category deleted.");
      fetchCategories(); // Refresh list
    } catch (err) {
      toast.error("Failed to delete category.");
    }
  };

  const handleDeleteSubCategory = async (name) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"?`)) return;
    try {
      await axios.delete(
        `${backendUrl}/api/category/deleteSubCategory/${name}`,
        {
          headers: { token },
        }
      );
      toast.success("Subcategory deleted.");
      fetchSubCategories(); // Refresh list
    } catch (err) {
      toast.error("Failed to delete subcategory.");
    }
  };

  const handleDeleteHeading = async (name) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"?`)) return;
    try {
      await axios.delete(`${backendUrl}/api/category/deleteHeading/${name}`, {
        headers: { token },
      });
      toast.success("Heading deleted.");
      fetchHeadings(); // Refresh list
    } catch (err) {
      toast.error("Failed to delete heading.");
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4 text-center">
        Manage Categories
      </h2>

      {/* Add Category Form */}
      <form onSubmit={handleAddCategory}>
        <div className="mb-4">
          <label htmlFor="category" className="block text-sm font-medium mb-1">
            Category Name:
          </label>
          <input
            id="category"
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="Enter category name"
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>

        <button
          type="submit"
          className={`w-full py-2 mt-2 rounded-md text-white font-semibold ${
            loading ? "bg-gray-500" : "bg-black hover:bg-gray-800"
          } transition`}
          disabled={loading}
        >
          {loading ? "Adding..." : "Add Category"}
        </button>
      </form>

      {/* Category List */}
      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-2">Existing Categories</h3>
        <ul className="space-y-2">
          {categories.length === 0 && (
            <p className="text-gray-500 text-sm">No categories found.</p>
          )}
          {categories.map((cat, index) => (
            <li
              key={index}
              className="flex justify-between items-center px-3 py-2 border rounded"
            >
              <span>{cat}</span>
              <button
                onClick={() => handleDeleteCategory(cat)}
                className="text-red-500 hover:text-red-700 text-sm"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      </div>
      <h2 className="text-xl font-semibold mt-4 mb-4 text-center">
        Manage Sub Categories
      </h2>

      {/* Add Category Form */}
      <form onSubmit={handleAddSubCategory}>
        <div className="mb-4">
          <label htmlFor="category" className="block text-sm font-medium mb-1">
            Sub Category Name:
          </label>
          <input
            id="subCategory"
            type="text"
            value={subCategory}
            onChange={(e) => setSubCategory(e.target.value)}
            placeholder="Enter subcategory name"
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>

        <button
          type="submit"
          className={`w-full py-2 mt-2 rounded-md text-white font-semibold ${
            loading ? "bg-gray-500" : "bg-black hover:bg-gray-800"
          } transition`}
          disabled={loading}
        >
          {loading ? "Adding..." : "Add Category"}
        </button>
      </form>

      {/* Category List */}
      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-2">Existing Sub Categories</h3>
        <ul className="space-y-2">
          {subCategories.length === 0 && (
            <p className="text-gray-500 text-sm">No sub categories found.</p>
          )}
          {subCategories.map((cat, index) => (
            <li
              key={index}
              className="flex justify-between items-center px-3 py-2 border rounded"
            >
              <span>{cat}</span>
              <button
                onClick={() => handleDeleteSubCategory(cat)}
                className="text-red-500 hover:text-red-700 text-sm"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      </div>
      <h2 className="text-xl font-semibold mt-4 mb-4 text-center">
        Manage Headings
      </h2>

      {/* Add Category Form */}
      <form onSubmit={handleAddHeading}>
        <div className="mb-4">
          <label htmlFor="category" className="block text-sm font-medium mb-1">
            Heading Name:
          </label>
          <input
            id="heading"
            type="text"
            value={heading}
            onChange={(e) => setHeading(e.target.value)}
            placeholder="Enter heading name"
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>

        <button
          type="submit"
          className={`w-full py-2 mt-2 rounded-md text-white font-semibold ${
            loading ? "bg-gray-500" : "bg-black hover:bg-gray-800"
          } transition`}
          disabled={loading}
        >
          {loading ? "Adding..." : "Add Heading"}
        </button>
      </form>

      {/* Category List */}
      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-2">Existing Headings</h3>
        <ul className="space-y-2">
          {headings.length === 0 && (
            <p className="text-gray-500 text-sm">No Headings found.</p>
          )}
          {headings.map((cat, index) => (
            <li
              key={index}
              className="flex justify-between items-center px-3 py-2 border rounded"
            >
              <span>{cat}</span>
              <button
                onClick={() => handleDeleteHeading(cat)}
                className="text-red-500 hover:text-red-700 text-sm"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      </div>

      <ToastContainer
        position="top-right"
        autoClose={2500}
        hideProgressBar={false}
      />
    </div>
  );
};
export default AddCategory;
