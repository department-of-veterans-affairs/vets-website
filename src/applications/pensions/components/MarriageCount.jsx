import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { setData } from '@department-of-veterans-affairs/platform-forms-system/actions';
import FormNavButtons from '~/platform/forms-system/src/js/components/FormNavButtons';
import ProgressButton from '~/platform/forms-system/src/js/components/ProgressButton';
import { Title } from '~/platform/forms-system/src/js/web-component-patterns/titlePattern';

/**
 * This component allows the user to input the number of marriages they have had.
 * Based on the value of the input (`marriageCount`), the component updates the `marriages`
 * array in the form data. The array is populated with objects representing each marriage.
 */

const MarriageCount = props => {
  const {
    data,
    onReviewPage,
    goBack,
    goForward,
    setFormData,
    updatePage,
  } = props;
  const { marriages = [] } = data;
  const MAXIMUM_MARRIAGE_COUNT = 10;

  const [marriageCount, setMarriageCount] = useState(
    marriages.length > 0 ? marriages.length : undefined,
  );
  const [error, setError] = useState(null);

  // To avoid unnecessary effect calls, we'll use a ref to store the previous value of marriageCount.
  const prevMarriageCountRef = useRef(marriageCount);

  const validateMarriageCount = value => {
    if (Number.isNaN(Number(value)) || value < 1) {
      return 'You must enter at least 1 marriage';
    }
    if (value > MAXIMUM_MARRIAGE_COUNT) {
      return `Please enter a number between 1 and ${MAXIMUM_MARRIAGE_COUNT}`;
    }
    return null;
  };

  useEffect(() => {
    if (marriageCount !== prevMarriageCountRef.current) {
      const count = Number(marriageCount);
      if (
        !Number.isNaN(count) &&
        count >= 1 &&
        count <= MAXIMUM_MARRIAGE_COUNT
      ) {
        setFormData({
          ...data,
          marriages:
            marriages.length > count
              ? marriages.slice(marriages.length - count) // Remove from the beginning when reducing
              : [...Array(count - marriages.length).fill({}), ...marriages], // Add empty objects at the beginning when increasing
        });
      }
      prevMarriageCountRef.current = marriageCount;
    }
  }, [marriageCount, data, marriages, setFormData]);

  const handlers = {
    onInput: event => {
      const { value } = event.target;
      setMarriageCount(value);
      setError(validateMarriageCount(value));
    },
    onEdit: event => {
      const validationError = validateMarriageCount(marriageCount);
      if (validationError) {
        setError(validationError);
        return;
      }
      updatePage(event);
    },
    onSubmit: event => {
      event.preventDefault();
      const validationError = validateMarriageCount(marriageCount);
      if (validationError) {
        setError(validationError);
        return;
      }
      goForward(data);
    },
  };

  const navButtons = <FormNavButtons goBack={goBack} submitToContinue />;
  const updateButton = (
    <ProgressButton
      submitButton
      onButtonClick={handlers.onEdit}
      buttonText="Update page"
      buttonClass="usa-button-primary"
      ariaLabel="Update marriage information"
    />
  );

  return (
    <form onSubmit={handlers.onSubmit}>
      <fieldset className="vads-u-margin-y--2">
        <legend className="schemaform-block-title">
          <Title title="Marriage history" />
        </legend>
        <va-text-input
          label="How many times have you been married?"
          inputmode="numeric"
          id="root_marriage_count_value"
          name="root_marriage_count_value"
          onInput={handlers.onInput}
          value={typeof marriageCount === 'undefined' ? '' : marriageCount}
          min={0}
          max={MAXIMUM_MARRIAGE_COUNT}
          width="sm"
          error={error}
          required
        />
        {onReviewPage ? updateButton : navButtons}
      </fieldset>
    </form>
  );
};

MarriageCount.propTypes = {
  data: PropTypes.shape({
    marriages: PropTypes.array,
  }).isRequired,
  goBack: PropTypes.func.isRequired,
  goForward: PropTypes.func.isRequired,
  setFormData: PropTypes.func.isRequired,
  updatePage: PropTypes.func,
  onReviewPage: PropTypes.bool,
};

MarriageCount.defaultProps = {
  onReviewPage: false,
};

const mapStateToProps = ({ form }) => ({
  formData: form.data,
});

const mapDispatchToProps = {
  setFormData: setData,
};

export default connect(mapStateToProps, mapDispatchToProps)(MarriageCount);
