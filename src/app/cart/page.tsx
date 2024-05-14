"use client"
import useSWR from "swr";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';


const fetcher = (url: string) => fetch(url).then((res) => res.json());

// interface Props {
//     query: string;
// }

interface Product {
    id: number;
    price: number;
  }

export default function CartPage() {
    const router = useRouter();
    const [subtotal, setSubtotal] = useState(0);
    const [cart, setCart] = useState([]);
    const { data: allProducts, error } = useSWR(`https://fakestoreapi.com/products/?${Object.keys(cart).map((product: any) => product.id)}`, fetcher);
    
    console.log(allProducts);
    
    useEffect(() => {
        const storedCart = localStorage.getItem('cart');
        if (storedCart) {
            setCart(JSON.parse(storedCart) || []);
        }
    }, []);

        useEffect(() => {
            if (allProducts && cart.length > 0) {
                let cartIds: number[] = cart.map((product: Product) => product.id);
                const cartProducts = allProducts.filter((product: Product) => cartIds.includes(product.id));
                const updatedCartProducts = cartProducts.map((product: Product) => ({...product, subtotal: product.price}));
                setCart(updatedCartProducts);
                const totalSubtotal = updatedCartProducts.reduce((acc: number, product: any) => acc + product.subtotal, 0);
                setSubtotal(totalSubtotal);
            }
        }, [allProducts, cart]);
           

    if (error) return <div>Error: {error.message}</div>;
    if (!allProducts) return <div className="flex justify-center items-center">
        <svg
            aria-hidden="true"
            className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
            viewBox="0 0 100 101"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="currentColor"
            />
            <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="currentFill"
            />
        </svg>
        <span className="p-4 text-gray-900">Sedang Memuat...</span>
    </div>;

    const handleCheckout = () => {
        localStorage.removeItem('cart');
        // Redirect ke halaman checkout 
        router.push("./checkout")
    };

  

    return (
        <div className="container mx-auto p-4 mb-20">
            <h1 className="text-2xl font-bold mb-4">Cart</h1>
            <div className="grid grid-cols-3 gap-4">
                {Object.keys(cart).map((product: any) => (
                    <div key={product.id} className="border p-4">
                        <img src={product.image} alt={product.title} className="w-full h-48 object-cover mb-2" />
                        <h2 className="text-lg font-bold">{product.title}</h2>
                        <p className="text-sm text-gray-500">Harga: Rp {product.price}</p>
                        <p className="text-sm text-gray-500">Jumlah: {product.quantity}</p>
                        <p className="text-sm text-gray-500">Subtotal: Rp {product.subtotal}</p>
                    </div>
                ))}
            </div>
            
            <div className="fixed bottom-0 left-0 right-0 bg-white p-6 flex justify-between items-center shadow-[0_35px_60px_-15px_rgba(0,0,0,0.8)]">
                <p className="text-xl text-red-900 font-bold">Total: Rp {subtotal}</p>
                <button
                    onClick={handleCheckout}
                    className="bg-blue-500 w-64 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
                >
                    Checkout
                </button>
            </div>
        </div>
    );
}
    
