import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
// import OAuth from '../components/oAuth';
import {
  signInStart,
  signInSuccess,
  signInFailure,
} from '../redux/user/userSlice';

export default function SignIn() {
  // State to manage form data
  const [formData, setFormData] = useState({});
  
  // Extracting loading and error state from the Redux store
  const { loading, error } = useSelector((state) => state.user);
  
  // useNavigate hook to programmatically navigate
  const navigate = useNavigate();
  
  // useDispatch hook to dispatch actions to the Redux store
  const dispatch = useDispatch();
  
  // Handle input change and update form data state
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Dispatch signInStart action to indicate loading state
      dispatch(signInStart());
      
      // Making a POST request to the sign-in endpoint
      const res = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      // Parsing the response data
      const data = await res.json();
      
      // If the response indicates failure, dispatch signInFailure action
      if (!res.ok) {
        dispatch(signInFailure(data.message));
        return;
      }
      
      // If the response is successful, dispatch signInSuccess action and navigate to the home page
      dispatch(signInSuccess(data));
      navigate('/');
    } catch (error) {
      // Dispatch signInFailure action in case of any errors
      dispatch(signInFailure(error.message));
    }
  };

  return (
    <div className='min-h-screen flex items-center justify-center bg-gradient-to-r from-gray-900 to-gray-700'>
      <div className='p-8 max-w-lg w-full bg-gray-800 rounded-lg shadow-lg transform transition-all duration-500 ease-in-out hover:scale-105'>
        <h1 className='text-4xl text-center font-bold text-white mb-6'>Sign In</h1>
        <form onSubmit={handleSubmit} className='flex flex-col gap-6'>
          <div className='relative'>
            <input
              type='email'
              id='email'
              className='peer placeholder-transparent h-10 w-full border-b-2 border-gray-600 text-gray-100 focus:outline-none focus:border-indigo-500 bg-transparent'
              placeholder='Enter your email'
              onChange={handleChange}
            />
            <label htmlFor='email' className='absolute left-0 -top-3.5 text-gray-400 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-gray-400 peer-focus:text-sm'>
              Email
            </label>
          </div>
          <div className='relative'>
            <input
              type='password'
              id='password'
              className='peer placeholder-transparent h-10 w-full border-b-2 border-gray-600 text-gray-100 focus:outline-none focus:border-indigo-500 bg-transparent'
              placeholder='Enter your password'
              onChange={handleChange}
            />
            <label htmlFor='password' className='absolute left-0 -top-3.5 text-gray-400 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-gray-400 peer-focus:text-sm'>
              Password
            </label>
          </div>
          <button
            disabled={loading}
            className='mt-6 bg-gradient-to-r from-purple-600 to-indigo-500 text-white p-4 rounded-lg uppercase font-bold hover:opacity-90 disabled:opacity-70 transition-opacity shadow-md'
          >
            {loading ? 'Loading...' : 'Sign In'}
          </button>
        {/* <OAuth/> */}
        </form>
        <div className='flex gap-2 mt-6 justify-center'>
          <p className='text-gray-400'>Don't have an account?</p>
          <Link to='/sign-up'>
            <span className='text-indigo-400'>Sign up</span>
          </Link>
        </div>
        {error && <p className='text-red-500 mt-5 text-center'>{error}</p>}
      </div>
    </div>
  );
}
