import React, { useState } from 'react';

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
      <p>
        Note: Any updates you make to your email address will only apply to this
        order. If you’d like to update for all future orders, you can either
        call us at{' '}
        <va-telephone contact="3032736200">303-273-6200</va-telephone> or change
        in your{' '}
        <a href="/profile/" target="_new">
          VA.gov profile
        </a>
        .
      </p>
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
