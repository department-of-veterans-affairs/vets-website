import React from 'react';
import { connect } from 'react-redux';

export class PaymentReviewView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      formData: props.formData,
      name: props.name,
    };
  }

  render() {
    return <span>SHOQW</span>;
  }
}

const mapStateToProps = store => ({
  user: store.user,
});

export default connect(mapStateToProps)(PaymentReviewView);
