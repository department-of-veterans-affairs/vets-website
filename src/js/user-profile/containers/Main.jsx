import React from 'react';
import { connect } from 'react-redux';
import $ from 'jquery';

import SignInProfileButton from '../../common/components/SignInProfileButton';
import TabNav from '../components/TabNav';

// TODO(crew): Redux-ify the state and how it is stored here.
class Main extends React.Component {
  constructor(props) {
    super(props);
    this.handleOpenPopup = this.handleOpenPopup.bind(this);
    this.setMyToken = this.setMyToken.bind(this);
    this.getUserToken = this.getUserToken.bind(this);
    this.state = {
      loginUrl: '',
      userToken: '',
      userEmail: '',
      userFname: '',
      userLname: '',
      userZip: ''
    };
  }

  componentDidMount() {
    this.serverRequest = $.get('http://localhost:3000/v0/sessions/new', result => {
      const loginPage = result;
      this.setState({
        loginUrl: loginPage.authenticate_via_get
      });
    });

    window.addEventListener('message', this.setMyToken);
  }

  componentWillUnmount() {
    this.serverRequest.abort();
    window.removeEventListener('message', this.setMyToken);
  }

  setMyToken() {
    if (event.origin === 'http://localhost:3000') {
      this.setState({
        userToken: event.data.token
      });
      this.getUserToken();
    }
  }

  getUserToken() {
    fetch('http://localhost:3000/v0/user', {
      method: 'GET',
      headers: new Headers({
        Authorization: `Token token=${this.state.userToken}`
      })
    }).then(response => {
      return response.json();
    }).then(json => {
      this.setState({
        userEmail: json.email,
        userFname: json.first_name,
        userLname: json.last_name,
        userZip: json.zip
      });
    });
  }

  handleOpenPopup() {
    const myLoginUrl = this.state.loginUrl;
    const receiver = window.open(myLoginUrl, '_blank', 'resizable=yes,top=50,left=500,width=500,height=750');
    receiver.focus();
  }

  render() {
    return (
      <div>
        <SignInProfileButton onButtonClick={this.handleOpenPopup}/>
        <div className="rx-app row">
          <TabNav/>
          {this.props.children}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return state;
};

export default connect(mapStateToProps)(Main);
