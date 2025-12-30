/**
 * Type definitions for VA Design System Web Components
 * These are custom elements used throughout the VA.gov applications
 * 
 * This file is included in base-tsconfig.json and will be available
 * to all applications that extend the base TypeScript configuration.
 */

declare namespace JSX {
  interface IntrinsicElements {
    // VA Loading Components
    'va-loading-indicator': React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLElement> & {
        label?: string;
        message?: string;
        'set-focus'?: boolean;
      },
      HTMLElement
    >;

    // VA Alert Components
    'va-alert': React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLElement> & {
        status?: 'info' | 'warning' | 'error' | 'success';
        'background-only'?: boolean;
        visible?: boolean;
        'closeable'?: boolean;
        'close-btn-aria-label'?: string;
        headline?: string;
      },
      HTMLElement
    >;

    // VA Button Components
    'va-button': React.DetailedHTMLProps<
      React.ButtonHTMLAttributes<HTMLButtonElement> & {
        text?: string;
        secondary?: boolean;
        'uswds'?: boolean;
        'analytics'?: string;
      },
      HTMLButtonElement
    >;

    // VA Form Input Components
    'va-text-input': React.DetailedHTMLProps<
      React.InputHTMLAttributes<HTMLInputElement> & {
        label?: string;
        'error-message'?: string;
        'required'?: boolean;
        'uswds'?: boolean;
      },
      HTMLInputElement
    >;

    'va-textarea': React.DetailedHTMLProps<
      React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
        label?: string;
        'error-message'?: string;
        'required'?: boolean;
        'uswds'?: boolean;
      },
      HTMLTextAreaElement
    >;

    'va-select': React.DetailedHTMLProps<
      React.SelectHTMLAttributes<HTMLSelectElement> & {
        label?: string;
        'error-message'?: string;
        'required'?: boolean;
        'uswds'?: boolean;
      },
      HTMLSelectElement
    >;

    'va-checkbox': React.DetailedHTMLProps<
      React.InputHTMLAttributes<HTMLInputElement> & {
        label?: string;
        'error-message'?: string;
        'required'?: boolean;
        'uswds'?: boolean;
      },
      HTMLInputElement
    >;

    'va-radio': React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLElement> & {
        label?: string;
        'error-message'?: string;
        'required'?: boolean;
        'uswds'?: boolean;
      },
      HTMLElement
    >;

    'va-radio-option': React.DetailedHTMLProps<
      React.InputHTMLAttributes<HTMLInputElement> & {
        label?: string;
        'error-message'?: string;
        'uswds'?: boolean;
      },
      HTMLInputElement
    >;

    // VA Date Components
    'va-date': React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLElement> & {
        label?: string;
        'error-message'?: string;
        'required'?: boolean;
        'uswds'?: boolean;
        name?: string;
      },
      HTMLElement
    >;

    'va-memorable-date': React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLElement> & {
        label?: string;
        'error-message'?: string;
        'required'?: boolean;
        'uswds'?: boolean;
        name?: string;
      },
      HTMLElement
    >;

    // VA Additional Components
    'va-additional-info': React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLElement> & {
        trigger?: string;
        'uswds'?: boolean;
      },
      HTMLElement
    >;

    'va-modal': React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLElement> & {
        visible?: boolean;
        'modal-title'?: string;
        'primary-button-text'?: string;
        'secondary-button-text'?: string;
        'uswds'?: boolean;
      },
      HTMLElement
    >;

    'va-breadcrumbs': React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLElement> & {
        'uswds'?: boolean;
      },
      HTMLElement
    >;

    'va-pagination': React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLElement> & {
        page?: number;
        pages?: number;
        'max-page-list-length'?: number;
        'uswds'?: boolean;
      },
      HTMLElement
    >;

    'va-back-to-top': React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLElement>,
      HTMLElement
    >;
  }
}
