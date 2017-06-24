import React from 'react';
import PropTypes from 'prop-types';

import ProgressButton from '../../common/components/form-elements/ProgressButton';

class FormIntroButtons extends React.Component {
  componentWillReceiveProps = (newProps) => {
    if (!this.props.returnUrl && newProps.returnUrl) {
      // Navigate to the last page they were on
      // TODO: The props haven't updated with the metadata yet...
      this.props.router.push(newProps.returnUrl);
      // TODO: Handle this scenario:
      //  1) I fill out some information and save my progress.
      //  2) The form is updated and a field I've not filled out yet gets moved
      //     to a page I have already completed.
      //  3) I load my saved progress.
      //  4) I should be put in the page with the missing information.
    }
  }

  goToBeginning = () => {
    this.props.router.push(this.props.route.pageList[1].path);
  }

  handleLoadPrefill = () => {
    if (this.props.prefillAvailable) {
      this.props.fetchInProgressForm(this.props.formId, this.props.migrations, true);
    } else {
      this.goToBeginning();
    }
  }

  handleLoadForm = () => {
    // If successful, this will set form.loadedData.metadata.returnUrl and will
    //  trickle down to this.props to be caught in componentWillReceiveProps
    this.props.fetchInProgressForm(this.props.formId, this.props.migrations);
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
            onButtonClick={this.handleLoadPrefill}
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
  returnUrl: PropTypes.string,
  fetchInProgressForm: PropTypes.func.isRequired,
  router: PropTypes.object.isRequired,
  formSaved: PropTypes.bool.isRequired,
  prefillAvailable: PropTypes.bool.isRequired
};

export default FormIntroButtons;
