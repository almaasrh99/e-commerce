"use client";
import useSWR from "swr";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AwesomeButton } from "react-awesome-button";
import "react-awesome-button/dist/styles.css";
import { MdShoppingCart } from "react-icons/md";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

interface Props {
  query: string;
}

export default function Products({ query }: Props) {
  const [email, setEmail] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  // const [imageUrl, setImageUrl] = useState(false);
  const { data, error } = useSWR(
    `https://fakestoreapi.com/products/?limit=12&search=${query}`,
    fetcher
  );
  const [cart, setCart] = useState([]);
  const router = useRouter();
  const subtotal = cart
    .reduce((total, product) => {
      const price = Number((product as { price: string }).price);
      const quantity = Number((product as { quantity: number }).quantity);

      if (isNaN(price) || isNaN(quantity)) {
        console.error(
          `Invalid price or quantity for product ${(product as any).id}`
        );
        return total;
      }

      return total + price * quantity;
    }, 0)
    .toFixed(2);

  useEffect(() => {
    // Melakukan pengecekan apakah user sudah login atau belum
    const loggedIn =
      typeof window !== "undefined" && localStorage.getItem("loggedIn");
    const storedEmail =
      typeof window !== "undefined" && localStorage.getItem("email");
    // const storedToken = typeof window !== "undefined" && localStorage.getItem("tokenId");
    // const storedImageUrl = typeof window !== "undefined" && localStorage.getItem("imageUrl");

    if (!loggedIn) {
      // Jika user tidak melakukan login dialihkan ke halaman login
      alert("Anda belum login");
      router.push("/login");
    } else {
      setIsLoggedIn(true);
      setEmail(storedEmail || "");
      // setEmail(storedToken || "");
      // setImageUrl(storedImageUrl);
    }
  }, []);

  useEffect(() => {
    // Mengambil data cart dari local storage saat memuat halaman
    const storedCart = localStorage.getItem("cart");
    if (storedCart) {
      setCart(JSON.parse(storedCart));
    }
  }, []);

  const handleLogout = () => {
    //Logout menghapus data login di local storage
    localStorage.removeItem("loggedIn");
    localStorage.removeItem("email");
    //Redirect ke halaman login
    router.push("/login");
  };

  if (!isLoggedIn) {
    return null;
  }

  const handleAddToCart = (product: any) => {
    const newCart: { id: number; quantity: number }[] = Array.isArray(cart)
      ? [...cart]
      : [];
    const foundIndex = newCart.findIndex((item) => item.id === product.id);

    if (foundIndex >= 0) {
      // Jika produk sudah ada di dalam troli, tambah kuantitasnya
      newCart[foundIndex].quantity += 1;
    } else {
      // Jika produk tidak ada di keranjang, tambahkan dengan sejumlah 1
      newCart.push({ ...product, quantity: 1 });
    }
    setCart(newCart);
    localStorage.setItem("cart", JSON.stringify(newCart));
  };

  if (error) return <div>Error: {error.message}</div>;
  if (!data)
    return (
      <div className="flex justify-center items-center">
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
      </div>
    );

  console.log(data);

  // function logout(): void {
  //   throw new Error("Function not implemented.");
  // }

  return (
    <div>
      <nav className="fixed z-50 top-0 left-0 right-0 bg-white shadow-md flex justify-between items-center px-8 sm:px-10 xs:p-4 xs:text-sm">
        <div>
          <Link href="./cart">
            <div className="flex items-center">
              <MdShoppingCart
                size={24}
                className="text-blue-600 font-semibold fa fa-shopping-cart text-3xl p-2 lg:fa-lg xs:font-semibold xs:text-md xs:p-0"
                aria-hidden="true"
              ></MdShoppingCart>
              <p className="text-slate-00 font-semibold text-md ml-2 xs:font-semibold xs:text-sm xs:text-center">
                {Object.keys(cart).length} items
              </p>
            </div>
          </Link>
        </div>
        <span className="p-4 text-slate-900 text-lg font-semibold xs:font-semibold sm:text-xl xs:text-sm xs:text-center">
          Total :{" "}
          <span className="text-orange-600 text-xl font-semibold sm:font-semibold sm:text-xl xs:font-semibold xs:text-base xs:text-center">
            Rp {subtotal}
          </span>
        </span>
        <div>
          <AwesomeButton type="danger" onPress={handleLogout}>
            Logout
          </AwesomeButton>
        </div>
      </nav>
      <div className="p-8 flex flex-col justify-center items-center"></div>
      <div className="p-8 flex flex-col justify-center items-center">
        <h1 className="mt-10 flex text-2xl font-bold sm:mt-20 sm:text-2xl xs:mt-20 lg:mt-10">
          Daftar Products
        </h1>
        <h2 className="m-2 text-xl font-bold p-4 xs:text-center xs:m-0">
          Selamat datang{" "}
          <span className="font-semibold italic text-xl text-emerald-600">
            {isLoggedIn && email ? ` ${email}` : ""}
          </span>
          <span></span>
        </h2>
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 xs:mt-5">
          {data.map((product: any) => (
            <div
              key={product.id}
              className="flex flex-col justify-center items-center bg-white rounded-lg shadow-md p-4"
            >
              <img
                src={product.image}
                alt={product.title}
                className="w-full h-64 object-cover mb-4 xs:h-32 xs:w-64 xs:bg-cover"
              />
              <h2 className="text-lg font-semibold text-center">
                {product.title}
              </h2>
              {/* <p className="text-gray-500 overflow-ellipsis overflow-hidden">
              {product.description.length > 20
                ? product.description.slice(0, 20) + "..."
                : product.description}
            </p> */}
              <p className="text-orange-600 font-bold mt-2 mb-2">
                Rp {product.price}
              </p>
              <AwesomeButton
                type="primary"
                onPress={() => handleAddToCart(product)} // Use onPress instead of onClick
              >
                + Add to Cart
              </AwesomeButton>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
