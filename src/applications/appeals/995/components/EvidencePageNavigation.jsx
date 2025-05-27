import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import FormNavButtons from 'platform/forms-system/src/js/components/FormNavButtons';

export const EvidencePageNavigation = ({ path, content, handlers }) => (
  <>
    <div className="vads-u-margin-top--2">
      <Link
        to={path}
        onClick={handlers.onAddAnother}
        className="vads-c-action-link--green"
      >
        {content.addAnotherLink}
      </Link>
    </div>

    <div className="vads-u-margin-top--4">
      {content.contentBeforeButtons}
      <FormNavButtons
        goBack={handlers.onGoBack}
        goForward={handlers.onGoForward}
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
