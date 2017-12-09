import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { sendFeedback, clearError } from '../actions';
import DefaultView from '../components/DefaultView';
import FeedbackForm from '../components/FeedbackForm';
import FeedbackSubmitted from '../components/FeedbackSubmitted';

class Main extends React.Component {

  constructor(props) {
    super(props);
    this.revealForm = this.revealForm.bind(this);
    this.state = { formIsVisible: false, requestPending: false };
  }

  revealForm() {
    this.setState({ formIsVisible: true });
  }

  render() {
    let content = null;

    if (this.props.feedbackReceived) {
      content = (
        <FeedbackSubmitted
          shouldSendResponse={this.props.shouldSendResponse}/>
      );
    } else if (!this.state.formIsVisible) {
      content = (
        <DefaultView
          feedbackButtonClicked={this.revealForm}/>
      );
    } else {
      content = (
        <FeedbackForm
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
    user: state.user,
    ...state.feedback
  };
}

function mapDispatchToProps(dispatch) {
  return {
    sendFeedback(values) {
      return dispatch(sendFeedback(values));
    },
    clearError() {
      return dispatch(clearError());
    }
  };
}

Main.propTypes = {
  requestPending: PropTypes.bool,
  feedbackReceived: PropTypes.bool,
  shouldSendResponse: PropTypes.bool,
  sendFeedback: PropTypes.func.isRequired,
  clearError: PropTypes.func.isRequired,
  errorMessage: PropTypes.string
};

export default connect(mapStateToProps, mapDispatchToProps)(Main);

export { Main };
