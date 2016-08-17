import React from 'react';
import { connect } from 'react-redux';

import PrescriptionList from '../components/PrescriptionList';
import { loadData } from '../actions/prescriptions.js';

class Active extends React.Component {
  componentWillMount() {
    this.props.dispatch(loadData());
  }
  render() {
    return (
      <PrescriptionList
          items={this.props.prescriptions.items}/>
    );
  }
}

// TODO: fill this out
const mapStateToProps = (state) => {
  return state;
};

export default connect(mapStateToProps)(Active);
