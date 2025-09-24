import React from 'react';
import PropTypes from 'prop-types';
import { VaSelect } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { useDispatch } from 'react-redux';
import { Categories } from '../../util/inputContants';
import { updateDraftInProgress } from '../../actions/threadDetails';

const CategoryInput = props => {
  const {
    categories,
    category,
    categoryError,
    setCategory,
    setCategoryError,
    setUnsavedNavigationError,
  } = props;
  const dispatch = useDispatch();

  const categoryChangeHandler = e => {
    setCategory(e.detail.value);
    dispatch(
      updateDraftInProgress({
        category: e.detail.value,
      }),
    );
    if (e.detail.value) setCategoryError(null);
    setUnsavedNavigationError();
  };

  return (
    <>
      {categories === undefined && <va-loading-indicator />}

      {categories?.length > 0 && (
        <VaSelect
          enable-analytics
          data-testid="compose-message-categories"
          data-dd-privacy="mask"
          data-dd-action-name="Category Dropdown Select"
          className="composeSelect"
          error={categoryError}
          id="category-select-dropdown"
          label="Category"
          name="compose-message-categories"
          value={category || ''}
          onVaSelect={categoryChangeHandler}
        >
          {categories?.map((item, i) => (
            <option
              key={i}
              value={item}
              data-dd-privacy="mask"
              data-testid="compose-category-dropdown-select"
              data-dd-action-name={`${Categories[item]?.label}: ${
                Categories[item]?.description
              } Dropdown Select`}
            >
              {Categories[item]
                ? `${Categories[item].label}: ${Categories[item].description}`
                : item}
            </option>
          ))}
        </VaSelect>
      )}
    </>
  );
};

CategoryInput.propTypes = {
  categories: PropTypes.array,
  category: PropTypes.string,
  categoryError: PropTypes.string,
  setCategory: PropTypes.func,
  setCategoryError: PropTypes.func,
  setUnsavedNavigationError: PropTypes.func,
};

export default CategoryInput;
