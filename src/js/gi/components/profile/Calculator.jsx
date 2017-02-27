import React from 'react';
import { connect } from 'react-redux';
import * as actions from '../../actions';

export class Calculator extends React.Component {
  render() {
    const it = this.props.profile.attributes;
    return (
      <div>
        Calculator
      </div>
    );
  }
}

const mapStateToProps = (state, props) => state;

const mapDispatchToProps = (dispatch) => {
  return {
    showModal: (name) => {
      dispatch(actions.displayModal(name));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Calculator);
