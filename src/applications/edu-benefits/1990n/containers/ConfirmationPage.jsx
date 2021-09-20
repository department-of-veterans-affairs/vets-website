import React from 'react';
import { connect } from 'react-redux';

import scrollToTop from 'platform/utilities/ui/scrollToTop';
import { focusElement } from 'platform/utilities/ui';
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
        docExplanationHeader="No documents required at this time"
        docExplanation={
          <>
            <p>
              In the future, you might need a copy of your DD 2863 (National
              Call to Service (NCS) Election of Options).
            </p>
            <p>
              Documents can be uploaded using the{' '}
              <a href="https://gibill.custhelp.com/app/utils/login_form/redirect/account%252">
                GI Bill site
              </a>
              .
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
export { ConfirmationPage };
