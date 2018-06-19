import React from 'react';

export default class Vet360TransactionPending extends React.Component {
  componentDidMount() {
    this.interval = window.setInterval(this.props.refreshTransaction, 1000);
  }
  componentWillUnmount() {
    window.clearInterval(this.interval);
  }
  render() {
    return <div>We’re working on saving your new {this.props.title.toLowerCase()}. We’ll show it here once it’s saved.</div>;
  }
}
