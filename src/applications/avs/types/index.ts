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
  clinicIen?: string;
  site?: string;
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

// Health information types
export interface AppointmentType {
  key: string;
  label: string;
}

export interface Appointment {
  type: string;
  datetime: string;
  location: string;
  physicalLocation?: string;
  site: string;
}

export interface Immunization {
  name: string;
  date: string;
  facility: string;
}

export interface Problem {
  description: string;
  lastUpdated: string;
}

export interface Allergy {
  allergen: string;
  verifiedDate: string;
  severity?: string;
  reactions: string[];
  type?: string;
  site: string;
}

export interface LabResultValue {
  test: string;
  result: string;
  units: string;
  refRange: string;
  flag: string;
}

export interface LabResult {
  values: LabResultValue[];
  specimen: string;
  orderingProvider: string;
  collectionDatetime: string;
  performingLab: string;
}

export interface PrimaryCareTeamMember {
  name: string;
  title?: string;
}

export interface PatientInfo {
  smokingStatus?: string;
}

export interface AllergiesReactions {
  allergies: Allergy[];
}

// Treatment plan types
export interface Order {
  type: string;
  name: string;
  instructions?: string;
  date?: string;
  text: string;
  [key: string]: any;
}

export interface ClinicalReminder {
  name: string;
  whenDue: string;
  frequency: string;
}

export interface MedicationChangesSummary {
  newMedications?: string[];
  discontinuedMeds?: string[];
  changedMedications?: string[];
}

export interface PharmacyTerm {
  term: string;
  aka?: string;
  explanation: string;
  patientActions?: string;
}

export interface MedicationTermsProps {
  avs: AvsData;
}

export interface ListBlockProps {
  heading: string;
  itemType: string;
  headingLevel?: number;
  itemName?: string | null;
  items?: any[];
  keyName?: string;
}

export interface OrdersBlockProps {
  heading: string;
  intro?: React.ReactNode | string;
  orders?: Order[];
  type: any; // OrderType from constants
}

// Appointment data types
export interface VitalSign {
  type: string;
  value: string;
  qualifiers?: string;
}

export interface Diagnosis {
  diagnosis: string;
  code: string;
}

export interface Procedure {
  name: string;
  code: string;
}

export interface ClinicMedication {
  name: string;
  sig: string;
  status: string;
}

export interface YourAppointmentProps {
  avs: AvsData;
}

export interface ClinicalService {
  name: string;
  location: string;
  hours: string;
  phone: string;
  comment: string;
}

export interface MoreInformationProps {
  avs: AvsData;
}

export interface AvsPageHeaderProps {
  text?: string;
}

export interface YourTreatmentPlanProps {
  avs: AvsData;
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
  primaryCareProviders?: string[];
  primaryCareTeam?: string;
  primaryCareTeamMembers?: PrimaryCareTeamMember[];
  appointments?: Appointment[];
  problems?: Problem[];
  immunizations?: Immunization[];
  allergiesReactions?: AllergiesReactions;
  labResults?: LabResult[];
  patientInfo?: PatientInfo;
  orders?: Order[];
  clinicalReminders?: ClinicalReminder[];
  patientInstructions?: string;
  medChangesSummary?: MedicationChangesSummary;
  pharmacyTerms?: PharmacyTerm[];
  providers?: string[];
  reasonForVisit?: Diagnosis[];
  diagnoses?: Diagnosis[];
  vitals?: VitalSign[];
  procedures?: Procedure[];
  clinicMedications?: ClinicMedication[];
  clinicalServices?: ClinicalService[];
  moreHelpAndInformation?: string;
  // Add more AVS-specific fields as needed
  [key: string]: any;
}

// Loader return type
export interface AvsLoaderData {
  avs: AvsData;
}

// Error boundary props
export interface ErrorBoundaryProps {
  children?: React.ReactNode;
}

export interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

// Component props
export interface AvsProps {
  id?: string;
}

export interface YourHealthInformationProps {
  avs: AvsData;
}

export interface ItemsBlockProps {
  heading: string;
  itemType: string;
  items?: any[];
  renderItem: (item: any, index?: number) => React.ReactNode;
  showSeparators?: boolean;
  intro?: React.ReactNode;
}

export interface ParagraphBlockProps {
  heading: string;
  content?: string;
  headingLevel?: number;
  htmlContent?: boolean;
}