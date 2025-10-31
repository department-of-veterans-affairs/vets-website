import React from 'react';
import PropTypes from 'prop-types';
import FormNavButtons from 'platform/forms-system/src/js/components/FormNavButtons';
import ActionLink from '../../shared/components/web-component-wrappers/ActionLink';

export const EvidencePageNavigation = ({ path, content, handlers }) => (
  <>
    <div className="vads-u-margin-top--2">
      <ActionLink
        disableAnalytics
        path={path}
        primary
        onClick={handlers.onAddAnother}
        text={content.addAnotherLink}
      />
    </div>

    <div className="vads-u-margin-top--4">
      {content.contentBeforeButtons}
      <FormNavButtons
        goBack={handlers.onGoBack}
        goForward={handlers.onGoForward}
        useWebComponents
      />
      {content.contentAfterButtons}
    </div>
  </>
);

EvidencePageNavigation.propTypes = {
  content: PropTypes.shape({
    addAnotherLink: PropTypes.string,
    contentAfterButtons: PropTypes.element,
    contentBeforeButtons: PropTypes.element,
  }),
  handlers: PropTypes.shape({
    onAddAnother: PropTypes.func,
    onGoBack: PropTypes.func,
    onGoForward: PropTypes.func,
  }),
  path: PropTypes.string,
};
