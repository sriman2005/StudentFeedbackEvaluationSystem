import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Signup from './components/Signup';
import AdminDashboard from './components/AdminDashboard';
import AuthService from './components/AuthService';
import StudentDashboard from './components/StudentDashboard';
import CourseFeedback from './components/CourseFeedback';
import Profile from './components/Profile';
import CreateCourseFeedback from './components/CreateCourseFeedback';

const PrivateRoute = ({ children }) => {
    return AuthService.isAuthenticated() ? children : <Navigate to="/login" />;
};

function App() {
    return (
        <Router>
            <div className="App">
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />

                    {/* Private Routes for Student */}
                    <Route path="/student-dashboard" element={<PrivateRoute><StudentDashboard /></PrivateRoute>}>
                        <Route path="course-feedback" element={<PrivateRoute><CourseFeedback /></PrivateRoute>} />
                        <Route path="profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
                    </Route>

                    {/* Private Routes for Admin */}
                    <Route path="/admin-dashboard" element={<PrivateRoute><AdminDashboard /></PrivateRoute>}>
                        {/* Nested routes for Admin Dashboard */}
                        <Route path="create-course-feedback" element={<PrivateRoute><CreateCourseFeedback /></PrivateRoute>} />
                    </Route>

                    <Route path="/" element={<Navigate to="/login" />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
