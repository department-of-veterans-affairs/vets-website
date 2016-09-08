import React from 'react';

import { connect } from 'react-redux';

import SecondaryContactFields from '../../components/veteran-information/SecondaryContactFields';

import { veteranUpdateField } from '../../actions/index';

class SecondaryContactPage extends React.Component {
  render() {
    const { data, onStateChange } = this.props;

    return (
      <div className="form-panel">
        <SecondaryContactFields data={data} onStateChange={onStateChange}/>
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

export default connect(mapStateToProps, mapDispatchToProps)(SecondaryContactPage);
export { SecondaryContactPage };
