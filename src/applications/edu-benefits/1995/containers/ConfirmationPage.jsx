import React from 'react';
import { connect } from 'react-redux';

import { scrollToTop } from 'platform/utilities/scroll';
import { focusElement } from 'platform/utilities/ui';
import PropTypes from 'prop-types';
import { benefitsLabelsUpdate } from '../../utils/labels';
import { ConfirmationPageContent } from '../../components/ConfirmationPageContent';

class ConfirmationPage extends React.Component {
  componentDidMount() {
    focusElement('.confirmation-page-title');
    scrollToTop('topScrollElement');
  }

  render() {
    const { form } = this.props;
    const { submission, formId } = form;
    const { benefit } = form.data;

    return (
      <ConfirmationPageContent
        claimInfoListItems={[
          <li key="benefit">
            <strong>Benefit to be transferred</strong>
            <br />
            {benefitsLabelsUpdate[benefit]}
          </li>,
        ]}
        docExplanationHeader="No documents required at this time"
        docExplanation={
          <>
            <p>In the future, you might need:</p>
            <ul>
              <li>Your reserve kicker</li>
              <li>
                Documentation of additional contributions that would increase
                your monthly benefits
              </li>
            </ul>
            <p>
              <a href="/contact-us/">
                You can update your documents online through Ask VA
              </a>
            </p>
          </>
        }
        formId={formId}
        name={form.data.veteranFullName}
        submission={submission}
      />
    );
  }
}

function mapStateToProps(state) {
  return {
    form: state.form,
  };
}

export default connect(mapStateToProps)(ConfirmationPage);
ConfirmationPage.propTypes = {
  form: PropTypes.object,
};

export { ConfirmationPage };
