import React from 'react';

import { connect } from 'react-redux';

import EducationHistoryFields from '../components/EducationHistoryFields';
import { veteranUpdateField, ensureFieldsInitialized } from '../actions/index';

class EducationHistory extends React.Component {
  render() {
    const { data, onStateChange, dirtyFields } = this.props;

    return (
      <div className="form-panel">
        <EducationHistoryFields data={data} onStateChange={onStateChange} initializeFields={dirtyFields}/>
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

export default connect(mapStateToProps, mapDispatchToProps)(EducationHistory);
export { EducationHistory };
