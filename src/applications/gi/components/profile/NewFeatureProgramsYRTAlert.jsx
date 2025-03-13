import React from 'react';
import PropTypes from 'prop-types';
import scrollTo from 'platform/utilities/ui/scrollTo';
import { getScrollOptions, focusElement } from 'platform/utilities/ui';
import { VaAlert } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

export default function NewFeatureProgramsYRTAlert({
  institution,
  toggleValue,
  toggleGiProgramsFlag,
  programTypes,
  visible,
  onClose,
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
      <h2 id="track-your-status-on-mobile" slot="headline">
        {institution.yr === true &&
        toggleValue &&
        programTypes?.length > 0 &&
        toggleGiProgramsFlag
          ? 'New features'
          : 'New feature'}
      </h2>
      <p className="vads-u-margin-y--0">
        Go to “On this page” directory or click{' '}
        {institution.yr === true &&
          toggleValue && (
            <>
              <a
                href="#yellow-ribbon-program-information"
                onClick={e =>
                  handleLinkClick(e, 'yellow-ribbon-program-information')
                }
              >
                Yellow Ribbon Program information
              </a>
              {programTypes?.length > 0 && ' and '}
            </>
          )}{' '}
        {programTypes?.length > 0 &&
          toggleGiProgramsFlag && (
            <a href="#programs" onClick={e => handleLinkClick(e, 'programs')}>
              Programs
            </a>
          )}
      </p>
    </VaAlert>
  );
}

NewFeatureProgramsYRTAlert.propTypes = {
  institution: PropTypes.object.isRequired,
  toggleValue: PropTypes.bool.isRequired,
  toggleGiProgramsFlag: PropTypes.bool.isRequired,
  programTypes: PropTypes.array,
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};
