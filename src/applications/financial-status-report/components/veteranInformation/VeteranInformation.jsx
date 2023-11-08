import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { focusElement } from 'platform/utilities/ui';
import VeteranInfoBox from './VeteranInfoBox';
import FormNavButtons from '~/platform/forms-system/src/js/components/FormNavButtons';
import ReviewPageNavigationAlert from '../alerts/ReviewPageNavigationAlert';

const VeteranInformation = ({
  data,
  contentBeforeButtons,
  contentAfterButtons,
  goBack,
  goForward,
  goToPath,
  setFormData,
}) => {
  const headerRef = useRef(null);
  useEffect(
    () => {
      if (headerRef?.current) {
        focusElement(headerRef?.current);
      }
    },
    [headerRef],
  );

  const {
    personalData,
    personalIdentification,
    reviewNavigation = false,
    'view:reviewPageNavigationToggle': showReviewNavigation,
  } = data;
  const {
    veteranFullName: { first, last, middle },
    dateOfBirth,
  } = personalData;
  const { ssn, fileNumber } = personalIdentification;

  const handleBackNavigation = () => {
    if (reviewNavigation) {
      setFormData({
        ...data,
        reviewNavigation: false,
      });
      goToPath('/review-and-submit');
    } else {
      goBack();
    }
  };

  return (
    <form>
      <fieldset className="vads-u-margin-y--2">
        <legend className="schemaform-block-title">
          <h3 className="vads-u-margin--0" ref={headerRef}>
            Veteran information
          </h3>
        </legend>
        {reviewNavigation && showReviewNavigation ? (
          <ReviewPageNavigationAlert data={data} title="veteran information" />
        ) : null}
        <VeteranInfoBox
          first={first}
          middle={middle}
          last={last}
          dateOfBirth={dateOfBirth}
          ssnLastFour={ssn}
          fileNumber={fileNumber}
        />
        {contentBeforeButtons}
        <FormNavButtons
          goBack={handleBackNavigation}
          goForward={goForward}
          submitToContinue
        />
        {contentAfterButtons}
      </fieldset>
    </form>
  );
};

VeteranInformation.propTypes = {
  contentAfterButtons: PropTypes.object,
  contentBeforeButtons: PropTypes.object,
  data: PropTypes.shape({
    personalData: PropTypes.shape({
      veteranFullName: PropTypes.shape({
        first: PropTypes.string,
        last: PropTypes.string,
        middle: PropTypes.string,
      }),
      dateOfBirth: PropTypes.string,
    }),
    personalIdentification: PropTypes.shape({
      ssn: PropTypes.string,
      fileNumber: PropTypes.string,
    }),
    reviewNavigation: PropTypes.bool,
    'view:reviewPageNavigationToggle': PropTypes.bool,
  }),
  goBack: PropTypes.func,
  goForward: PropTypes.func,
  goToPath: PropTypes.func,
};

export default VeteranInformation;
