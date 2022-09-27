import React from 'react';
import PropTypes from 'prop-types';

const MessageCategoryInput = props => {
  const { category, categoryError, setCategory, setCategoryError } = props;

  const categoryChangeHandler = event => {
    setCategory(event.target.value);
    setCategoryError(null);
  };

  return (
    <fieldset
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

      <div className="form-radio-buttons">
        <div className="radio-button">
          <input
            type="radio"
            autoComplete="false"
            id="categoryGeneral"
            name="category"
            value="GENERAL"
            checked={category === 'GENERAL'}
            onChange={categoryChangeHandler}
          />
          <label name="category-0-label" htmlFor="categoryGeneral">
            <strong>General:</strong> Ask Questions about non urgent,
            non-emergency issues
          </label>
        </div>
      </div>

      <div className="form-radio-buttons">
        <div className="radio-button">
          <input
            type="radio"
            autoComplete="false"
            id="categoryCovid"
            name="category"
            value="COVID"
            checked={category === 'COVID'}
            onChange={categoryChangeHandler}
          />
          <label name="category-1-label" htmlFor="categoryCovid">
            <strong>COVID:</strong> Ask COVID related questions
          </label>
        </div>
      </div>

      <div />

      <div className="form-expanding-group">
        <div className="form-radio-buttons">
          <div className="radio-button">
            <input
              type="radio"
              autoComplete="false"
              id="categoryAppointment"
              name="category"
              value="APPOINTMENT"
              checked={category === 'APPOINTMENT'}
              onChange={categoryChangeHandler}
            />
            <label name="category-2-label" htmlFor="defaultId-2">
              <strong>Appointment:</strong> Request an appointment or ask about
              an existing appointment
            </label>
          </div>
        </div>
      </div>
      <div className="form-expanding-group">
        <div className="form-radio-buttons">
          <div className="radio-button">
            <input
              type="radio"
              autoComplete="false"
              id="categoryMedication"
              name="category"
              value="MEDICATION"
              checked={category === 'MEDICATION'}
              onChange={categoryChangeHandler}
            />
            <label name="category-3-label" htmlFor="categoryMedication">
              <strong>Medication:</strong> Request to renew a medication or ask
              a question about medication
            </label>
          </div>
        </div>
      </div>
      <div className="form-expanding-group">
        <div className="form-radio-buttons">
          <div className="radio-button">
            <input
              type="radio"
              autoComplete="false"
              id="categoryTest"
              name="category"
              value="TEST"
              checked={category === 'TEST'}
              onChange={categoryChangeHandler}
            />
            <label name="category-4-label" htmlFor="defaultId-2">
              <strong>Test:</strong> Ask a question about a test/lab result or
              about a future test or procedure
            </label>
          </div>
        </div>
      </div>
      <div className="form-expanding-group">
        <div className="form-radio-buttons">
          <div className="radio-button">
            <input
              type="radio"
              autoComplete="false"
              id="categoryEducation"
              name="category"
              value="EDUCATION"
              checked={category === 'EDUCATION'}
              onChange={categoryChangeHandler}
            />
            <label name="category-5-label" htmlFor="defaultId-2">
              <strong>Education:</strong> Request health education information
            </label>
          </div>
        </div>
      </div>
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
