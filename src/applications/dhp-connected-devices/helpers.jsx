import { apiRequest } from 'platform/utilities/api';

export const authorizeWithVendor = async vendorUrl => {
  return apiRequest(vendorUrl, { apiVersion: 'dhp_connected_devices' }).then(
    response => {
      if (response.redirected) {
        window.location.replace(response.url);
      }
    },
  );
};
