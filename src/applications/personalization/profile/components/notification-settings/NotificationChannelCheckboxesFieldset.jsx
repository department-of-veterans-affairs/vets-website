import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';

export const NotificationChannelCheckboxesFieldset = ({
  children,
  itemName,
  description,
  hasSomeErrorUpdates,
  hasSomePendingUpdates,
  hasSomeSuccessUpdates,
}) => {
  const legendHeadingClasses = classNames(
    'vads-u-font-family--sans',
    'vads-u-font-weight--bold',
    'vads-u-font-size--base',
    'vads-u-padding--0',
    'vads-u-margin--0',
  );

  const fieldsetClasses = classNames(
    'vads-u-position--relative',
    'vads-u-border-left--4px',
    'vads-u-padding-left--1p5',
    'vads-u-padding-bottom--1p5',
    'vads-u-margin-left--neg1p5',
    {
      'vads-u-border-color--white':
        !hasSomeErrorUpdates && !hasSomeSuccessUpdates,
      'vads-u-border-color--green': hasSomeSuccessUpdates,
      'vads-u-border-color--secondary': hasSomeErrorUpdates,
    },
  );

  return (
    <fieldset className={fieldsetClasses} disabled={hasSomePendingUpdates}>
      <legend className="vads-u-padding--0">
        <h3 className={legendHeadingClasses}>{itemName}</h3>
        {description ? (
          <p className="vads-u-margin-y--0p5 vads-u-color--gray-medium vads-u-font-size--base vads-u-font-weight--normal">
            {description}
          </p>
        ) : null}
      </legend>

      {children}
    </fieldset>
  );
};

NotificationChannelCheckboxesFieldset.propTypes = {
  children: PropTypes.node.isRequired,
  itemId: PropTypes.string.isRequired,
  itemName: PropTypes.string.isRequired,
  description: PropTypes.string,
  disabled: PropTypes.bool,
  hasSomeErrorUpdates: PropTypes.bool,
  hasSomePendingUpdates: PropTypes.bool,
  hasSomeSuccessUpdates: PropTypes.bool,
};
