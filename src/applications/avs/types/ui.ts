// UI component props and React-related types

import type { AvsData, Order } from './domain';

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

export interface YourAppointmentProps {
  avs: AvsData;
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
