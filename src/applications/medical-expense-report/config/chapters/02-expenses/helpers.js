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

/**
 * @param formData
 * @param index
 * @param fullData
 * @returns boolean - false if in home attendant, true otherwise.
 */
export const hideIfInHomeCare = (formData, index, fullData) => {
  const careExpenses = formData?.careExpenses ?? fullData?.careExpenses;
  const careExpense = careExpenses?.[index];
  return careExpense?.typeOfCare !== 'IN_HOME_CARE_ATTENDANT';
};

/**
 * @param formData
 * @param index
 * @param fullData
 * @returns boolean - true if in home attendant, true otherwise.
 */
export const requiredIfInHomeCare = (formData, index, fullData) => {
  const careExpenses = formData?.careExpenses ?? fullData?.careExpenses;
  const careExpense = careExpenses?.[index];
  return careExpense?.typeOfCare === 'IN_HOME_CARE_ATTENDANT';
};

/**
 * @param formData
 * @returns string - cost page title.
 */
export const getCostPageTitle = formData => {
  const provider = formData?.provider ?? '';
  return provider ? `Cost of care for ${provider}` : 'Cost of care';
};

/**
 * @param formData
 * @param index
 * @param fullData
 * @returns boolean - true if in home attendant, true otherwise.
 */
export const requiredIfMileageReimbursed = (formData, index, fullData) => {
  const mileageExpenses =
    formData?.mileageExpenses ?? fullData?.mileageExpenses;
  const mileageExpense = mileageExpenses?.[index];
  return mileageExpense?.travelReimbursed === true;
};

/**
 * @param formData
 * @param index
 * @param fullData
 * @returns boolean - true if in home attendant, true otherwise.
 */
export const requiredIfMileageLocationOther = (formData, index, fullData) => {
  const mileageExpenses =
    formData?.mileageExpenses ?? fullData?.mileageExpenses;
  const mileageExpense = mileageExpenses?.[index];
  return mileageExpense?.travelLocation === 'OTHER';
};
