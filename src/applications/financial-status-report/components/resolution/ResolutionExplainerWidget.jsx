import React from 'react';
import PropTypes from 'prop-types';
import FormNavButtons from 'platform/forms-system/src/js/components/FormNavButtons';

const ResolutionExplainerWidget = ({
  data,
  goBack,
  goForward,
  contentBeforeButtons,
  contentAfterButtons,
}) => {
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
          show-icon
          status="info"
          visible="true"
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
        {contentBeforeButtons}
        <FormNavButtons
          goBack={goBack}
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
  data: PropTypes.object,
  goBack: PropTypes.func,
  goForward: PropTypes.func,
  goToPath: PropTypes.func,
  setFormData: PropTypes.func,
};

export default ResolutionExplainerWidget;
