export function getLabelClasses(value, touched) {
  const labelMarginClass =
    value === undefined && touched
      ? 'vads-u-margin-left--3'
      : 'vads-u-margin-left--1';
  return `vads-l-col--1 vads-u-margin-top--3 ${labelMarginClass}`;
}
