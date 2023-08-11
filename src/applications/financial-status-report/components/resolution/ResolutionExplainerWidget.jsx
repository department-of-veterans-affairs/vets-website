import React from 'react';
import { connect } from 'react-redux';

const ResolutionExplainerWidget = () => {
  return (
    <div>
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
          You may select the same or different options for each of the debts you
          need help with.
        </p>
      </va-alert>
    </div>
  );
};

const mapStateToProps = ({ form }) => {
  return {
    formData: form.data,
  };
};

export default connect(mapStateToProps)(ResolutionExplainerWidget);
