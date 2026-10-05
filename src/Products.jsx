import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from './api';

const empty = { product_name: '', description: '', price: '', quantity: '' };

export default function Products() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(empty);
  const [editId, setEditId] = useState(null);
  const navigate = useNavigate();

  const load = async () => {
    const res = await api.get('/products');
    setProducts(Array.isArray(res.data) ? res.data : res.data.data || []);
  };

  useEffect(() => { load(); }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editId) await api.put(`/products/${editId}`, form);
    else await api.post('/products', form);
    setForm(empty);
    setEditId(null);
    load();
  };

  const handleEdit = (p) => {
    setEditId(p.id);
    setForm({ product_name: p.product_name, description: p.description, price: p.price, quantity: p.quantity });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    await api.delete(`/products/${id}`);
    load();
  };

  const handleLogout = async () => {
    try {
      await api.post('/logout', { refresh_token: localStorage.getItem('refresh_token') });
    } catch { /* ignore */ }
    localStorage.clear();
    navigate('/login');
  };
//yes haha or smths
  return (
    <div style={{ maxWidth: 800, margin: '40px auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <h2>Products</h2>
        <button onClick={handleLogout}>Logout</button>
      </div>

      <form onSubmit={handleSubmit} style={{ marginBottom: 24 }}>
        <input name="product_name" placeholder="Name" value={form.product_name} onChange={handleChange} required />
        <input name="description" placeholder="Description" value={form.description} onChange={handleChange} />
        <input name="price" type="number" step="0.01" placeholder="Price" value={form.price} onChange={handleChange} required />
        <input name="quantity" type="number" placeholder="Qty" value={form.quantity} onChange={handleChange} required />
        <button type="submit">{editId ? 'Update' : 'Add'}</button>
        {editId && <button type="button" onClick={() => { setEditId(null); setForm(empty); }}>Cancel</button>}
      </form>

      <table border="1" cellPadding="8" style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr><th>ID</th><th>Name</th><th>Description</th><th>Price</th><th>Qty</th><th>Actions</th></tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.id}>
              <td>{p.id}</td><td>{p.product_name}</td><td>{p.description}</td>
              <td>{p.price}</td><td>{p.quantity}</td>
              <td>
                <button onClick={() => handleEdit(p)}>Edit</button>{' '}
                <button onClick={() => handleDelete(p.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}