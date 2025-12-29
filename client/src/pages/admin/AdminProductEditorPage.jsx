import React, { useEffect, useState } from 'react';
import agent from '../../api/agent';
import { useNavigate, useParams, Link } from 'react-router-dom';
import AdminSidebar from '../../layout/AdminSidebar';

export default function AdminProductEditorPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditMode = !!id;

    const [product, setProduct] = useState({
        name: '',
        description: '',
        price: '',
        pictureUrl: '',
        categoryId: '',
        brandId: ''
    });
    const [pictureFile, setPictureFile] = useState(null);
    const [brands, setBrands] = useState([]);
    const [types, setTypes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const promises = [
            agent.Products.brands(),
            agent.Products.types()
        ];

        if (isEditMode) {
            promises.push(agent.Products.details(id));
        }

        Promise.all(promises)
            .then(([brandsRes, typesRes, productRes]) => {
                setBrands(brandsRes);
                setTypes(typesRes);
                if (productRes) {
                    setProduct({
                        name: productRes.name,
                        description: productRes.description,
                        price: productRes.price,
                        pictureUrl: productRes.pictureUrl,
                        categoryId: productRes.categoryId,
                        brandId: productRes.brandId
                    });
                }
            })
            .catch(error => console.log(error))
            .finally(() => setLoading(false));
    }, [id, isEditMode]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        const formData = new FormData();
        formData.append('name', product.name);
        formData.append('description', product.description);
        formData.append('price', product.price);
        formData.append('categoryId', product.categoryId);
        formData.append('brandId', product.brandId);

        if (pictureFile) {
            formData.append('picture', pictureFile);
        } else if (isEditMode) {
            // Keep existing logic if no file changed, backend handles optional picture
        }


        try {
            if (isEditMode) {
                // For update, we might need a custom endpoint if standard PUT doesn't support FormData well in all configs, 
                // but standard ASP.NET Core usually handles PUT with FromForm fine.
                await agent.Products.update(id, formData);
            } else {
                await agent.Products.create(formData);
            }
            navigate('/admin/products');
        } catch (error) {
            console.log(error);
        } finally {
            setSubmitting(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProduct(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setPictureFile(e.target.files[0]);
        }
    };

    if (loading) return <div className="text-center mt-20">Loading...</div>;

    return (
        <div className="flex bg-background min-h-screen">
            <AdminSidebar />
            <div className="flex-1 p-8">
                <div className="max-w-2xl mx-auto">
                    <h1 className="text-3xl font-bold text-secondary mb-8">{isEditMode ? 'Edit Product' : 'Create New Product'}</h1>

                    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-xl shadow-lg">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Product Name</label>
                            <input type="text" name="name" value={product.name} onChange={handleChange} required
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm border p-2" />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Description</label>
                            <textarea name="description" value={product.description} onChange={handleChange} required rows={3}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm border p-2" />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Price</label>
                                <input type="number" name="price" value={product.price} onChange={handleChange} required step="0.01"
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm border p-2" />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Product Image</label>
                            {isEditMode && product.pictureUrl && !pictureFile && (
                                <div className="mb-2">
                                    <img src={product.pictureUrl} alt="Current" className="h-24 w-24 object-cover rounded-md border" />
                                </div>
                            )}
                            <input
                                type="file"
                                onChange={handleFileChange}
                                accept="image/*"
                                className="mt-1 block w-full text-sm text-gray-500
                                file:mr-4 file:py-2 file:px-4
                                file:rounded-full file:border-0
                                file:text-sm file:font-semibold
                                file:bg-primary file:text-white
                                hover:file:bg-orange-600
                                "
                            />
                            {/* Hidden input for URL if needed for compatibility, but mainly relying on file now */}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Brand</label>
                                <select name="brandId" value={product.brandId} onChange={handleChange} required
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm border p-2">
                                    <option value="">Select Brand</option>
                                    {brands.map(b => (
                                        <option key={b.id} value={b.id}>{b.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Type</label>
                                <select name="categoryId" value={product.categoryId} onChange={handleChange} required
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm border p-2">
                                    <option value="">Select Type</option>
                                    {types.map(t => (
                                        <option key={t.id} value={t.id}>{t.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="flex justify-end space-x-3 pt-4">
                            <Link to="/admin/products" className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">Cancel</Link>
                            <button type="submit" disabled={submitting} className="bg-primary text-white px-6 py-2 rounded-md hover:bg-orange-600 disabled:opacity-50">
                                {submitting ? 'Saving...' : 'Save Product'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
