/**
 * Type definitions for platform components
 * These types are automatically inferred from PropTypes using InferProps
 * to stay in sync with the actual component prop definitions.
 * 
 * This file imports the components to access their PropTypes at compile time.
 * 
 * Note: For connected components (Redux), we import the base component
 * (before connect) to access PropTypes, not the connected wrapper.
 */

import type { InferProps } from 'prop-types';
// Import the base component (named export) to access PropTypes
// The default export is the connected/wrapped component which doesn't expose propTypes
import { RoutedSavableApp as BaseRoutedSavableApp } from 'platform/forms/save-in-progress/RoutedSavableApp';
// Import the base component (before connect) to access PropTypes
// The named export is the base component, default export is the connected one
import { DowntimeNotification as BaseDowntimeNotification } from 'platform/monitoring/DowntimeNotification/containers/DowntimeNotification';

// Infer types from PropTypes - automatically stays in sync with component definitions
export type RoutedSavableAppProps = InferProps<
  typeof BaseRoutedSavableApp.propTypes
>;

export type DowntimeNotificationProps = InferProps<
  typeof BaseDowntimeNotification.propTypes
>;

// HOC-injected props that are provided by connect() - these shouldn't be required when using the component
type DowntimeNotificationHOCProps =
  | 'dismissDowntimeWarning'
  | 'getGlobalDowntime'
  | 'getScheduledDowntime'
  | 'initializeDowntimeWarnings'
  | 'globalDowntime'
  | 'isReady'
  | 'isPending'
  | 'shouldSendRequest'
  | 'isDowntimeWarningDismissed'
  | 'status'
  | 'startTime'
  | 'endTime'
  | 'description'
  | 'externalService';

// Public props that consumers should provide (excludes HOC-injected props)
export type DowntimeNotificationPublicProps = Omit<
  DowntimeNotificationProps,
  DowntimeNotificationHOCProps
>;
