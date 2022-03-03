import React from 'react';
import moment from 'moment';
import { connect } from 'react-redux';
// import Scroll from 'react-scroll';
import PropTypes from 'prop-types';

// import { focusElement } from 'platform/utilities/ui';

// const { scroller } = Scroll;
// const scrollToTop = () => {
//   scroller.scrollTo('topScrollElement', {
//     duration: 500,
//     delay: 0,
//     smooth: true,
//   });
// };

export const ConfirmationPage = ({ form }) => {
  // componentDidMount() {
  //   focusElement('.schemaform-title > h1');
  //   scrollToTop();
  // }

  const { submission, data } = form;
  const { response } = submission;
  const name = data.veteranFullName;

  return (
    <div>
      <h3 className="confirmation-page-title">Claim received</h3>
      <p>
        We usually process claims within <strong>a week</strong>.
      </p>
      <p>
        We may contact you for more information or documents.
        <br />
        <i>Please print this page for your records.</i>
      </p>
      <div className="inset">
        <h4>
          Transferred Education Benefits Claim{' '}
          <span className="additional">(Form 22-1990E)</span>
        </h4>
        {name ? (
          <span>
            for {name.first} {name.middle} {name.last} {name.suffix}
          </span>
        ) : null}

        {response ? (
          <ul className="claim-list">
            <li>
              <strong>Date received</strong>
              <br />
              <span>{moment(response.timestamp).format('MMM D, YYYY')}</span>
            </li>
          </ul>
        ) : null}
      </div>
    </div>
  );
};

function mapStateToProps(state) {
  return {
    form: state.form,
  };
}

export default connect(mapStateToProps)(ConfirmationPage);

ConfirmationPage.propTypes = {
  form: PropTypes.shape({
    data: PropTypes.shape({
      veteranFullName: PropTypes.shape({
        first: PropTypes.string,
        middle: PropTypes.string,
        last: PropTypes.string,
        suffix: PropTypes.string,
      }),
    }),
    submission: PropTypes.shape({
      response: PropTypes.any,
    }),
  }),
};
