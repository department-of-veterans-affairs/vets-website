import React from 'react';

import { connect } from 'react-redux';

import { veteranUpdateField, ensureFieldsInitialized } from '../actions/index';

class FormPage extends React.Component {
  render() {
    const { data, onStateChange, dirtyFields, Fields } = this.props;

    return (
      <div className="form-panel">
        <Fields data={data} onStateChange={onStateChange} initializeFields={dirtyFields}/>
      </div>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    data: state.veteran,
    Fields: ownProps.route.fieldsComponent
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

export default connect(mapStateToProps, mapDispatchToProps)(FormPage);
