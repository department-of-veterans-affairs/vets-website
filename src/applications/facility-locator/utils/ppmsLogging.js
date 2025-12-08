import { dataDogLogger } from 'platform/monitoring/Datadog/utilities';

/**
 * Check if PPMS debug logging is enabled via URL parameter.
 * @returns {boolean} True if ppmsDebug=true is in the URL
 */
export const isPpmsDebugEnabled = () => {
  if (typeof window === 'undefined') {
    return false;
  }
  const searchParams = new URLSearchParams(window.location.search);
  return searchParams.get('ppmsDebug') === 'true';
};

/**
 * Sanitize a single provider object by removing potentially sensitive fields.
 * @param {Object} provider - The provider object from PPMS API response
 * @returns {Object} Sanitized provider object
 */
const sanitizeProvider = provider => {
  if (!provider || !provider.attributes) {
    return provider;
  }

  const { attributes } = provider;

  // Create a copy and remove sensitive fields
  const sanitizedAttributes = { ...attributes };

  // Remove potentially sensitive contact preferences and email
  delete sanitizedAttributes.email;
  delete sanitizedAttributes.prefContact;

  return {
    id: provider.id,
    type: provider.type,
    attributes: sanitizedAttributes,
  };
};

/**
 * Sanitize PPMS API response data to remove any potentially sensitive information
 * while preserving provider identifiers, names, addresses, and location data.
 * @param {Object} responseData - The raw API response data
 * @returns {Object} Sanitized response data safe for logging
 */
export const sanitizePpmsResponse = responseData => {
  if (!responseData) {
    return null;
  }

  const sanitized = {
    meta: responseData.meta,
    links: responseData.links,
  };

  // Sanitize each provider in the data array
  if (Array.isArray(responseData.data)) {
    sanitized.data = responseData.data.map(sanitizeProvider);
  }

  return sanitized;
};

/**
 * Log PPMS API response to Datadog for debugging purposes.
 * Only logs when ppmsDebug=true URL parameter is present.
 * @param {Object} responseData - The API response data to log
 * @param {Object} searchParams - Search parameters used for the request
 */
export const logPpmsResponse = (responseData, searchParams = {}) => {
  if (!isPpmsDebugEnabled()) {
    return;
  }

  const sanitizedData = sanitizePpmsResponse(responseData);

  // Remove any user-provided address from search params to avoid logging PII
  const safeSearchParams = { ...searchParams };
  delete safeSearchParams.address;

  const providerCount = sanitizedData?.data?.length || 0;

  dataDogLogger({
    message: 'PPMS Community Care Provider Response',
    attributes: {
      ppmsDebug: true,
      providerCount,
      locationType: safeSearchParams.locationType,
      serviceType: safeSearchParams.serviceType,
      bounds: safeSearchParams.bounds,
      page: safeSearchParams.page,
      providers: sanitizedData?.data || [],
      pagination: sanitizedData?.meta?.pagination || null,
    },
    status: 'info',
  });
};
