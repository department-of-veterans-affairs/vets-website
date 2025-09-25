// Type declarations for platform startup modules

declare module '@department-of-veterans-affairs/platform-startup/exports' {
  export function authenticatedLoader(config: {
    loader: (...args: unknown[]) => unknown;
    fallbackValue?: unknown;
  }): (...args: unknown[]) => Promise<unknown>;
}

declare module '@department-of-veterans-affairs/platform-startup/withoutRouter' {
  interface StartAppConfig {
    entryName: string;
    url: string;
    reducer: Record<string, unknown>;
    router: React.ReactElement;
  }

  function startApp(config: StartAppConfig): void;
  export default startApp;
}
