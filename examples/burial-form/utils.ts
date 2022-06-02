import { isBefore } from 'date-fns';

export const isBeforeDate = (
  dateOne: Date,
  dateTwo: Date,
  validationMessage: string
): () => string => {
  return () => isBefore(new Date(dateOne), new Date(dateTwo)) ? validationMessage : '';
}
