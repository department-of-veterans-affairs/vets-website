// Core AVS domain types for medical data and business entities

/**
 * Information about a clinic visited during an appointment
 */
export interface ClinicVisited {
  /** Date of the clinic visit in MM/DD/YYYY format */
  date: string;
  /** Time of the clinic visit in HH:mm format */
  time: string;
  /** Name or description of the clinic */
  clinic?: string;
  /** Name of the provider(s) seen */
  provider?: string;
  /** VistA clinic Internal Entry Number (IEN) */
  clinicIen?: string;
  /** VA medical center or facility site name */
  site?: string;
}

/**
 * Metadata about the AVS document generation and facility
 */
export interface AvsMetadata {
  /** Header text displayed at the top of the AVS document */
  pageHeader?: string;
  /** ISO 8601 timestamp when the AVS was generated */
  generatedDate: string;
  /** IANA timezone identifier (e.g., 'America/Los_Angeles') */
  timeZone: string;
  /** VA station number (facility identifier) */
  stationNo?: string;
}

/**
 * Medication prescription information from VistA pharmacy system
 * Can represent both VA and non-VA medications
 */
export interface Medication {
  /** Medication name (brand or generic) */
  name?: string;
  /** Type of prescription (e.g., 'PRESCRIPTION', 'SUPPLY') */
  prescriptionType?: string;
  /** Source of medication ('VA' or 'NON-VA'), added by application code */
  medicationSource?: string;
  /** Whether the patient reports currently taking this medication */
  patientTaking?: boolean;
  /** VA station number where medication was prescribed */
  stationNo?: string;
  /** Sig (Signetur) - dosage and administration instructions */
  sig?: string;
  /** Medical indication or reason for the medication */
  indication?: string;
  /** Additional medication description */
  description?: string;
  /** Prescription number for tracking and refills */
  rxNumber?: string;
  /** Additional comments or notes about the medication */
  comment?: string;
  /** Name of the VA facility station */
  stationName?: string;
  /** Phone number of the prescribing facility */
  facilityPhone?: string;
  /** Name of the provider who ordered the medication */
  orderingProvider?: string;
  /** Current status of the prescription (e.g., 'ACTIVE', 'DISCONTINUED') */
  status?: string;
  /** Quantity prescribed (pills, ml, etc.) */
  quantity?: string | number;
  /** Number of days the prescription should last */
  daysSupply?: string | number;
  /** Number of refills remaining on the prescription */
  refillsRemaining?: string | number;
  /** Date the prescription expires */
  dateExpires?: string;
  /** Date the prescription was last filled */
  dateLastFilled?: string;
  /** Date the prescription was last released to the patient */
  dateLastReleased?: string;
  /** Facility where the medication was documented */
  documentingFacility?: string;
  /** Person who documented the medication information */
  documentor?: string;
}

/**
 * Appointment type categorization
 */
export interface AppointmentType {
  /** Unique identifier for the appointment type */
  key: string;
  /** Human-readable label for the appointment type */
  label: string;
}

/**
 * Future appointment information
 */
export interface Appointment {
  /** Type or category of appointment */
  type: string;
  /** Date and time of the appointment */
  datetime: string;
  /** Clinic or department name */
  location: string;
  /** Building, floor, or room information */
  physicalLocation?: string;
  /** VA medical center or facility site name */
  site: string;
}

/**
 * Immunization (vaccination) record
 */
export interface Immunization {
  /** Name of the vaccine administered */
  name: string;
  /** Date the immunization was given */
  date: string;
  /** VA facility where the immunization was administered */
  facility: string;
}

/**
 * Active medical problem from the patient's problem list
 */
export interface Problem {
  /** Description of the medical problem */
  description: string;
  /** Date the problem was last updated in the system */
  lastUpdated: string;
}

/**
 * Allergy or adverse reaction record
 */
export interface Allergy {
  /** Name of the allergen (medication, food, substance) */
  allergen: string;
  /** Date the allergy was verified */
  verifiedDate: string;
  /** Severity level (e.g., 'MODERATE', 'SEVERE') */
  severity?: string;
  /** List of reactions experienced (e.g., 'HIVES', 'ANAPHYLAXIS') */
  reactions: string[];
  /** Type of allergy (e.g., 'DRUG', 'FOOD') */
  type?: string;
  /** VA facility site where allergy was documented */
  site: string;
}

/**
 * Individual lab test result value
 */
export interface LabResultValue {
  /** Name of the lab test performed */
  test: string;
  /** Measured result value */
  result: string;
  /** Units of measurement */
  units: string;
  /** Reference range for normal values */
  refRange: string;
  /** Flag indicating abnormal results (e.g., 'H' for high, 'L' for low) */
  flag: string;
}

/**
 * Complete laboratory test result with context
 */
export interface LabResult {
  /** Array of individual test values in this lab panel */
  values: LabResultValue[];
  /** Type of specimen collected (e.g., 'BLOOD', 'URINE') */
  specimen: string;
  /** Name of the provider who ordered the lab test */
  orderingProvider: string;
  /** Date and time the specimen was collected */
  collectionDatetime: string;
  /** Laboratory that performed the analysis */
  performingLab: string;
}

/**
 * Member of the patient's primary care team
 */
export interface PrimaryCareTeamMember {
  /** Name of the team member */
  name: string;
  /** Professional title or role (e.g., 'Primary Care Physician', 'Nurse') */
  title?: string;
}

/**
 * Patient demographic and health information
 */
export interface PatientInfo {
  /** Patient's smoking status (e.g., 'Current smoker', 'Never smoker') */
  smokingStatus?: string;
}

