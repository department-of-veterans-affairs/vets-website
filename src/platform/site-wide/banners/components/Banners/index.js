// Node modules.
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import * as Sentry from '@sentry/browser';
import EmergencyBanner from '@department-of-veterans-affairs/component-library/EmergencyBanner';
import MaintenanceBanner from '@department-of-veterans-affairs/component-library/MaintenanceBanner';
// Relative imports.
import config from '../../config/maintenanceBanner';
import recordEvent from 'platform/monitoring/record-event';
import { apiRequest } from 'platform/utilities/api';

const EMERGENCY_BANNER_CONFIG_URL =
  'https://raw.githubusercontent.com/department-of-veterans-affairs/vagov-content/master/fragments/home/banner.json';

export const Banners = ({
  emergencyBannerContent,
  emergencyBannerTitle,
  emergencyBannerType,
  emergencyBannerVisible,
}) => {
  // Derive the state for the emergency banner.
  const [fetching, setFetching] = useState(false);
  const [content, setContent] = useState(emergencyBannerContent);
  const [title, setTitle] = useState(emergencyBannerTitle);
  const [type, setType] = useState(emergencyBannerType);
  const [visible, setVisible] = useState(emergencyBannerVisible);

  const fetchEmergencyBannerConfig = async () => {
    // Show fetching state.
    setFetching(true);

    try {
      // Fetch the emergency banner content.
      const response = await apiRequest(EMERGENCY_BANNER_CONFIG_URL, {
        mode: 'no-cors',
      });

      // Set the emergency banner content.
      setContent(response?.content);
      setTitle(response?.title);
      setType(response?.type);
      setVisible(response?.visible);
    } catch (error) {
      // If there was an error, log it.
      Sentry.captureException(error);
    }

    // Hide fetching state.
    setFetching(false);
  };

  // Fetch the emergency banner config when the component mounts.
  useEffect(() => {
    fetchEmergencyBannerConfig();
  }, []);

  return (
    <>
      {/* Homepage Banner */}
      {!fetching && (
        <EmergencyBanner
          content={content}
          localStorage={localStorage}
          recordEvent={recordEvent}
          showClose
          title={title}
          type={type}
          visible={visible === 'true'}
        />
      )}

      {/* Maintenance Banner */}
      <MaintenanceBanner
        content={config.content}
        expiresAt={config.expiresAt}
        id={config.id}
        localStorage={localStorage}
        startsAt={config.startsAt}
        title={config.title}
        warnContent={config.warnContent}
        warnStartsAt={config.warnStartsAt}
        warnTitle={config.warnTitle}
      />
    </>
  );
};

Banners.propTypes = {
  emergencyBannerContent: PropTypes.string.isRequired,
  emergencyBannerTitle: PropTypes.string.isRequired,
  emergencyBannerType: PropTypes.string.isRequired,
  emergencyBannerVisible: PropTypes.string.isRequired,
};

export default Banners;
