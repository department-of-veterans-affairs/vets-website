import React from 'react';
import moment from 'moment';
import _ from 'lodash/fp';
import { connect } from 'react-redux';
import Scroll from 'react-scroll';

import { focusElement } from '../../common/utils/helpers';

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
    const time = _.get('form.submission.response.timestamp', this.props);

    return (
      <div>
        <div className="usa-width-one-sixth medium-2 columns">
          <i className="fa fa-check-circle hca-success-icon"></i>
        </div>
        <div className="usa-width-five-sixths medium-10 columns">
          <h4 className="success-copy">You have successfully submitted your application for health care.</h4>
        </div>
        <div>
          <p>
            We are processing your application.<br/>
            The Department of Veterans Affairs will contact you when we finish our review.<br/>
            <i>Please print this page for your records.</i>
          </p>
          {time &&
            <div className="success-alert-box">
              <p className="success-copy">Form submitted: {moment(time).format('MMMM D, YYYY, h:mm a')}</p>
            </div>
          }
          <div className="confirmation-guidance-container">
            <h4 className="confirmation-guidance-heading">What happens after I apply?</h4>
            <p className="confirmation-guidance-message"><a href="/health-care/after-you-apply">Find out what happens after you apply.</a></p>
            <h4 className="confirmation-guidance-heading">Need help?</h4>
            <p className="confirmation-guidance-message">If you have questions, call <a href="tel:+1-877-222-8387">1-877-222-VETS (8387)</a> and press 2.</p>
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    form: state.form
  };
}

export default connect(mapStateToProps)(ConfirmationPage);
