import React, { useState } from 'react';
import './AdminDashboard.css';
import CreateCourseFeedback from './CreateCourseFeedback';
import FeedbackAnalytics from './FeedbackAnalytics';
import ManageUsers from './ManageUsers';
import GeneralFeedbackAdmin from './GeneralFeedbackAdmin'; // Import GeneralFeedbackAdmin component

import FacultyFeedbackAnalytics from './FacultyFeedbackAnalytics'; // Importing FacultyFeedbackAnalytics

function AdminDashboard() {
    const [activeSection, setActiveSection] = useState('create-course-feedback');

    const navItems = [
        { id: 'create-course-feedback', label: 'Create Course Feedback' },
        { id: 'manage-users', label: 'Manage Users' },
        { id: 'analytics', label: 'Analytics' },
        { id: 'faculty-feedback-analytics', label: 'Faculty Feedback Analytics' },
        { id: 'feedback-review', label: 'Feedback Review' },
        { id: 'general-feedback', label: 'General Feedback' }, // Added General Feedback route
    ];
    

    const handleLogout = () => {
        // Clear authentication and redirect to login page
        localStorage.removeItem('authToken');
        window.location.href = '/login'; // Or use a router redirection if you prefer
    };

    const renderContent = () => {
        switch (activeSection) {
            case 'create-course-feedback':
                return <CreateCourseFeedback />;
            case 'manage-users':
                return <ManageUsers />;
            case 'analytics':
                return <FeedbackAnalytics />;
            case 'faculty-feedback-analytics': // Added new case for FacultyFeedbackAnalytics
                return <FacultyFeedbackAnalytics />;
            case 'feedback-review':
                return <div>Feedback Review Content</div>;
            case 'general-feedback': // Added case for GeneralFeedbackAdmin
                return <GeneralFeedbackAdmin />;
            default:
                return <CreateCourseFeedback />;
        }
    };

    return (
        <div className="admin-dashboard">
            {/* Sidebar */}
            <div className="admin-sidebar">
                <div className="sidebar-logo">
                    <h2>Admin Panel</h2>
                </div>
                <nav className="admin-nav">
                    <ul>
                        {navItems.map((item) => (
                            <li
                                key={item.id}
                                className={activeSection === item.id ? 'active' : ''}
                                onClick={() => setActiveSection(item.id)}
                            >
                                <span>{item.label}</span>
                            </li>
                        ))}
                    </ul>
                </nav>
            </div>

            {/* Main Content */}
            <div className="admin-main-content">
                <div className="logout-button-container">
                    <button className="logout-button" onClick={handleLogout}>
                        Logout
                    </button>
                </div>
                {renderContent()}
            </div>
        </div>
    );
}

export default AdminDashboard;
