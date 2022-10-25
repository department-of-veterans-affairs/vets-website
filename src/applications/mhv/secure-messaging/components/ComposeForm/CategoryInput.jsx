import React from 'react';
import PropTypes from 'prop-types';
import { RadioCategories } from '../../util/inputContants';

const CategoryInput = props => {
  const { category, categoryError, setCategory, setCategoryError } = props;

  const categoryChangeHandler = event => {
    setCategory(event.target.value);
    setCategoryError(null);
  };

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

      {RadioCategories.map(item => (
        <div className="form-radio-buttons" key={item.id}>
          <div className="radio-button">
            <input
              type="radio"
              id={item.id}
              name="category"
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

CategoryInput.propTypes = {
  category: PropTypes.string,
  categoryError: PropTypes.bool,
  setCategory: PropTypes.func,
  setCategoryError: PropTypes.func,
};

export default CategoryInput;
