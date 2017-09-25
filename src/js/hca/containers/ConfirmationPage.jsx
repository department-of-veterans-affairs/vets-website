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

class ConfirmationPage extends React.Component {
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
          <p>We are processing your application. The Department of Veterans Affairs will contact you when we finish our review.</p>
          {time &&
            <div className="success-alert-box">
              <p className="success-copy">Form submitted: {moment(time).format('MMMM D, YYYY, h:mm a')}</p>
            </div>
          }
          <p>Please print this page for your records.</p>
          <p>If you have questions, call 1-877-222-VETS (8387) and press 2.</p>
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
export { ConfirmationPage };
