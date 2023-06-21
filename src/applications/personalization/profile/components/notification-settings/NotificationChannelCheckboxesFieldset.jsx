import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';

export const NotificationChannelCheckboxesFieldset = ({
  children,
  itemName,
  description,
}) => {
  const legendClasses = classNames(
    'vads-u-font-family--sans',
    'vads-u-font-weight--bold',
    'vads-u-font-size--h4',
    'vads-u-padding--0',
    'vads-u-margin--0',
    'vads-u-margin-top--2',
  );

  return (
    <fieldset>
      <div className="clearfix">
        <legend className="rb-legend vads-u-padding--0">
          <h3 className={legendClasses}>{itemName}</h3>
        </legend>
      </div>
      {description ? (
        <p className="vads-u-margin-y--0p5 vads-u-color--gray-medium">
          {description}
        </p>
      ) : null}
      {children}
    </fieldset>
  );
};

NotificationChannelCheckboxesFieldset.propTypes = {
  children: PropTypes.node.isRequired,
  itemName: PropTypes.string.isRequired,
  description: PropTypes.string,
};
