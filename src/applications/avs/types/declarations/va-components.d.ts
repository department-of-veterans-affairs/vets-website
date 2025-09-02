// Type declarations for VA web components used as JSX elements

declare namespace JSX {
  interface IntrinsicElements {
    'va-alert': {
      status?: 'error' | 'warning' | 'success' | 'info';
      uswds?: boolean;
      children?: React.ReactNode;
    };
    'va-loading-indicator': {
      'data-testid'?: string;
      message?: string;
      children?: React.ReactNode;
    };
    'va-accordion': {
      uswds?: boolean;
      children?: React.ReactNode;
    };
    'va-accordion-item': {
      header?: string;
      open?: string | boolean;
      uswds?: boolean;
      children?: React.ReactNode;
    };
    'va-telephone': {
      contact?: string;
      'not-clickable'?: boolean;
      tty?: boolean;
      children?: React.ReactNode;
    };
    'va-additional-info': {
      trigger?: string;
      uswds?: boolean;
      children?: React.ReactNode;
    };
    'va-icon': {
      icon?: string;
      size?: number;
      'data-testid'?: string;
      children?: React.ReactNode;
    };
  }
}