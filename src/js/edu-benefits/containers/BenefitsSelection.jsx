import React from 'react';

import { connect } from 'react-redux';

import BenefitsSelectionFields from '../components/BenefitsSelectionFields';
import NavButtons from '../components/NavButtons';
import { isValidSection } from '../utils/validations';
import { withRouter } from 'react-router';

class BenefitsSelection extends React.Component {
  render() {
    const { section, panels, currentLocation, data, submission, router } = this.props;
    const sectionNames = panels.reduce((sections, panel) => {
      return sections.concat(panel.sections.map(sectionObj => sectionObj.path));
    }, []);

    const navigateTo = path => router.push(path);

    return (
      <div className="form-panel">
        <BenefitsSelectionFields data={data} section={section}/>
        <NavButtons
            submission={submission}
            path={currentLocation}
            sections={sectionNames}
            isValid={isValidSection(currentLocation, data)}
            onNavigate={navigateTo}/>
      </div>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    data: state.veteran,
    section: state.uiState.sections[ownProps.location.pathname],
    panels: state.uiState.panels,
    submission: state.uiState.submission,
    currentLocation: ownProps.location.pathname,
    router: ownProps.router
  };
}

// Fill this in when we start using actions
function mapDispatchToProps() {
  return {};
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(BenefitsSelection));
export { BenefitsSelection };
