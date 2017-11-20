import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { sendFeedback } from '../actions'
import DefaultView from '../components/DefaultView'
import FeedbackForm from '../components/FeedbackForm'
import FeedbackSubmitted from '../components/FeedbackSubmitted'

class Main extends React.Component {

  constructor(){
    super();
    this.revealForm = this.revealForm.bind(this);
    this.state = { formIsVisible: false, requestPending: false };
  }

  revealForm(){
    this.setState({ formIsVisible: true });
  }

  render(){
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
          requestPending={this.props.requestPending}/>
      );
    }

    return (
      <div className="feedback-widget">
        <div className="row">{content}</div>
      </div>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    user: state.user,
    ...state.feedback
  };
}

function mapDispatchToProps(dispatch, ownProps) {
  return {
    sendFeedback(values){
      return dispatch(sendFeedback(values));
    }
  }
}

Main.propTypes = {
  requestPending: PropTypes.bool,
  feedbackReceived: PropTypes.bool,
  shouldSendResponse: PropTypes.bool,
  sendFeedback: PropTypes.func.isRequired
}

export default connect(mapStateToProps, mapDispatchToProps)(Main);

export { Main }
