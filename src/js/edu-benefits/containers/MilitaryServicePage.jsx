import React from 'react';

import { connect } from 'react-redux';

import MilitaryServiceFields from '../components/MilitaryServiceFields';
import { veteranUpdateField, ensureFieldsInitialized } from '../actions/index';

class MilitaryService extends React.Component {
  render() {
    const { data, onStateChange, dirtyFields } = this.props;

    return (
      <div className="form-panel">
        <MilitaryServiceFields data={data} onStateChange={onStateChange} initializeFields={dirtyFields}/>
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

export default connect(mapStateToProps, mapDispatchToProps)(MilitaryService);
export { MilitaryService };
