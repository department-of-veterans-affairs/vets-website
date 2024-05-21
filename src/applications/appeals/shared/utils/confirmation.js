export const showBooleanValue = (value, [yes = 'Yes', no = 'No'] = []) => {
  if (typeof value === 'boolean') {
    return value ? yes : no;
  }
  return 'Not selected';
};
