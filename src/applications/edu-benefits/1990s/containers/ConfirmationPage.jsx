import React from 'react';
import { connect } from 'react-redux';

import scrollToTop from 'platform/utilities/ui/scrollToTop';
import { focusElement } from 'platform/utilities/ui';
import { ConfirmationPageContent } from '../../components/ConfirmationPageContent';

export class ConfirmationPage extends React.Component {
  componentDidMount() {
    focusElement('.confirmation-page-title');
    scrollToTop('topScrollElement');
  }
  render() {
    const form = this.props.form;
    const { submission } = form;

    return (
      <ConfirmationPageContent
        formId="VRRAP"
        submission={submission}
        printHeader="Apply for the Veteran Rapid Retraining Assistance Program"
        formName="Veteran Rapid Retraining Assistance Program"
        name={form.data['view:applicantInformation'].veteranFullName}
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
