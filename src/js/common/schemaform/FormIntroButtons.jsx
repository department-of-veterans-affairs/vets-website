import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import { loadFormData, loadData } from './actions';
import ProgressButton from '../../common/components/form-elements/ProgressButton';

class FormIntroButtons extends React.Component {
  componentWillMount() {
    // TODO: When the api is available to get a list of all the saved forms, query
    //  for that instead and save it in the redux store

    // Load the form data into the redux store if possible
    // NOTE: This does not fill the data into the form yet; just grabs it and
    //  saves it for later (when we want to fill in the blanks).
    this.props.loadFormData(this.props.form.formId, this.props.form.migrations);
  }

  goToBeginning = () => {
    this.props.router.push(this.props.route.pageList[1].path);
  }

  handleLoadForm = () => {
    // This is where we take the formData we pre-loaded in componentWillMount
    //  and fill in the form.
    this.props.loadData();
  }

  render() {
    // console.log('props:', this.props);
    // console.log(`logggedIn: ${this.props.loggedIn}, loadedStatus: ${this.props.form.loadedStatus}`);
    let resumeButton = null;
    let firstPageButtonText = 'Continue';
    let firstPageButtonClass = 'usa-button-primary';
    if (this.props.loggedIn && this.props.form.loadedStatus === 'success') {
      firstPageButtonText = 'Start over';
      firstPageButtonClass = 'usa-button-outline';
      resumeButton = (
        <div className="small-6 usa-width-five-twelfths medium-5 columns">
          <ProgressButton
              onButtonClick={this.handleLoadForm}
              buttonText="Resume previous application"
              buttonClass="usa-button-primary"/>
        </div>
      );
    }

    // <div className="row progress-box progress-box-schemaform form-progress-buttons schemaform-buttons">
    return (
      <div className="row">
        {resumeButton}
        <div className="small-6 usa-width-five-twelfths medium-5 columns">
          <ProgressButton
              onButtonClick={this.goToBeginning}
              buttonText={firstPageButtonText}
              buttonClass={firstPageButtonClass}
              afterText="»"/>
        </div>
      </div>
    );
  }
}

FormIntroButtons.propTypes = {
  route: PropTypes.object.isRequired,
  form: PropTypes.object.isRequired,
  loggedIn: PropTypes.bool.isRequired
};

function mapStateToProps(state) {
  return {
    // TODO: When we get the ability to query for all saved forms, add the list here
    form: state.form
  };
}

const mapDispatchToProps = {
  loadFormData,
  loadData
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(FormIntroButtons));
