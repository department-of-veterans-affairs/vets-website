import React from 'react';

import { connect } from 'react-redux';

import BenefitsSelectionFields from '../components/BenefitsSelectionFields';
import { veteranUpdateField } from '../actions/index';
import NavHeader from '../components/NavHeader';
import routes from '../routes';
import { groupPagesIntoChapters } from '../utils/chapters';

class BenefitsSelection extends React.Component {
  render() {
    const { section, data, onStateChange } = this.props;
    const chapters = groupPagesIntoChapters(routes);

    return (
      <div className="form-panel">
        <NavHeader path={currentLocation} chapters={chapters} className="show-for-small-only"/>
        <BenefitsSelectionFields data={data} section={section} onStateChange={onStateChange}/>
      </div>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    data: state.veteran,
    section: state.uiState.sections[ownProps.location.pathname],
  };
}

function mapDispatchToProps(dispatch) {
  return {
    onStateChange(field, update) {
      dispatch(veteranUpdateField(field, update));
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(BenefitsSelection);
export { BenefitsSelection };
