import React from 'react';
import { connect } from 'react-redux';
import $ from 'jquery';

import SignInProfileButton from '../../common/components/SignInProfileButton';
import TabNav from '../components/TabNav';

// TODO(crew): Redux-ify the state and how it is stored here.
class Main extends React.Component {
  constructor(props) {
    super(props);
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

  render() {
    return (
      <div>
        <SignInProfileButton loginUrl={this.state.loginUrl}/>
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
