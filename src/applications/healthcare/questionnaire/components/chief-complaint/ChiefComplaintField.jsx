import React from 'react';
import { connect } from 'react-redux';

import TextWidget from 'platform/forms-system/src/js/widgets/TextWidget';

const ChiefComplaintField = props => {
  const { onReviewPage, reviewMode } = props.formContext;
  const currentValue = props.value;
  // const { chiefComplaint } = props;

  const editField = () => {
    return (
      <div data-testid="editField">
        <TextWidget {...props} />
      </div>
    );
  };

  if (onReviewPage && reviewMode) {
    return <>{currentValue}</>;
  } else if (onReviewPage && !reviewMode) {
    return editField();
  } else {
    return editField();
  }
};

const mapStateToProps = () => ({
  chiefComplaint: 'Pain in right knee',
});

export default connect(
  mapStateToProps,
  null,
)(ChiefComplaintField);
