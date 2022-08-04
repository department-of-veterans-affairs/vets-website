import React, { useState } from 'react';

const MessageCategory = () => {
  const [invalid] = useState(false);

  return (
    <fieldset
      className={`fieldset-input message-category ${invalid &&
        'usa-input-error'}`}
    >
      <legend className="legend-label usa-input-error-label">
        Category <span className="required">(*Required)</span>
      </legend>

      {invalid && (
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
            value="general"
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
            value="covid"
          />
          <label name="category-1-label" htmlFor="categoryCovid">
            <strong>Covid:</strong> Ask COVID related questions
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
              value="appointment"
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
              value="medication"
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
              value="test"
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
              value="education"
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

export default MessageCategory;
