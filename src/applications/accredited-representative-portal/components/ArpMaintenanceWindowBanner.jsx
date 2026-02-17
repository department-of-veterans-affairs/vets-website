import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import {
  isAfter,
  isBefore,
  parseISO,
  subHours,
  differenceInHours,
} from 'date-fns';
import { apiRequest } from 'platform/utilities/api';
import { externalServices } from 'platform/monitoring/DowntimeNotification';

/**
 * Finds the soonest maintenance window across all subscribed services
 * @param {Array} windows - Array of maintenance window objects from API
 * @param {Array<string>} services - Services to filter by
 * @returns {Object|null} The soonest maintenance window or null
 */
function findSoonestWindow(windows, services) {
  const now = new Date();
  const relevantWindows = windows.filter(window => {
    const { externalService, startTime, endTime } = window.attributes || window;
    if (!services.includes(externalService)) {
      return false;
    }

    const start = parseISO(startTime);
    const end = parseISO(endTime);

    // Include if:
    // 1. Maintenance is currently active (started and not ended)
    // 2. Maintenance is approaching (within 24 hours)
    const isActive = isAfter(now, start) && isBefore(now, end);
    const isApproaching =
      isBefore(now, start) && isAfter(now, subHours(start, 24));

    return isActive || isApproaching;
  });

  // Return the window with the earliest start time
  if (relevantWindows.length === 0) {
    return null;
  }

  return relevantWindows.reduce((soonest, current) => {
    const currentStart = parseISO(
      current.attributes?.startTime || current.startTime,
    );
    const soonestStart = parseISO(
      soonest.attributes?.startTime || soonest.startTime,
    );
    return currentStart < soonestStart ? current : soonest;
  });
}

/**
 * Component that fetches maintenance windows from /maintenance_windows/ endpoint
 * and displays them using the va-maintenance-banner web component.
 *
 * Subscribes to specific services to show maintenance notifications for the
 * Accredited Representative Portal.
 *
 * @component
 * @param {Array<string>} services - Array of service names to subscribe to maintenance windows for
 * @param {string} bannerId - Unique ID for the banner instance
 * @example
 * <ArpMaintenanceWindowBanner
 *   services={['global', 'logingov', 'lighthouseBenefitsClaims']}
 *   bannerId="arp-maintenance-banner"
 * />
 */
const ArpMaintenanceWindowBanner = ({
  services = [
    externalServices.accreditedRepresentativePortal,
    externalServices.global,
    externalServices.idme,
    externalServices.logingov,
    externalServices.lighthouseBenefitsClaims,
    externalServices.lighthouseBenefitsIntake,
    externalServices.mvi,
    externalServices.vaProfile,
  ],
  bannerId = 'arp-banner',
}) => {
  const [maintenanceWindow, setMaintenanceWindow] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMaintenanceWindows = async () => {
      try {
        setLoading(true);
        const response = await apiRequest('/maintenance_windows/');
        const windows = response.data || [];
        // Find the soonest maintenance window for our subscribed services
        const relevantWindow = findSoonestWindow(windows, services);
        setMaintenanceWindow(relevantWindow);
        setError(null);
      } catch (err) {
        // Log error but don't break the app
        // eslint-disable-next-line no-console
        console.error('Error fetching maintenance windows:', err);
        setError(err);
        setMaintenanceWindow(null);
      } finally {
        setLoading(false);
      }
    };

    fetchMaintenanceWindows();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading || error || !maintenanceWindow) {
    return null;
  }

  const { startTime, endTime } = maintenanceWindow.attributes;
  const start = parseISO(startTime);
  const end = parseISO(endTime);

  // Calculate duration in hours
  const durationHours = differenceInHours(end, start, {
    roundingMethod: 'round',
  });

  // Determine warning start time (12 hours before maintenance starts)
  const warnStartsAt = subHours(start, 12);

  // Generate maintenance content
  const maintenanceTitle = 'Site maintenance';
  const maintenanceContent =
    "We're working on the Accredited Representative Portal right now. If you have trouble signing in, check back after we're finished. Thank you for your patience.";

  const warnTitle = 'Upcoming site maintenance';
  const warnContent = `We'll be doing some work on the Accredited Representative Portal. The maintenance will last ${durationHours} hour${
    durationHours > 1 ? 's' : ''
  }. During that time, you may not be able to sign in.`;

  return (
    <div className="arp-maintenance-window-banner">
      <va-maintenance-banner
        banner-id={bannerId}
        maintenance-end-date-time={endTime}
        maintenance-start-date-time={startTime}
        maintenance-title={maintenanceTitle}
        upcoming-warn-title={warnTitle}
        upcoming-warn-start-date-time={warnStartsAt}
      >
        <div slot="warn-content">
          <span>{warnContent}</span>
        </div>
        <div slot="maintenance-content">
          <span>{maintenanceContent}</span>
        </div>
      </va-maintenance-banner>
    </div>
  );
};

ArpMaintenanceWindowBanner.propTypes = {
  /** Unique ID for the banner instance */
  bannerId: PropTypes.string,
  /** Array of service names to subscribe to maintenance windows for */
  services: PropTypes.arrayOf(PropTypes.string),
};

export default ArpMaintenanceWindowBanner;
