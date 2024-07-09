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
        <span className="vads-u-height--full vads-u-margin-right--1">
          <div style={{ position: 'relative', display: 'inline-block' }}>
            <div
              aria-hidden="true"
              style={{
                position: 'absolute',
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                backgroundColor: 'var(--vads-u-color--primary-alt-lightest)',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
              }}
            />
            <va-icon
              icon={icon}
              size={3}
              srtext={icon}
              className="vads-u-color--primary-alt-lightest"
              aria-hidden="true"
            />
          </div>
        </span>

        <span>
          {`${firstWords} `}
          <span style={{ whiteSpace: 'nowrap' }}>
            {lastWord}
            {boldText ? (
              <va-icon
                icon="navigate_next"
                size={2}
                className="vads-u-margin-left--1"
              />
            ) : null}
          </span>
        </span>
        {dotIndicator && (
          <Toggler
            toggleName={Toggler.TOGGLE_NAMES.myVaNotificationDotIndicator}
          >
            <Toggler.Enabled>
              <svg
                viewBox="0 0 100 100"
                width="25px"
                height="25px"
                xmlns="http://www.w3.org/2000/svg"
                className="vads-u-height--full vads-u-margin-left--1"
                data-testid="icon-cta-link-dot-indicator"
              >
                <circle cx="50" cy="55" r="20" fill="#b50909" />
              </svg>
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
