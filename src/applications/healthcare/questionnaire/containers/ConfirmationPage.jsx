import React from 'react';
import moment from 'moment';
import { connect } from 'react-redux';
import Scroll from 'react-scroll';

import { focusElement } from 'platform/utilities/ui';

const scroller = Scroll.scroller;
const scrollToTop = () => {
  scroller.scrollTo('topScrollElement', {
    duration: 500,
    delay: 0,
    smooth: true,
  });
};

export class ConfirmationPage extends React.Component {
  componentDidMount() {
    focusElement('.schemaform-title > h1');
    scrollToTop();
  }

  render() {
    const { submission } = this.props.form;
    const { response } = submission;

    return (
      <div>
        <div className="usa-alert usa-alert-info schemaform-sip-alert">
          <div className="usa-alert-body">
            <h4 className="usa-alert-heading">
              Your questionnaire has been sent to your provider.
            </h4>
            <div className="usa-alert-text">
              <p>We look forward to seeing you at your upcoming appointment.</p>
            </div>
          </div>
        </div>

        <div className="inset">
          <h4>Upcoming appointment questionnaire</h4>
          <p>For Person name goes here</p>

          {response && (
            <ul className="claim-list">
              <li>
                <strong>Date received</strong>
                <br />
                <span>{moment(response.timestamp).format('MMM D, YYYY')}</span>
              </li>
              <li>
                <strong>Your information was sent to</strong>
                <br />
                <span>Some cool place that has my stuff</span>
              </li>
            </ul>
          )}
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    form: state.form,
  };
}

export default connect(mapStateToProps)(ConfirmationPage);
