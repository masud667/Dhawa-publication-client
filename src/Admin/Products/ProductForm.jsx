import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'react-hot-toast';
import axios from 'axios';

const ProductForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        author: '',
        publisher: 'ধাওয়া পাবলিকেশন',
        category: '',
        description: '',
        price: '',
        discountPrice: '',
        stock: '',
        image: '',
        status: 'published',
    });

    useEffect(() => {
        if (id) {
            fetchProduct();
        }
    }, [id]);

    const fetchProduct = async () => {
        try {
            const token = localStorage.getItem('admin-token');
            const { data } = await axios.get(`http://localhost:5000/api/admin/products/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setFormData(data);
        } catch (error) {
            toast.error('Failed to fetch product');
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const token = localStorage.getItem('admin-token');
            const url = id
                ? `http://localhost:5000/api/admin/products/${id}`
                : 'http://localhost:5000/api/admin/products';
            const method = id ? 'put' : 'post';

            await axios[method](url, formData, {
                headers: { Authorization: `Bearer ${token}` },
            });

            toast.success(id ? 'Product updated!' : 'Product created!');
            navigate('/admin/products');
        } catch (error) {
            toast.error('Failed to save product');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <button
                onClick={() => navigate('/admin/products')}
                className="flex items-center gap-2 text-gray-600 hover:text-emerald-700 transition mb-4"
            >
                <ArrowLeft className="h-4 w-4" /> Back to Products
            </button>

            <h1 className="text-2xl font-bold text-[#174D3B] mb-6">
                {id ? 'Edit Product' : 'Add New Product'}
            </h1>

            <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 shadow-sm border border-amber-200/30">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Title *</label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            className="w-full rounded-lg border border-gray-200 px-4 py-2.5 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Author *</label>
                        <input
                            type="text"
                            name="author"
                            value={formData.author}
                            onChange={handleChange}
                            className="w-full rounded-lg border border-gray-200 px-4 py-2.5 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Category</label>
                        <input
                            type="text"
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            className="w-full rounded-lg border border-gray-200 px-4 py-2.5 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Publisher</label>
                        <input
                            type="text"
                            name="publisher"
                            value={formData.publisher}
                            onChange={handleChange}
                            className="w-full rounded-lg border border-gray-200 px-4 py-2.5 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Price *</label>
                        <input
                            type="number"
                            name="price"
                            value={formData.price}
                            onChange={handleChange}
                            className="w-full rounded-lg border border-gray-200 px-4 py-2.5 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Discount Price</label>
                        <input
                            type="number"
                            name="discountPrice"
                            value={formData.discountPrice}
                            onChange={handleChange}
                            className="w-full rounded-lg border border-gray-200 px-4 py-2.5 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Stock *</label>
                        <input
                            type="number"
                            name="stock"
                            value={formData.stock}
                            onChange={handleChange}
                            className="w-full rounded-lg border border-gray-200 px-4 py-2.5 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Status</label>
                        <select
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                            className="w-full rounded-lg border border-gray-200 px-4 py-2.5 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none"
                        >
                            <option value="published">Published</option>
                            <option value="draft">Draft</option>
                        </select>
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700">Image URL</label>
                        <input
                            type="text"
                            name="image"
                            value={formData.image}
                            onChange={handleChange}
                            placeholder="https://placehold.co/600x900/..."
                            className="w-full rounded-lg border border-gray-200 px-4 py-2.5 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none"
                        />
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700">Description</label>
                        <textarea
                            name="description"
                            rows={4}
                            value={formData.description}
                            onChange={handleChange}
                            className="w-full rounded-lg border border-gray-200 px-4 py-2.5 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none"
                        />
                    </div>
                </div>

                <div className="mt-6 flex gap-4">
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-emerald-700 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-emerald-800 transition disabled:opacity-50"
                    >
                        {loading ? 'Saving...' : id ? 'Update Product' : 'Create Product'}
                    </button>
                    <button
                        type="button"
                        onClick={() => navigate('/admin/products')}
                        className="border border-gray-300 text-gray-700 px-6 py-2.5 rounded-lg font-medium hover:bg-gray-50 transition"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ProductForm;