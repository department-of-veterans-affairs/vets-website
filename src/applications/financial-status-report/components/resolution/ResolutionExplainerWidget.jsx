import React from 'react';
import PropTypes from 'prop-types';
import FormNavButtons from '@department-of-veterans-affairs/platform-forms-system/FormNavButtons';
import { waitForRenderThenFocus } from '@department-of-veterans-affairs/platform-utilities/ui';
import ReviewPageNavigationAlert from '../alerts/ReviewPageNavigationAlert';

const ResolutionExplainerWidget = ({
  data,
  goBack,
  goForward,
  goToPath,
  setFormData,
  contentBeforeButtons,
  contentAfterButtons,
}) => {
  const {
    reviewNavigation = false,
    'view:reviewPageNavigationToggle': showReviewNavigation,
  } = data;

  const handleBackNavigation = () => {
    if (reviewNavigation && showReviewNavigation) {
      setFormData({
        ...data,
        reviewNavigation: false,
      });
      goToPath('/review-and-submit');
    } else {
      goBack();
    }
  };
  React.useEffect(() => {
    // focus on the h3  when the page loads for screen readers
    waitForRenderThenFocus('h3');
  }, []);
  return (
    <form
      onSubmit={event => {
        event.preventDefault();
        goForward(data);
      }}
    >
      <fieldset>
        <va-alert
          close-btn-aria-label="Close notification"
          disable-analytics="false"
          full-width="false"
          status="info"
          visible
        >
          <h3 slot="headline">
            Next, you’ll be asked to choose a relief option for each debt you
            selected
          </h3>
          <p className="vads-u-margin-bottom--0">
            You may select the same or different options for each of the debts
            you need help with.
          </p>
        </va-alert>
        {reviewNavigation && showReviewNavigation ? (
          <ReviewPageNavigationAlert
            data={data}
            title="repayment or relief options"
          />
        ) : null}
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

ResolutionExplainerWidget.propTypes = {
  contentAfterButtons: PropTypes.object,
  contentBeforeButtons: PropTypes.object,
  data: PropTypes.shape({
    reviewNavigation: PropTypes.bool,
    'view:reviewPageNavigationToggle': PropTypes.bool,
  }),
  goBack: PropTypes.func,
  goForward: PropTypes.func,
  goToPath: PropTypes.func,
  setFormData: PropTypes.func,
};

export default ResolutionExplainerWidget;
