import React from 'react';

export default class Wizard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pageHistory: [],
    };
  }

  render() {
    return <div>Hey!</div>;
  }
}
