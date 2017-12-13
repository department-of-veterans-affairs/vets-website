import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { revealForm, setFormValues, sendFeedback, clearError } from '../actions';
import DefaultView from '../components/DefaultView';
import FeedbackForm from '../components/FeedbackForm';
import FeedbackSubmitted from '../components/FeedbackSubmitted';

class Main extends React.Component {

  render() {
    let content = null;

    if (this.props.feedbackReceived) {
      content = (
        <FeedbackSubmitted
          shouldSendResponse={this.props.shouldSendResponse}/>
      );
    } else if (!this.props.formIsVisible) {
      content = (
        <DefaultView
          revealForm={this.props.revealForm}/>
      );
    } else {
      content = (
        <FeedbackForm
          formValues={this.props.formValues}
          setFormValues={this.props.setFormValues}
          sendFeedback={this.props.sendFeedback}
          clearError={this.props.clearError}
          requestPending={this.props.requestPending}
          hasError={this.props.hasError}
          errorMessage={this.props.errorMessage}/>
      );
    }

    return (
      <div className="feedback-widget">
        <a className="sr-only" href="#feedback-tool" name="feedback-tool">Give feedback on this page</a>
        <div className="row">{content}</div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    ...state.feedback
  };
}

const mapDispatchToProps = {
  setFormValues,
  revealForm,
  sendFeedback,
  clearError
};

Main.propTypes = {
  requestPending: PropTypes.bool,
  feedbackReceived: PropTypes.bool,
  shouldSendResponse: PropTypes.bool,
  setFormValues: PropTypes.func.isRequired,
  revealForm: PropTypes.func.isRequired,
  sendFeedback: PropTypes.func.isRequired,
  clearError: PropTypes.func.isRequired,
  errorMessage: PropTypes.string
};

export default connect(mapStateToProps, mapDispatchToProps)(Main);

export { Main };
