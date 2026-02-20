// Common utility types and shared interfaces

export interface ManifestType {
  appName: string;
  entryFile: string;
  entryName: string;
  rootUrl: string;
  productId: string;
}

// Route parameters
export interface RouteParams {
  id?: string;
}
