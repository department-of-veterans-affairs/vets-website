import React from 'react';
import { connect } from 'react-redux';
import { focusElement } from '../../common/utils/helpers';
import OMBInfo from '../../common/components/OMBInfo';
import LoginModal from '../../common/components/LoginModal';
import FormTitle from '../../common/schemaform/FormTitle';
import FormIntroButtons from '../../common/schemaform/FormIntroButtons';

class IntroductionPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      modalOpened: false
    };
  }

  componentDidMount() {
    focusElement('.va-nav-breadcrumbs-list');
  }

  getAlertBody = () => {
    let body = (<div>
      <strong>Note:</strong> You are now able save a form in progress, and come back to finish it later. To be able to save your form in progress, please <a onClick={this.openLoginModal}>sign in</a>.
      <LoginModal
          onClose={this.closeLoginModal}
          visible={this.state.modalOpened}/>
    </div>);

    if (this.props.loggedIn) {
      body = (<div>
        <strong>Note:</strong> You can now save your application and come back to save it at a later time.
      </div>);
    }

    return body;
  }

  openLoginModal = () => {
    this.setState({ modalOpened: true });
  }

  closeLoginModal = () => {
    this.setState({ modalOpened: false });
  }

  render() {
    return (
      <div className="schemaform-intro">
        <FormTitle title="Apply online for health care with the 10-10ez"/>
        <p>
          Fill out this application with the most accurate information you have. The more accurate it is, the more likely you are to get a rapid response.
        </p>
        <p>
          VA uses the information you submit to determine your eligibility and to provide you with the best service.
        </p>
        <p>
          Federal law provides criminal penalties, including a fine and/or imprisonment for up to 5 years, for concealing a material fact or making a materially false statement. (See <a href="https://www.justice.gov/usam/criminal-resource-manual-903-false-statements-concealment-18-usc-1001" target="_blank">18 U.S.C. 1001</a>)
        </p>
        <div className="usa-alert usa-alert-info">
          <div className="usa-alert-body">
            {this.getAlertBody()}
          </div>
        </div>
        <br/>
        <FormIntroButtons
            route={this.props.route}
            loggedIn={this.props.loggedIn}/>
        <br/>
        {/* TODO: Remove inline style after I figure out why .omb-info--container has a left padding */}
        <div className="omb-info--container" style={{ paddingLeft: 0 }}>
          <OMBInfo resBurden={30} ombNumber="2900-0091" expDate="05/31/2018"/>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    loggedIn: state.user.login.currentlyLoggedIn
  };
}

export default connect(mapStateToProps)(IntroductionPage);

export { IntroductionPage };
