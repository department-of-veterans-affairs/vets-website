// Common utility types and shared interfaces

export interface ManifestType {
  appName: string;
  entryFile: string;
  entryName: string;
  rootUrl: string;
  productId: string;
}

// Define the application state structure
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface AppState {
  // Currently the reducer is empty, but will be expanded when state management is added
}

// Route parameters
export interface RouteParams {
  id?: string;
}
