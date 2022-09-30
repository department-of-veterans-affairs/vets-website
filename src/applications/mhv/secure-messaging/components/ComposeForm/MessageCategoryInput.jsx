import React from 'react';
import PropTypes from 'prop-types';

const MessageCategoryInput = props => {
  const { category, categoryError, setCategory, setCategoryError } = props;

  const categoryChangeHandler = event => {
    setCategory(event.target.value);
    setCategoryError(null);
  };

  const categories = [
    {
      id: 'category-general',
      name: 'category',
      value: 'GENERAL',
      label: 'General',
      description: 'Ask questions about non urgent, non-emergency issues',
    },
    {
      id: 'category-COVID',
      name: 'category',
      value: 'COVID',
      label: 'COVID',
      description: 'Ask COVID related questions',
    },
    {
      id: 'category-appointment',
      name: 'category',
      value: 'APPOINTMENT',
      label: 'Appointment',
      description:
        'Request an appointment or ask about an existing appointment',
    },
    {
      id: 'category-medication',
      name: 'category',
      value: 'MEDICATION',
      label: 'Medication',
      description:
        'Request to renew a medication or ask a question about medication',
    },
    {
      id: 'category-test',
      name: 'category',
      value: 'TEST',
      label: 'Test',
      description:
        'Ask a question about a test/lab result or about a future test or procedure',
    },
    {
      id: 'category-education',
      name: 'category',
      value: 'EDUCATION',
      label: 'Education',
      description: 'Request health education information',
    },
  ];

  return (
    <fieldset
      id="message-category"
      className={`fieldset-input message-category ${categoryError &&
        'usa-input-error'}`}
    >
      <legend className="legend-label usa-input-error-label">
        Category <span className="required">(*Required)</span>
      </legend>

      {categoryError && (
        <span
          className="usa-input-error-message"
          role="alert"
          id="defaultId-error-message"
        >
          <span className="sr-only">Error</span> Please select a category
        </span>
      )}

      {categories.map(item => (
        <div className="form-radio-buttons" key={item.id}>
          <div className="radio-button">
            <input
              type="radio"
              id={item.id}
              name={item.name}
              value={item.value}
              checked={category === item.value}
              onChange={categoryChangeHandler}
            />
            <label name={`${item.id}-label`} htmlFor={item.id}>
              <strong>{item.label}:</strong> {item.description}
            </label>
          </div>
        </div>
      ))}
    </fieldset>
  );
};

MessageCategoryInput.propTypes = {
  category: PropTypes.string,
  categoryError: PropTypes.bool,
  setCategory: PropTypes.func,
  setCategoryError: PropTypes.func,
};

export default MessageCategoryInput;
