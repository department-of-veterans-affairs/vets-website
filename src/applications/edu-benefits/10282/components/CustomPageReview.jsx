// src/applications/edu-benefits/10282/components/CustomPageReview.js
import React, { useState } from 'react';

const CustomPageReview = ({ formData, onEdit }) => {
  const [isEditing, setIsEditing] = useState(false);
  console.log(formData, 'formData')
  const [editedData, setEditedData] = useState(formData);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = () => {
    onEdit(editedData); // Call the onEdit function to save changes
    setIsEditing(false);
  };

  const handleChange = e => {
    const { name, value } = e.target;
    setEditedData({ ...editedData, [name]: value });
  };

  return (
    <div>
      <h2>Your personal information</h2>
      {isEditing ? (
        <div>
          <div>
            <label>First name:</label>
            <input
              type="text"
              name="firstName"
              value={editedData?.firstName || ''}
              onChange={handleChange}
            />
          </div>
          <div>
            <label>Middle initial:</label>
            <input
              type="text"
              name="middleInitial"
              value={editedData?.middleInitial || ''}
              onChange={handleChange}
            />
          </div>
          <div>
            <label>Last name:</label>
            <input
              type="text"
              name="lastName"
              value={editedData?.lastName || ''}
              onChange={handleChange}
            />
          </div>
          <div>
            <label>Which one best describes you?</label>
            <input
              type="text"
              name="veteranDesc"
              value={editedData?.veteranDesc || ''}
              onChange={handleChange}
            />
          </div>
          <div>
            <label>Email address:</label>
            <input
              type="email"
              name="email"
              value={editedData?.email || ''}
              onChange={handleChange}
            />
          </div>
          <div>
            <label>Mobile phone number:</label>
            <input
              type="tel"
              name="mobilePhone"
              value={editedData?.mobilePhone || ''}
              onChange={handleChange}
            />
          </div>
          <div>
            <label>Home phone number:</label>
            <input
              type="tel"
              name="homePhone"
              value={editedData?.homePhone || ''}
              onChange={handleChange}
            />
          </div>
          <div>
            <label>Country and state of residence:</label>
            <input
              type="text"
              name="countryState"
              value={editedData?.countryState || ''}
              onChange={handleChange}
            />
          </div>
          <button onClick={handleSaveClick}>Save</button>
        </div>
      ) : (
        <div>
          <div>
            <strong>First name:</strong> {formData?.veteranFullName?.first || 'No response'}
          </div>
          <div>
            <strong>Middle initial:</strong>{' '}
            {formData?.middleInitial || 'No response'}
          </div>
          <div>
            <strong>Last name:</strong> {formData?.lastName || 'No response'}
          </div>
          <div>
            <strong>Which one best describes you?</strong>{' '}
            {formData?.veteranDesc || 'No response'}
          </div>
          <div>
            <strong>Email address:</strong> {formData?.email || 'No response'}
          </div>
          <div>
            <strong>Mobile phone number:</strong>{' '}
            {formData?.mobilePhone || 'No response'}
          </div>
          <div>
            <strong>Home phone number:</strong>{' '}
            {formData?.homePhone || 'No response'}
          </div>
          <div>
            <strong>Country and state of residence:</strong>{' '}
            {formData?.countryState || 'No response'}
          </div>
          <button onClick={handleEditClick}>Edit</button>
        </div>
      )}
    </div>
  );
};

export default CustomPageReview;
