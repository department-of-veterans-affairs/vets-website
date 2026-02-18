import type { AppointmentType } from '../types/domain';

// Type definitions for constants
export type { AppointmentType };

export interface OrderType {
  key: string;
  label: string;
}

export interface AppointmentTypes {
  RECALL: AppointmentType;
  SCHEDULED: AppointmentType;
}

export interface OrderTypes {
  CONSULT: OrderType;
  IMAGING: OrderType;
  LAB: OrderType;
  MED: OrderType;
  OTHER: OrderType;
}

export interface MedicationSources {
  VA: string;
  NON_VA: string;
}

export interface MedicationTypes {
  DRUG: string;
  SUPPLY: string;
}

// Constants with proper typing
export const APPOINTMENT_TYPES: AppointmentTypes = {
  RECALL: {
    key: 'RECALL',
    label: 'Recall',
  },
  SCHEDULED: {
    key: 'SCHEDULED',
    label: 'Scheduled',
  },
} as const;

export const ORDER_TYPES: OrderTypes = {
  CONSULT: {
    key: 'CONSULT',
    label: 'Consultations',
  },
  IMAGING: {
    key: 'IMAGING',
    label: 'Imaging',
  },
  LAB: {
    key: 'LAB',
    label: 'Lab Tests',
  },
  MED: {
    key: 'MED',
    label: 'Medications',
  },
  OTHER: {
    key: 'OTHER',
    label: 'Other Orders',
  },
} as const;

export const MEDICATION_SOURCES: MedicationSources = {
  VA: 'VA',
  NON_VA: 'Non-VA',
} as const;

export const MEDICATION_TYPES: MedicationTypes = {
  DRUG: 'drug',
  SUPPLY: 'supply',
} as const;
