import React, { useState } from 'react';
import './StudentDashboard.css';
import CourseFeedback from './CourseFeedback';
import FacultyFeedback from './FacultyFeedback';
import Profile from './Profile';
import GeneralFeedbackForm from './GeneralFeedbackForm';

function StudentDashboard() {
    const [activeSection, setActiveSection] = useState('course-feedback');

    const handleLogout = () => {
        localStorage.removeItem('userToken');
        window.location.href = '/login';
    };

    return (
        <div className="student-dashboard">
            <div className="student-sidebar">
                <div className="sidebar-logo">
                    <h2>Student Portal</h2>
                </div>
                <nav className="student-nav">
                    <ul>
                        <li
                            className={activeSection === 'course-feedback' ? 'active' : ''}
                            onClick={() => setActiveSection('course-feedback')}
                        >
                            <span>📚 Course Feedback</span>
                        </li>
                        <li
                            className={activeSection === 'faculty-feedback' ? 'active' : ''}
                            onClick={() => setActiveSection('faculty-feedback')}
                        >
                            <span>👨‍🏫 Instructor Feedback</span>
                        </li>
                        <li
                            className={activeSection === 'general-feedback' ? 'active' : ''}
                            onClick={() => setActiveSection('general-feedback')}
                        >
                            <span>📝 General Feedback</span>
                        </li>
                        <li
                            className={activeSection === 'profile' ? 'active' : ''}
                            onClick={() => setActiveSection('profile')}
                        >
                            <span>👤 Profile</span>
                        </li>
                    </ul>
                </nav>
            </div>

            <div className="student-main-content">
                {activeSection === 'course-feedback' && <CourseFeedback />}
                {activeSection === 'faculty-feedback' && <FacultyFeedback />}
                {activeSection === 'general-feedback' && <GeneralFeedbackForm />}
                {activeSection === 'profile' && <Profile />}
            </div>

            <button className="logout-btn" onClick={handleLogout}>
                Logout
            </button>
        </div>
    );
}

export default StudentDashboard;
