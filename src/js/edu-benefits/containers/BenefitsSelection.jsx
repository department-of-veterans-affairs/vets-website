import React from 'react';

import { connect } from 'react-redux';

import BenefitsSelectionFields from '../components/BenefitsSelectionFields';
import NavButtons from '../components/NavButtons';
import { isValidSection } from '../utils/validations';
import { withRouter } from 'react-router';
import { veteranUpdateField, ensureFieldsInitialized, updateCompletedStatus } from '../actions/index';

class BenefitsSelection extends React.Component {
  render() {
    const { section, currentLocation, data, submission, router, onStateChange, dirtyFields, setComplete } = this.props;
    const navigateTo = path => router.push(path);

    return (
      <div className="form-panel">
        <BenefitsSelectionFields data={data} section={section} onStateChange={onStateChange}/>
        <NavButtons
            submission={submission}
            path={currentLocation}
            isValid={isValidSection(currentLocation, data)}
            dirtyFields={dirtyFields}
            onNavigate={navigateTo}
            onComplete={setComplete}/>
      </div>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    data: state.veteran,
    section: state.uiState.sections[ownProps.location.pathname],
    submission: state.uiState.submission,
    currentLocation: ownProps.location.pathname,
    router: ownProps.router
  };
}

function mapDispatchToProps(dispatch) {
  return {
    onStateChange(field, update) {
      dispatch(veteranUpdateField(field, update));
    },
    dirtyFields(section) {
      dispatch(ensureFieldsInitialized(section));
    },
    setComplete(section) {
      dispatch(updateCompletedStatus(section));
    }
  };
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(BenefitsSelection));
export { BenefitsSelection };
