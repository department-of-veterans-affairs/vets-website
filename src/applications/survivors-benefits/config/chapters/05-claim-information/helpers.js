// helper to handle both boolean and string "yes" values coming from different
// test fixtures or UX components
export const isYes = val =>
  val === true ||
  (typeof val === 'string' && val.toLowerCase().startsWith('y'));
