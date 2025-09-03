// Type declarations for platform startup modules

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