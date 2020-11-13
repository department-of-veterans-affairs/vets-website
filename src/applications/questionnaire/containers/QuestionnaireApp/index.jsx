import React from 'react';
import { connect } from 'react-redux';

const QuestionnaireApp = props => {
  const { children } = props;
  return <div className="questionnaire-app">{children}</div>;
};

function mapStateToProps(_state) {
  return {
    // user: selectUser(state),
    // showApplication: vaosApplication(state),
    // loadingFeatureToggles: selectFeatureToggleLoading(state),
    // sites: selectPatientFacilities(state),
    // useFlatFacilityPage: selectUseFlatFacilityPage(state),
  };
}

export default connect(mapStateToProps)(QuestionnaireApp);
