import React from 'react';

import { connect } from 'react-redux';

import VeteranAddressFields from '../../components/veteran-information/VeteranAddressFields';

import { veteranUpdateField } from '../../actions/index';

class VeteranAddressPage extends React.Component {
  render() {
    const { data, onStateChange } = this.props;

    return (
      <div className="form-panel">
        <VeteranAddressFields data={data} onStateChange={onStateChange}/>
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

export default connect(mapStateToProps, mapDispatchToProps)(VeteranAddressPage);
export { VeteranAddressPage };
