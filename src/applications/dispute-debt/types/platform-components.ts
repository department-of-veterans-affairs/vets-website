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
import RoutedSavableApp from 'platform/forms/save-in-progress/RoutedSavableApp';
// Import the base component (before connect) to access PropTypes
// The named export is the base component, default export is the connected one
import { DowntimeNotification as BaseDowntimeNotification } from 'platform/monitoring/DowntimeNotification/containers/DowntimeNotification';

// Infer types from PropTypes - automatically stays in sync with component definitions
export type RoutedSavableAppProps = InferProps<
  typeof RoutedSavableApp.propTypes
>;

export type DowntimeNotificationProps = InferProps<
  typeof BaseDowntimeNotification.propTypes
>;
