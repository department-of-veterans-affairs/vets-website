import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';

import { focusElement } from 'platform/utilities/ui';
import scrollToTop from 'platform/utilities/ui/scrollToTop';
import { ConfirmationPageContent } from '../../components/ConfirmationPageContent';

function ConfirmationPage(props) {
  // componentDidMount() {
  //   focusElement('.confirmation-page-title');
  //   scrollToTop('topScrollElement');
  // }
  const [isLoading, setIsLoading] = useState(false);
  const { form } = props;
  const { submission, formId } = form;

  useEffect(
    () => {
      focusElement('.confirmation-page-title');
      scrollToTop('topScrollElement');
      setIsLoading(true);
    },
    [isLoading],
  );

  if (isLoading) {
    return (
      <div className="vads-u-margin-y--5">
        <va-loading-indicator label="Loading" message="Loading your results" />
      </div>
    );
  }

  return (
    <ConfirmationPageContent
      formId={formId}
      name={form.data.relativeFullName}
      printHeader="Apply to use transferred education benefits"
      submission={submission}
    />
  );
}

function mapStateToProps(state) {
  return {
    form: state.form,
  };
}

export default connect(mapStateToProps)(ConfirmationPage);
export { ConfirmationPage };
