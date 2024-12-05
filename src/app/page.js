"use client";

import { GlobalContext } from "@/context"; 
import { getAllAdminProducts } from "@/services/product"; 
import { useRouter } from "next/navigation"; 
import { useContext, useEffect, useState } from "react"; 

export default function Home() {
  const { isAuthUser } = useContext(GlobalContext);
  const [products, setProducts] = useState([]); 
  const router = useRouter();

  async function getListOfProducts() {
    const res = await getAllAdminProducts();
    if (res.success) {
      setProducts(res.data);
    }
  }

  useEffect(() => {
    getListOfProducts();
  }, []);

  return (
    <main className="bg-gradient-to-b from-white via-gray-100 to-gray-200 min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-purple-600 to-pink-500 text-white py-16">
        <div className="container mx-auto px-6 lg:flex lg:items-center lg:justify-between">
          <div className="lg:w-1/2">
            <h1 className="text-4xl font-bold leading-tight sm:text-5xl">
              Welcome to MallifyIQ
            </h1>
            <p className="mt-4 text-lg">
              Discover a world of shopping, dining, and entertainment all under one roof.
            </p>
            <button
              type="button"
              onClick={() => router.push("/product/listing/all-products")}
              className="mt-6 px-6 py-3 bg-yellow-400 text-black font-semibold rounded-lg shadow-md hover:bg-yellow-500 transition"
            >
              Explore Now
            </button>
          </div>
          <div className="lg:w-1/2 mt-8 lg:mt-0">
            <img
              src="/imgs/mall.webp"
              alt="Mall Entrance"
              className="rounded-lg shadow-lg"
            />
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="container mx-auto py-12 px-6">
        <h2 className="text-center text-3xl font-bold text-gray-800">
          Featured Products
        </h2>
        <p className="text-center text-gray-600 mt-2">
          Explore the best deals on our exclusive products.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
          {products && products.length ? (
            products
              .filter((item) => item.onSale === "yes") // Show only on-sale items
              .slice(0, 4) // Limit to 4 items
              .map((product) => (
                <div
                  key={product._id}
                  onClick={() => router.push(`/product/${product._id}`)}
                  className="cursor-pointer rounded-lg shadow-md overflow-hidden border hover:shadow-xl transition"
                >
                  <img
                    src={product.imageUrl || "/imgs/img1.avif"}
                    alt={product.name}
                    className="object-cover w-full h-48"
                  />
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-800">
                      {product.name}
                    </h3>
                    <p className="text-gray-600 mt-1">${product.price}</p>
                    <p className="text-red-500 mt-1">
                      {`(-${product.priceDrop}%) Off`}
                    </p>
                  </div>
                </div>
              ))
          ) : (
            <p className="text-gray-500">No products on sale currently.</p>
          )}
        </div>
      </section>

      {/* Categories Section */}
      <section className="bg-gray-100 py-12">
        <h2 className="text-center text-3xl font-bold text-gray-800">
          Explore by Category
        </h2>
        <p className="text-center text-gray-600 mt-2">
          Find everything you need, from fashion to food.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-8 px-6 container mx-auto">
          <CategoryCard
            image="/imgs/img2.jpg"
            title="Fashion"
            description="Trendy outfits for all seasons."
            onClick={() => router.push("/product/listing/fashion")}
          />
          <CategoryCard
            image="/imgs/img3.avif"
            title="Women"
            description="Trends For Trendy Women."
            onClick={() => router.push("/product/listing/dining")}
          />
          <CategoryCard
            image="/imgs/img4.jpg"
            title="Men"
            description="Men's Clothing and Fashion."
            onClick={() => router.push("/product/listing/entertainment")}
          />
        </div>
      </section>
    </main>
  );
}

// Reusable Component for Categories
function CategoryCard({ image, title, description, onClick }) {
  return (
    <div
      className="relative block group cursor-pointer rounded-lg overflow-hidden shadow-md hover:shadow-lg transition"
      onClick={onClick}
    >
      <img src={image} alt={title} className="object-cover w-full h-64" />
      <div className="absolute inset-0 flex flex-col justify-end p-6 bg-gradient-to-t from-black/60 to-transparent">
        <h3 className="text-xl font-medium text-white">{title}</h3>
        <p className="text-sm text-gray-300">{description}</p>
        <button className="mt-3 px-4 py-2 bg-yellow-400 text-black font-semibold rounded-lg shadow-md hover:bg-yellow-500 transition">
          Explore
        </button>
      </div>
    </div>
  );
}
