import React from 'react';
import { connect } from 'react-redux';
import { showModal } from '../../actions';

export class Calculator extends React.Component {
  render() {
    // const it = this.props.profile.attributes;
    return (
      <div>
        Calculator
      </div>
    );
  }
}

const mapStateToProps = (state) => state;

const mapDispatchToProps = {
  showModal,
};

export default connect(mapStateToProps, mapDispatchToProps)(Calculator);
