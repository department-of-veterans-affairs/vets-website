import React from 'react';

import { connect } from 'react-redux';

import EmploymentHistoryFields from '../components/EmploymentHistoryFields';
import { veteranUpdateField, ensureFieldsInitialized } from '../actions/index';

class EmploymentHistory extends React.Component {
  render() {
    const { data, onStateChange, dirtyFields } = this.props;

    return (
      <div className="form-panel">
        <EmploymentHistoryFields data={data} onStateChange={onStateChange} initializeFields={dirtyFields}/>
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
    },
    dirtyFields(...args) {
      dispatch(ensureFieldsInitialized(...args));
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(EmploymentHistory);
export { EmploymentHistory };
