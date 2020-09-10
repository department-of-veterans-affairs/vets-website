import React from 'react';
import { connect } from 'react-redux';

import TextWidget from 'platform/forms-system/src/js/widgets/TextWidget';

const ChiefComplaintField = props => {
  const editField = () => {
    return (
      <div>
        <TextWidget {...props} />
      </div>
    );
  };

  return editField();
};

const mapStateToProps = () => ({
  chiefComplaint: 'Pain in right knee',
});

export default connect(
  mapStateToProps,
  null,
)(ChiefComplaintField);
