import React from 'react';
import { connect } from 'react-redux';

import { focusElement } from 'platform/utilities/ui';
import scrollToTop from 'platform/utilities/ui/scrollToTop';
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
        name={form.data.relativeFullName}
        printHeader={'Apply to use transferred education benefits'}
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
export { ConfirmationPage };
