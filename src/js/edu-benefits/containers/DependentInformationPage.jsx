import React from 'react';

import { connect } from 'react-redux';

import DependentInformationFields from '../components/DependentInformationFields';
import { veteranUpdateField } from '../actions/index';

class DependentInformationPage extends React.Component {
  render() {
    const { data, onStateChange } = this.props;

    return (
      <div className="form-panel">
        <DependentInformationFields data={data} onStateChange={onStateChange}/>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    data: state.veteran
  };
}

function mapDispatchToProps(dispatch) {
  return {
    onStateChange(field, update) {
      dispatch(veteranUpdateField(field, update));
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(DependentInformationPage);
export { DependentInformationPage };
