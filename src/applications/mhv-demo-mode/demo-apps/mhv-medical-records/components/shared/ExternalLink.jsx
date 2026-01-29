import React from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { sendDataDogAction } from '../../util/helpers';

export default function ExternalLink({ href, text, ddTag }) {
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
            if (ddTag) sendDataDogAction(ddTag);
          }}
        >
          {text}
        </a>
      ) : (
        <a
          onClick={() => {
            if (ddTag) sendDataDogAction(ddTag);
          }}
          href={href}
          rel="noreferrer"
          data-dd-action-name={ddTag}
        >
          {text}
        </a>
      )}
    </>
  );
}

ExternalLink.propTypes = {
  ddTag: PropTypes.string,
  href: PropTypes.string,
  text: PropTypes.string,
};
