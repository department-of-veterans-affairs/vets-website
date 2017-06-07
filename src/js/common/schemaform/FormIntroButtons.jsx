import React from 'react';
import PropTypes from 'prop-types';

import ProgressButton from '../../common/components/form-elements/ProgressButton';

class FormIntroButtons extends React.Component {
  componentWillMount() {
    // TODO: When the api is available to get a list of all the saved forms, query
    //  for that instead and save it in the redux store

    // Load the form data into the redux store if possible
    // NOTE: This does not fill the data into the form yet; just grabs it and
    //  saves it for later (when we want to fill in the blanks).
    this.props.fetchInProgressForm(this.props.form.formId, this.props.form.migrations);
  }

  // Load the form data again if we weren't logged in before but are now.
  componentWillReceiveProps(newProps) {
    // Ugh. So verbose.
    let wasLoggedIn;
    let isLoggedIn;
    try {
      wasLoggedIn = this.props.user.login.currentlyLoggedIn;
    } catch (e) {
      if (e instanceof TypeError) {
        // Probably couldn't read a property somewhere along the way
        wasLoggedIn = false;
      }
    }
    try {
      isLoggedIn = newProps.user.login.currentlyLoggedIn;
    } catch (e) {
      if (e instanceof TypeError) {
        isLoggedIn = false;
      }
    }
    if (!wasLoggedIn && isLoggedIn) {
      this.props.fetchInProgressForm(this.props.form.formId, this.props.form.migrations);
    }
  }

  goToBeginning = () => {
    this.props.router.push(this.props.route.pageList[1].path);
  }

  handleLoadForm = () => {
    // This is where we take the formData we pre-loaded in componentWillMount
    //  and fill in the form.
    this.props.loadInProgressDataIntoForm();
    // Navigate to the last page they were on
    this.props.router.push(this.props.form.loadedData.metadata.returnUrl);
    // TODO: Handle this scenario:
    //  1) I fill out some information and save my progress.
    //  2) The form is updated and a field I've not filled out yet gets moved
    //     to a page I have already completed.
    //  3) I load my saved progress.
    //  4) I should be put in the page with the missing information.
  }

  render() {
    let resumeButton = null;
    let firstPageButtonText = 'Continue';
    let firstPageButtonClass = 'usa-button-primary';
    if (this.props.loggedIn && this.props.form.loadedStatus === 'success') {
      firstPageButtonText = 'Start over';
      firstPageButtonClass = 'usa-button-outline';
      resumeButton = (
        <ProgressButton
            onButtonClick={this.handleLoadForm}
            buttonText="Resume previous application"
            buttonClass="usa-button-primary"/>
      );
    }

    return (
      <div>
        {resumeButton}
        <ProgressButton
            onButtonClick={this.goToBeginning}
            buttonText={firstPageButtonText}
            buttonClass={firstPageButtonClass}
            afterText="»"/>
      </div>
    );
  }
}

FormIntroButtons.propTypes = {
  route: PropTypes.object.isRequired,
  form: PropTypes.object.isRequired,
  loggedIn: PropTypes.bool.isRequired,
  fetchInProgressForm: PropTypes.func.isRequired,
  loadInProgressDataIntoForm: PropTypes.func.isRequired,
  router: PropTypes.object.isRequired
};

export default FormIntroButtons;
