import React from 'react';
import PropTypes from 'prop-types';
import { links } from '../../definitions/content';

const StatementOfTruth = ({ content }) => {
  const { label = '', text = [] } = content;
  return (
    <>
      <legend className="signature-box--legend vads-u-display--block vads-u-width--full vads-u-font-family--serif vads-u-font-size--h3 vads-u-font-weight--bold">
        {`${label} statement of truth`}
      </legend>

      {text.map((copy, idx) => {
        return (
          <p key={`${label}-${idx}`} data-testid="cg-statement-copy">
            {copy}
          </p>
        );
      })}

      <p data-testid="cg-privacy-copy">
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
