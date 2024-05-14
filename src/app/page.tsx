import Link from 'next/link'

export default function Home() {
  return (
   <div className=" flex flex-col justify-center items-center bg-slate-500 h-screen">
    <h1 className='block mx-auto text-2xl font-bold m-4'>Kamu harus login terlebih dahulu</h1>
    
      <Link href="/login"><button className='p-4 bg-blue-500 w-64 text-xl font-semibold text-white rounded-md'>Login</button></Link>
  
     
   </div>
  );
}
