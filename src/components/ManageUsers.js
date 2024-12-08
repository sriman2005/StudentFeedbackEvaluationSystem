import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AuthService from './AuthService';
import './ManageUsers.css'

function ManageUsers() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);

    useEffect(() => {
        fetchUsers();
    }, [page, pageSize]);

    const fetchUsers = async () => {
        try {
            const token = AuthService.getCurrentUser()?.token;
            
            const response = await axios.get(`http://localhost:8080/api/users`, {
                params: {
                    page: page,
                    size: pageSize
                },
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            setUsers(response.data.content || response.data);
            setLoading(false);
        } catch (err) {
            console.error('Error fetching users:', err);
            setError('Failed to fetch users');
            setLoading(false);
        }
    };

    const handleDeleteUser = async (userId) => {
        try {
            const token = AuthService.getCurrentUser()?.token;
            
            await axios.delete(`http://localhost:8080/api/users/${userId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            // Remove the deleted user from the list
            setUsers(users.filter(user => user.id !== userId));
        } catch (err) {
            console.error('Error deleting user:', err);
            setError('Failed to delete user');
        }
    };

    if (loading) return <div>Loading users...</div>;
    if (error) return <div className="error-message">{error}</div>;

    return (
        <div className="manage-users-container">
            <h2>User Management</h2>
            <table className="users-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Username</th>
                        <th>Email</th>
                        <th>Phone Number</th>
                        <th>Role</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => (
                        <tr key={user.id}>
                            <td>{user.id}</td>
                            <td>{user.username}</td>
                            <td>{user.email}</td>
                            <td>{user.phoneNumber}</td>
                            <td>{user.role}</td>
                            <td>
                                <span className={user.enabled ? 'status-active' : 'status-inactive'}>
                                    {user.enabled ? 'Active' : 'Inactive'}
                                </span>
                            </td>
                            <td>
                                <button 
                                    onClick={() => handleDeleteUser(user.id)}
                                    className="btn-delete"
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className="pagination">
                <button 
                    onClick={() => setPage(Math.max(0, page - 1))}
                    disabled={page === 0}
                >
                    Previous
                </button>
                <span>Page {page + 1}</span>
                <button 
                    onClick={() => setPage(page + 1)}
                    disabled={users.length < pageSize}
                >
                    Next
                </button>
            </div>
        </div>
    );
}

export default ManageUsers;