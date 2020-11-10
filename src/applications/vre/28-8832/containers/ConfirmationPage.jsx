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
    const { submission, data } = this.props.form;
    const { isLoggedIn, fullName } = this.props;
    const { response } = submission;
    const name = isLoggedIn ? fullName : data.fullName;

    return (
      <div>
        <p>
          Equal to VA Form 28-8832 (Education/Vocational Counseling Application)
        </p>
        <div className="inset">
          <h2 className="vads-u-font-size--h3 vads-u-margin-top--1">
            Thank you for submitting your application
          </h2>
          <h3 className="vads-u-font-size--h4">
            Education/Vocational Counseling Application{' '}
            <span className="additional">(Form 28-8832)</span>
          </h3>
          {name && (
            <p>
              FOR: {name.first} {name.last}
            </p>
          )}

          {response && (
            <ul className="claim-list">
              <li>
                <strong>Date submitted</strong>
                <br />
                <span>{moment(response.timestamp).format('MMM D, YYYY')}</span>
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
    fullName: state?.user?.profile?.userFullName,
    isLoggedIn: state?.user?.login?.currentlyLoggedIn,
  };
}

export default connect(mapStateToProps)(ConfirmationPage);
