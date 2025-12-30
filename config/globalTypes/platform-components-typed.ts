/**
 * Typed versions of HOC-wrapped platform components
 * 
 * This file centralizes the type assertions needed for components wrapped with
 * connect() or withRouter(). As more components are converted to TypeScript,
 * add their typed versions here.
 * 
 * Usage:
 *   import { RoutedSavableApp, DowntimeNotification } from '../../config/globalTypes/platform-components-typed';
 * 
 * Pattern for adding new components:
 *   1. Add the props type to platform-components.ts
 *   2. Import the base component and props type here
 *   3. Create the typed version with @ts-expect-error
 *   4. Export it
 */

import type { ComponentType } from 'react';
import RoutedSavableAppBase from 'platform/forms/save-in-progress/RoutedSavableApp';
import { DowntimeNotification as DowntimeNotificationBase } from 'platform/monitoring/DowntimeNotification';

import type {
  RoutedSavableAppProps,
  DowntimeNotificationPublicProps,
} from './platform-components';

// RoutedSavableApp - wrapped with connect() and withRouter()
// @ts-expect-error - HOC typing limitation - types still inferred from PropTypes
export const RoutedSavableApp: ComponentType<RoutedSavableAppProps> = RoutedSavableAppBase;

// DowntimeNotification - wrapped with connect()
// @ts-expect-error - HOC typing limitation - types still inferred from PropTypes
export const DowntimeNotification: ComponentType<DowntimeNotificationPublicProps> = DowntimeNotificationBase;
