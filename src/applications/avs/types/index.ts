// Common types for the AVS application

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
  [key: string]: any;
}

// Route parameters
export interface RouteParams {
  id?: string;
}

// AVS Data Types
export interface ClinicVisited {
  date: string;
  time: string;
  clinic?: string;
  provider?: string;
}

export interface AvsMetadata {
  pageHeader?: string;
  generatedDate: string;
  timeZone: string;
  stationNo?: string;
}

// Medication types
export interface Medication {
  name?: string;
  prescriptionType?: string;
  medicationSource?: string;
  patientTaking?: boolean;
  stationNo?: string;
  sig?: string;
  indication?: string;
  description?: string;
  rxNumber?: string;
  comment?: string;
  stationName?: string;
  facilityPhone?: string;
  orderingProvider?: string;
  status?: string;
  quantity?: string | number;
  daysSupply?: string | number;
  refillsRemaining?: string | number;
  dateExpires?: string;
  dateLastFilled?: string;
  dateLastReleased?: string;
  documentingFacility?: string;
  documentor?: string;
}

export interface AvsData {
  id?: string;
  visitDate?: string;
  provider?: string;
  clinic?: string;
  clinicsVisited: ClinicVisited[];
  meta: AvsMetadata;
  vaMedications?: Medication[];
  nonvaMedications?: Medication[];
  // Add more AVS-specific fields as needed
  [key: string]: any;
}

// Loader return type
export interface AvsLoaderData {
  avs: AvsData;
}

// Error boundary props
export interface ErrorBoundaryProps {
  children: React.ReactNode;
}

export interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

// Component props
export interface AvsProps {
  id?: string;
}