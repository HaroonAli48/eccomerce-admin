import React, { useState, useEffect } from "react";
import { assets } from "../assets/assets";
import { backendUrl } from "../App";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const HeroEdit = ({ token }) => {
  const [pic1, setImage1] = useState(false);
  const [pic2, setImage2] = useState(false);
  const [pic3, setImage3] = useState(false);
  const [pic4, setImage4] = useState(false);
  const [pic5, setImage5] = useState(false);
  const [pic6, setImage6] = useState(false);
  const [pic7, setImage7] = useState(false);
  const [pic8, setImage8] = useState(false);
  const [pic9, setImage9] = useState(false);
  const [pic10, setImage10] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    return () => {
      if (pic1) URL.revokeObjectURL(pic1);
      if (pic2) URL.revokeObjectURL(pic2);
      if (pic3) URL.revokeObjectURL(pic3);
      if (pic4) URL.revokeObjectURL(pic4);
      if (pic5) URL.revokeObjectURL(pic5);
      if (pic6) URL.revokeObjectURL(pic6);
      if (pic7) URL.revokeObjectURL(pic7);
      if (pic8) URL.revokeObjectURL(pic8);
      if (pic9) URL.revokeObjectURL(pic9);
      if (pic10) URL.revokeObjectURL(pic10);
    };
  }, [pic1, pic2, pic3, pic4, pic5, pic6, pic7, pic8, pic9, pic10]);

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    // if (!pic1 && !pic2 && !pic3) {
    //   toast.warn("Please select at least one image.");
    //   return;
    // }

    setLoading(true);
    const formData = new FormData();
    if (pic1) formData.append("pic1", pic1);
    if (pic2) formData.append("pic2", pic2);
    if (pic3) formData.append("pic3", pic3);
    if (pic4) formData.append("pic4", pic4);
    if (pic5) formData.append("pic5", pic5);
    if (pic6) formData.append("pic6", pic6);
    if (pic7) formData.append("pic7", pic7);
    if (pic8) formData.append("pic8", pic8);
    if (pic9) formData.append("pic9", pic9);
    if (pic10) formData.append("pic10", pic10);

    try {
      const res = await axios.post(
        `${backendUrl}/api/images/upload`,
        formData,
        {
          headers: { token },
        }
      );
      toast.success("Images uploaded successfully!");
      console.log(res.data);

      // Clear previews
      setImage1(false);
      setImage2(false);
      setImage3(false);
    } catch (err) {
      console.error(err);
      toast.error("Upload failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const previewStyle =
    "w-28 h-28 object-cover border rounded shadow-sm hover:scale-105 transition";

  return (
    <form
      onSubmit={onSubmitHandler}
      className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md"
    >
      <h2 className="text-xl font-semibold mb-4 text-center">
        Upload Hero Images
      </h2>

      {[
        { pic: pic1, setPic: setImage1, id: "pic1", label: "Image 1" },
        { pic: pic2, setPic: setImage2, id: "pic2", label: "Image 2" },
        { pic: pic3, setPic: setImage3, id: "pic3", label: "Image 3" },
        { pic: pic4, setPic: setImage4, id: "pic4", label: "Image 4" },
        { pic: pic5, setPic: setImage5, id: "pic5", label: "Image 5" },
        { pic: pic6, setPic: setImage6, id: "pic6", label: "Image 6" },
        { pic: pic7, setPic: setImage7, id: "pic7", label: "Image 7" },
        { pic: pic8, setPic: setImage8, id: "pic8", label: "Image 8" },
        { pic: pic9, setPic: setImage9, id: "pic9", label: "Image 9" },
        { pic: pic10, setPic: setImage10, id: "pic10", label: "Image 10" },
      ].map(({ pic, setPic, id, label }) => (
        <div key={id} className="mb-4">
          <p className="mb-1 font-medium">{label}:</p>
          <label htmlFor={id} className="cursor-pointer inline-block">
            <img
              src={!pic ? assets.upload_area : URL.createObjectURL(pic)}
              className={previewStyle}
              alt=""
            />
            <input
              onChange={(e) => setPic(e.target.files[0])}
              type="file"
              accept="image/*"
              id={id}
              hidden
            />
          </label>
        </div>
      ))}

      <button
        type="submit"
        className={`w-full py-2 mt-4 rounded-md text-white font-semibold ${
          loading ? "bg-gray-500" : "bg-black hover:bg-gray-800"
        } transition`}
        disabled={loading}
      >
        {loading ? "Uploading..." : "Upload Images"}
      </button>

      {/* Toast container */}
      <ToastContainer
        position="top-right"
        autoClose={2500}
        hideProgressBar={false}
      />
    </form>
  );
};

export default HeroEdit;
