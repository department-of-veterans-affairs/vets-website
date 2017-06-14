import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { focusElement } from '../../common/utils/helpers';
import OMBInfo from '../../common/components/OMBInfo';
import LoginModal from '../../common/components/LoginModal';
import FormTitle from '../../common/schemaform/FormTitle';
import FormIntroButtons from '../../common/schemaform/FormIntroButtons';

import { updateLogInUrl } from '../../login/actions';
import { fetchInProgressForm } from '../../common/schemaform/save-load-actions';


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

  // TODO: Add shouldComponentUpdate(); it renders like 14 times upon page refresh

  getAlertBody = () => {
    let body = (<div>
      <strong>Note:</strong> You are now able save a form in progress, and come back to finish it later. To be able to save your form in progress, please <a onClick={this.openLoginModal}>sign in</a>.
      <LoginModal
          onClose={this.closeLoginModal}
          visible={this.state.modalOpened}
          user={this.props.user}
          onUpdateLoginUrl={this.props.updateLogInUrl}/>
    </div>);

    if (this.props.user.login.currentlyLoggedIn) {
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
    const { profile } = this.props.user;
    const formSaved = !!(profile && profile.savedForms.includes(this.props.formId));
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
            router={this.props.router}
            formId={this.props.formId}
            returnUrl={this.props.returnUrl}
            migrations={this.props.migrations}
            fetchInProgressForm={this.props.fetchInProgressForm}
            loggedIn={this.props.user.login.currentlyLoggedIn}
            formSaved={formSaved}/>
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
  const { formId, migrations, loadedData } = state.form;
  return {
    formId,
    // TODO: migrations doesn't hook up to anything (nor should it); need to figure out
    //  how to get the migrations from formConfig into here
    migrations,
    returnUrl: loadedData.metadata.returnUrl,
    user: state.user
  };
}

// Copied from src/js/login/containers/Main.jsx
const mapDispatchToProps = {
  fetchInProgressForm,
  updateLogInUrl
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(IntroductionPage));

export { IntroductionPage };
