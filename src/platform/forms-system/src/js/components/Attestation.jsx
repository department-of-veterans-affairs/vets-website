import React from 'react';
import FormSignature from './FormSignature';
import PropTypes from 'prop-types';

/**
 * Wraps the FormSignature in a gray box and handles the aria-labelledby
 * attribute by default.
 *
 * Example usage in formConfig:
 * presubmitInfo: {
 *   CustomComponent: signatureProps => (
 *     <Attestation heading="Statement of truth" descriptionId="unique-ID-string">
 *       <p>I solemnly swear I am up to no good.</p>
 *     </Attestation>
 *   )
 * }
 */
export const Attestation = ({ children, heading, descriptionId, ...props }) => {
  return (
    <div className="box vads-u-background-color--gray-lightest vads-u-padding-bottom--6 vads-u-padding-x--3 vads-u-padding-top--1px vads-u-margin-bottom--7">
      {typeof heading === 'string' ? <h2>{heading}</h2> : heading}
      <div id="attestation-content">{children}</div>
      <FormSignature {...props} ariaDescribedBy={descriptionId} />
    </div>
  );
};

Attestation.propTypes = {
  ...FormSignature.propTypes,
  children: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.arrayOf(PropTypes.element),
  ]),
  heading: PropTypes.oneOfType([
    PropTypes.string,
    function(props, propName, componentName) {
      if (!/^h[1-6]$/i.test(props[propName]?.type)) {
        return new Error(
          `${componentName} ${propName} only accepts heading elements or strings.`,
        );
      }
      return undefined;
    },
  ]),
};

export default Attestation;
