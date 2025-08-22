// Type declarations for platform modules that don't have TypeScript support yet

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

declare module '@department-of-veterans-affairs/platform-utilities/featureFlagNames' {
  const FEATURE_FLAG_NAMES: {
    avsEnabled: string;
    [key: string]: string;
  };
  export default FEATURE_FLAG_NAMES;
}

declare module '@department-of-veterans-affairs/platform-startup/exports' {
  export function authenticatedLoader(config: {
    loader: (params: any) => any;
    defaultReturn: any;
  }): any;
}

declare module '@department-of-veterans-affairs/platform-startup/withoutRouter' {
  interface StartAppConfig {
    entryName: string;
    url: string;
    reducer: any;
    router: React.ReactElement;
  }
  
  function startApp(config: StartAppConfig): void;
  export default startApp;
}

declare module '@department-of-veterans-affairs/platform-user/selectors' {
  export function selectUser(state: any): any;
}

declare module '@department-of-veterans-affairs/platform-user/profile/backendServices' {
  const backendServices: {
    USER_PROFILE: string;
    [key: string]: string;
  };
  export default backendServices;
}

declare module '@department-of-veterans-affairs/platform-user/RequiredLoginView' {
  interface RequiredLoginViewProps {
    user: any;
    serviceRequired: string[];
    children: React.ReactNode;
  }
  
  export const RequiredLoginView: React.FC<RequiredLoginViewProps>;
}

declare module '@department-of-veterans-affairs/mhv/exports' {
  export const MhvPageNotFound: React.FC;
}