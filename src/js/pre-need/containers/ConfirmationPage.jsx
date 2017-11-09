import React from 'react';
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
    focusElement('.confirmation-page-title');
    scrollToTop();
  }

  render() {
    return (
      <div>
        <h3 className="confirmation-page-title">Application received</h3>

        <p>
          You’ve successfully submitted your application for a pre-need eligibility determination for burial in a VA national cemetery. Please print or save this page for your records.
        </p>
        <p>
          We usually process claims within <strong>90 days</strong>. We’ll let you know by mail or phone (if you provided your phone number) if we need more information.
        </p>
        <p>
          <a href="/burials-and-memorials/pre-need/after-you-apply/">Learn more about what happens after you apply.</a>
        </p>

        <h4>Want to save a copy of your application for your records?</h4>

        <button>Download now</button>
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
