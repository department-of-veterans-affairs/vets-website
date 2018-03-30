import React from 'react';
import moment from 'moment';
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
    const { submission, data } = this.props.form;
    const { response } = submission;
    const name = data.veteranFullName;

    return (
      <div>
        <h3 className="confirmation-page-title">Claim received</h3>
        <p>We usually process claims within <strong>a week</strong>.</p>
        <p>
          We may contact you for more information or documents.<br/>
          <i>Please print this page for your records.</i>
        </p>
        <div className="inset">
          <h4>cool-party Claim <span className="additional">(Form c00L)</span></h4>
          <span>for {name.first} {name.middle} {name.last} {name.suffix}</span>

          {response && <ul className="claim-list">
            <li>
              <strong>Date received</strong><br/>
              <span>{moment(response.timestamp).format('MMM D, YYYY')}</span>
            </li>
          </ul>}
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
