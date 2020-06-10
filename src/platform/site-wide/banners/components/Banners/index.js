// Node modules.
import React from 'react';
import PropTypes from 'prop-types';
// Relative imports.
import HomepageBanner from '../HomepageBanner';
import MaintenanceBanner from '../MaintenanceBanner';
import './styles.scss';

export const Banners = ({
  homepageBannerContent,
  homepageBannerTitle,
  homepageBannerType,
  homepageBannerVisible,
}) => (
  <>
    {/* Homepage Banner */}
    <HomepageBanner
      content={homepageBannerContent}
      title={homepageBannerTitle}
      type={homepageBannerType}
      visible={homepageBannerVisible === 'true'}
    />

    {/* Maintenance Banner */}
    <MaintenanceBanner />
  </>
);

Banners.propTypes = {
  homepageBannerContent: PropTypes.string.isRequired,
  homepageBannerTitle: PropTypes.string.isRequired,
  homepageBannerType: PropTypes.string.isRequired,
  homepageBannerVisible: PropTypes.string.isRequired,
};

export default Banners;
