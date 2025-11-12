export const listClassNames = (addBorder = true) =>
  [
    'vads-u-padding-x--0',
    addBorder ? 'vads-u-border-top--1px' : '',
    addBorder ? 'vads-u-border-color--gray-light' : '',
    addBorder ? 'vads-u-padding-y--2' : '',
  ].join(' ');

export const errorClassNames = [
  'usa-input-error',
  'vads-u-padding-x--2',
  'vads-u-padding-y--0',
  'vads-u-margin-left--2',
  'vads-u-margin-top--0',
].join(' ');

export const removeButtonClass = [
  'remove-item',
  'vads-u-width--auto',
  'vads-u-margin-left--2',
  'vads-u-margin-top--0',
].join(' ');

export const confirmationPageLabel = showListOnly =>
  showListOnly
    ? [
        'vads-u-margin-bottom--0p5',
        'vads-u-color--gray',
        'vads-u-font-size--sm',
      ].join(' ')
    : 'vads-u-font-weight--bold';
