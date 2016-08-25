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
    this.state = { loginUrl: '' };
  }

  componentDidMount() {
    this.serverRequest = $.get('https://dev.vets.gov/api/v0/sessions/new', result => {
      const loginPage = result;
      this.setState({
        loginUrl: loginPage.authenticate_via_get
      });
    });
  }

  componentWillUnmount() {
    this.serverRequest.abort();
  }

  handleOpenPopup() {
    const myLoginUrl = this.state.loginUrl;
    window.open(myLoginUrl, '_blank', 'toolbar=yes,scrollbars=yes,resizable=yes,top=50,left=500,width=500,height=750');
  }

  render() {
    fetch('https://dev.vets.gov/api/v0/users', {
      method: 'GET',
      headers: new Headers({
        'Authorization': 'Token token=Sc59S-31JFWYVr3cXS7jJ6jngXTo9h-CbiELNmgN'
      })
    }).then(function(responseObj) {
      console.log(responseObj);
    });

    return (
      <div>
        <SignInProfileButton onButtonClick={this.handleOpenPopup}/>
        <div className='rx-app row'>
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
