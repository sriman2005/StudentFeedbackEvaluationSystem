import React, { useState, useEffect } from 'react';
import AuthService from './AuthService'; // Adjust the import path as needed
import './Profile.css';

function Profile() {
    const [user, setUser] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [isChangingPassword, setIsChangingPassword] = useState(false);
    const [editedUser, setEditedUser] = useState({
        username: '',
        email: '',
        phoneNumber: ''
    });
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: ''
    });
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        const currentUser = AuthService.getCurrentUser();
        if (currentUser) {
            setUser(currentUser);
            setEditedUser({
                username: currentUser.username,
                email: currentUser.email,
                phoneNumber: currentUser.phoneNumber
            });
        }
    }, []);

    const handleEditToggle = () => {
        setIsEditing(!isEditing);
        setError('');
        setSuccessMessage('');
    };

    const handlePasswordChangeToggle = () => {
        setIsChangingPassword(!isChangingPassword);
        setError('');
        setSuccessMessage('');
        // Reset password fields
        setPasswordData({
            currentPassword: '',
            newPassword: '',
            confirmNewPassword: ''
        });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditedUser(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handlePasswordInputChange = (e) => {
        const { name, value } = e.target;
        setPasswordData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSaveProfile = async (e) => {
        e.preventDefault();
        
        // Client-side validations
        if (!editedUser.username) {
            setError('Username is required');
            return;
        }
        
        if (!editedUser.email) {
            setError('Email is required');
            return;
        }
        
        if (!editedUser.phoneNumber) {
            setError('Phone number is required');
            return;
        }
        
        // Email validation regex
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(editedUser.email)) {
            setError('Invalid email format');
            return;
        }

        try {
            // Call the update profile method
            const updatedUser = await AuthService.updateProfile(
                user.id, 
                {
                    username: editedUser.username,
                    email: editedUser.email,
                    phoneNumber: editedUser.phoneNumber
                }
            );

            // Update local state
            setUser(updatedUser);
            setIsEditing(false);
            setError('');
            setSuccessMessage('Profile updated successfully');
        } catch (err) {
            // Handle specific error messages
            setError(err.message || 'Failed to update profile');
        }
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();

        // Validate password inputs
        if (!passwordData.currentPassword) {
            setError('Current password is required');
            return;
        }

        if (!passwordData.newPassword) {
            setError('New password is required');
            return;
        }

        if (passwordData.newPassword.length < 8) {
            setError('New password must be at least 8 characters long');
            return;
        }

        if (passwordData.newPassword !== passwordData.confirmNewPassword) {
            setError('New passwords do not match');
            return;
        }

        try {
            await AuthService.changePassword(
                user.id, 
                passwordData.currentPassword, 
                passwordData.newPassword
            );

            // Reset form and show success message
            setIsChangingPassword(false);
            setPasswordData({
                currentPassword: '',
                newPassword: '',
                confirmNewPassword: ''
            });
            setError('');
            setSuccessMessage('Password changed successfully');
        } catch (err) {
            setError(err.message || 'Failed to change password');
        }
    };

    if (!user) {
        return <div>Loading...</div>;
    }

    return (
        <div className="profile-container">
            <h2>User Profile</h2>
            
            {/* Error and Success Messages */}
            {error && <div style={{color: 'red', marginBottom: '10px'}}>{error}</div>}
            {successMessage && <div style={{color: 'green', marginBottom: '10px'}}>{successMessage}</div>}
            
            {/* Profile Details Section */}
            {!isEditing ? (
                <div className="profile-details">
                    <p><strong>Username:</strong> {user.username}</p>
                    <p><strong>Email:</strong> {user.email}</p>
                    <p><strong>Phone Number:</strong> {user.phoneNumber}</p>
                    <button onClick={handleEditToggle}>Edit Profile</button>
                </div>
            ) : (
                <form onSubmit={handleSaveProfile} className="edit-profile-form">
                    <div>
                        <label>Username:</label>
                        <input
                            type="text"
                            name="username"
                            value={editedUser.username}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div>
                        <label>Email:</label>
                        <input
                            type="email"
                            name="email"
                            value={editedUser.email}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div>
                        <label>Phone Number:</label>
                        <input
                            type="tel"
                            name="phoneNumber"
                            value={editedUser.phoneNumber}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div className="form-actions">
                        <button type="submit">Save Changes</button>
                        <button type="button" onClick={handleEditToggle}>Cancel</button>
                    </div>
                </form>
            )}

            {/* Change Password Section */}
            <div className="change-password-section">
                <h3>Change Password</h3>
                {!isChangingPassword ? (
                    <button onClick={handlePasswordChangeToggle}>Change Password</button>
                ) : (
                    <form onSubmit={handleChangePassword} className="change-password-form">
                        <div>
                            <label>Current Password:</label>
                            <input
                                type="password"
                                name="currentPassword"
                                value={passwordData.currentPassword}
                                onChange={handlePasswordInputChange}
                                required
                            />
                        </div>
                        <div>
                            <label>New Password:</label>
                            <input
                                type="password"
                                name="newPassword"
                                value={passwordData.newPassword}
                                onChange={handlePasswordInputChange}
                                required
                            />
                        </div>
                        <div>
                            <label>Confirm New Password:</label>
                            <input
                                type="password"
                                name="confirmNewPassword"
                                value={passwordData.confirmNewPassword}
                                onChange={handlePasswordInputChange}
                                required
                            />
                        </div>
                        <div className="form-actions">
                            <button type="submit">Change Password</button>
                            <button type="button" onClick={handlePasswordChangeToggle}>Cancel</button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}

export default Profile;