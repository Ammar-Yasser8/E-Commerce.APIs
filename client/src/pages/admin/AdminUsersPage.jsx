import React, { useEffect, useState } from 'react';
import agent from '../../api/agent';
import AdminSidebar from '../../layout/AdminSidebar';

export default function AdminUsersPage() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = () => {
        agent.Account.list()
            .then(res => setUsers(res))
            .catch(err => console.log(err))
            .finally(() => setLoading(false));
    }

    const handlePromote = (email) => {
        if (window.confirm(`Are you sure you want to make ${email} an Admin?`)) {
            agent.Account.promote(email)
                .then(() => {
                    alert('User promoted successfully');
                    loadUsers(); // Reload list to update roles
                })
                .catch(err => {
                    console.log(err);
                    alert('Failed to promote user');
                });
        }
    };

    if (loading) return <div className="text-center mt-20">Loading...</div>;

    return (
        <div className="flex bg-background min-h-screen">
            <AdminSidebar />
            <div className="flex-1 p-8">
                <h1 className="text-3xl font-bold text-secondary mb-8">Manage Users</h1>

                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Display Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {users.map((user) => (
                                <tr key={user.email}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900">{user.displayName}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-500">{user.email}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.role === 'Admin' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        {user.role !== 'Admin' && (
                                            <button
                                                onClick={() => handlePromote(user.email)}
                                                className="text-primary hover:text-orange-900 font-bold"
                                            >
                                                Make Admin
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
