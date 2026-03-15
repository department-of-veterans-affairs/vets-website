import React from 'react';
import CallToActionWidget from 'applications/static-pages/cta-widget';
import { CTA_WIDGET_TYPES } from 'applications/static-pages/cta-widget/ctaWidgets';

const ServiceAvailabilityBanner = () => {
  return (
    <CallToActionWidget appId={CTA_WIDGET_TYPES.TRACK_YOUR_VRE_BENEFITS} />
  );
};

export default ServiceAvailabilityBanner;
