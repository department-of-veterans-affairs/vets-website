import React from 'react';
import PropTypes from 'prop-types';
import {
  VaRadio,
  VaRadioOption,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { useDispatch } from 'react-redux';
import { RadioCategories } from '../../util/inputContants';
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
        <VaRadio
          required
          enable-analytics
          data-testid="compose-message-categories"
          label="Category"
          className=" fieldset-input message-category"
          error={categoryError}
          onVaValueChange={categoryChangeHandler}
        >
          {categories?.map((item, i) => (
            <VaRadioOption
              data-dd-privacy="mask"
              data-testid="compose-category-radio-button"
              data-dd-action-name={`${RadioCategories[item].label}: ${
                RadioCategories[item].description
              } Radio Button`}
              style={{ display: 'flex' }}
              key={i}
              label={
                RadioCategories[item]
                  ? `${RadioCategories[item].label}: ${
                      RadioCategories[item].description
                    }`
                  : item
              }
              name="compose-message-categories"
              value={item}
              checked={category === item}
            />
          ))}
        </VaRadio>
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
