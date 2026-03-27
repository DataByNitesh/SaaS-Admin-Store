import { useEffect, useState } from "react";
import API from "../api/axios";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    category: "",
    stock: "",
    image: "",
  });
  const [imageUploadType, setImageUploadType] = useState("url"); // "url" or "file"
  const [imageFile, setImageFile] = useState(null);
  const [editImageFile, setEditImageFile] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [category, setCategory] = useState("");
  const [sort, setSort] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);

  const handleNewChange = (e) => {
    setNewProduct({
      ...newProduct,
      [e.target.name]: e.target.value,
    });
  };

  const handleCreate = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");
      let finalImageUrl = newProduct.image;

      if (imageUploadType === "file" && imageFile) {
        const formData = new FormData();
        formData.append("image", imageFile);
        const uploadRes = await API.post("/upload", formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });
        finalImageUrl = uploadRes.data.image;
      }

      const productToCreate = { ...newProduct, image: finalImageUrl };

      const res = await API.post("/products", productToCreate, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setProducts([res.data.product, ...products]);

      setNewProduct({
        name: "",
        price: "",
        category: "",
        stock: "",
        image: "",
      });
      setImageFile(null);
      setShowCreateForm(false);
    } catch (error) {
      console.log("Create error:", error);
    }
  };

  const fetchProducts = async () => {
    try {
      let url = `/products?search=${search}&page=${page}&limit=8`;
      if (category) url += `&category=${category}`;
      if (sort) url += `&sort=${sort}`;
      
      const res = await API.get(url);
      setProducts(res.data.products);
      setTotalPages(res.data.totalPages || 1);
    } catch (error) {
      console.log("Fetch error:", error);
    }
  };

  const fetchUserRole = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      const res = await API.get("/auth/me", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setIsAdmin(res.data.user?.role === "admin");
    } catch (error) {
      console.log("Error fetching user role:", error);
    }
  };

  useEffect(() => {
    fetchUserRole();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchProducts();
    }, 300);
    return () => clearTimeout(timer);
  }, [search, page, category, sort]);

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");

      await API.delete(`/products/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setProducts(products.filter((p) => p._id !== id));
    } catch (error) {
      console.log("Delete error:", error);
    }
  };

  const handleEditClick = (product) => {
    setEditingId(product._id);
    setEditData(product);
    setEditImageFile(null);
  };

  const handleChange = (e) => {
    setEditData({
      ...editData,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpdate = async () => {
    try {
      const token = localStorage.getItem("token");
      let finalImageUrl = editData.image;

      if (editImageFile) {
        const formData = new FormData();
        formData.append("image", editImageFile);
        const uploadRes = await API.post("/upload", formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });
        finalImageUrl = uploadRes.data.image;
      }

      const updatedProductData = { ...editData, image: finalImageUrl };

      const res = await API.put(`/products/${editingId}`, updatedProductData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setProducts(
        products.map((p) => (p._id === editingId ? res.data.product : p)),
      );

      setEditingId(null);
      setEditImageFile(null);
    } catch (error) {
      console.log("Update error:", error);
      alert("Failed to update product");
      setEditingId(null);
      setEditImageFile(null);
    }
  };

  return (
    <div className="p-8 min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <div className="flex flex-col md:flex-row justify-between md:items-center mb-6 gap-4">
        <h1 className="text-4xl font-bold">Products</h1>
        {isAdmin && (
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-lg shadow-md font-medium transition"
          >
            {showCreateForm ? "Close Form" : "+ Add New Product"}
          </button>
        )}
      </div>

      {/* FILTER BAR */}
      <div className="bg-gray-800/80 border border-gray-700/50 p-4 rounded-xl shadow-lg mb-8 flex flex-col xl:flex-row gap-4 items-center">
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1); 
          }}
          className="p-3 bg-gray-900 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 w-full flex-grow shadow-inner text-sm"
        />
        
        <input
          type="text"
          placeholder="Filter Category..."
          value={category}
          onChange={(e) => {
            setCategory(e.target.value);
            setPage(1); 
          }}
          className="p-3 bg-gray-900 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 w-full xl:w-64 shadow-inner text-sm"
        />

        <select
          value={sort}
          onChange={(e) => {
            setSort(e.target.value);
            setPage(1);
          }}
          className="p-3 bg-gray-900 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 w-full xl:w-64 shadow-inner text-sm appearance-none"
        >
          <option value="">Sort: Newest First</option>
          <option value="price">Price: Low to High</option>
          <option value="-price">Price: High to Low</option>
          <option value="name">Name: A to Z</option>
          <option value="-name">Name: Z to A</option>
        </select>
      </div>

      {/* CREATE FORM */}
      {isAdmin && showCreateForm && (
        <div className="mb-10 bg-gray-800/80 border border-gray-700/50 rounded-xl p-6 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 bg-green-500 h-full"></div>
          <h2 className="text-xl font-bold mb-4">Create New Product</h2>
          <form
            onSubmit={handleCreate}
            className="grid md:grid-cols-4 gap-5"
          >
            {["name", "price", "category", "stock"].map((field) => (
              <div key={field} className="flex flex-col gap-1">
                <label className="text-sm text-gray-400 capitalize font-medium">{field}</label>
                <input
                  name={field}
                  type={field === "price" || field === "stock" ? "number" : "text"}
                  placeholder={`Enter ${field}`}
                  value={newProduct[field]}
                  onChange={handleNewChange}
                  className="p-3 bg-gray-900 rounded-lg outline-none focus:ring-2 focus:ring-green-500 transition w-full shadow-inner"
                />
              </div>
            ))}

            <div className="md:col-span-4 flex flex-col gap-2 p-4 bg-gray-900/50 rounded-lg border border-gray-700/50">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-2">
                <div className="flex gap-6">
                  <label className="flex items-center gap-2 cursor-pointer text-sm font-semibold">
                    <input type="radio" checked={imageUploadType === "url"} onChange={() => setImageUploadType("url")} className="accent-green-500 w-4 h-4" />
                    Provide Image URL
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer text-sm font-semibold">
                    <input type="radio" checked={imageUploadType === "file"} onChange={() => setImageUploadType("file")} className="accent-green-500 w-4 h-4" />
                    Upload Local File
                  </label>
                </div>
                <span className="text-xs text-gray-400 italic">Recommended: Square format (JPG/PNG/WEBP restrict &lt; 2MB)</span>
              </div>
              
              {imageUploadType === "url" ? (
                <input
                  name="image"
                  type="text"
                  placeholder="https://example.com/product.jpg"
                  value={newProduct.image}
                  onChange={handleNewChange}
                  className="p-3 bg-gray-900 border border-gray-700 rounded-lg outline-none focus:ring-2 focus:ring-green-500 transition w-full text-sm shadow-inner"
                />
              ) : (
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImageFile(e.target.files[0])}
                  className="p-2.5 bg-gray-900 border border-gray-700 rounded-lg outline-none focus:ring-2 focus:ring-green-500 transition w-full text-sm shadow-inner file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-gray-700 file:text-white hover:file:bg-gray-600"
                />
              )}
            </div>

            <button
              type="submit"
              className="md:col-span-4 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 p-3.5 rounded-lg font-bold text-lg hover:scale-[1.01] transition shadow-lg w-full flex justify-center items-center gap-2 mt-2"
            >
              Confirm & Save Product
            </button>
          </form>
        </div>
      )}

      {/* PRODUCT GRID */}
      <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {products.map((product) => (
          <div
            key={product._id}
            className="bg-gray-900/60 backdrop-blur-md border border-gray-700 rounded-xl p-4 shadow-lg hover:scale-[1.03] transition"
          >
            {/* IMAGE */}
            <div className="overflow-hidden rounded-lg bg-gray-800/80 flex justify-center items-center h-56 p-2 border border-gray-700/50 shadow-inner">
              <img
                src={editingId === product._id ? (editImageFile ? URL.createObjectURL(editImageFile) : (editData.image || product.image)) : product.image}
                alt={product.name}
                className="w-full h-full object-contain drop-shadow-md hover:scale-105 transition duration-300"
              />
            </div>
            {editingId === product._id && (
              <div className="mt-4 flex flex-col gap-2 p-3 bg-gray-800 rounded-lg border border-gray-700/50">
                <p className="text-xs text-gray-400 mb-1">Update Product Image (JPG/PNG/WEBP)</p>
                <input
                  type="text"
                  name="image"
                  value={editData.image || ""}
                  onChange={handleChange}
                  placeholder="Change Image URL"
                  className="w-full p-2 bg-gray-900 rounded text-sm outline-none focus:ring-1 focus:ring-green-500"
                />
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setEditImageFile(e.target.files[0])}
                  className="w-full p-2 bg-gray-900 rounded text-xs outline-none focus:ring-1 focus:ring-green-500"
                />
              </div>
            )}

            {/* NAME */}
            {editingId === product._id ? (
              <input
                name="name"
                value={editData.name}
                onChange={handleChange}
                className="w-full p-2 bg-gray-800 rounded mt-3"
              />
            ) : (
              <h2 className="text-lg font-semibold mt-3">{product.name}</h2>
            )}

            {/* PRICE */}
            {editingId === product._id ? (
              <input
                name="price"
                value={editData.price}
                onChange={handleChange}
                className="w-full p-2 bg-gray-800 rounded mt-2"
              />
            ) : (
              <p className="text-green-400 font-medium mt-1">
                ₹{new Intl.NumberFormat('en-IN').format(product.price)}
              </p>
            )}

            {/* CATEGORY */}
            {editingId === product._id ? (
              <input
                name="category"
                value={editData.category || ""}
                onChange={handleChange}
                className="w-full p-2 bg-gray-800 rounded mt-2"
              />
            ) : (
              <p className="text-sm text-gray-400 mt-1">{product.category}</p>
            )}

            {/* STOCK */}
            {editingId === product._id ? (
              <input
                name="stock"
                value={editData.stock}
                onChange={handleChange}
                className="w-full p-2 bg-gray-800 rounded mt-2"
              />
            ) : (
              <p className="text-sm mt-2 text-gray-300">
                Stock: {product.stock}
              </p>
            )}

            {/* ACTIONS */}
            {isAdmin && (
              <div className="flex gap-2 mt-5">
                {editingId === product._id ? (
                  <button
                    onClick={handleUpdate}
                    className="flex-1 bg-green-600 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition"
                  >
                    Save
                  </button>
                ) : (
                  <button
                    onClick={() => handleEditClick(product)}
                    className="flex-1 bg-blue-600 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition"
                  >
                    Edit
                  </button>
                )}

                <button
                  onClick={() => handleDelete(product._id)}
                  className="flex-1 bg-red-600 py-2 rounded-lg text-sm font-medium hover:bg-red-700 transition"
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-10">
          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className="px-5 py-2 bg-gray-800 rounded-lg disabled:opacity-50 hover:bg-gray-700 transition shadow-md font-medium"
          >
            Prev
          </button>
          <span className="text-gray-300 font-medium">
            Page {page} of {totalPages}
          </span>
          <button
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
            className="px-5 py-2 bg-gray-800 rounded-lg disabled:opacity-50 hover:bg-gray-700 transition shadow-md font-medium"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default Products;
