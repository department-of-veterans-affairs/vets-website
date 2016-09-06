import React from 'react';

import { connect } from 'react-redux';

import MilitaryServiceFields from '../components/MilitaryServiceFields';
import { veteranUpdateField, ensureFieldsInitialized } from '../actions/index';

class MilitaryService extends React.Component {
  render() {
    const { section, data, onStateChange, dirtyFields } = this.props;

    return (
      <div className="form-panel">
        <MilitaryServiceFields data={data} section={section} onStateChange={onStateChange} initializeFields={dirtyFields}/>
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
    },
    dirtyFields(...args) {
      dispatch(ensureFieldsInitialized(...args));
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(MilitaryService);
export { MilitaryService };
