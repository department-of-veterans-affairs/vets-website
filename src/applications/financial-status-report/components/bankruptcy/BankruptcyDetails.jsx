import React, { useEffect, useRef, useState } from 'react';
import {
  VaDate,
  VaTextInput,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import PropTypes from 'prop-types';
import { focusElement } from 'platform/utilities/ui';
import ButtonGroup from '../shared/ButtonGroup';

const BankruptcyDetails = ({
  data,
  goBack,
  goForward,
  setFormData,
  contentBeforeButtons,
  contentAfterButtons,
}) => {
  const headerRef = useRef(null);
  const {
    additionalData: { bankruptcy = {} },
    reviewNavigation = false,
    'view:reviewPageNavigationToggle': showReviewNavigation,
  } = data;

  const [courtError, setCourtError] = useState(null);
  const [courtLocation, setCourtLocation] = useState(
    bankruptcy?.courtLocation || '',
  );

  const [docketError, setDocketError] = useState(null);
  const [docketNumber, setDocketNumber] = useState(
    bankruptcy?.docketNumber || '',
  );

  // Date validation
  const [dateError, setDateError] = useState(null);
  const [dateDischarged, setDateDischarged] = useState(
    bankruptcy?.dateDischarged || '',
  );

  const handleDateBlur = () => {
    const today = new Date();
    // new Date as YYYY-MM-DD is giving the day prior to the day select
    // new Date as YYYY MM DD is giving the correct day selected
    const dateInput = new Date(dateDischarged.split('-').join(' '));

    if (dateInput > today) {
      setDateError('Date must be in the past');
    } else {
      setDateError(null);
    }
  };

  // notify user they are returning to review page if they are in review mode
  const continueButtonText =
    reviewNavigation && showReviewNavigation
      ? 'Continue to review page'
      : 'Continue';

  // Header ref for setting focus
  useEffect(
    () => {
      if (headerRef?.current) {
        focusElement(headerRef?.current);
      }
    },
    [headerRef],
  );

  // Set errors and data
  const onGoForward = () => {
    const courtEr = courtLocation.length === 0;
    const docketEr = docketNumber.length === 0;
    const dateEr = dateDischarged.length === 0;

    if (courtEr) {
      setCourtError('Please provide location of court');
    }
    if (docketEr) {
      setDocketError('Please provide a docket number');
    }
    if (dateEr) {
      setDateError('Please provide a date');
    }
    if (courtEr || docketEr || dateEr) {
      return;
    }

    if (reviewNavigation && showReviewNavigation) {
      setFormData({
        ...data,
        reviewNavigation: false,
      });
    }

    setFormData({
      ...data,
      additionalData: {
        ...data?.additionalData,
        bankruptcy: {
          dateDischarged,
          courtLocation,
          docketNumber,
        },
      },
    });
  };

  // Handle nav forward if data is valid
  const onSubmit = event => {
    event.preventDefault();
    onGoForward();
    if (!courtError && !docketError && !dateError) {
      goForward(data);
    }
  };

  return (
    <form onSubmit={onSubmit}>
      <fieldset className="vads-u-margin-y--2">
        <legend className="schemaform-block-title">
          <h3 className="vads-u-margin--0" ref={headerRef}>
            Your bankruptcy details
          </h3>
        </legend>
        <VaDate
          data-testid="date-discharged"
          error={dateError}
          id="date-discharged"
          required
          label="Date a court granted you a bankruptcy discharge"
          name="date-discharged"
          onDateBlur={() => handleDateBlur()}
          onDateChange={({ target }) => {
            setDateDischarged(target.value);
          }}
          value={dateDischarged}
        />
        <VaTextInput
          error={courtError}
          id="court-location"
          label="Location of court (city, state)"
          name="court-location"
          onBlur={({ target }) => {
            if (target.value.length === 0) {
              setCourtError('Please provide location of court');
            }
          }}
          onInput={({ target }) => {
            if (target.value.length > 0) {
              setCourtError(null);
            }
            setCourtLocation(target.value);
          }}
          required
          type="text"
          uswds
          value={courtLocation}
        />
        <VaTextInput
          error={docketError}
          hint="You’ll find this number on your case documents."
          id="docket-number"
          label="Case or docket number"
          name="docket-number"
          onBlur={({ target }) => {
            if (target.value.length === 0) {
              setDocketError('Please provide a docket number');
            }
          }}
          onInput={({ target }) => {
            if (target.value.length > 0) {
              setDocketError(null);
            }
            setDocketNumber(target.value);
          }}
          required
          type="text"
          uswds
          value={docketNumber}
        />
      </fieldset>
      {contentBeforeButtons}
      <ButtonGroup
        buttons={[
          {
            label: 'Back',
            onClick: goBack,
            isSecondary: true,
          },
          {
            label: continueButtonText,
            onClick: onSubmit,
            isSubmitting: true,
          },
        ]}
      />
      {contentAfterButtons}
    </form>
  );
};

BankruptcyDetails.propTypes = {
  contentAfterButtons: PropTypes.object,
  contentBeforeButtons: PropTypes.object,
  data: PropTypes.shape({
    additionalData: PropTypes.shape({
      bankruptcy: PropTypes.shape({
        courtLocation: PropTypes.string,
        dateDischarged: PropTypes.string,
        docketNumber: PropTypes.string,
      }),
    }),
    reviewNavigation: PropTypes.bool,
    'view:reviewPageNavigationToggle': PropTypes.bool,
  }),
  goBack: PropTypes.func,
  goForward: PropTypes.func,
  goToPath: PropTypes.func,
  setFormData: PropTypes.func,
};

export default BankruptcyDetails;
