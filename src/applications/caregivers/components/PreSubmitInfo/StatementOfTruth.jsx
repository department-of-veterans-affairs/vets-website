import React from 'react';
import PropTypes from 'prop-types';
import { links } from '../../definitions/content';

const StatementOfTruth = ({ content }) => {
  const { label = '', text = [] } = content;
  return (
    <>
      <h3 className="vads-u-margin-top--4">{`${label} statement of truth`}</h3>

      {text.map((copy, idx) => {
        return <p key={`${label}-${idx}`}>{copy}</p>;
      })}

      <p>
        I have read and accept the{' '}
        <a
          href={links.privacyPolicy.link}
          rel="noopener noreferrer"
          target="_blank"
        >
          privacy policy
        </a>
        .
      </p>
    </>
  );
};

StatementOfTruth.propTypes = {
  content: PropTypes.object,
};

export default StatementOfTruth;
