/**
 * Router-related type definitions
 * 
 * Shared types for React Router location objects used across applications
 */

import type { Location } from 'history';

/**
 * Extended Location type that includes href property
 * Used by platform components like RoutedSavableApp that expect
 * a location object with an optional href property
 */
export type AppLocation = Location & {
  href?: string;
};
