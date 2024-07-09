import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import SwiperCore from 'swiper';
import 'swiper/css/bundle';
import ListingItem from '../components/ListingItem';
import TypingEffect from '../components/TypingEffect';

SwiperCore.use([Navigation, Pagination, Autoplay]);

export default function Home() {
  const [offerListings, setOfferListings] = useState([]);
  const [saleListings, setSaleListings] = useState([]);
  const [rentListings, setRentListings] = useState([]);

  useEffect(() => {
    const fetchOfferListings = async () => {
      try {
        const res = await fetch('/api/listing/get?offer=true&limit=4');
        const data = await res.json();
        setOfferListings(data);
        fetchRentListings();
      } catch (error) {
        console.log(error);
      }
    };

    const fetchRentListings = async () => {
      try {
        const res = await fetch('/api/listing/get?type=rent&limit=4');
        const data = await res.json();
        setRentListings(data);
        fetchSaleListings();
      } catch (error) {
        console.log(error);
      }
    };

    const fetchSaleListings = async () => {
      try {
        const res = await fetch('/api/listing/get?type=sale&limit=4');
        const data = await res.json();
        setSaleListings(data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchOfferListings();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-900 to-gray-700 text-white">
      {/* Top Section */}
      <div className="flex flex-col items-center gap-6 p-8 max-w-6xl mx-auto text-center">
        <h1 className="font-bold text-3xl lg:text-6xl text-purple-400 animate-fadeIn">
          <TypingEffect text="Find your next perfect place with ease" speed={100} />
        </h1>
        <Link
          to="/search"
          className="text-sm sm:text-base text-blue-500 font-bold hover:underline animate-fadeIn"
        >
          Let's get started...
        </Link>
      </div>

      {/* Swiper Section */}
      <div className="w-full h-screen mb-8">
        {offerListings.length > 0 && (
          <Swiper
            navigation
            pagination={{ clickable: true }}
            autoplay={{ delay: 5000 }}
            className="h-full w-full rounded-lg shadow-lg overflow-hidden"
          >
            {offerListings.map((listing) => (
              <SwiperSlide key={listing._id}>
                <div
                  style={{
                    background: `url(${listing.imageUrls[0]}) center no-repeat`,
                    backgroundSize: 'cover',
                  }}
                  className="h-full w-full"
                ></div>
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </div>

      {/* Listing Sections */}
      <div className="w-full min-h-screen flex flex-col">
        {offerListings.length > 0 && (
          <div className="flex-grow p-6 bg-gray-800 rounded-lg shadow-lg flex flex-col justify-center w-full">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold text-purple-400">Recent offers</h2>
              <Link className="text-sm text-blue-500 hover:underline" to="/search?offer=true">
                Show more offers
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {offerListings.map((listing) => (
                <ListingItem listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )}

        {rentListings.length > 0 && (
          <div className="flex-grow p-6 bg-gray-800 rounded-lg shadow-lg flex flex-col justify-center w-full">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold text-purple-400">Recent places for rent</h2>
              <Link className="text-sm text-blue-500 hover:underline" to="/search?type=rent">
                Show more places for rent
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {rentListings.map((listing) => (
                <ListingItem listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )}

        {saleListings.length > 0 && (
          <div className="flex-grow p-6 bg-gray-800 rounded-lg shadow-lg flex flex-col justify-center w-full">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold text-purple-400">Recent places for sale</h2>
              <Link className="text-sm text-blue-500 hover:underline" to="/search?type=sale">
                Show more places for sale
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {saleListings.map((listing) => (
                <ListingItem listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
