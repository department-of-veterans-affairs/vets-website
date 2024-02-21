import React, { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { VaRadio } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import PropTypes from 'prop-types';
import { setData } from 'platform/forms-system/src/js/actions';
import { focusElement } from 'platform/utilities/ui';
import FormNavButtons from '~/platform/forms-system/src/js/components/FormNavButtons';
import ReviewPageNavigationAlert from '../alerts/ReviewPageNavigationAlert';

const BankruptcyQuestion = ({
  data,
  goBack,
  goForward,
  goToPath,
  setFormData,
  contentBeforeButtons,
  contentAfterButtons,
}) => {
  const dispatch = useDispatch();
  const headerRef = useRef(null);
  const {
    reviewNavigation = false,
    'view:reviewPageNavigationToggle': showReviewNavigation,
  } = data;

  const {
    questions: { hasBeenAdjudicatedBankrupt = null },
  } = data;

  const [error, setError] = useState(null);

  // Header ref for setting focus
  useEffect(
    () => {
      if (headerRef?.current) {
        focusElement(headerRef?.current);
      }
    },
    [headerRef],
  );

  // custom back navigation for review functionality
  const handleBackNavigation = () => {
    if (reviewNavigation && showReviewNavigation) {
      dispatch(
        setData({
          ...data,
          reviewNavigation: false,
        }),
      );
      goToPath('/review-and-submit');
    } else {
      goBack();
    }
  };

  const onSelection = ({ detail }) => {
    const val = detail?.value === 'y';
    setError(null);
    setFormData({
      ...data,
      questions: {
        ...data?.questions,
        hasBeenAdjudicatedBankrupt: val,
      },
    });
  };

  const onGoForward = () => {
    if (hasBeenAdjudicatedBankrupt !== null) {
      if (reviewNavigation && !hasBeenAdjudicatedBankrupt) {
        setFormData({
          ...data,
          reviewNavigation: false,
        });
      }
      goForward(data);
    } else {
      setError('You must answer yes or no');
      focusElement('va-radio');
    }
  };

  return (
    <form
      onSubmit={event => {
        event.preventDefault();
      }}
    >
      <fieldset className="vads-u-margin-y--2">
        <legend className="schemaform-block-title">
          <h3 className="vads-u-margin--0" ref={headerRef}>
            Your bankruptcy details
          </h3>
        </legend>
        {reviewNavigation && showReviewNavigation ? (
          <ReviewPageNavigationAlert data={data} title="bankruptcy history" />
        ) : null}
        <VaRadio
          class="vads-u-margin-y--2"
          label="Have you ever declared bankruptcy?"
          onVaValueChange={onSelection}
          error={error}
          required
          uswds
        >
          <va-radio-option
            uswds
            id="has-declared-bankruptcy"
            label="Yes"
            value="y"
            checked={
              hasBeenAdjudicatedBankrupt === null
                ? null
                : hasBeenAdjudicatedBankrupt
            }
          />
          <va-radio-option
            uswds
            id="has-not-declared-bankruptcy"
            label="No"
            value="n"
            name="primary"
            checked={
              hasBeenAdjudicatedBankrupt === null
                ? null
                : !hasBeenAdjudicatedBankrupt
            }
          />
        </VaRadio>
        {contentBeforeButtons}
        <FormNavButtons
          goBack={handleBackNavigation}
          goForward={onGoForward}
          submitToContinue
        />
        {contentAfterButtons}
      </fieldset>
    </form>
  );
};

BankruptcyQuestion.propTypes = {
  data: PropTypes.shape({
    questions: PropTypes.shape({
      hasBeenAdjudicatedBankrupt: PropTypes.bool,
    }),
    reviewNavigation: PropTypes.bool,
    'view:reviewPageNavigationToggle': PropTypes.bool,
  }).isRequired,
  goBack: PropTypes.func.isRequired,
  goForward: PropTypes.func.isRequired,
  goToPath: PropTypes.func.isRequired,
  setFormData: PropTypes.func.isRequired,
  contentAfterButtons: PropTypes.node,
  contentBeforeButtons: PropTypes.node,
};

export default BankruptcyQuestion;
