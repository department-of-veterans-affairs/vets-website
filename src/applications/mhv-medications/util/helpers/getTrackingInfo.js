import { trackingConfig } from '../constants';

export const getTrackingUrl = (carrier, trackingNumber) => {
  const config = trackingConfig[carrier?.toLowerCase()];
  return config && trackingNumber
    ? `${config.url}${encodeURIComponent(trackingNumber)}`
    : null;
};

export const getCarrierLabel = carrier => {
  const config = trackingConfig[carrier?.toLowerCase()];
  return config ? config.label : carrier;
};
