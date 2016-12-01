import React from 'react';

import { connect } from 'react-redux';

import { veteranUpdateField, ensureFieldsInitialized } from '../actions/index';

function focusForm() {
  const legend = document.querySelector('.form-panel legend');
  if (legend && legend.getBoundingClientRect().height > 0) {
    legend.setAttribute('tabindex', '-1');
    legend.focus();
  } else {
    const navHeader = document.querySelector('.nav-header');
    if (navHeader) {
      navHeader.setAttribute('tabindex', '-1');
      navHeader.focus();
    }
  }
}

class FormPage extends React.Component {
  componentDidMount() {
    focusForm();
  }
  componentDidUpdate(prevProps) {
    if (this.props.Fields !== prevProps.Fields) {
      focusForm();
    }
  }
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
