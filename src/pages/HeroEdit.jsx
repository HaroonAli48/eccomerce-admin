import React, { useState, useEffect } from 'react';
import { assets } from '../assets/assets';
import { backendUrl } from '../App';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const HeroEdit = ({ token }) => {
  const [pic1, setImage1] = useState(false);
  const [pic2, setImage2] = useState(false);
  const [pic3, setImage3] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    return () => {
      if (pic1) URL.revokeObjectURL(pic1);
      if (pic2) URL.revokeObjectURL(pic2);
      if (pic3) URL.revokeObjectURL(pic3);
    };
  }, [pic1, pic2, pic3]);

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    if (!pic1 && !pic2 && !pic3) {
      toast.warn('Please select at least one image.');
      return;
    }

    setLoading(true);
    const formData = new FormData();
    if (pic1) formData.append('pic1', pic1);
    if (pic2) formData.append('pic2', pic2);
    if (pic3) formData.append('pic3', pic3);

    try {
      const res = await axios.post(`${backendUrl}/api/images/upload`, formData, {
        headers: { token },
      });
      toast.success('Images uploaded successfully!');
      console.log(res.data);

      // Clear previews
      setImage1(false);
      setImage2(false);
      setImage3(false);
    } catch (err) {
      console.error(err);
      toast.error('Upload failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const previewStyle = 'w-28 h-28 object-cover border rounded shadow-sm hover:scale-105 transition';

  return (
    <form onSubmit={onSubmitHandler} className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4 text-center">Upload Hero Images</h2>

      {[{ pic: pic1, setPic: setImage1, id: 'pic1', label: 'Image 1' },
        { pic: pic2, setPic: setImage2, id: 'pic2', label: 'Image 2' },
        { pic: pic3, setPic: setImage3, id: 'pic3', label: 'Image 3' }
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
        className={`w-full py-2 mt-4 rounded-md text-white font-semibold ${loading ? 'bg-gray-500' : 'bg-black hover:bg-gray-800'} transition`}
        disabled={loading}
      >
        {loading ? 'Uploading...' : 'Upload Images'}
      </button>

      {/* Toast container */}
      <ToastContainer position="top-right" autoClose={2500} hideProgressBar={false} />
    </form>
  );
};

export default HeroEdit;
