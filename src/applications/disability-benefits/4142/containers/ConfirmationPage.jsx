import React from 'react';
// import moment from 'moment';
import { connect } from 'react-redux';
import Scroll from 'react-scroll';

// import { focusElement } from '../../../../platform/utilities/ui';

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
    scrollToTop();
  }

  render() {
    // const { submission, data } = this.props.form;
    // const { response } = submission;
    const fullname = data.veteranFullName;

    return (
      <div>
        <h3 className="confirmation-page-title">Claim received</h3>
        <p>We usually process claims within <strong>a week</strong>.</p>
        <p>
          We may contact you for more information or documents.<br/>
          <i>Please print this page for your records.</i>
        </p>
        <div className="inset">
          <h4>Authorization to disclose information Claim <span className="additional">(Form 21-4142)</span></h4>
          <span>for {fullname.first} {fullname.middle} {fullname.last} {fullname.suffix}</span>
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
