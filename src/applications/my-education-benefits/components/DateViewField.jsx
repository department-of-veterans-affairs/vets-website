import { formatReadableDate } from '../helpers';

export default function DateViewField({ formData }) {
  const { dateOfBirth } = formData;

  return formatReadableDate(dateOfBirth);
}
