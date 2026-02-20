// UI component props and React-related types

import type { AvsData, Order } from './domain';
import type { OrderType } from '../utils/constants';

export interface MedicationTermsProps {
  avs: AvsData;
}

export interface ListBlockProps {
  heading: string;
  itemType: string;
  headingLevel?: number;
  itemName?: string | null;
  items?: unknown[];
  keyName?: string;
}

export interface OrdersBlockProps {
  heading: string;
  intro?: React.ReactNode | string;
  orders?: Order[];
  type: OrderType;
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
}

// Component props
export interface AvsProps {
  id?: string;
}

export interface YourHealthInformationProps {
  avs: AvsData;
}

export interface ItemsBlockProps<T = unknown> {
  heading: string;
  itemType: string;
  items?: T[];
  renderItem: (item: T, index?: number) => React.ReactNode;
  showSeparators?: boolean;
  intro?: React.ReactNode;
}

export interface ParagraphBlockProps {
  heading: string;
  content?: string;
  headingLevel?: number;
  htmlContent?: boolean;
}
