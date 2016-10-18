import React from 'react';

export default class LoginAccess extends React.Component {
  constructor(props) {
    super(props);
    this.handleOpenPopup = this.handleOpenPopup.bind(this);
  }

  handleOpenPopup() {
    const myLoginUrl = this.props.loginUrl;
    const receiver = window.open(myLoginUrl, '_blank', 'resizable=yes,top=50,left=500,width=500,height=750');
    receiver.focus();
  }

  render() {
    return (
      <div className="row">
        <div className="medium-12 small-12 columns">
          <h1>Whoever cross the bridge of death must answer me these questions three, and the other side he see.</h1>
          <img src="http://i58.tinypic.com/2qvbaee.jpg" alt="Monty Python Bridge Troll"/>
          <div><button onClick={this.handleOpenPopup}>Sign In</button></div>
          <small>Note: This is an loa1 gate so the copy above is most likely confusing.</small>
        </div>
      </div>
    );
  }
}
