"use client"
import useSWR from "swr";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

interface Props {
    query: string;
  }

export default function Products ({query} :Props) {
  const [email, setEmail] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { data ,error } = useSWR(`https://fakestoreapi.com/products/?limit=12&search=${query}`,fetcher);
  const [cart, setCart] = useState({});
  const router = useRouter();
 

  useEffect(() => {
    // Melakukan pengecekan apakah user sudah login atau belum
    const loggedIn = typeof window !== "undefined" && localStorage.getItem("loggedIn");
    const storedEmail = typeof window !== "undefined" && localStorage.getItem("email");
   

    if (!loggedIn) {
      // Jika user tidak melakukan login dialihkan ke halaman login
      alert("Anda belum login");
      router.push("/login");
    } else {
      setIsLoggedIn(true);
      setEmail(storedEmail || "");
    }

  }, []);

  useEffect(() => {
   // Mengambil data cart dari local storage saat memuat halaman
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      setCart(JSON.parse(storedCart));
    }
  }, []);

  const handleLogout = () => {
    //Logout menghapus data login di local storage
    localStorage.removeItem("loggedIn");
    //Redirect ke halaman login
    router.push("/login");
  };

  if (!isLoggedIn) {
    return null;
  }

  const handleAddToCart = (product: any) => {
    const newCart: { [key: string]: number } = { ...cart };
    if (newCart[product.id]) {
      newCart[product.id] += 1;
    } else {
      newCart[product.id] = 1;
    }
    setCart(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
  };


  if (error) return <div>Error: {error.message}</div>;
  if (!data) return <div className="flex justify-center items-center">
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
  <span className="p-4 text-slate-900">Sedang memuat...</span>
</div>;

console.log(data);

return (
  <div>
    <nav className="fixed top-0 left-0 right-0 bg-white shadow-md flex justify-between items-center p-4">
      <div>
        <Link href='./cart'>
          <div className="flex items-center">
            <i className="fa fa-shopping-cart" aria-hidden="true"></i>
            <p className="text-blue-600 font-semibold text-md ml-2">
              Cart : {Object.keys(cart).length} items
            </p>
          </div>
        </Link>
      </div>
      <span className="p-4 text-red-900 text-xl font-semibold">
        Total : Rp{" "}
        {Object.keys(cart).reduce(
          (item, id) =>
            item +
            (data.find((product: any) => product.id === +id)?.price || 0) *
              cart[id as keyof typeof cart], 0
        ).toFixed(2)}
      </span>
      <div>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded-md"
        >
          Logout
        </button>
      </div>
    </nav>
    <div className="p-8 flex flex-col justify-center items-center">

      <h1 className="mt-20 flex text-2xl font-bold">Daftar Products</h1>
      <h2 className="m-2 font-bold p-4">
        Selamat datang{" "}
        <span className="font-semibold italic text-xl text-emerald-600">
          {isLoggedIn && email ? ` ${email}` : ""}
        </span>
      </h2>
      <div className="mt-10 grid grid-cols-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {data.map((product: any) => (
          <div key={product.id} className="bg-white rounded-lg shadow-md p-4">
            <img
              src={product.image}
              alt={product.title}
              className="w-full h-64 object-cover mb-4"
            />
            <h2 className="text-lg font-semibold">{product.title}</h2>
            <p className="text-gray-500 overflow-ellipsis overflow-hidden">
              {product.description.length > 20
                ? product.description.slice(0, 20) + "..."
                : product.description}
            </p>
            <p className="text-gray-700 font-bold mt-2">Rp {product.price}</p>
            <button
              onClick={() => handleAddToCart(product)}
              className="bg-blue-500 text-white px-4 py-2 mt-4 rounded-md"
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </div>
  </div>
);
};



