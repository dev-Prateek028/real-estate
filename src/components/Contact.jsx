import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export default function Contact({ listing }) {
  const [landlord, setLandlord] = useState(null);
  const [message, setMessage] = useState('');
  const onChange = (e) => {
    setMessage(e.target.value);
  };

  useEffect(() => {
    const fetchLandlord = async () => {
      try {
        const res = await fetch(`/api/user/${listing.userRef}`);
        const data = await res.json();
        setLandlord(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchLandlord();
  }, [listing.userRef]);

  return (
    <>
      {landlord && (
        <div className='flex flex-col gap-4 p-5 bg-gray-800 rounded-lg shadow-lg transition-transform transform hover:scale-105'>
          <p className='text-white text-lg'>
            Contact <span className='font-semibold text-blue-400'>{landlord.username}</span> for{' '}
            <span className='font-semibold text-blue-400'>{listing.name.toLowerCase()}</span>
          </p>
          <textarea
            name='message'
            id='message'
            rows='4'
            value={message}
            onChange={onChange}
            placeholder='Enter your message here...'
            className='w-full border border-gray-600 bg-gray-700 text-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 ease-in-out'
          ></textarea>
          <Link
            to={`mailto:${landlord.email}?subject=Regarding ${listing.name}&body=${message}`}
            className='bg-blue-500 text-white text-center p-3 uppercase rounded-lg hover:bg-blue-600 transition duration-300 ease-in-out'
          >
            Send Message
          </Link>
        </div>
      )}
    </>
  );
}
