import React from 'react';
import FormNavButtons from 'platform/forms-system/src/js/components/FormNavButtons';

export default function NavUpdateButton({
  contentBeforeButtons,
  onReviewPage,
  goBack,
  onGoForward,
  contentAfterButtons,
}) {
  return (
    <div className="vads-u-margin-top--4">
      {contentBeforeButtons}
      {!onReviewPage ? (
        <>
          {contentBeforeButtons}
          <FormNavButtons goBack={goBack} goForward={onGoForward} />
          {contentAfterButtons}
        </>
      ) : (
        <va-button text="Update page" onClick={onGoForward} uswds />
      )}
      {contentAfterButtons}
    </div>
  );
}
