import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { app } from '../firebase';

export default function CreateListing() {
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();

  const [files, setFiles] = useState([]);
  const [formData, setFormData] = useState({
    imageUrls: [],
    name: '',
    description: '',
    address: '',
    type: 'rent',
    bedrooms: 1,
    bathrooms: 1,
    regularPrice: 50,
    discountPrice: 0,
    offer: false,
    parking: false,
    furnished: false,
  });

  const [imageUploadError, setImageUploadError] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleImageSubmit = (e) => {
    if (files.length > 0 && files.length + formData.imageUrls.length < 7) {
      setUploading(true);
      setImageUploadError(false);
      const promises = [];

      for (let i = 0; i < files.length; i++) {
        promises.push(storeImage(files[i]));
      }

      Promise.all(promises)
        .then((urls) => {
          setFormData({
            ...formData,
            imageUrls: formData.imageUrls.concat(urls),
          });
          setImageUploadError(false);
          setUploading(false);
        })
        .catch((err) => {
          setImageUploadError('Image upload failed (2 mb max per image)');
          setUploading(false);
        });
    } else {
      setImageUploadError('You can only upload 6 images per listing');
      setUploading(false);
    }
  };

  const storeImage = async (file) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Upload is ${progress}% done`);
        },
        (error) => {
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL);
          });
        }
      );
    });
  };

  const handleRemoveImage = (index) => {
    setFormData({
      ...formData,
      imageUrls: formData.imageUrls.filter((_, i) => i !== index),
    });
  };

  const handleChange = (e) => {
    if (e.target.id === 'sale' || e.target.id === 'rent') {
      setFormData({
        ...formData,
        type: e.target.id,
      });
    }

    if (
      e.target.id === 'parking' ||
      e.target.id === 'furnished' ||
      e.target.id === 'offer'
    ) {
      setFormData({
        ...formData,
        [e.target.id]: e.target.checked,
      });
    }

    if (
      e.target.type === 'number' ||
      e.target.type === 'text' ||
      e.target.type === 'textarea'
    ) {
      setFormData({
        ...formData,
        [e.target.id]: e.target.value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData.imageUrls.length < 1)
        return setError('You must upload at least one image');
      if (+formData.regularPrice < +formData.discountPrice)
        return setError('Discount price must be lower than regular price');
      setLoading(true);
      setError(false);

      const res = await fetch('/api/listing/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          userRef: currentUser._id,
        }),
      });

      const data = await res.json();
      setLoading(false);

      if (data.success === false) {
        setError(data.message);
      }

      navigate(`/listing/${data._id}`);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  return (
    <div className='min-h-screen flex items-center justify-center bg-gradient-to-r from-gray-900 to-gray-700'>
      <div className='w-full max-w-lg bg-gradient-to-r from-gray-900 to-gray-700 p-8 rounded-lg shadow-md'>
        <h1 className='text-2xl font-bold mb-6 text-white'>Create a Listing</h1>
        <form onSubmit={handleSubmit}>
          <div className='flex flex-col mb-4'>
            <label htmlFor='name' className='mb-2 font-bold text-lg text-gray-100'>
              Name
            </label>
            <input
              type='text'
              id='name'
              className='border rounded-lg p-2 text-gray-900'
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className='flex flex-col mb-4'>
            <label htmlFor='description' className='mb-2 font-bold text-lg text-gray-100'>
              Description
            </label>
            <textarea
              id='description'
              className='border rounded-lg p-2 text-gray-900'
              value={formData.description}
              onChange={handleChange}
              required
            />
          </div>
          <div className='flex flex-col mb-4'>
            <label htmlFor='address' className='mb-2 font-bold text-lg text-gray-100'>
              Address
            </label>
            <input
              type='text'
              id='address'
              className='border rounded-lg p-2 text-gray-900'
              value={formData.address}
              onChange={handleChange}
              required
            />
          </div>
          <div className='flex flex-col mb-4'>
            <label className='mb-2 font-bold text-lg text-gray-100'>Type</label>
            <div className='flex items-center'>
              <input
                type='radio'
                id='sale'
                className='mr-2'
                checked={formData.type === 'sale'}
                onChange={handleChange}
              />
              <label htmlFor='sale' className='mr-4 text-gray-100'>
                Sale
              </label>
              <input
                type='radio'
                id='rent'
                className='mr-2'
                checked={formData.type === 'rent'}
                onChange={handleChange}
              />
              <label htmlFor='rent' className='text-gray-100'>Rent</label>
            </div>
          </div>
          <div className='flex flex-col mb-4'>
            <label htmlFor='bedrooms' className='mb-2 font-bold text-lg text-gray-100'>
              Bedrooms
            </label>
            <input
              type='number'
              id='bedrooms'
              className='border rounded-lg p-2 text-gray-900'
              value={formData.bedrooms}
              onChange={handleChange}
              required
            />
          </div>
          <div className='flex flex-col mb-4'>
            <label htmlFor='bathrooms' className='mb-2 font-bold text-lg text-gray-100'>
              Bathrooms
            </label>
            <input
              type='number'
              id='bathrooms'
              className='border rounded-lg p-2 text-gray-900'
              value={formData.bathrooms}
              onChange={handleChange}
              required
            />
          </div>
          <div className='flex flex-col mb-4'>
            <label htmlFor='regularPrice' className='mb-2 font-bold text-lg text-gray-100'>
              Regular Price
            </label>
            <input
              type='number'
              id='regularPrice'
              className='border rounded-lg p-2 text-gray-900'
              value={formData.regularPrice}
              onChange={handleChange}
              required
            />
          </div>
          <div className='flex items-center mb-4'>
            <input
              type='checkbox'
              id='offer'
              className='mr-2'
              checked={formData.offer}
              onChange={handleChange}
            />
            <label htmlFor='offer' className='font-bold text-lg text-gray-100'>
              Offer
            </label>
          </div>
          {formData.offer && (
            <div className='flex flex-col mb-4'>
              <label htmlFor='discountPrice' className='mb-2 font-bold text-lg text-gray-100'>
                Discount Price
              </label>
              <input
                type='number'
                id='discountPrice'
                className='border rounded-lg p-2 text-gray-900'
                value={formData.discountPrice}
                onChange={handleChange}
                required
              />
            </div>
          )}
          <div className='flex items-center mb-4'>
            <input
              type='checkbox'
              id='parking'
              className='mr-2'
              checked={formData.parking}
              onChange={handleChange}
            />
            <label htmlFor='parking' className='font-bold text-lg text-gray-100'>
              Parking
            </label>
          </div>
          <div className='flex items-center mb-4'>
            <input
              type='checkbox'
              id='furnished'
              className='mr-2'
              checked={formData.furnished}
              onChange={handleChange}
            />
            <label htmlFor='furnished' className='font-bold text-lg text-gray-100'>
              Furnished
            </label>
          </div>
          <div className='flex flex-col mb-4'>
            <label className='mb-2 font-bold text-lg text-gray-100'>Images</label>
            <input
              type='file'
              accept='image/*'
              multiple
              onChange={(e) => setFiles(e.target.files)}
              className='mb-2'
            />
            <button
              type='button'
              onClick={handleImageSubmit}
              className='bg-gradient-to-r from-purple-600 to-blue-500 text-white font-bold py-2 px-4 rounded-lg uppercase hover:opacity-90 disabled:opacity-70 transition-opacity shadow-md'
              disabled={uploading}
            >
              {uploading ? 'Uploading...' : 'Upload Images'}
            </button>
            {imageUploadError && (
              <p className='text-red-500 text-sm mt-2'>{imageUploadError}</p>
            )}
            <div className='flex flex-wrap gap-2 mt-2'>
              {formData.imageUrls.map((url, index) => (
                <div key={index} className='relative'>
                  <img
                    src={url}
                    alt='Listing'
                    className='w-24 h-24 object-cover rounded-lg'
                  />
                  <button
                    type='button'
                    className='absolute top-1 right-1 text-red-500'
                    onClick={() => handleRemoveImage(index)}
                  >
                    X
                  </button>
                </div>
              ))}
            </div>
          </div>
          <button
            type='submit'
            className='bg-gradient-to-r from-purple-600 to-blue-500 text-white font-bold py-2 px-4 rounded-lg uppercase hover:opacity-90 disabled:opacity-70 transition-opacity shadow-md'
            disabled={loading}
          >
            {loading ? 'Creating...' : 'Create Listing'}
          </button>
          {error && <p className='text-red-500 text-sm mt-2'>{error}</p>}
        </form>
      </div>
    </div>
  );
}
