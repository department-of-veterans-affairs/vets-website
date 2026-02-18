import React from 'react';
import PropTypes from 'prop-types';

export default function AppointmentHeading({ backlink, heading, infoText }) {
  return (
    <div>
      <div className="vaos-hide-for-print mobile:vads-u-margin-bottom--0 mobile-lg:vads-u-margin-bottom--1 medium-screen:vads-u-margin-bottom--2">
        <nav aria-label="backlink" className="vads-u-padding-y--2 ">
          <va-link
            back
            aria-label="Back link"
            data-testid="back-link"
            text={backlink.text}
            href={backlink.href}
            onClick={backlink?.onClick}
          />
        </nav>
      </div>
      {heading && <h1 className="vads-u-margin-y--2p5">{heading}</h1>}
      {infoText && <p>{infoText}</p>}
    </div>
  );
}

AppointmentHeading.propTypes = {
  backlink: PropTypes.shape({
    text: PropTypes.string.isRequired,
    href: PropTypes.string.isRequired,
    onClick: PropTypes.func,
  }).isRequired,
  heading: PropTypes.string,
  infoText: PropTypes.string,
};
