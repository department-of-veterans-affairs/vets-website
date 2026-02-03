import { FLOW_TYPES } from './constants';

/**
 * @typedef {{ topicId: string, topicName: string }} Topic
 */

/**
 * Default empty slot object for form state
 */
export const emptySlot = {
  dtStartUtc: null,
  dtEndUtc: null,
};

/**
 * Creates a Topic object for testing.
 *
 * @param {string} id - The topic ID
 * @param {string} [name] - The topic name (defaults to "Topic {id}")
 * @returns {Topic}
 *
 * @example
 * createTopic('1') // { topicId: '1', topicName: 'Topic 1' }
 * createTopic('abc', 'Custom Name') // { topicId: 'abc', topicName: 'Custom Name' }
 */
export const createTopic = (id, name) => ({
  topicId: id,
  topicName: name || `Topic ${id}`,
});

/**
 * Creates an array of Topic objects for testing.
 *
 * @param {...string} ids - Topic IDs to create
 * @returns {Topic[]}
 *
 * @example
 * createTopics('1', '2', '3')
 * // [{ topicId: '1', topicName: 'Topic 1' }, { topicId: '2', topicName: 'Topic 2' }, ...]
 */
export const createTopics = (...ids) => ids.map(id => createTopic(id));

/**
 * Default initial form state for the vassForm slice.
 * Use this as the base for creating test states.
 */
export const defaultFormState = {
  hydrated: false,
  selectedSlot: { ...emptySlot },
  selectedTopics: [],
  obfuscatedEmail: null,
  uuid: null,
  lastName: null,
  dob: null,
  flowType: FLOW_TYPES.ANY,
};

/**
 * Creates a form slice state with optional overrides.
 * Use for reducer tests where you need the raw slice state.
 *
 * @param {Object} overrides - Override values for state fields
 * @returns {Object} Form slice state
 *
 * @example
 * // Default empty state
 * const state = createFormState();
 *
 * @example
 * // With specific overrides
 * const state = createFormState({
 *   hydrated: true,
 *   uuid: 'test-uuid',
 *   selectedSlot: { dtStartUtc: '2025-01-15T10:00:00.000Z', dtEndUtc: '2025-01-15T11:00:00.000Z' },
 * });
 */
export const createFormState = (overrides = {}) => ({
  ...defaultFormState,
  selectedSlot: {
    ...emptySlot,
    ...(overrides.selectedSlot || {}),
  },
  ...overrides,
});

/**
 * Creates a root redux state with vassForm slice for selector tests.
 * Wraps the form state in { vassForm: {...} } structure.
 *
 * @param {Object} overrides - Override values for vassForm state fields
 * @returns {Object} Root state with vassForm slice
 *
 * @example
 * // Default state for selectors
 * const state = createRootFormState();
 * const result = selectUuid(state); // null
 *
 * @example
 * // With overrides
 * const state = createRootFormState({ uuid: 'test-uuid' });
 * const result = selectUuid(state); // 'test-uuid'
 */
export const createRootFormState = (overrides = {}) => ({
  vassForm: createFormState(overrides),
});
