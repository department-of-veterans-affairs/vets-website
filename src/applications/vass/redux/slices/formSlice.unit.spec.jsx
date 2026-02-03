import { expect } from 'chai';
import formReducer, {
  setSelectedSlot,
  setSelectedTopics,
  setObfuscatedEmail,
  setLowAuthFormData,
  setFlowType,
  clearFormData,
  hydrateFormData,
  loadFormDataFromStorage,
  selectSelectedSlot,
  selectSelectedTopics,
  selectHydrated,
  selectObfuscatedEmail,
  selectUuid,
  selectLastName,
  selectDob,
  selectFlowType,
} from './formSlice';
import { FLOW_TYPES } from '../../utils/constants';
import {
  createFormState,
  createRootFormState,
  createTopic,
  createTopics,
  defaultFormState,
  emptySlot,
} from '../../utils/form';

describe('formSlice', () => {
  describe('reducer', () => {
    it('should return initial state', () => {
      const initialState = formReducer(undefined, { type: 'unknown' });
      expect(initialState).to.deep.equal(defaultFormState);
    });

    describe('setSelectedSlot', () => {
      it('should set the selected slot', () => {
        const slot = {
          dtStartUtc: '2025-01-15T10:00:00.000Z',
          dtEndUtc: '2025-01-15T11:00:00.000Z',
        };
        const actual = formReducer(createFormState(), setSelectedSlot(slot));

        expect(actual.selectedSlot).to.deep.equal(slot);
        expect(actual.selectedTopics).to.deep.equal([]);
      });

      it('should update the selected slot when one already exists', () => {
        const initialState = createFormState({
          selectedSlot: {
            dtStartUtc: '2025-01-15T10:00:00.000Z',
            dtEndUtc: '2025-01-15T11:00:00.000Z',
          },
          selectedTopics: [createTopic('1')],
        });
        const newSlot = {
          dtStartUtc: '2025-02-20T14:30:00.000Z',
          dtEndUtc: '2025-02-20T15:30:00.000Z',
        };
        const actual = formReducer(initialState, setSelectedSlot(newSlot));

        expect(actual.selectedSlot).to.deep.equal(newSlot);
        expect(actual.selectedTopics).to.deep.equal([createTopic('1')]);
      });
    });

    describe('setSelectedTopics', () => {
      it('should set the selected topics', () => {
        const topics = createTopics('1', '2', '3');
        const actual = formReducer(
          createFormState(),
          setSelectedTopics(topics),
        );

        expect(actual.selectedTopics).to.deep.equal(topics);
        expect(actual.selectedSlot.dtStartUtc).to.be.null;
      });

      it('should update the selected topics when some already exist', () => {
        const initialState = createFormState({
          selectedSlot: {
            dtStartUtc: '2025-01-15T10:00:00.000Z',
            dtEndUtc: '2025-01-15T11:00:00.000Z',
          },
          selectedTopics: [createTopic('1')],
        });
        const newTopics = createTopics('2', '3');
        const actual = formReducer(initialState, setSelectedTopics(newTopics));

        expect(actual.selectedTopics).to.deep.equal(newTopics);
        expect(actual.selectedSlot.dtStartUtc).to.equal(
          '2025-01-15T10:00:00.000Z',
        );
      });

      it('should handle setting an empty topics array', () => {
        const initialState = createFormState({
          selectedTopics: createTopics('1', '2'),
        });
        const actual = formReducer(initialState, setSelectedTopics([]));

        expect(actual.selectedTopics).to.deep.equal([]);
      });
    });

    describe('setObfuscatedEmail', () => {
      it('should set the obfuscated email', () => {
        const email = 't***@example.com';
        const actual = formReducer(
          createFormState(),
          setObfuscatedEmail(email),
        );

        expect(actual.obfuscatedEmail).to.equal(email);
      });

      it('should update the obfuscated email when one already exists', () => {
        const initialState = createFormState({
          obfuscatedEmail: 'old***@example.com',
        });
        const newEmail = 'new***@example.com';
        const actual = formReducer(initialState, setObfuscatedEmail(newEmail));

        expect(actual.obfuscatedEmail).to.equal(newEmail);
      });
    });

    describe('setLowAuthFormData', () => {
      it('should set uuid, lastname, and dob', () => {
        const payload = {
          uuid: 'c0ffee-1234-beef-5678',
          lastName: 'Doe',
          dob: '1990-01-15',
        };
        const actual = formReducer(
          createFormState(),
          setLowAuthFormData(payload),
        );

        expect(actual.uuid).to.equal(payload.uuid);
        expect(actual.lastName).to.equal(payload.lastName);
        expect(actual.dob).to.equal(payload.dob);
      });

      it('should update uuid, lastname, and dob when they already exist', () => {
        const initialState = createFormState({
          uuid: 'old-uuid',
          lastName: 'OldName',
          dob: '1980-05-20',
        });
        const payload = {
          uuid: 'new-uuid',
          lastName: 'NewName',
          dob: '1995-12-25',
        };
        const actual = formReducer(initialState, setLowAuthFormData(payload));

        expect(actual.uuid).to.equal(payload.uuid);
        expect(actual.lastName).to.equal(payload.lastName);
        expect(actual.dob).to.equal(payload.dob);
      });
    });

    describe('setFlowType', () => {
      it('should set the flow type to schedule', () => {
        const actual = formReducer(
          createFormState(),
          setFlowType(FLOW_TYPES.SCHEDULE),
        );

        expect(actual.flowType).to.equal(FLOW_TYPES.SCHEDULE);
      });

      it('should set the flow type to cancel', () => {
        const actual = formReducer(
          createFormState(),
          setFlowType(FLOW_TYPES.CANCEL),
        );

        expect(actual.flowType).to.equal(FLOW_TYPES.CANCEL);
      });

      it('should update the flow type when one already exists', () => {
        const initialState = createFormState({
          flowType: FLOW_TYPES.SCHEDULE,
        });
        const actual = formReducer(
          initialState,
          setFlowType(FLOW_TYPES.CANCEL),
        );

        expect(actual.flowType).to.equal(FLOW_TYPES.CANCEL);
      });
    });

    describe('clearFormData', () => {
      it('should clear all form data including hydrated flag and reset flowType', () => {
        const initialState = createFormState({
          hydrated: true,
          selectedSlot: {
            dtStartUtc: '2025-01-15T10:00:00.000Z',
            dtEndUtc: '2025-01-15T11:00:00.000Z',
          },
          selectedTopics: createTopics('1', '2'),
          obfuscatedEmail: 't***@example.com',
          uuid: 'c0ffee-1234-beef-5678',
          lastName: 'Doe',
          dob: '1990-01-15',
          flowType: FLOW_TYPES.CANCEL,
        });
        const actual = formReducer(initialState, clearFormData());

        expect(actual.hydrated).to.be.false;
        expect(actual.selectedSlot).to.deep.equal(emptySlot);
        expect(actual.selectedTopics).to.deep.equal([]);
        expect(actual.obfuscatedEmail).to.be.null;
        expect(actual.uuid).to.be.null;
        expect(actual.lastname).to.be.null;
        expect(actual.dob).to.be.null;
        expect(actual.flowType).to.equal(FLOW_TYPES.ANY);
      });

      it('should return initial state when clearing already empty data', () => {
        const actual = formReducer(createFormState(), clearFormData());

        expect(actual.hydrated).to.be.false;
        expect(actual.selectedSlot).to.deep.equal(emptySlot);
        expect(actual.selectedTopics).to.deep.equal([]);
        expect(actual.obfuscatedEmail).to.be.null;
        expect(actual.uuid).to.be.null;
        expect(actual.lastname).to.be.null;
        expect(actual.dob).to.be.null;
        expect(actual.flowType).to.equal(FLOW_TYPES.ANY);
      });
    });

    describe('hydrateFormData', () => {
      it('should set hydrated to true and merge payload', () => {
        const payload = {
          selectedSlot: {
            dtStartUtc: '2025-03-01T10:00:00.000Z',
            dtEndUtc: '2025-03-01T11:00:00.000Z',
          },
          selectedTopics: [{ topicId: '1', topicName: 'Topic 1' }],
          uuid: null,
        };
        const actual = formReducer(undefined, hydrateFormData(payload));

        expect(actual.hydrated).to.be.true;
        expect(actual.selectedSlot).to.deep.equal(payload.selectedSlot);
        expect(actual.selectedTopics).to.deep.equal(payload.selectedTopics);
        expect(actual.uuid).to.be.null;
        expect(actual.flowType).to.equal(FLOW_TYPES.ANY);
      });

      it('should hydrate all form fields from payload including flowType', () => {
        const payload = {
          uuid: 'test-uuid',
          lastName: 'Smith',
          dob: '1985-05-15',
          obfuscatedEmail: 's***@example.com',
          selectedSlot: {
            dtStartUtc: '2025-04-01T14:00:00.000Z',
            dtEndUtc: '2025-04-01T15:00:00.000Z',
          },
          selectedTopics: [{ topicId: '2', topicName: 'Topic 2' }],
          flowType: FLOW_TYPES.CANCEL,
        };
        const actual = formReducer(undefined, hydrateFormData(payload));

        expect(actual.hydrated).to.be.true;
        expect(actual.uuid).to.equal(payload.uuid);
        expect(actual.lastName).to.equal(payload.lastName);
        expect(actual.dob).to.equal(payload.dob);
        expect(actual.obfuscatedEmail).to.equal(payload.obfuscatedEmail);
        expect(actual.selectedSlot).to.deep.equal(payload.selectedSlot);
        expect(actual.selectedTopics).to.deep.equal(payload.selectedTopics);
        expect(actual.flowType).to.equal(FLOW_TYPES.CANCEL);
      });

      it('should only flip hydrated when payload is empty', () => {
        const actual = formReducer(undefined, hydrateFormData({}));

        expect(actual.hydrated).to.be.true;
        expect(actual.selectedSlot).to.deep.equal(emptySlot);
        expect(actual.selectedTopics).to.deep.equal([]);
        expect(actual.uuid).to.be.null;
        expect(actual.flowType).to.equal(FLOW_TYPES.ANY);
      });
    });
  });

  describe('selectors', () => {
    describe('selectSelectedSlot', () => {
      it('should select the slot from state', () => {
        const selectedSlot = {
          dtStartUtc: '2025-01-15T10:00:00.000Z',
          dtEndUtc: '2025-01-15T11:00:00.000Z',
        };
        const state = createRootFormState({ selectedSlot });
        const result = selectSelectedSlot(state);
        expect(result).to.deep.equal(selectedSlot);
      });

      it('should return empty slot when no slot is selected', () => {
        const state = createRootFormState();
        const result = selectSelectedSlot(state);
        expect(result).to.deep.equal(emptySlot);
      });
    });

    describe('selectSelectedTopics', () => {
      it('should select the topics from state', () => {
        const topics = createTopics('1', '2');
        const state = createRootFormState({ selectedTopics: topics });
        const result = selectSelectedTopics(state);
        expect(result).to.deep.equal(topics);
        expect(result).to.deep.equal(topics);
      });

      it('should return empty array when no topics are selected', () => {
        const state = createRootFormState();
        const result = selectSelectedTopics(state);
        expect(result).to.deep.equal([]);
      });
    });

    describe('selectHydrated', () => {
      it('should return hydration flag', () => {
        const state = createRootFormState({ hydrated: true });
        const result = selectHydrated(state);
        expect(result).to.be.true;
      });
    });

    describe('selectObfuscatedEmail', () => {
      it('should select the obfuscated email from state', () => {
        const state = createRootFormState({
          obfuscatedEmail: 't***@example.com',
        });
        const result = selectObfuscatedEmail(state);
        expect(result).to.equal('t***@example.com');
      });

      it('should return null when no obfuscated email is set', () => {
        const state = createRootFormState();
        const result = selectObfuscatedEmail(state);
        expect(result).to.be.null;
      });
    });

    describe('selectUuid', () => {
      it('should select the uuid from state', () => {
        const state = createRootFormState({ uuid: 'c0ffee-1234-beef-5678' });
        const result = selectUuid(state);
        expect(result).to.equal('c0ffee-1234-beef-5678');
      });
    });

    describe('selectLastName', () => {
      it('should select the lastname from state', () => {
        const state = createRootFormState({ lastname: 'Doe' });
        const result = selectLastname(state);
        expect(result).to.equal('Doe');
      });

      it('should return null when no lastname is set', () => {
        const state = createRootFormState();
        const result = selectLastname(state);
        expect(result).to.be.null;
      });
    });

    describe('selectDob', () => {
      it('should select the dob from state', () => {
        const state = createRootFormState({ dob: '1990-01-15' });
        const result = selectDob(state);
        expect(result).to.equal('1990-01-15');
      });

      it('should return null when no dob is set', () => {
        const state = createRootFormState();
        const result = selectDob(state);
        expect(result).to.be.null;
      });
    });

    describe('selectFlowType', () => {
      it('should select the flowType from state', () => {
        const state = createRootFormState({ flowType: FLOW_TYPES.SCHEDULE });
        const result = selectFlowType(state);
        expect(result).to.equal(FLOW_TYPES.SCHEDULE);
      });

      it('should return cancel when flowType is cancel', () => {
        const state = createRootFormState({ flowType: FLOW_TYPES.CANCEL });
        const result = selectFlowType(state);
        expect(result).to.equal(FLOW_TYPES.CANCEL);
      });

      it('should return any when flowType is any (default)', () => {
        const state = createRootFormState();
        const result = selectFlowType(state);
        expect(result).to.equal(FLOW_TYPES.ANY);
      });
    });
  });

  describe('loadFormDataFromStorage', () => {
    beforeEach(() => {
      sessionStorage.clear();
    });

    afterEach(() => {
      sessionStorage.clear();
    });

    it('should return null when no UUID is stored', () => {
      const result = loadFormDataFromStorage();
      expect(result).to.be.null;
    });

    it('should return null when UUID exists but no form data is stored', () => {
      sessionStorage.setItem('vass_current_uuid', JSON.stringify('test-uuid'));
      const result = loadFormDataFromStorage();
      expect(result).to.be.null;
    });

    it('should return form data when UUID and form data are stored', () => {
      const formData = createFormState({
        selectedSlot: {
          dtStartUtc: '2025-01-15T10:00:00.000Z',
          dtEndUtc: '2025-01-15T11:00:00.000Z',
        },
        selectedTopics: [{ topicId: '1', topicName: 'Topic 1' }],
        uuid: 'test-uuid',
      });
      sessionStorage.setItem('vass_current_uuid', JSON.stringify('test-uuid'));
      sessionStorage.setItem('vass_form', JSON.stringify(formData));

      const result = loadFormDataFromStorage();
      expect(result).to.deep.equal(formData);
    });
  });
});
