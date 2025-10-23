import React from 'react';
import PropTypes from 'prop-types';
import ExplainerComponent from '../shared/ExplainerComponent';

const SpouseTransitionExplainer = ({
  contentBeforeButtons,
  contentAfterButtons,
  goBack,
  goForward,
}) => {
  return (
    <ExplainerComponent
      headline="You added a spouse"
      strongMessage="You will now be asked additional questions about your spouse’s
      income and employment. Your spouse is considered a dependent. On the dependents page, include your spouse as a dependent."
      detailMessage="  After you answer these questions, you can continue back to the
      review page."
      contentBeforeButtons={contentBeforeButtons}
      goBack={goBack}
      goForward={goForward}
      contentAfterButtons={contentAfterButtons}
    />
  );
};

SpouseTransitionExplainer.propTypes = {
  contentAfterButtons: PropTypes.object,
  contentBeforeButtons: PropTypes.object,
  goBack: PropTypes.func,
  goForward: PropTypes.func,
};

export default SpouseTransitionExplainer;
