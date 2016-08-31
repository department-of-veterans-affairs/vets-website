import React from 'react';

import { connect } from 'react-redux';

import BenefitsSelectionFields from '../components/BenefitsSelectionFields';
import { veteranUpdateField } from '../actions/index';

class BenefitsSelection extends React.Component {
  render() {
    const { section, data, onStateChange } = this.props;

    return (
      <div className="form-panel">
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
