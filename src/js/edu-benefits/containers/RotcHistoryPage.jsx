import React from 'react';

import { connect } from 'react-redux';

import RotcHistoryFields from '../components/RotcHistoryFields';
import { veteranUpdateField, ensureFieldsInitialized } from '../actions/index';

class RotcHistory extends React.Component {
  render() {
    const { data, dirtyFields, onStateChange } = this.props;

    return (
      <div className="form-panel">
        <RotcHistoryFields data={data} initializeFields={dirtyFields} onStateChange={onStateChange}/>
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
    onStateChange(...args) {
      dispatch(veteranUpdateField(...args));
    },
    dirtyFields(...args) {
      dispatch(ensureFieldsInitialized(...args));
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(RotcHistory);
export { RotcHistory };
