import React from 'react';
import PropTypes from 'prop-types';
import { FIELD_NAMES } from '@@vap-svc/constants';
import { Link } from 'react-router-dom';
import { VaAlertExpandable } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { NOTIFICATION_CHANNEL_IDS, PROFILE_PATHS } from '../../constants';
import { useContactInfoDeepLink } from '../../hooks';
import { useNotificationSettingsUtils } from '../../hooks/useNotificationSettingsUtils';

const channelDescriptions = {
  [NOTIFICATION_CHANNEL_IDS.EMAIL]: 'email address',
  [NOTIFICATION_CHANNEL_IDS.TEXT]: 'mobile number',
};

const AddYourInfoDescription = ({ channel }) => {
  const description = channelDescriptions[channel.id];

  if (description) {
    return (
      <p className="vads-u-margin-top--0">
        {`Add your ${description} to your profile to manage these ${
          channel.name
        } notification settings:`}
      </p>
    );
  }

  return null;
};

AddYourInfoDescription.propTypes = {
  channel: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
  }).isRequired,
};

const UnavailableItemsList = ({ items }) => {
  return (
    <ul>
      {items.map(item => (
        <li key={item.name}>{item.name}</li>
      ))}
    </ul>
  );
};

UnavailableItemsList.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
    }),
  ).isRequired,
};

const AddYourInfoLink = ({ channel }) => {
  const { generateContactInfoLink } = useContactInfoDeepLink();

  const fieldNames = {
    [NOTIFICATION_CHANNEL_IDS.EMAIL]: FIELD_NAMES.EMAIL,
    [NOTIFICATION_CHANNEL_IDS.TEXT]: FIELD_NAMES.MOBILE_PHONE,
  };

  return (
    <Link
      to={generateContactInfoLink({
        fieldName: fieldNames[channel.id],
        returnPath: encodeURIComponent(PROFILE_PATHS.NOTIFICATION_SETTINGS),
      })}
    >
      {`Add your ${channelDescriptions[channel.id]} to your profile`}
    </Link>
  );
};

AddYourInfoLink.propTypes = {
  channel: PropTypes.shape({
    id: PropTypes.string.isRequired,
  }).isRequired,
};

export const MissingContactInfoExpandable = ({
  showEmailNotificationSettings = false,
}) => {
  const {
    useUnavailableItems,
    missingChannels,
  } = useNotificationSettingsUtils();

  const unavailableItems = useUnavailableItems();

  if (!showEmailNotificationSettings || missingChannels.length !== 1) {
    return null;
  }

  const channel = missingChannels[0];

  return (
    <VaAlertExpandable
      status="info"
      trigger={`Want to manage your ${channel.name} notification settings?`}
    >
      <div className="medium-screen:vads-u-padding-x--4 medium-screen:vads-u-padding-bottom--3 vads-u-padding-bottom--1">
        <AddYourInfoDescription channel={channel} />

        <UnavailableItemsList items={unavailableItems} />

        <AddYourInfoLink channel={channel} />
      </div>
    </VaAlertExpandable>
  );
};

MissingContactInfoExpandable.propTypes = {
  showEmailNotificationSettings: PropTypes.bool,
};
