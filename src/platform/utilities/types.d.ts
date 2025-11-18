// Type declarations for platform utilities modules

declare module '@department-of-veterans-affairs/platform-utilities/exports' {
  export const environment: {
    API_URL: string;
    [key: string]: any;
  };
  export function formatDateLong(date: Date | string): string;
  export * from '@department-of-veterans-affairs/platform-utilities/api';
}

declare module '@department-of-veterans-affairs/platform-utilities/api' {
  export function apiRequest(url: string, options?: any): Promise<any>;
}
