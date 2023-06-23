import React, { useMemo } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';

import { useSelector } from 'react-redux';
import { LOADING_STATES } from '../../../common/constants';

const getChannelsByItemId = (itemId, channelEntities) => {
  return Object.values(channelEntities).filter(
    channel => channel.parentItem === itemId,
  );
};

export const NotificationChannelCheckboxesFieldset = ({
  children,
  itemName,
  description,
  itemId,
}) => {
  const legendClasses = classNames(
    'vads-u-font-family--sans',
    'vads-u-font-weight--bold',
    'vads-u-font-size--h4',
    'vads-u-padding--0',
    'vads-u-margin--0',
  );

  const channelsByItemId = useSelector(state =>
    getChannelsByItemId(
      itemId,
      state?.communicationPreferences?.channels?.entities,
    ),
  );

  const hasSomeSuccessUpdates = useMemo(
    () =>
      channelsByItemId.some(
        channel => channel.ui.updateStatus === LOADING_STATES.loaded,
      ),
    [channelsByItemId],
  );

  const hasSomeErrorUpdates = useMemo(
    () =>
      channelsByItemId.some(
        channel => channel.ui.updateStatus === LOADING_STATES.error,
      ),
    [channelsByItemId],
  );

  const fieldsetClasses = classNames(
    'vads-u-position--relative',
    'vads-u-margin-y--2',
    'vads-u-border-left--4px',
    'vads-u-padding-left--1p5',
    'vads-u-margin-left--neg1p5',
    {
      'vads-u-border-color--white':
        !hasSomeErrorUpdates && !hasSomeSuccessUpdates,
      'vads-u-border-color--green': hasSomeSuccessUpdates,
      'vads-u-border-color--secondary': hasSomeErrorUpdates,
    },
  );

  return (
    <fieldset className={fieldsetClasses}>
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
