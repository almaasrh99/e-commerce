"use client"

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

const Checkout = () => {
  const router = useRouter();

  useEffect(() => {
    localStorage.removeItem('cart');
  }, []);



return (
    <motion.div
        className="flex flex-col items-center justify-center h-screen"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
    >
        <motion.h1
            className="text-4xl font-bold mb-4"
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
        >
            Checkout Successful
        </motion.h1>
        <motion.p
            className="text-lg mb-8"
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
        >
            Terimakasih Telah Berbelanja!
        </motion.p>
        <motion.button
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            onClick={() => router.push('/products')}
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
        >
           Belanja Lagi
        </motion.button>
    </motion.div>
);
};

export default Checkout;