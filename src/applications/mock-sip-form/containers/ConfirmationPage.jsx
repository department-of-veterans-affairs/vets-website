import React from 'react';
import moment from 'moment';
import { connect } from 'react-redux';

import { focusElement } from 'platform/utilities/ui';
import { scrollToTop } from 'platform/utilities/scroll';

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
            Mock SIP Form Claim{' '}
            <span className="additional">(Form XX-123)</span>
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
  }
}

function mapStateToProps(state) {
  return {
    form: state.form,
  };
}

export default connect(mapStateToProps)(ConfirmationPage);
