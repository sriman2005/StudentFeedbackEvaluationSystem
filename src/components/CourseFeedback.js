import React, { useState, useEffect } from 'react';
import './CourseFeedback.css';

function CourseFeedback() {
    const [courses, setCourses] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [feedbackData, setFeedbackData] = useState({
        courseId: '',
        rating: 0,
        comment: '',
    });

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await fetch('/api/courses');
                const data = await response.json();
                setCourses(data);
            } catch (error) {
                console.error('Error fetching courses:', error);
            }
        };

        fetchCourses();
    }, []);

    const handleCourseSelect = (course) => {
        setSelectedCourse(course);
        setFeedbackData((prev) => ({
            ...prev,
            courseId: course.id,
        }));
    };

    const handleFeedbackChange = (e) => {
        const { name, value } = e.target;
        setFeedbackData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const submitFeedback = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('/api/feedback', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(feedbackData),
            });

            if (response.ok) {
                alert('Feedback Submitted Successfully');
                setSelectedCourse(null);
                setFeedbackData({
                    courseId: '',
                    rating: 0,
                    comment: '',
                });
            } else {
                alert('Failed to Submit Feedback');
            }
        } catch (error) {
            console.error('Error submitting feedback:', error);
        }
    };

    const closeModal = () => {
        setSelectedCourse(null);
    };

    return (
        <div className="course-feedback">
            <h2>Available Courses</h2>
            <div className="courses-grid">
                {Array.isArray(courses) && courses.length > 0 ? (
                    courses.map((course) => (
                        <div
                            key={course.id}
                            className="course-card"
                            onClick={() => handleCourseSelect(course)}
                        >
                            <h3>{course.courseName}</h3>
                            <p>{course.courseCode}</p>
                            <p>{course.department}</p>
                        </div>
                    ))
                ) : (
                    <p>No courses available</p>
                )}
            </div>
            {selectedCourse && (
                <div className="feedback-modal">
                    <div className="feedback-content">
                        <h2>Provide Feedback</h2>
                        <form onSubmit={submitFeedback}>
                            <div className="form-group">
                                <label>Course</label>
                                <input
                                    type="text"
                                    value={selectedCourse.courseName}
                                    disabled
                                />
                            </div>
                            <div className="form-group">
                                <label>Course Rating</label>
                                <select
                                    name="rating"
                                    value={feedbackData.rating}
                                    onChange={handleFeedbackChange}
                                    required
                                >
                                    <option value="">Select Rating</option>
                                    <option value="1">1 - Poor</option>
                                    <option value="2">2 - Fair</option>
                                    <option value="3">3 - Good</option>
                                    <option value="4">4 - Very Good</option>
                                    <option value="5">5 - Excellent</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Comments</label>
                                <textarea
                                    name="comment"
                                    value={feedbackData.comment}
                                    onChange={handleFeedbackChange}
                                    placeholder="Share your feedback"
                                    required
                                />
                            </div>
                            <div className="form-actions">
                                <button type="submit" className="submit-feedback-btn">
                                    Submit Feedback
                                </button>
                                <button
                                    type="button"
                                    className="close-modal-btn"
                                    onClick={closeModal}
                                >
                                    Close
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default CourseFeedback;
