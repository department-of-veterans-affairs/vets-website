import { format, parseISO } from 'date-fns';

export const transformDate = dateStr => {
  if (!dateStr) return null;
  const date = parseISO(dateStr);
  return format(date, 'MM/dd/yyyy');
};

/**
 * @param formData
 * @returns boolean - true if no expenses have been added, false otherwise.
 */
export const hasNoExpenses = formData => {
  const careExpenses = formData.careExpenses || [];
  const medicalExpenses = formData.medicalExpenses || [];
  const mileageExpenses = formData.mileageExpenses || [];
  return (
    careExpenses.length === 0 &&
    medicalExpenses.length === 0 &&
    mileageExpenses.length === 0
  );
};

/**
 * @param formData
 * @returns boolean - true if care expenses, false otherwise.
 */
export const hasCareExpenses = formData => {
  const careExpenses = formData.careExpenses || [];
  return careExpenses.length > 0;
};
