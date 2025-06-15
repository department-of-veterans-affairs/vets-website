import React from 'react';
import PropTypes from 'prop-types';
import { focusElement } from 'platform/utilities/ui/focus';
import { getScrollOptions, scrollTo } from 'platform/utilities/scroll';
import { VaAlert } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

export default function NewFeatureProgramsYRTAlert({
  institution,
  programTypes,
  visible,
  onClose,
  customHeadline,
  customParagraph,
}) {
  const handleLinkClick = (event, targetId) => {
    event.preventDefault();
    scrollTo(targetId, getScrollOptions());
    const sectionHeading = document.querySelector(`#${targetId} h2`);
    if (sectionHeading) {
      focusElement(sectionHeading);
    }
  };

  return (
    <VaAlert
      closeBtnAriaLabel="Close notification"
      className="vads-u-margin-bottom--4"
      closeable
      onCloseEvent={onClose}
      status="info"
      visible={visible}
    >
      {customHeadline ? (
        <h2 id="track-your-status-on-mobile" slot="headline">
          {customHeadline}
        </h2>
      ) : (
        <>
          <h2 id="track-your-status-on-mobile" slot="headline">
            {institution.yr === true && programTypes.length > 0
              ? 'New features'
              : 'New feature'}
          </h2>
          <p>We've added new details for institutions:</p>
        </>
      )}
      {customParagraph ? (
        <p className="vads-u-margin-y--0">{customParagraph}</p>
      ) : (
        <p className="vads-u-margin-y--0">
          {institution.yr === true && (
            <a
              href="#yellow-ribbon-program-information"
              onClick={e =>
                handleLinkClick(e, 'yellow-ribbon-program-information')
              }
            >
              <ul>
                <li>Learn about Yellow Ribbon Program information</li>
              </ul>
            </a>
          )}{' '}
          {programTypes.length > 0 && (
            <a href="#programs" onClick={e => handleLinkClick(e, 'programs')}>
              <ul>
                <li> Learn about approved programs of study</li>
              </ul>
            </a>
          )}
        </p>
      )}
    </VaAlert>
  );
}

NewFeatureProgramsYRTAlert.propTypes = {
  institution: PropTypes.object,
  programTypes: PropTypes.array,
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  customHeadline: PropTypes.node,
  customParagraph: PropTypes.node,
};

NewFeatureProgramsYRTAlert.defaultProps = {
  institution: {},
  programTypes: [],
  customHeadline: null,
  customParagraph: null,
};
