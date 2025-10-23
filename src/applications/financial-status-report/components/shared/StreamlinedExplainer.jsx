import React from 'react';
import PropTypes from 'prop-types';
import ExplainerComponent from './ExplainerComponent';

const StreamlinedExplainer = ({
  contentBeforeButtons,
  contentAfterButtons,
  goBack,
  goForward,
}) => {
  return (
    <ExplainerComponent
      headline="You can skip questions on this form"
      strongMessage="Based on your responses so far, you’re tentatively eligible for debt relief. We don’t need to ask you any more questions."
      detailMessage="After you submit your request, we’ll mail you a letter with more details."
      contentBeforeButtons={contentBeforeButtons}
      goBack={goBack}
      goForward={goForward}
      contentAfterButtons={contentAfterButtons}
    />
  );
};

StreamlinedExplainer.propTypes = {
  contentAfterButtons: PropTypes.object,
  contentBeforeButtons: PropTypes.object,
  goBack: PropTypes.func,
  goForward: PropTypes.func,
};

export default StreamlinedExplainer;
