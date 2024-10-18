import React from 'react';
import PropTypes from 'prop-types';
import { focusElement } from 'platform/utilities/ui';
import classNames from 'classnames';
import recordEvent from 'platform/monitoring/record-event';

export default function LearnMoreLabel({
  ariaLabel,
  labelFor,
  onClick,
  text,
  buttonId,
  bold,
  buttonClassName,
  dataTestId,
}) {
  let displayText = text && <>{text} </>;
  if (labelFor && text) {
    displayText = (
      <label
        className="vads-u-margin--0 vads-u-margin-right--0p5 vads-u-display--inline-block"
        htmlFor={labelFor}
      >
        {text}
      </label>
    );
  }

  return (
    <span
      data-testid={dataTestId}
      role="button"
      tabIndex="0"
      onKeyDown={() => {}}
      className={classNames(
        buttonClassName,
        'vads-u-margin--0',
        'vads-u-display--inline-block',
        {
          'vads-u-font-weight--bold': bold,
        },
      )}
      onClick={() => {
        focusElement(labelFor);
        recordEvent({
          event: 'cta-button-click',
          'button-click-label': `${ariaLabel || labelFor}`,
          'button-type': 'link',
        });
      }}
    >
      {bold ? <strong>{displayText}</strong> : displayText}
      <span
        className={classNames('vads-u-margin--0 vads-u-display--inline-block', {
          'vads-u-font-weight--bold': bold,
        })}
      >
        (
        {/* eslint-disable-next-line @department-of-veterans-affairs/prefer-button-component, react/button-has-type */}
        <button
          id={buttonId}
          aria-label={ariaLabel}
          type="button"
          className={classNames(
            buttonClassName,
            'va-button-link learn-more-button vads-u-margin--0',
          )}
          onClick={onClick}
        >
          Learn more
        </button>
        )
      </span>
    </span>
  );
}
LearnMoreLabel.propTypes = {
  ariaLabel: PropTypes.string,
  bold: PropTypes.bool,
  buttonClassName: PropTypes.string,
  buttonId: PropTypes.string,
  dataTestId: PropTypes.string,
  labelFor: PropTypes.string,
  text: PropTypes.any,
  onClick: PropTypes.func,
};
