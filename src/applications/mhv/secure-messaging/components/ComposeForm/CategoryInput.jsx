import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  VaRadio,
  VaRadioOption,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { useDispatch, useSelector } from 'react-redux';
import { getCategories } from '../../actions/categories';
import { RadioCategories } from '../../util/inputContants';

const CategoryInput = props => {
  const dispatch = useDispatch();
  const { category, categoryError, setCategory, setCategoryError } = props;
  const categories = useSelector(state => state.sm.categories.categories);

  useEffect(
    () => {
      dispatch(getCategories());
    },
    [dispatch],
  );

  const categoryChangeHandler = ({ target }) => {
    setCategory(target.value);
    setCategoryError(null);
  };

  return (
    <>
      {categories === undefined && <va-loading-indicator />}

      {categories?.length > 0 && (
        <VaRadio
          required
          data-testid="compose-message-categories"
          label="Category"
          className=" fieldset-input message-category"
          error={categoryError && 'Please select a category'}
          onRadioOptionSelected={categoryChangeHandler}
        >
          {categories?.map((item, i) => (
            <VaRadioOption
              data-testid="compose-category-radio-button"
              key={i}
              label={
                RadioCategories[item]
                  ? `${RadioCategories[item].label}: ${
                      RadioCategories[item].description
                    }`
                  : item
              }
              name={item}
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
  category: PropTypes.string,
  categoryError: PropTypes.bool,
  setCategory: PropTypes.func,
  setCategoryError: PropTypes.func,
};

export default CategoryInput;
