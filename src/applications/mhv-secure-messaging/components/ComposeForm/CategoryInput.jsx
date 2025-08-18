import React from 'react';
import PropTypes from 'prop-types';
import {
  VaRadio,
  VaRadioOption,
  VaSelect,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { useDispatch } from 'react-redux';
import { Categories } from '../../util/inputContants';
import { updateDraftInProgress } from '../../actions/threadDetails';
import useFeatureToggles from '../../hooks/useFeatureToggles';

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

  const { cernerPilotSmFeatureFlag } = useFeatureToggles();

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

      {categories?.length > 0 &&
        (!cernerPilotSmFeatureFlag ? (
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
                data-dd-action-name={`${Categories[item].label}: ${
                  Categories[item].description
                } Radio Button`}
                style={{ display: 'flex' }}
                key={i}
                label={
                  Categories[item]
                    ? `${Categories[item].label}: ${
                        Categories[item].description
                      }`
                    : item
                }
                name="compose-message-categories"
                value={item}
                checked={category === item}
              />
            ))}
          </VaRadio>
        ) : (
          <VaSelect
            required
            enable-analytics
            data-testid="compose-message-categories"
            className="fieldset-input message-category"
            error={categoryError}
            label="Category"
            name="compose-message-categories"
            value={category}
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
        ))}
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
