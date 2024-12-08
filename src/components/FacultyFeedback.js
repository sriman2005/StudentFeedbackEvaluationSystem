import React, { useState, useEffect } from 'react';
import './FacultyFeedback.css';

function FacultyFeedback() {
    const [courses, setCourses] = useState([]);
    const [selectedInstructor, setSelectedInstructor] = useState(null);
    const [instructorFeedbackData, setInstructorFeedbackData] = useState({
        courseId: '',
        instructorId: '',
        materialExplanationRating: '',
        objectivesClarityRating: '',
        contentRelevanceRating: '',
        assignmentClarityRating: '',
        gradingCriteriaRating: '',
        additionalComments: '',
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

    const handleInstructorSelect = (course) => {
        setSelectedInstructor({
            name: course.instructor,
            courseId: course.id,
        });
        setInstructorFeedbackData((prev) => ({
            ...prev,
            courseId: course.id,
            instructorId: course.instructor,
        }));
    };

    const handleFeedbackChange = (e) => {
        const { name, value } = e.target;
        setInstructorFeedbackData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const submitInstructorFeedback = async (e) => {
        e.preventDefault();
        try {
            // Calculate overall rating
            const ratings = [
                instructorFeedbackData.materialExplanationRating,
                instructorFeedbackData.objectivesClarityRating,
                instructorFeedbackData.contentRelevanceRating,
                instructorFeedbackData.assignmentClarityRating,
                instructorFeedbackData.gradingCriteriaRating
            ];
            
            const validRatings = ratings.filter(r => r && parseInt(r) > 0);
            const overallRating = validRatings.length > 0 
                ? Math.round(validRatings.reduce((a, b) => parseInt(a) + parseInt(b), 0) / validRatings.length)
                : 0;
    
            const feedbackData = {
                courseId: instructorFeedbackData.courseId,
                instructorId: selectedInstructor.name,
                rating: overallRating,
                materialExplanationRating: parseInt(instructorFeedbackData.materialExplanationRating) || 0,
                objectivesClarityRating: parseInt(instructorFeedbackData.objectivesClarityRating) || 0,
                contentRelevanceRating: parseInt(instructorFeedbackData.contentRelevanceRating) || 0,
                assignmentClarityRating: parseInt(instructorFeedbackData.assignmentClarityRating) || 0,
                gradingCriteriaRating: parseInt(instructorFeedbackData.gradingCriteriaRating) || 0,
                comment: instructorFeedbackData.additionalComments || '',
                additionalComments: instructorFeedbackData.additionalComments || ''
            };
    
            const response = await fetch('/api/instructor-feedback', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(feedbackData),
            });
    
            if (response.ok) {
                alert('Instructor Feedback Submitted Successfully');
                setSelectedInstructor(null);
                // Reset form data
                setInstructorFeedbackData({
                    courseId: '',
                    instructorId: '',
                    materialExplanationRating: '',
                    objectivesClarityRating: '',
                    contentRelevanceRating: '',
                    assignmentClarityRating: '',
                    gradingCriteriaRating: '',
                    additionalComments: '',
                });
            } else {
                const errorText = await response.text();
                alert(`Failed to Submit Instructor Feedback: ${errorText}`);
            }
        } catch (error) {
            console.error('Error submitting instructor feedback:', error);
            alert('An error occurred while submitting feedback');
        }
    };
    const closeModal = () => {
        setSelectedInstructor(null);
    };

    const renderRatingDropdown = (name, label) => (
        <div className="form-group">
            <label>{label}</label>
            <select
                name={name}
                value={instructorFeedbackData[name]}
                onChange={handleFeedbackChange}
                required
            >
                <option value="">Select Rating</option>
                <option value="1">1 - Poor</option>
                <option value="2">2 - Fair</option>
                <option value="3">3 - Average</option>
                <option value="4">4 - Good</option>
                <option value="5">5 - Excellent</option>
            </select>
        </div>
    );

    return (
        <div className="faculty-feedback">
            <h2>Courses and Instructors</h2>
            <div className="courses-grid">
                {Array.isArray(courses) && courses.length > 0 ? (
                    courses.map((course) => (
                        <div
                            key={course.id}
                            className="course-card"
                            onClick={() => handleInstructorSelect(course)}
                        >
                            <h3>{course.courseName}</h3>
                            <p>Course Code: {course.courseCode}</p>
                            <p>Instructor: {course.instructor}</p>
                            <p>Department: {course.department}</p>
                        </div>
                    ))
                ) : (
                    <p>No courses available</p>
                )}
            </div>

            {selectedInstructor && (
                <div className="feedback-modal">
                    <div className="feedback-content">
                        <h2>Provide Instructor Feedback</h2>
                        <form onSubmit={submitInstructorFeedback}>
                            <div className="form-group">
                                <label>Instructor</label>
                                <input
                                    type="text"
                                    value={selectedInstructor.name}
                                    disabled
                                />
                            </div>
                            <div className="form-group">
                                <label>Course</label>
                                <input
                                    type="text"
                                    value={courses.find(c => c.id === selectedInstructor.courseId)?.courseName}
                                    disabled
                                />
                            </div>

                            {renderRatingDropdown(
                                'materialExplanationRating', 
                                'How well did the faculty explain the course material?'
                            )}

                            {renderRatingDropdown(
                                'objectivesClarityRating', 
                                'Were the course objectives and learning outcomes clearly communicated?'
                            )}

                            {renderRatingDropdown(
                                'contentRelevanceRating', 
                                'Was the course content relevant and up-to-date?'
                            )}

                            {renderRatingDropdown(
                                'assignmentClarityRating', 
                                'How clear and fair were the assignments and exams?'
                            )}

                            {renderRatingDropdown(
                                'gradingCriteriaRating', 
                                'Were the grading criteria transparent?'
                            )}

                            <div className="form-group">
                                <label>Additional Comments</label>
                                <textarea
                                    name="additionalComments"
                                    value={instructorFeedbackData.additionalComments}
                                    onChange={handleFeedbackChange}
                                    placeholder="Share any additional feedback"
                                    rows="4"
                                />
                            </div>

                            <div className="form-actions">
                                <button type="submit" className="submit-feedback-btn">
                                    Submit Instructor Feedback
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

export default FacultyFeedback;