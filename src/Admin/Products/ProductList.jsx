import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, Eye } from 'lucide-react';
import { toast } from 'react-hot-toast';
import api from '../../api/axios';

const ProductList = () => {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchbooks = async () => {
        try {
            const token = localStorage.getItem('admin-token');
            const { data } = await api.get("/books", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setBooks(data);
        } catch (error) {
            toast.error('Failed to fetch books');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchbooks();
    }, []);

    const handleDelete = async (id) => {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this book?"
        );

        if (!confirmDelete) return;

        try {
            await api.delete(`/books/${id}`);
            toast.success("Book deleted successfully!");
            setBooks((prevBooks) => prevBooks.filter((book) => book._id !== id));
        } catch (error) {
            console.error("Delete book error:", error);
            toast.error(error.response?.data?.message || "Failed to delete book");
        }
    };

    return (
        <div className="w-full">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-[#174D3B]">Books</h1>
                    <p className="text-sm text-gray-500 mt-0.5">Manage inventory and book details</p>
                </div>
                <Link
                    to="/admin/books/create"
                    className="flex items-center gap-2 bg-emerald-700 text-white px-4 py-2.5 rounded-lg hover:bg-emerald-800 transition text-sm font-medium shadow-sm w-full sm:w-auto justify-center"
                >
                    <Plus className="h-4 w-4" /> Add Product
                </Link>
            </div>

            {loading ? (
                <div className="flex justify-center py-12">
                    <div className="animate-spin h-8 w-8 border-4 border-emerald-500 border-t-transparent rounded-full" />
                </div>
            ) : books.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-2xl border border-amber-200/30">
                    <p className="text-gray-500 text-sm">No books found in the inventory.</p>
                </div>
            ) : (
                <>
                    {/* MOBILE CARD VIEW (Hidden on md and larger) */}
                    <div className="grid grid-cols-1 gap-4 md:hidden">
                        {books.map((product) => (
                            <div
                                key={product._id}
                                className="bg-white p-4 rounded-xl shadow-sm border border-amber-200/30 flex gap-4 items-start"
                            >
                                <img
                                    src={product.image || '/default-book.jpg'}
                                    alt={product.title}
                                    className="h-20 w-14 rounded object-cover shadow-sm flex-shrink-0"
                                />

                                <div className="flex-1 min-w-0">
                                    <h2 className="font-semibold text-gray-800 text-base truncate">
                                        {product.title}
                                    </h2>
                                    <p className="text-xs text-gray-500 mb-2 truncate">
                                        By {product.author || 'Unknown'}
                                    </p>

                                    <div className="flex items-center justify-between text-xs mb-3">
                                        <span className="text-emerald-700 font-bold text-sm">
                                            ৳{product.price}
                                        </span>
                                        <span className={`px-2 py-0.5 rounded font-medium ${product.stock > 0 ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-600'}`}>
                                            Stock: {product.stock}
                                        </span>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
                                        <Link
                                            to={`/admin/books/edit/${product._id}`}
                                            className="flex-1 flex items-center justify-center gap-1.5 py-1.5 bg-emerald-50 text-emerald-700 rounded-lg text-xs font-medium hover:bg-emerald-100 transition"
                                        >
                                            <Edit className="h-3.5 w-3.5" /> Edit
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(product._id)}
                                            className="flex-1 flex items-center justify-center gap-1.5 py-1.5 bg-red-50 text-red-600 rounded-lg text-xs font-medium hover:bg-red-100 transition"
                                        >
                                            <Trash2 className="h-3.5 w-3.5" /> Delete
                                        </button>
                                        <Link
                                            to={`/books/${product._id}`}
                                            target="_blank"
                                            className="p-1.5 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 transition"
                                            title="View Product"
                                        >
                                            <Eye className="h-4 w-4" />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* DESKTOP TABLE VIEW (Hidden on small screens, horizontal scroll enabled) */}
                    <div className="hidden md:block bg-white rounded-2xl shadow-sm border border-amber-200/30 overflow-hidden">
                        <div className="w-full overflow-x-auto">
                            <table className="w-full text-left border-collapse min-w-[700px]">
                                <thead className="bg-[#FAF9F5] border-b border-amber-200/30">
                                    <tr>
                                        <th className="px-4 py-3.5 text-xs font-semibold text-gray-600 uppercase tracking-wider">Image</th>
                                        <th className="px-4 py-3.5 text-xs font-semibold text-gray-600 uppercase tracking-wider">Title</th>
                                        <th className="px-4 py-3.5 text-xs font-semibold text-gray-600 uppercase tracking-wider">Author</th>
                                        <th className="px-4 py-3.5 text-xs font-semibold text-gray-600 uppercase tracking-wider">Price</th>
                                        <th className="px-4 py-3.5 text-xs font-semibold text-gray-600 uppercase tracking-wider">Stock</th>
                                        <th className="px-4 py-3.5 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-amber-200/20">
                                    {books.map((product, index) => (
                                        <motion.tr
                                            key={product._id}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ delay: index * 0.03 }}
                                            className="hover:bg-amber-50/20 transition"
                                        >
                                            <td className="px-4 py-3 whitespace-nowrap">
                                                <img
                                                    src={product.image || '/default-book.jpg'}
                                                    alt={product.title}
                                                    className="h-12 w-9 rounded object-cover shadow-sm"
                                                />
                                            </td>
                                            <td className="px-4 py-3 font-medium text-gray-800 whitespace-nowrap max-w-[220px] truncate">
                                                {product.title}
                                            </td>
                                            <td className="px-4 py-3 text-gray-600 whitespace-nowrap max-w-[150px] truncate">
                                                {product.author}
                                            </td>
                                            <td className="px-4 py-3 text-emerald-700 font-bold whitespace-nowrap">
                                                ৳{product.price}
                                            </td>
                                            <td className="px-4 py-3 text-gray-800 whitespace-nowrap">
                                                {product.stock}
                                            </td>
                                            <td className="px-4 py-3 text-right whitespace-nowrap">
                                                <div className="flex items-center justify-end gap-1">
                                                    <Link
                                                        to={`/admin/books/edit/${product._id}`}
                                                        className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition"
                                                        title="Edit Product"
                                                    >
                                                        <Edit className="h-4 w-4" />
                                                    </Link>
                                                    <button
                                                        onClick={() => handleDelete(product._id)}
                                                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                                                        title="Delete Product"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </button>
                                                    <Link
                                                        to={`/books/${product._id}`}
                                                        target="_blank"
                                                        className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition"
                                                        title="View Product"
                                                    >
                                                        <Eye className="h-4 w-4" />
                                                    </Link>
                                                </div>
                                            </td>
                                        </motion.tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default ProductList;