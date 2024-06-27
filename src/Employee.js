import React, { useState } from 'react';

const Employee = ({ name, phone, category, brand, note }) => {
    const [review, setReview] = useState('');
    const [option, setOption] = useState('');

    const handleReviewChange = (e) => {
        setReview(e.target.value);
    };

    const handleOptionChange = (e) => {
        setOption(e.target.value);
    };

    const updateReview = () => {
        // Logic to handle the review update can be added here
        console.log(`Review: ${review}, Option: ${option}`);
    };

    return (
        <div className="employee">
            <h2>{name}</h2>
            <p>Phone: {phone}</p>
            <p>Category: {category}</p>
            <p>Brand: {brand}</p>
            <p>Note: {note}</p>
            <textarea 
                value={review} 
                onChange={handleReviewChange} 
                placeholder="Additional Review" 
            />
            <div className="review-options">
                <label>
                    <input 
                        type="radio" 
                        value="good" 
                        checked={option === 'good'} 
                        onChange={handleOptionChange} 
                    />
                    Good
                </label>
                <label>
                    <input 
                        type="radio" 
                        value="not good" 
                        checked={option === 'not good'} 
                        onChange={handleOptionChange} 
                    />
                    Not Good
                </label>
                <label>
                    <input 
                        type="radio" 
                        value="did not pick up the call" 
                        checked={option === 'did not pick up the call'} 
                        onChange={handleOptionChange} 
                    />
                    Did not pick up the call
                </label>
            </div>
            <button onClick={updateReview}>Update Review</button>
        </div>
    );
};

export default Employee;
