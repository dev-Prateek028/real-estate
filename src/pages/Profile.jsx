import { useSelector } from 'react-redux';
import { useRef, useState, useEffect } from 'react';
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from 'firebase/storage';
import { app } from '../firebase';
import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  signOutUserStart,
} from '../redux/user/userSlice';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';

export default function Profile() {
  const fileRef = useRef(null);
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const [file, setFile] = useState(undefined);
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [showListingsError, setShowListingsError] = useState(false);
  const [userListings, setUserListings] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  const handleFileUpload = (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFilePerc(Math.round(progress));
      },
      (error) => {
        setFileUploadError(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>
          setFormData({ ...formData, avatar: downloadURL })
        );
      }
    );
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        return;
      }
      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
    } catch (error) {
      dispatch(updateUserFailure(error.message));
    }
  };

  const handleDeleteUser = async () => {
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess(data));
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };

  const handleSignOut = async () => {
    try {
      dispatch(signOutUserStart());
      const res = await fetch('/api/auth/signout');
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess(data));
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };

  const handleShowListings = async () => {
    try {
      setShowListingsError(false);
      const res = await fetch(`/api/user/listings/${currentUser._id}`);
      const data = await res.json();
      if (data.success === false) {
        setShowListingsError(true);
        return;
      }

      setUserListings(data);
    } catch (error) {
      setShowListingsError(true);
    }
  };

  const handleListingDelete = async (listingId) => {
    try {
      const res = await fetch(`/api/listing/delete/${listingId}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success === false) {
        console.log(data.message);
        return;
      }

      setUserListings((prev) =>
        prev.filter((listing) => listing._id !== listingId)
      );
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className='min-h-screen bg-gradient-to-r from-gray-900 to-gray-700 p-6 flex flex-col items-center text-white'>
      <h1 className='text-4xl font-semibold my-6'>Profile</h1>
      <form onSubmit={handleSubmit} className='bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-lg flex flex-col gap-6'>
        <input
          onChange={(e) => setFile(e.target.files[0])}
          type='file'
          ref={fileRef}
          hidden
          accept='image/*'
        />
        <img
          onClick={() => fileRef.current.click()}
          src={formData.avatar || currentUser.avatar}
          alt='profile'
          className='rounded-full h-24 w-24 object-cover cursor-pointer self-center'
        />
        <p className='text-sm self-center'>
          {fileUploadError ? (
            <span className='text-red-500'>
              Error uploading image (must be less than 2MB)
            </span>
          ) : filePerc > 0 && filePerc < 100 ? (
            <span className='text-slate-400'>{`Uploading ${filePerc}%`}</span>
          ) : filePerc === 100 ? (
            <span className='text-green-500'>Image successfully uploaded!</span>
          ) : (
            ''
          )}
        </p>
        <input
          type='text'
          placeholder='Username'
          defaultValue={currentUser.username}
          id='username'
          className='bg-gray-900 border border-gray-700 p-3 rounded-lg text-white'
          onChange={handleChange}
        />
        <input
          type='email'
          placeholder='Email'
          id='email'
          defaultValue={currentUser.email}
          className='bg-gray-900 border border-gray-700 p-3 rounded-lg text-white'
          onChange={handleChange}
        />
        <input
          type='password'
          placeholder='Password'
          onChange={handleChange}
          id='password'
          className='bg-gray-900 border border-gray-700 p-3 rounded-lg text-white'
        />
        <button
          disabled={loading}
          className='mt-4 bg-gradient-to-r from-purple-600 to-blue-500 text-white p-4 rounded-lg uppercase font-bold hover:opacity-90 disabled:opacity-70 transition-opacity shadow-md'
        >
          {loading ? 'Loading...' : 'Update'}
        </button>
        <Link
          className='mt-4 bg-green-600 text-white p-4 rounded-lg uppercase text-center font-bold hover:opacity-90 transition-opacity shadow-md'
          to={'/create-listing'}
        >
          Create Listing
        </Link>
      </form>
      <div className='flex justify-between mt-6 w-full max-w-lg'>
        <span
          onClick={handleDeleteUser}
          className='text-red-500 cursor-pointer'
        >
          Delete Account
        </span>
        <span onClick={handleSignOut} className='text-red-500 cursor-pointer'>
          Sign Out
        </span>
      </div>
      <p className='text-red-500 mt-5'>{error ? error : ''}</p>
      <p className='text-green-500 mt-5'>
        {updateSuccess ? 'User updated successfully!' : ''}
      </p>
      <button
        onClick={handleShowListings}
        className='mt-6 bg-blue-600 text-white p-4 rounded-lg uppercase font-bold hover:opacity-90 transition-opacity shadow-md'
      >
        Show Listings
      </button>
      <p className='text-red-500 mt-5'>
        {showListingsError ? 'Error showing listings' : ''}
      </p>

      {userListings && userListings.length > 0 && (
        <div className='w-full max-w-lg mt-6'>
          <h2 className='text-2xl font-semibold mb-4 text-center'>Your Listings</h2>
          <div className="flex flex-col gap-4">
            {userListings.map((listing) => (
              <div
                key={listing._id}
                className='bg-gray-800 border border-gray-700 rounded-lg p-4 flex justify-between items-center gap-4'
              >
                <Link to={`/listing/${listing._id}`}>
                  <img
                    src={listing.imageUrls[0]}
                    alt='listing cover'
                    className='h-16 w-16 object-cover rounded-lg'
                  />
                </Link>
                <Link
                  className='text-white font-semibold hover:underline truncate flex-1'
                  to={`/listing/${listing._id}`}
                >
                  <p>{listing.name}</p>
                </Link>
                <div className='flex flex-col items-center'>
                  <button
                    onClick={() => handleListingDelete(listing._id)}
                    className='text-red-500 uppercase font-bold hover:underline'
                  >
                    Delete
                  </button>
                  <Link to={`/update-listing/${listing._id}`}>
                    <button className='text-green-500 uppercase font-bold hover:underline'>
                      Edit
                    </button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
