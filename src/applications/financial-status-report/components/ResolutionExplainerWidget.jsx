import React from 'react';
import { connect } from 'react-redux';

const ResolutionExplainerWidget = () => {
  return (
    <div>
      <va-alert status="info">
        <strong>
          Next, you’ll be asked to choose a relief option for each debt you
          selected
        </strong>

        <p className="vads-u-font-size--base vads-u-font-family--sans">
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
