import React from 'react';
import propTypes from 'prop-types';

const AddYourMedicationInfoWarning = ({ isVisible }) => {
  return (
    <div className="vads-u-margin-top--3">
      <va-banner
        headline="Add your medication information to this message"
        type="warning"
        visible={isVisible}
      >
        <p>
          To submit your renewal request, you should fill in as many of the
          medication details as possible. You can find this information on your
          prescription label or in your prescription details page.
        </p>
      </va-banner>
    </div>
  );
};

AddYourMedicationInfoWarning.propTypes = {
  isVisible: propTypes.bool,
};

export default AddYourMedicationInfoWarning;
