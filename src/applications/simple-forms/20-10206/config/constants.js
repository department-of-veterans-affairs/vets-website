export const PREPARER_TYPES = Object.freeze({
  CITIZEN: 'citizen',
  NON_CITIZEN: 'non-citizen',
  THIRD_PARTY: 'rep-citizen',
});
export const PREPARER_TYPE_LABELS = Object.freeze({
  [PREPARER_TYPES.CITIZEN]:
    'I’m a US citizen requesting my own personal VA records',
  [PREPARER_TYPES.NON_CITIZEN]:
    'I’m a non-US citizen requesting my own personal VA records',
  [PREPARER_TYPES.THIRD_PARTY]:
    'I’m a third-party or power of attorney requesting personal VA records on behalf of someone else',
});
