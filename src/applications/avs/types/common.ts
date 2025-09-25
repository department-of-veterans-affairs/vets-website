// Common utility types and shared interfaces

export interface ManifestType {
  appName: string;
  entryFile: string;
  entryName: string;
  rootUrl: string;
  productId: string;
}

// Define the application state structure
export interface AppState {
  // Currently the reducer is empty, but we'll define this for future use
  [key: string]: unknown;
}

// Route parameters
export interface RouteParams {
  id?: string;
}