/**
 * Container for allergy information
 */
export interface AllergiesReactions {
  /** List of documented allergies */
  allergies: Allergy[];
}

/**
 * Medical order from the visit (consultations, imaging, lab tests, etc.)
 */
export interface Order {
  /** Category of order (e.g., 'CONSULT', 'IMAGING', 'LAB', 'MED') */
  type: string;
  /** Name or description of the order */
  name: string;
  /** Special instructions or notes for the order */
  instructions?: string;
  /** Scheduled or due date for the order */
  date?: string;
  /** Full text description of the order for display */
  text: string;
}

/**
 * Preventive care or health maintenance reminder
 */
export interface ClinicalReminder {
  /** Name of the clinical reminder (e.g., 'Flu Vaccine', 'Mammogram') */
  name: string;
  /** When the reminder is due or overdue */
  whenDue: string;
  /** Recommended frequency for this reminder */
  frequency: string;
}

/**
 * Summary of medication changes made during the visit
 */
export interface MedicationChangesSummary {
  /** List of newly prescribed medications */
  newMedications?: string[];
  /** List of medications that were discontinued */
  discontinuedMeds?: string[];
  /** List of medications that had dosage or other changes */
  changedMedications?: string[];
}

/**
 * Pharmacy or medication terminology definition for patient education
 */
export interface PharmacyTerm {
  /** Medical or pharmacy term being defined */
  term: string;
  /** Alternative name or abbreviation (also known as) */
  aka?: string;
  /** Plain-language explanation of the term */
  explanation: string;
  /** Actions the patient should take related to this term */
  patientActions?: string;
}

/**
 * Vital signs measurement from the appointment
 */
export interface VitalSign {
  /** Type of vital sign (e.g., 'BLOOD PRESSURE', 'TEMPERATURE', 'PULSE') */
  type: string;
  /** Measured value with units */
  value: string;
  /** Additional context (e.g., 'Lying', 'Standing', 'Left Arm') */
  qualifiers?: string;
}

/**
 * Medical diagnosis with ICD coding
 */
export interface Diagnosis {
  /** Human-readable diagnosis description */
  diagnosis: string;
  /** ICD-10 or ICD-9 diagnosis code */
  code: string;
}

/**
 * Medical procedure performed during the visit
 */
export interface Procedure {
  /** Name or description of the procedure */
  name: string;
  /** CPT or other standard procedure code */
  code: string;
}

/**
 * Medication administered or prescribed during the clinic visit
 * This is distinct from the patient's ongoing medication list
 */
export interface ClinicMedication {
  /** Medication name */
  name: string;
  /** Sig (dosage and administration instructions) */
  sig: string;
  /** Status of the medication (e.g., 'GIVEN', 'PRESCRIBED') */
  status: string;
}

/**
 * Clinical service contact information and hours
 */
export interface ClinicalService {
  /** Name of the clinical service or department */
  name: string;
  /** Physical location (building, floor, room) */
  location: string;
  /** Operating hours */
  hours: string;
  /** Contact phone number */
  phone: string;
  /** Additional notes or instructions */
  comment: string;
}

/**
 * After Visit Summary (AVS) complete data structure
 * Contains all medical information from a patient's clinic visit
 */
export interface AvsData {
  /** Unique identifier for this AVS document */
  id?: string;
  /** Date of the visit */
  visitDate?: string;
  /** Primary provider for the visit */
  provider?: string;
  /** Clinic or department where visit occurred */
  clinic?: string;
  /** List of all clinics visited during this appointment (may be multiple) */
  clinicsVisited: ClinicVisited[];
  /** Document metadata and generation information */
  meta: AvsMetadata;
  /** Medications prescribed by VA providers */
  vaMedications?: Medication[];
  /** Medications from non-VA providers (self-reported or community care) */
  nonvaMedications?: Medication[];
  /** Names of primary care providers */
  primaryCareProviders?: string[];
  /** Primary care team name or identifier */
  primaryCareTeam?: string;
  /** Detailed list of primary care team members */
  primaryCareTeamMembers?: PrimaryCareTeamMember[];
  /** Future scheduled appointments */
  appointments?: Appointment[];
  /** Active problems from patient's problem list */
  problems?: Problem[];
  /** Immunization history */
  immunizations?: Immunization[];
  /** Allergies and adverse reactions */
  allergiesReactions?: AllergiesReactions;
  /** Laboratory test results */
  labResults?: LabResult[];
  /** Patient demographic and health information */
  patientInfo?: PatientInfo;
  /** New orders from this visit (labs, imaging, consults, etc.) */
  orders?: Order[];
  /** Health maintenance and preventive care reminders */
  clinicalReminders?: ClinicalReminder[];
  /** Instructions given to the patient by the provider */
  patientInstructions?: string;
  /** Summary of medication changes from this visit */
  medChangesSummary?: MedicationChangesSummary;
  /** Pharmacy terminology glossary for patient education */
  pharmacyTerms?: PharmacyTerm[];
  /** All providers involved in the visit */
  providers?: string[];
  /** Chief complaint or reason patient came to clinic */
  reasonForVisit?: Diagnosis[];
  /** Diagnoses made during the visit */
  diagnoses?: Diagnosis[];
  /** Vital signs taken during the visit */
  vitals?: VitalSign[];
  /** Procedures performed during the visit */
  procedures?: Procedure[];
  /** Medications administered or prescribed in clinic */
  clinicMedications?: ClinicMedication[];
  /** Contact information for clinical services */
  clinicalServices?: ClinicalService[];
  /** Additional help and information text */
  moreHelpAndInformation?: string;
}
