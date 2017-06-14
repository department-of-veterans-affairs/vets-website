import React from 'react';
import PropTypes from 'prop-types';

import ProgressButton from '../../common/components/form-elements/ProgressButton';

class FormIntroButtons extends React.Component {
  goToBeginning = () => {
    this.props.router.push(this.props.route.pageList[1].path);
  }

  handleLoadForm = () => {
    // This is where we take the formData we pre-loaded in componentWillMount
    //  and fill in the form.
    this.props.fetchInProgressForm(this.props.formId, this.props.migrations).then((returnUrl) => {
      // Navigate to the last page they were on
      // TODO: The props haven't updated with the metadata yet...
      this.props.router.push(returnUrl);
      // TODO: Handle this scenario:
      //  1) I fill out some information and save my progress.
      //  2) The form is updated and a field I've not filled out yet gets moved
      //     to a page I have already completed.
      //  3) I load my saved progress.
      //  4) I should be put in the page with the missing information.
    }).catch(() => {
      // TODO: Handle when the loading fails.
      // fetchInProgressForm will have set the loadingStatus already
    });
  }

  render() {
    let resumeButton = null;
    let firstPageButtonText = 'Continue';
    let firstPageButtonClass = 'usa-button-primary';
    if (this.props.formSaved) {
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
  formId: PropTypes.string.isRequired,
  migrations: PropTypes.array.isRequired,
  loggedIn: PropTypes.bool.isRequired,
  fetchInProgressForm: PropTypes.func.isRequired,
  router: PropTypes.object.isRequired,
  formSaved: PropTypes.bool.isRequired
};

export default FormIntroButtons;
