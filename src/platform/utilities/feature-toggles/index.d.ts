// Type declarations for platform feature toggles modules

declare module '~/platform/utilities/feature-toggles' {
  import React from 'react';

  /**
   * Configuration type for a single feature toggle
   */
  export interface ToggleConfig {
    toggleName: string;
    formKey?: string;
  }

  /**
   * Feature toggle hook return type
   */
  export interface FeatureToggleHook {
    TOGGLE_NAMES: Record<string, string>;
    useToggleValue: (toggleName: string) => boolean;
    useToggleLoadingValue: () => boolean;
    useFormFeatureToggleSync: (
      toggles: (string | ToggleConfig)[],
      setStorageItem?: (key: string, value: string) => void,
    ) => void;
  }

  /**
   * Fetches feature toggle values from the service and updates the redux store
   */
  export function connectFeatureToggle(
    dispatch: (action: {
      type: string;
      payload?: Record<string, unknown>;
      newToggleValues?: Record<string, unknown>;
    }) => void,
    toggleValues?: Record<string, boolean>,
  ): Promise<void>;

  /**
   * Updates feature toggle values (for testing purposes)
   */
  export function updateFeatureToggleValue(
    newToggleValues: Record<string, boolean>,
  ): void;

  /**
   * Get feature toggle loading state
   */
  export function useToggleLoadingValue(): boolean;

  /**
   * Hook to sync feature toggles with form data and session storage
   */
  export function useFormFeatureToggleSync(
    toggles: (string | ToggleConfig)[],
    setStorageItem?: (key: string, value: string) => void,
  ): void;

  /**
   * Get feature toggle value
   */
  export function useToggleValue(toggleName: string): boolean;

  /**
   * Main feature toggle hook
   */
  export function useFeatureToggle(): FeatureToggleHook;

  /**
   * Toggler component
   */
  export const Toggler: React.ComponentType<Record<string, unknown>>;

  /**
   * Toggle names constant
   */
  export const TOGGLE_NAMES: Record<string, string>;
}
