import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { showFeedbackForm } from '../actions'

function FeedbackForm() {
  return (
    <div className="feedback-form">
      <div className="row va-flex">
        <div className="feedback-widget-form" style={{ }}>
          <label>What can we do to make Vets.gov better?</label>
          <textarea/>
          <input id="send-feedback-response" type="checkbox"/>
          <label for="send-feedback-response">I would like to receive a response about my feedback.</label>
        </div>
        <div className="feedback-widget-need-help">
          <h3>Need help?</h3>
          Calls the Vets.gov Help Desk<br/>
          <a href="tel:18555747286">1-855-574-7286</a><br/>
          TTY:&nbsp;<a href="tel:+18008778339">1-800-877-8339</a><br/>
          Monday – Friday, 8:00 a.m. – 8:00 p.m. (<abbr title="eastern time">ET</abbr>)
        </div>
      </div>
    </div>
  )
}


class Main extends React.Component {

  static propTypes = {};

  render(){
    let content = null;

    if (this.props.feedbackState.isOpen) {
      content = <FeedbackForm/>
    } else {
      content = (
        <div className="row">
          <div className="usa-grid-full">
            <div className="usa-width-one-half">
              <p className="feedback-widget-intro">
                We are always looking for ways to make Vets.gov better.
              </p>
            </div>
            <div className="usa-width-one-half">
              <button onClick={this.props.showFeedbackForm} className="usa-button-secondary feedback-button">Give us feedback</button>
            </div>
          </div>
        </div>
      )
    }

    return (
      <div className="feedback-widget">
        <div className="row">
          <h4 className="feedback-widget-title">Tell us what you think</h4>
        </div>
        {content}
      </div>
    )
  }
}

function mapStateToProps(state, ownProps) {
  return {
    user: state.user,
    feedbackState: state.feedback
  };
}

function mapDispatchToProps(dispatch, ownProps) {
  return {
    showFeedbackForm(){
      return dispatch(showFeedbackForm());
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Main);

export { Main }