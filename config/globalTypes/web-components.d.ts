/**
 * Type definitions for VA Design System Web Components
 * These are custom elements used throughout the VA.gov applications
 * 
 * This file is included in base-tsconfig.json and will be available
 * to all applications that extend the base TypeScript configuration.
 */

type WebComponent<T = {}> = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLElement> & T,
  HTMLElement
>;

type WebComponentInput<T = {}> = React.DetailedHTMLProps<
  React.InputHTMLAttributes<HTMLInputElement> & T,
  HTMLInputElement
>;

declare namespace JSX {
  interface IntrinsicElements {
    'va-loading-indicator': WebComponent<{
      label?: string;
      message?: string;
      'set-focus'?: boolean;
    }>;

    'va-alert': WebComponent<{
      status?: 'info' | 'warning' | 'error' | 'success';
      'background-only'?: boolean;
      visible?: boolean;
      'closeable'?: boolean;
      'close-btn-aria-label'?: string;
      headline?: string;
    }>;

    'va-button': WebComponent<{
      text?: string;
      secondary?: boolean;
      'uswds'?: boolean;
      'analytics'?: string;
    }>;

    'va-text-input': WebComponentInput<{
      label?: string;
      'error-message'?: string;
      'required'?: boolean;
      'uswds'?: boolean;
    }>;

    'va-textarea': WebComponent<{
      label?: string;
      'error-message'?: string;
      'required'?: boolean;
      'uswds'?: boolean;
    }>;

    'va-select': WebComponent<{
      label?: string;
      'error-message'?: string;
      'required'?: boolean;
      'uswds'?: boolean;
    }>;

    'va-checkbox': WebComponentInput<{
      label?: string;
      'error-message'?: string;
      'required'?: boolean;
      'uswds'?: boolean;
    }>;

    'va-radio': WebComponent<{
      label?: string;
      'error-message'?: string;
      'required'?: boolean;
      'uswds'?: boolean;
    }>;

    'va-radio-option': WebComponentInput<{
      label?: string;
      'error-message'?: string;
      'uswds'?: boolean;
    }>;

    'va-date': WebComponent<{
      label?: string;
      'error-message'?: string;
      'required'?: boolean;
      'uswds'?: boolean;
      name?: string;
    }>;

    'va-memorable-date': WebComponent<{
      label?: string;
      'error-message'?: string;
      'required'?: boolean;
      'uswds'?: boolean;
      name?: string;
    }>;

    'va-additional-info': WebComponent<{
      trigger?: string;
      'uswds'?: boolean;
    }>;

    'va-modal': WebComponent<{
      visible?: boolean;
      'modal-title'?: string;
      'primary-button-text'?: string;
      'secondary-button-text'?: string;
      'uswds'?: boolean;
    }>;

    'va-breadcrumbs': WebComponent<{
      'uswds'?: boolean;
    }>;

    'va-pagination': WebComponent<{
      page?: number;
      pages?: number;
      'max-page-list-length'?: number;
      'uswds'?: boolean;
    }>;

    'va-back-to-top': WebComponent;
  }
}
