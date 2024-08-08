import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import scrollToTop from 'platform/utilities/ui/scrollToTop';
import { focusElement } from 'platform/utilities/ui';

export class ConfirmationPage extends React.Component {
  componentDidMount() {
    focusElement('h2');
    scrollToTop('topScrollElement');
  }

  render() {
    const { form } = this.props;
    const { formId, data } = form;

    const { fullName } = data;

    return (
      <div className="vads-u-margin-bottom--9">
        <h2 className="vads-u-font-size--h3">
          Your application has been submitted
        </h2>
        <p>We may contact you for more information or documents.</p>
        <p className="screen-only">Please print this page for your records.</p>
        <va-summary-box uswds>
          <h3 slot="headline" className="vads-u-margin-top--0">
            21P-0969 Income and Asset Statement Form Claim{' '}
            <span className="vads-u-font-weight--normal">(Form {formId})</span>
          </h3>
          {fullName ? (
            <span>
              for {fullName.first} {fullName.middle} {fullName.last}
              {fullName.suffix ? `, ${fullName.suffix}` : null}
            </span>
          ) : null}

          <va-button
            uswds
            class="screen-only vads-u-margin-top--2"
            text="Print this page for your records"
            onClick={() => {
              window.print();
            }}
          />
        </va-summary-box>
      </div>
    );
  }
}

ConfirmationPage.propTypes = {
  form: PropTypes.shape({
    data: PropTypes.shape({
      fullName: {
        first: PropTypes.string,
        middle: PropTypes.string,
        last: PropTypes.string,
        suffix: PropTypes.string,
      },
    }),
    formId: PropTypes.string,
    submission: PropTypes.shape({
      timestamp: PropTypes.string,
    }),
  }),
  name: PropTypes.string,
};

function mapStateToProps(state) {
  return {
    form: state.form,
  };
}

export default connect(mapStateToProps)(ConfirmationPage);
