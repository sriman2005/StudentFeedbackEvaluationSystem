import React, { useState } from 'react';
import './CreateCourseFeedback.css';

function CourseCreation() {
    const COURSES = [
        {
            id: 1,
            courseName: 'Advanced Machine Learning',
            courseCode: 'ML201',
            description: 'Deep dive into advanced machine learning techniques, covering neural networks, deep learning, and practical applications.',
            department: 'Computer Science',
            credits: 4,
            instructor: 'Dr. Emily Rodriguez',
            prerequisites: 'Basic ML course, Linear Algebra',
            schedule: 'Tue/Thu 2:00-3:30 PM',
            semester: 'ODD 2024',
        },
        {
            id: 2,
            courseName: 'Cloud Computing Fundamentals',
            courseCode: 'CLOUD300',
            description: 'Comprehensive overview of cloud computing architectures, including AWS, Azure, and Google Cloud platforms.',
            department: 'CSIT',
            credits: 3,
            instructor: 'Prof. Michael Chen',
            prerequisites: 'Network Fundamentals, Basic Programming',
            schedule: 'Mon/Wed 10:00-11:30 AM',
            semester: 'Even 2024'
        },
        {
            id: 3,
            courseName: 'Cybersecurity Principles',
            courseCode: 'SEC250',
            description: 'Essential concepts in network and information security, covering encryption, ethical hacking, and risk management.',
            department: 'Computer Science',
            credits: 3,
            instructor: 'Dr. Sarah Thompson',
            prerequisites: 'Network Security Basics',
            schedule: 'Mon/Wed 1:00-2:30 PM',
            semester: 'Odd 2024'
        },
        {
            id: 4,
            courseName: 'Embedded Systems Design',
            courseCode: 'EMB400',
            description: 'Advanced course in embedded system architecture and programming, focusing on IoT and real-time systems.',
            department: 'ECE',
            credits: 4,
            instructor: 'Prof. David Kim',
            prerequisites: 'Microcontroller Programming, Digital Electronics',
            schedule: 'Tue/Thu 3:30-5:00 PM',
            semester: 'Summer 2025'
        },
        {
            id: 5,
            courseName: 'Big Data Analytics',
            courseCode: 'BDA350',
            description: 'Advanced techniques for processing and analyzing large-scale data using modern big data technologies.',
            department: 'AIDS',
            credits: 4,
            instructor: 'Dr. Sophia Wang',
            prerequisites: 'Data Structures, Basic Statistics',
            schedule: 'Mon/Wed 4:00-5:30 PM',
            semester: 'Odd 2024'
        },
        {
            id: 6,
            courseName: 'Data Visualization with Python',
            courseCode: 'DV310',
            description: 'Learn the art of data storytelling using Python libraries like Matplotlib, Seaborn, and Plotly.',
            department: 'Data Science',
            credits: 3,
            instructor: 'Dr. Anjali Mehta',
            prerequisites: 'Basic Python Programming, Statistics',
            schedule: 'Tue/Thu 11:00-12:30 PM',
            semester: 'Even 2024'
        },
        {
            id: 7,
            courseName: 'Blockchain Technology Fundamentals',
            courseCode: 'BC202',
            description: 'Understand the principles of blockchain, cryptocurrencies, and decentralized applications.',
            department: 'Information Technology',
            credits: 4,
            instructor: 'Prof. Ravi Kapoor',
            prerequisites: 'Computer Networks, Cryptography Basics',
            schedule: 'Mon/Wed 2:00-3:30 PM',
            semester: 'Summer 2025'
        },
        {
            id: 8,
            courseName: 'Game Development with Unity',
            courseCode: 'GD401',
            description: 'Explore the fundamentals of game design and development using Unity and C#.',
            department: 'Computer Science',
            credits: 4,
            instructor: 'Ms. Elena Howard',
            prerequisites: 'Object-Oriented Programming, Basic Graphics',
            schedule: 'Fri 10:00 AM-1:00 PM',
            semester: 'Odd 2024'
        },
        {
            id: 9,
            courseName: 'Quantum Computing Basics',
            courseCode: 'QC100',
            description: 'Introduction to quantum computing principles, qubits, and algorithms like Shor’s and Grover’s.',
            department: 'Physics and Computer Science',
            credits: 3,
            instructor: 'Dr. Nathaniel Carter',
            prerequisites: 'Linear Algebra, Basic Programming',
            schedule: 'Tue/Thu 4:00-5:30 PM',
            semester: 'Even 2024'
        },
        {
            id: 10,
            courseName: 'Digital Marketing Strategies',
            courseCode: 'DM205',
            description: 'Master digital marketing concepts including SEO, PPC, social media marketing, and analytics.',
            department: 'Business Administration',
            credits: 3,
            instructor: 'Prof. Linda Graham',
            prerequisites: 'Marketing Principles',
            schedule: 'Mon/Wed 9:00-10:30 AM',
            semester: 'Even 2024'
        }
        

    
        // Other courses...
    ];

    const [selectedCourse, setSelectedCourse] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [popupMessage, setPopupMessage] = useState(''); // New state for popup message
    const [loading, setLoading] = useState(false);

    const handleCourseSelect = (e) => {
        const courseId = parseInt(e.target.value);
        const selected = COURSES.find((course) => course.id === courseId);
        setSelectedCourse(selected);
    };

    const handleCreateCourse = async () => {
        if (!selectedCourse) return;

        setLoading(true);
        setPopupMessage('');

        try {
            const response = await fetch('/api/courses', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(selectedCourse),
            });

            if (response.ok) {
                setShowModal(true);
            } else {
                setPopupMessage('Course already available'); // Show popup message
            }
        } catch (err) {
            setPopupMessage('An error occurred while creating the course.'); // Show error popup
        } finally {
            setLoading(false);
        }
    };

    const closeModal = () => {
        setShowModal(false);
    };

    const closePopup = () => {
        setPopupMessage('');
    };

    return (
        <div className="course-creation-container">
            <div className="course-header">
                <h1>University Course Creation Portal</h1>
            </div>

            <div className="course-selection-wrapper">
                <div className="course-select-container">
                    <label className="course-select-label">Select a Course</label>
                    <select
                        className="course-select-dropdown"
                        onChange={handleCourseSelect}
                        defaultValue=""
                    >
                        <option value="" disabled>
                            Choose a Course
                        </option>
                        {COURSES.map((course) => (
                            <option key={course.id} value={course.id}>
                                {course.courseName} ({course.courseCode})
                            </option>
                        ))}
                    </select>
                </div>

                {selectedCourse && (
                    <div className="course-details-container">
                        <table className="course-details-table">
                            <tbody>
                                <tr>
                                    <th>Course Name</th>
                                    <td>{selectedCourse.courseName}</td>
                                </tr>
                                <tr>
                                    <th>Course Code</th>
                                    <td>{selectedCourse.courseCode}</td>
                                </tr>
                                <tr>
                                    <th>Department</th>
                                    <td>{selectedCourse.department}</td>
                                </tr>
                                <tr>
                                    <th>Credits</th>
                                    <td>{selectedCourse.credits}</td>
                                </tr>
                                <tr>
                                    <th>Description</th>
                                    <td>{selectedCourse.description}</td>
                                </tr>
                                <tr>
                                    <th>Instructor</th>
                                    <td>{selectedCourse.instructor}</td>
                                </tr>
                                <tr>
                                    <th>Semester</th>
                                    <td>{selectedCourse.semester}</td>
                                </tr>
                                <tr>
                                    <th>Schedule</th>
                                    <td>{selectedCourse.schedule}</td>
                                </tr>
                                <tr>
                                    <th>Prerequisites</th>
                                    <td>{selectedCourse.prerequisites}</td>
                                </tr>
                            </tbody>
                        </table>

                        <button
                            className="create-course-button"
                            onClick={handleCreateCourse}
                            disabled={loading}
                        >
                            {loading ? 'Creating...' : 'Create Course'}
                        </button>
                    </div>
                )}
            </div>

            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2>Course Created Successfully!</h2>
                        <p>Course: {selectedCourse.courseName}</p>
                        <p>Course Code: {selectedCourse.courseCode}</p>
                        <button onClick={closeModal}>Close</button>
                    </div>
                </div>
            )}

            {popupMessage && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2>{popupMessage}</h2>
                        <button onClick={closePopup}>Close</button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default CourseCreation;
