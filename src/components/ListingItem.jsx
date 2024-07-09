import { Link } from 'react-router-dom';
import { MdLocationOn } from 'react-icons/md';

export default function ListingItem({ listing }) {
  return (
    <div className='bg-gray-900 shadow-lg hover:shadow-2xl transition-shadow overflow-hidden rounded-lg w-full sm:w-[330px]'>
      <Link to={`/listing/${listing._id}`} className='block group'>
        <img
          src={
            listing.imageUrls[0] ||
            'https://53.fs1.hubspotusercontent-na1.net/hub/53/hubfs/Sales_Blog/real-estate-business-compressor.jpg?width=595&height=400&name=real-estate-business-compressor.jpg'
          }
          alt='listing cover'
          className='h-[320px] sm:h-[220px] w-full object-cover group-hover:scale-105 transition-transform duration-300'
        />
        <div className='p-4 flex flex-col gap-2 w-full'>
          <p className='truncate text-lg font-semibold text-white group-hover:text-blue-400'>
            {listing.name}
          </p>
          <div className='flex items-center gap-1'>
            <MdLocationOn className='h-5 w-5 text-blue-400' />
            <p className='text-sm text-gray-400 truncate w-full'>
              {listing.address}
            </p>
          </div>
          <p className='text-sm text-gray-400 line-clamp-2'>
            {listing.description}
          </p>
          <p className='text-blue-400 mt-2 font-semibold '>
            $
            {listing.offer
              ? listing.discountPrice.toLocaleString('en-US')
              : listing.regularPrice.toLocaleString('en-US')}
            {listing.type === 'rent' && ' / month'}
          </p>
          <div className='text-gray-400 flex gap-4'>
            <div className='font-bold text-xs'>
              {listing.bedrooms > 1
                ? `${listing.bedrooms} beds `
                : `${listing.bedrooms} bed `}
            </div>
            <div className='font-bold text-xs'>
              {listing.bathrooms > 1
                ? `${listing.bathrooms} baths `
                : `${listing.bathrooms} bath `}
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
