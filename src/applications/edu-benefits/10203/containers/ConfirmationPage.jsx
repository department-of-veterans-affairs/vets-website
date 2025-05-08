import React from 'react';
import { connect } from 'react-redux';

import { focusElement } from '@department-of-veterans-affairs/platform-utilities/ui';
import scrollToTop from '@department-of-veterans-affairs/platform-utilities/scrollToTop';
import { ConfirmationPageContent } from '../../components/ConfirmationPageContent';

class ConfirmationPage extends React.Component {
  componentDidMount() {
    focusElement('.confirmation-page-title');
    scrollToTop('topScrollElement');
  }

  render() {
    const form = this.props.form;
    const { submission, formId } = form;

    return (
      <ConfirmationPageContent
        formId={formId}
        submission={submission}
        printHeader="Apply for the Rogers STEM Scholarship"
        formName="Rogers STEM Scholarship"
        name={form.data.veteranFullName}
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
export { ConfirmationPage };
