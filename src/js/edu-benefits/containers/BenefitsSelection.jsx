import React from 'react';

import { connect } from 'react-redux';

import BenefitsSelectionFields from '../components/BenefitsSelectionFields';
import NavButtons from '../components/NavButtons';
import NavHeader from '../components/NavHeader';
import { isValidSection } from '../utils/validations';
import { withRouter } from 'react-router';
import routes from '../routes';
import { veteranUpdateField, ensureSectionInitialized, updateCompletedStatus } from '../actions/index';
import { groupPagesIntoChapters } from '../utils/chapters';

class BenefitsSelection extends React.Component {
  render() {
    const { section, currentLocation, data, submission, router, onStateChange, dirtySection, setComplete } = this.props;
    const navigateTo = path => router.push(path);
    const chapters = groupPagesIntoChapters(routes);

    return (
      <div className="form-panel">
        <NavHeader path={currentLocation} chapters={chapters} className="show-for-small-only"/>
        <BenefitsSelectionFields data={data} section={section} onStateChange={onStateChange}/>
        <NavButtons
            submission={submission}
            path={currentLocation}
            isValid={isValidSection(currentLocation, data)}
            dirtySection={dirtySection}
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
    dirtySection(section) {
      dispatch(ensureSectionInitialized(section));
    },
    setComplete(section) {
      dispatch(updateCompletedStatus(section));
    }
  };
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(BenefitsSelection));
export { BenefitsSelection };
