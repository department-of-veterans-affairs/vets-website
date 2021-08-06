import React from 'react';

export default function DateViewField({ formData }) {
  const { dateOfBirth } = formData;

  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  let dateParts;
  let date;

  if (dateOfBirth) {
    dateParts = dateOfBirth.split('-');
    date = new Date(
      Number.parseInt(dateParts[0], 10),
      Number.parseInt(dateParts[1], 10) - 1,
      Number.parseInt(dateParts[2], 10),
    );
  }

  return (
    <>
      {date && months[date.getMonth()]} {date && date.getDate()}
      {date && ', '}
      {date && date.getFullYear()}
    </>
  );
}
