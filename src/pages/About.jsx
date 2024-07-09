import { useEffect } from 'react';
import { motion } from 'framer-motion';

export default function About() {
  // Animation variants for the text
  const containerVariants = {
    hidden: { opacity: 0, y: -50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 120,
        damping: 20,
        staggerChildren: 0.3,
      },
    },
  };

  const childVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className='min-h-screen flex flex-col items-center bg-gray-900 text-white'>
      <motion.div
        className='py-20 px-4 max-w-6xl mx-auto bg-gray-800 shadow-md rounded-lg'
        initial='hidden'
        animate='visible'
        variants={containerVariants}
      >
        <motion.h1
          className='text-3xl font-bold mb-4 text-center'
          variants={childVariants}
        >
          About House Hunt
        </motion.h1>
        <motion.p className='mb-4 leading-relaxed text-justify' variants={childVariants}>
          House Hunt is a leading real estate agency that specializes in helping clients buy, sell, and rent properties in the most desirable neighborhoods. Our team of experienced agents is dedicated to providing exceptional service and making the buying and selling process as smooth as possible.
        </motion.p>
        <motion.p className='mb-4 leading-relaxed text-justify' variants={childVariants}>
          Our mission is to help our clients achieve their real estate goals by providing expert advice, personalized service, and a deep understanding of the local market. Whether you are looking to buy, sell, or rent a property, we are here to help you every step of the way.
        </motion.p>
        <motion.p className='mb-4 leading-relaxed text-justify' variants={childVariants}>
          Our team of agents has a wealth of experience and knowledge in the real estate industry, and we are committed to providing the highest level of service to our clients. We believe that buying or selling a property should be an exciting and rewarding experience, and we are dedicated to making that a reality for each and every one of our clients.
        </motion.p>
      </motion.div>
    </div>
  );
}
