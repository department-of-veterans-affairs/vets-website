import React from 'react';

import { connect } from 'react-redux';

import DirectDepositFields from '../../components/veteran-information/DirectDepositFields';

import { veteranUpdateField } from '../../actions/index';

class DirectDepositPage extends React.Component {
  render() {
    const { data, onStateChange } = this.props;

    return (
      <div className="form-panel">
        <DirectDepositFields data={data} onStateChange={onStateChange}/>
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

export default connect(mapStateToProps, mapDispatchToProps)(DirectDepositPage);
export { DirectDepositPage };
