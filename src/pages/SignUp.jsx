import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
//import OAuth from  '../components/oAuth.jsx';

export default function SignUp() {
  // State to store form data
  const [formData, setFormData] = useState({});
  // State to store error messages
  const [error, setError] = useState(null);
  // State to manage loading state during form submission
  const [loading, setLoading] = useState(false);
  // Hook to programmatically navigate to a different route
  const navigate = useNavigate();

  // Function to handle input changes and update formData state
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    try {
      setLoading(true); // Set loading state to true
      // Send a POST request to the signup API endpoint with form data
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData), // Convert form data to JSON
      });
      const data = await res.json(); // Parse JSON response
      if (!res.ok) { // If response is not okay, handle the error
        setLoading(false); // Set loading state to false
        setError(data.message); // Set error message
        return;
      }
      setLoading(false); // Set loading state to false
      setError(null); // Clear any existing error messages
      navigate('/sign-in'); // Navigate to the sign-in page
    } catch (error) { // Handle any unexpected errors
      setLoading(false); // Set loading state to false
      setError('An unexpected error occurred. Please try again later.'); // Set generic error message
    }
  };

  return (
    // Main container with gradient background
    <div className='min-h-screen flex items-center justify-center bg-gradient-to-r from-gray-900 to-gray-700'>
      <div className='p-8 max-w-lg w-full bg-gray-800 rounded-lg shadow-lg transform transition-all duration-500 ease-in-out hover:scale-105'>
        {/* Title */}
        <h1 className='text-4xl text-center font-bold text-white mb-6'>Sign Up</h1>
        {/* Signup form */}
        <form onSubmit={handleSubmit} className='flex flex-col gap-6'>
          {/* Username input */}
          <div className='relative'>
            <input
              type='text'
              id='username'
              className='peer placeholder-transparent h-10 w-full border-b-2 border-gray-600 text-gray-100 focus:outline-none focus:border-blue-500 bg-transparent'
              placeholder='Enter your username'
              onChange={handleChange}
            />
            <label htmlFor='username' className='absolute left-0 -top-3.5 text-gray-400 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-gray-400 peer-focus:text-sm'>
              Username
            </label>
          </div>
          {/* Email input */}
          <div className='relative'>
            <input
              type='email'
              id='email'
              className='peer placeholder-transparent h-10 w-full border-b-2 border-gray-600 text-gray-100 focus:outline-none focus:border-blue-500 bg-transparent'
              placeholder='Enter your email'
              onChange={handleChange}
            />
            <label htmlFor='email' className='absolute left-0 -top-3.5 text-gray-400 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-gray-400 peer-focus:text-sm'>
              Email
            </label>
          </div>
          {/* Password input */}
          <div className='relative'>
            <input
              type='password'
              id='password'
              className='peer placeholder-transparent h-10 w-full border-b-2 border-gray-600 text-gray-100 focus:outline-none focus:border-blue-500 bg-transparent'
              placeholder='Enter your password'
              onChange={handleChange}
            />
            <label htmlFor='password' className='absolute left-0 -top-3.5 text-gray-400 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-gray-400 peer-focus:text-sm'>
              Password
            </label>
          </div>
          {/* Submit button */}
          <button
            disabled={loading}
            className='mt-6 bg-gradient-to-r from-purple-600 to-blue-500 text-white p-4 rounded-lg uppercase font-bold hover:opacity-90 disabled:opacity-70 transition-opacity shadow-md'
          >
            {loading ? 'Loading...' : 'Sign Up'}
          </button>
          {/* <OAuth/> */}
        </form>
        {/* Link to Sign-in */}
        <div className='flex gap-2 mt-6 justify-center'>
          <p className='text-gray-400'>Have an account?</p>
          <Link to='/sign-in'>
            <span className='text-blue-400'>Sign in</span>
          </Link>
        </div>
        {/* Error message display */}
        {error && <p className='text-red-500 mt-5 text-center'>{error}</p>}
      </div>
    </div>
  );
}
