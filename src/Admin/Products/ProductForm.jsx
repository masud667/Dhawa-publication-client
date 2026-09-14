import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import api from '../../api/axios';

const ProductForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState([]);
    const [showCategoryForm, setShowCategoryForm] = useState(false);
    const [newCategory, setNewCategory] = useState('');
    const [categoryLoading, setCategoryLoading] = useState(false);

    const [formData, setFormData] = useState({
        title: '',
        cover: '',
        author: '',
        converter: '',
        category: '',
        image: '',
        gallery: [],
        description: '',
        price: '',
        discountPrice: '',
        rating: 0,
        totalReviews: 0,
        stock: '',
        sold: 0,
        language: 'বাংলা',
        pages: '',
        publisher: 'Dhawa Publication',
        isbn: '',
        edition: '',
        publishDate: '',
        featured: false,
        recent: false,
        bestSeller: false,
        status: 'published',
    });

    const [imageType, setImageType] = useState('upload');
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState('');
    const [uploadingImage, setUploadingImage] = useState(false);

    const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
    const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

    // Fetch Categories
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                setCategoryLoading(true);
                const { data } = await api.get("/categories");
                setCategories(Array.isArray(data) ? data : []);
            } catch (error) {
                console.error('Category fetch error:', error);
            } finally {
                setCategoryLoading(false);
            }
        };

        fetchCategories();
    }, []);

    // Fetch Product Data if editing
    useEffect(() => {
        if (id) {
            const fetchProduct = async () => {
                try {
                    const token = localStorage.getItem('admin-token');
                    const { data } = await api.get(`/books/${id}`, {
                        headers: { Authorization: `Bearer ${token}` },
                    });
                    setFormData(data);
                    if (data.image) {
                        setImageType('url');
                        setImagePreview(data.image);
                    }
                } catch (error) {
                    console.error('Fetch product error:', error);
                    toast.error('Failed to fetch product');
                }
            };
            fetchProduct();
        }
    }, [id]);

    const handleAddCategory = async () => {
        const name = newCategory.trim();

        if (!name) {
            toast.error('Category name is required');
            return;
        }

        try {
            // Fixed: Changed api.get to api.post for category creation
            const { data } = await api.post("/categories", {
                name,
                slug: name.toLowerCase().trim().replace(/\s+/g, '-'),
                image: '',
            });

            const createdCategory = {
                _id: data.insertedId || data._id,
                name,
                slug: name.toLowerCase().trim().replace(/\s+/g, '-'),
                image: '',
            };

            setCategories((prev) => [...prev, createdCategory]);
            setFormData((prev) => ({
                ...prev,
                category: name,
            }));

            setNewCategory('');
            setShowCategoryForm(false);
            toast.success('Category created successfully!');
        } catch (error) {
            console.error('Create category error:', error);
            if (error.response?.status === 409) {
                toast.error('Category already exists');
            } else {
                toast.error('Failed to create category');
            }
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            toast.error('Please select an image file');
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            toast.error('Image size must be less than 5MB');
            return;
        }

        setImageFile(file);
        setImagePreview(URL.createObjectURL(file));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            let imageUrl = formData.image;

            if (imageType === 'upload' && imageFile) {
                setUploadingImage(true);
                const cloudinaryData = new FormData();
                cloudinaryData.append('file', imageFile);
                cloudinaryData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

                const uploadResponse = await axios.post(
                    `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
                    cloudinaryData
                );

                imageUrl = uploadResponse.data.secure_url;
                setUploadingImage(false);
            }

            if (!imageUrl) {
                toast.error('Please upload an image or provide an image URL');
                setLoading(false);
                return;
            }

            const bookData = {
                ...formData,
                image: imageUrl,
                price: Number(formData.price),
                discountPrice: Number(formData.discountPrice),
                stock: Number(formData.stock),
                pages: Number(formData.pages),
                rating: Number(formData.rating),
                totalReviews: Number(formData.totalReviews),
                sold: Number(formData.sold),
            };

            if (id) {
                await api.patch(`/books/${id}`, bookData);
                toast.success('Book updated successfully!');
            } else {
                await api.post("/books", bookData);
                toast.success('Book added successfully!');
            }

            navigate('/admin/books');
        } catch (error) {
            console.error('Book save error:', error);
            setUploadingImage(false);
            toast.error(error.response?.data?.message || 'Failed to save book');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <button
                onClick={() => navigate('/admin/books')}
                className="flex items-center gap-2 text-gray-600 hover:text-emerald-700 transition mb-4"
            >
                <ArrowLeft className="h-4 w-4" /> Back to Products
            </button>

            <h1 className="text-2xl font-bold text-[#174D3B] mb-6">
                {id ? 'Edit Product' : 'Add New Product'}
            </h1>

            <form
                onSubmit={handleSubmit}
                className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-amber-200/30"
            >
                {/* BASIC INFORMATION */}
                <div className="mb-8">
                    <h2 className="text-lg font-semibold text-[#174D3B] mb-5">
                        Basic Information
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                Title *
                            </label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                placeholder="আলোর পথে জীবন"
                                required
                                className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-gray-900 placeholder:text-gray-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                Cover
                            </label>
                            <input
                                type="text"
                                name="cover"
                                value={formData.cover}
                                onChange={handleChange}
                                placeholder="হার্ডকাভার"
                                className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-gray-900 placeholder:text-gray-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                Author *
                            </label>
                            <input
                                type="text"
                                name="author"
                                value={formData.author}
                                onChange={handleChange}
                                placeholder="মুহাম্মদ হাসান"
                                required
                                className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-gray-900 placeholder:text-gray-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                Translator
                            </label>
                            <input
                                type="text"
                                name="converter"
                                value={formData.converter}
                                onChange={handleChange}
                                placeholder="মুহাম্মদ হাসান"
                                className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-gray-900 placeholder:text-gray-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Category *
                            </label>
                            <select
                                name="category"
                                value={formData.category}
                                onChange={(e) => {
                                    if (e.target.value === '__add_new__') {
                                        setShowCategoryForm(true);
                                        return;
                                    }
                                    handleChange(e);
                                }}
                                required
                                className="w-full rounded-lg border border-gray-200 px-4 py-2.5 bg-white text-gray-900 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none"
                            >
                                <option value="">Select Category</option>
                                {categories.map((category) => (
                                    <option key={category._id} value={category.name}>
                                        {category.name}
                                    </option>
                                ))}
                                <option value="__add_new__">+ Add New Category</option>
                            </select>

                            {showCategoryForm && (
                                <div className="mt-3 p-4 rounded-xl bg-emerald-50 border border-emerald-100">
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            value={newCategory}
                                            onChange={(e) => setNewCategory(e.target.value)}
                                            placeholder="Enter new category"
                                            className="flex-1 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-gray-900 outline-none focus:border-emerald-500"
                                        />
                                        <button
                                            type="button"
                                            onClick={handleAddCategory}
                                            className="px-4 py-2.5 rounded-lg bg-emerald-700 text-white hover:bg-emerald-800 transition"
                                        >
                                            Add
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                Publisher
                            </label>
                            <input
                                type="text"
                                name="publisher"
                                value={formData.publisher}
                                onChange={handleChange}
                                placeholder="Dhawa Publication"
                                className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-gray-900 placeholder:text-gray-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none"
                            />
                        </div>
                    </div>
                </div>

                {/* BOOK IMAGES */}
                <div className="mb-8">
                    <h2 className="text-lg font-semibold text-[#174D3B] mb-5">
                        Book Images
                    </h2>

                    <div className="grid grid-cols-1 gap-6">
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Book Image *
                            </label>
                            <div className="flex gap-2 mb-4">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setImageType('upload');
                                        setImageFile(null);
                                        setImagePreview('');
                                    }}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition ${imageType === 'upload'
                                            ? 'bg-emerald-700 text-white'
                                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                        }`}
                                >
                                    Upload Image
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setImageType('url');
                                        setImageFile(null);
                                        setImagePreview('');
                                    }}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition ${imageType === 'url'
                                            ? 'bg-emerald-700 text-white'
                                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                        }`}
                                >
                                    Image URL
                                </button>
                            </div>

                            {imageType === 'upload' && (
                                <div>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        className="w-full rounded-lg border border-gray-200 px-4 py-2.5 bg-white text-gray-900 file:mr-4 file:rounded-lg file:border-0 file:bg-emerald-700 file:px-4 file:py-2 file:text-white hover:file:bg-emerald-800 outline-none"
                                    />
                                    <p className="mt-2 text-xs text-gray-500">
                                        JPG, PNG, WEBP — Maximum 5MB
                                    </p>
                                </div>
                            )}

                            {imageType === 'url' && (
                                <input
                                    type="url"
                                    name="image"
                                    value={formData.image}
                                    onChange={(e) => {
                                        handleChange(e);
                                        setImagePreview(e.target.value);
                                    }}
                                    placeholder="https://example.com/book-image.jpg"
                                    className="w-full rounded-lg border border-gray-200 px-4 py-2.5 bg-white text-gray-900 outline-none focus:border-emerald-500"
                                />
                            )}

                            {(imagePreview || formData.image) && (
                                <div className="mt-5">
                                    <p className="text-sm font-medium text-gray-700 mb-2">
                                        Image Preview
                                    </p>
                                    <img
                                        src={imagePreview || formData.image}
                                        alt="Book preview"
                                        className="w-32 h-44 object-cover rounded-lg border border-gray-200 shadow-sm"
                                    />
                                </div>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                Gallery Images
                            </label>
                            <textarea
                                name="gallery"
                                value={formData.gallery.join('\n')}
                                onChange={(e) => {
                                    setFormData((prev) => ({
                                        ...prev,
                                        gallery: e.target.value
                                            .split('\n')
                                            .map((url) => url.trim())
                                            .filter(Boolean),
                                    }));
                                }}
                                rows={4}
                                placeholder={`https://example.com/image-1.jpg\nhttps://example.com/image-2.jpg`}
                                className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-gray-900 outline-none resize-none"
                            />
                            <p className="text-xs text-gray-400 mt-1">
                                Add one image URL per line.
                            </p>
                        </div>
                    </div>
                </div>

                {/* DESCRIPTION */}
                <div className="mb-8">
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Description
                    </label>
                    <textarea
                        name="description"
                        rows={5}
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="কুরআন ও সুন্নাহর আলোকে সুন্দর জীবন..."
                        className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-gray-900 outline-none resize-none"
                    />
                </div>

                {/* PRICE & INVENTORY */}
                <div className="mb-8">
                    <h2 className="text-lg font-semibold text-[#174D3B] mb-5">
                        Price & Inventory
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                Price *
                            </label>
                            <input
                                type="number"
                                name="price"
                                value={formData.price}
                                onChange={handleChange}
                                min="0"
                                required
                                placeholder="650"
                                className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-gray-900 outline-none"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                Discount Price
                            </label>
                            <input
                                type="number"
                                name="discountPrice"
                                value={formData.discountPrice}
                                onChange={handleChange}
                                min="0"
                                placeholder="520"
                                className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-gray-900 outline-none"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                Stock
                            </label>
                            <input
                                type="number"
                                name="stock"
                                value={formData.stock}
                                onChange={handleChange}
                                min="0"
                                placeholder="35"
                                className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-gray-900 outline-none"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                Sold
                            </label>
                            <input
                                type="number"
                                name="sold"
                                value={formData.sold}
                                onChange={handleChange}
                                min="0"
                                placeholder="120"
                                className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-gray-900 outline-none"
                            />
                        </div>
                    </div>
                </div>

                {/* BOOK DETAILS */}
                <div className="mb-8">
                    <h2 className="text-lg font-semibold text-[#174D3B] mb-5">
                        Book Details
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                Language
                            </label>
                            <select
                                name="language"
                                value={formData.language}
                                onChange={handleChange}
                                className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-gray-900 outline-none"
                            >
                                <option value="বাংলা">বাংলা</option>
                                <option value="English">English</option>
                                <option value="আরবি">আরবি</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                Pages
                            </label>
                            <input
                                type="number"
                                name="pages"
                                value={formData.pages}
                                onChange={handleChange}
                                min="0"
                                placeholder="224"
                                className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-gray-900 outline-none"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                ISBN
                            </label>
                            <input
                                type="text"
                                name="isbn"
                                value={formData.isbn}
                                onChange={handleChange}
                                placeholder="978-984-001-0001"
                                className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-gray-900 outline-none"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                Edition
                            </label>
                            <input
                                type="text"
                                name="edition"
                                value={formData.edition}
                                onChange={handleChange}
                                placeholder="১ম সংস্করণ"
                                className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-gray-900 outline-none"
                            />
                        </div>
                    </div>
                </div>

                {/* FLAGS & SUBMIT */}
                <div className="flex flex-wrap gap-6 mb-8">
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="checkbox"
                            name="featured"
                            checked={formData.featured}
                            onChange={handleChange}
                            className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500 h-4 w-4"
                        />
                        <span className="text-sm font-medium text-gray-700">Featured</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="checkbox"
                            name="recent"
                            checked={formData.recent}
                            onChange={handleChange}
                            className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500 h-4 w-4"
                        />
                        <span className="text-sm font-medium text-gray-700">Recent</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="checkbox"
                            name="bestSeller"
                            checked={formData.bestSeller}
                            onChange={handleChange}
                            className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500 h-4 w-4"
                        />
                        <span className="text-sm font-medium text-gray-700">Best Seller</span>
                    </label>
                </div>

                <button
                    type="submit"
                    disabled={loading || uploadingImage}
                    className="w-full bg-[#174D3B] text-white py-3 rounded-lg font-semibold hover:bg-[#123b2e] transition disabled:opacity-50"
                >
                    {loading || uploadingImage ? 'Saving...' : id ? 'Update Product' : 'Add Product'}
                </button>
            </form>
        </div>
    );
};

export default ProductForm;