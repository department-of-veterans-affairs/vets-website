import React, { useState } from 'react';
import UnsavedFieldNote from './UnsavedFieldNote';

const EditEmail = ({ data, goToPath, setFormData }) => {
  const [email, setEmail] = useState(data.emailAddress || '');

  const handleSubmit = event => {
    event.preventDefault();
    setFormData({ ...data, emailAddress: email });
    goToPath('/contact-information');
  };

  return (
    <div>
      <h2>Order medical supplies</h2>
      <h3>Contact information</h3>
      <UnsavedFieldNote fieldName="email address" />
      <form onSubmit={handleSubmit}>
        <label htmlFor="email-input">Edit email address (Required)</label>
        <input
          id="email-input"
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <div>
          <va-button
            text="Update"
            onClick={handleSubmit}
            type="submit"
            className="usa-button"
          />
          <va-button
            text="Cancel"
            type="button"
            className="usa-button-secondary"
            onClick={() => goToPath('/contact-information')}
          />
        </div>
      </form>
    </div>
  );
};

export default EditEmail;
