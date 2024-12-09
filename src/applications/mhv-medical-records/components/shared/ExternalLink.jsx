import React from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';

export default function ExternalLink({ href, text }) {
  const killExternalLinks = useSelector(
    state => state.featureToggles.mhv_medical_records_kill_external_links,
  );

  return (
    <>
      {killExternalLinks ? (
        <a
          href="/"
          onClick={e => {
            e.preventDefault();
          }}
        >
          {text}
        </a>
      ) : (
        <a href={href} rel="noreferrer">
          {text}
        </a>
      )}
    </>
  );
}

ExternalLink.propTypes = {
  href: PropTypes.string,
  text: PropTypes.string,
};
