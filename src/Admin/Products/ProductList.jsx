import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, Eye } from 'lucide-react';
import { toast } from 'react-hot-toast';
import axios from 'axios';

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchProducts = async () => {
        try {
            const token = localStorage.getItem('admin-token');
            const { data } = await axios.get('http://localhost:5000/api/admin/products', {
                headers: { Authorization: `Bearer ${token}` },
            });
            setProducts(data);
        } catch (error) {
            toast.error('Failed to fetch products');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this product?')) return;
        try {
            const token = localStorage.getItem('admin-token');
            await axios.delete(`http://localhost:5000/api/admin/products/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            toast.success('Product deleted successfully');
            fetchProducts();
        } catch (error) {
            toast.error('Failed to delete product');
        }
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-[#174D3B]">Products</h1>
                <Link
                    to="/admin/products/create"
                    className="flex items-center gap-2 bg-emerald-700 text-white px-4 py-2 rounded-lg hover:bg-emerald-800 transition"
                >
                    <Plus className="h-4 w-4" /> Add Product
                </Link>
            </div>

            {loading ? (
                <div className="flex justify-center py-12">
                    <div className="animate-spin h-8 w-8 border-4 border-emerald-500 border-t-transparent rounded-full" />
                </div>
            ) : (
                <div className="bg-white rounded-2xl shadow-sm border border-amber-200/30 overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-[#FAF9F5] border-b border-amber-200/30">
                            <tr>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Image</th>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Title</th>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Price</th>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Stock</th>
                                <th className="px-6 py-3 text-right text-sm font-semibold text-gray-600">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map((product, index) => (
                                <motion.tr
                                    key={product._id}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: index * 0.05 }}
                                    className="border-b border-amber-200/30 hover:bg-amber-50/30"
                                >
                                    <td className="px-6 py-3">
                                        <img
                                            src={product.image || '/default-book.jpg'}
                                            alt={product.title}
                                            className="h-12 w-10 rounded object-cover"
                                        />
                                    </td>
                                    <td className="px-6 py-3 font-medium text-gray-800">{product.title}</td>
                                    <td className="px-6 py-3 text-emerald-700 font-bold">৳{product.price}</td>
                                    <td className="px-6 py-3">{product.stock}</td>
                                    <td className="px-6 py-3 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <Link
                                                to={`/admin/products/edit/${product._id}`}
                                                className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition"
                                            >
                                                <Edit className="h-4 w-4" />
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(product._id)}
                                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                            <Link
                                                to={`/books/${product._id}`}
                                                target="_blank"
                                                className="p-2 text-gray-500 hover:bg-gray-50 rounded-lg transition"
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
            )}
        </div>
    );
};

export default ProductList;