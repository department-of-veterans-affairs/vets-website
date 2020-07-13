// Node modules.
import React from 'react';
import PropTypes from 'prop-types';
import EmergencyBanner from '@department-of-veterans-affairs/formation-react/EmergencyBanner';
import MaintenanceBanner from '@department-of-veterans-affairs/formation-react/MaintenanceBanner';
// Relative imports.
import config from '../../config/maintenanceBanner';
import environment from 'platform/utilities/environment';
import recordEvent from 'platform/monitoring/record-event';

export const Banners = ({
  homepageBannerContent,
  homepageBannerTitle,
  homepageBannerType,
  homepageBannerVisible,
}) => (
  <>
    {/* Homepage Banner */}
    <EmergencyBanner
      content={homepageBannerContent}
      recordEvent={recordEvent}
      title={homepageBannerTitle}
      showClose={!environment.isProduction()}
      type={homepageBannerType}
      visible={homepageBannerVisible === 'true'}
    />

    {/* Maintenance Banner */}
    <MaintenanceBanner
      content={config.content}
      expiresAt={config.expiresAt}
      id={config.id}
      startsAt={config.startsAt}
      title={config.title}
      warnContent={config.warnContent}
      warnStartsAt={config.warnStartsAt}
      warnTitle={config.warnTitle}
    />
  </>
);

Banners.propTypes = {
  homepageBannerContent: PropTypes.string.isRequired,
  homepageBannerTitle: PropTypes.string.isRequired,
  homepageBannerType: PropTypes.string.isRequired,
  homepageBannerVisible: PropTypes.string.isRequired,
};

export default Banners;
