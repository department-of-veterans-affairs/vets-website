import React from 'react';
import PropTypes from 'prop-types';
import { Toggler } from '~/platform/utilities/feature-toggles';
import useLastWord from '../useLastWord';

const IconCTALink = ({
  ariaLabel,
  href,
  text,
  // icon should be a valid Font Awesome 5 icon name
  icon,
  onClick,
  boldText,
  newTab,
  // optional data-testid HTML attribute
  testId,
  dotIndicator,
}) => {
  const [lastWord, firstWords] = useLastWord(text);

  const linkClass = `vads-u-padding-y--2p5 cta-link vads-u-font-weight--${
    boldText ? 'bold' : 'normal'
  }`;

  const relProp = newTab ? 'noreferrer noopener' : undefined;
  const targetProp = newTab ? '_blank' : undefined;

  return (
    <a
      aria-label={ariaLabel ? `${ariaLabel}` : ''}
      href={href}
      rel={relProp}
      target={targetProp}
      onClick={onClick || undefined}
      className={linkClass}
      data-testid={testId || ''}
    >
      <span className="vads-u-display--flex">
        <span className="fa-stack fa-sm vads-u-height--full vads-u-margin-right--1">
          <i
            aria-hidden="true"
            className="fas fa-circle fa-stack-2x vads-u-color--primary-alt-lightest"
          />
          <i aria-hidden="true" className={`fas fa-${icon} fa-stack-1x`} />
        </span>
        <span>
          {`${firstWords} `}
          <span style={{ whiteSpace: 'nowrap' }}>
            {lastWord}
            {boldText ? (
              <i
                aria-hidden="true"
                className="fas fa-xs fa-chevron-right vads-u-margin-left--1"
              />
            ) : null}
          </span>
        </span>
        {dotIndicator && (
          <Toggler
            toggleName={Toggler.TOGGLE_NAMES.myVaNotificationDotIndicator}
          >
            <Toggler.Enabled>
              <span
                data-testid="icon-cta-link-dot-indicator"
                className="fa-stack fa-sm vads-u-height--full vads-u-margin-left--1"
              >
                <i
                  aria-hidden="true"
                  className="fas fa-xs fa-stack-1x vads-u-height--full fa-circle vads-u-color--secondary-dark"
                />
              </span>
            </Toggler.Enabled>
          </Toggler>
        )}
      </span>
    </a>
  );
};

IconCTALink.propTypes = {
  ariaLabel: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  boldText: PropTypes.bool,
  dotIndicator: PropTypes.bool,
  href: PropTypes.string,
  icon: PropTypes.string,
  newTab: PropTypes.bool,
  testId: PropTypes.string,
  text: PropTypes.string,
  onClick: PropTypes.func,
};

export default IconCTALink;
