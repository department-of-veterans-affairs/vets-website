import React from 'react';
import { connect } from 'react-redux';
import SubmitMessage from '../components/SubmitMessage';


class SubmitPage extends React.Component {
  render() {
    const address = {
      name: 'Western Region',
      street1: 'VA Regional Office',
      street2: 'P.O. Box 8888',
      city: 'Muskogee',
      state: 'OK',
      zip: '74402-8888'
    };

		// TODO: replace this with actual data from the API
    return (
      <SubmitMessage
          claimType="Education Benefits"
          confirmation="8-910fks-76"
          date="Jul 12, 2016"
          address={address}
          claimedBenefits="Chapter 33"
          relinquishedBenefits="Chapter 1607"/>
    );
  }
}

function mapStateToProps(state) {
  return state;
}

// Fill this in when we start using actions
function mapDispatchToProps() {
  return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(SubmitPage);
export { SubmitPage };
