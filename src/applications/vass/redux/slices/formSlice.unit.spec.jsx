import { expect } from 'chai';
import formReducer, {
  setSelectedDate,
  setSelectedTopics,
  setObfuscatedEmail,
  setLowAuthFormData,
  setFlowType,
  clearFormData,
  hydrateFormData,
  loadFormDataFromStorage,
  selectSelectedDate,
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
  defaultVassFormState,
  createVassFormRootState,
} from '../../utils/test-utils';

describe('formSlice', () => {
  describe('reducer', () => {
    it('should return initial state', () => {
      const initialState = formReducer(undefined, { type: 'unknown' });
      expect(initialState).to.deep.equal(defaultVassFormState);
    });

    describe('setSelectedDate', () => {
      it('should set the selected date', () => {
        const dateString = '2025-01-15T10:00:00.000Z';
        const actual = formReducer(
          defaultVassFormState,
          setSelectedDate(dateString),
        );

        expect(actual.selectedDate).to.equal(dateString);
        expect(actual.selectedTopics).to.deep.equal([]);
      });

      it('should update the selected date when one already exists', () => {
        const initialState = {
          ...defaultVassFormState,
          selectedDate: '2025-01-15T10:00:00.000Z',
          selectedTopics: [{ topicId: '1', topicName: 'Topic 1' }],
        };
        const newDateString = '2025-02-20T14:30:00.000Z';
        const actual = formReducer(
          initialState,
          setSelectedDate(newDateString),
        );

        expect(actual.selectedDate).to.equal(newDateString);
        expect(actual.selectedTopics).to.deep.equal([
          { topicId: '1', topicName: 'Topic 1' },
        ]);
      });
    });

    describe('setSelectedTopics', () => {
      it('should set the selected topics', () => {
        const topics = [
          { topicId: '1', topicName: 'Topic 1' },
          { topicId: '2', topicName: 'Topic 2' },
          { topicId: '3', topicName: 'Topic 3' },
        ];
        const actual = formReducer(
          defaultVassFormState,
          setSelectedTopics(topics),
        );

        expect(actual.selectedTopics).to.deep.equal(topics);
        expect(actual.selectedDate).to.be.null;
      });

      it('should update the selected topics when some already exist', () => {
        const initialState = {
          ...defaultVassFormState,
          selectedDate: '2025-01-15T10:00:00.000Z',
          selectedTopics: [{ topicId: '1', topicName: 'Topic 1' }],
        };
        const newTopics = [
          { topicId: '2', topicName: 'Topic 2' },
          { topicId: '3', topicName: 'Topic 3' },
        ];
        const actual = formReducer(initialState, setSelectedTopics(newTopics));

        expect(actual.selectedTopics).to.deep.equal(newTopics);
        expect(actual.selectedDate).to.equal('2025-01-15T10:00:00.000Z');
      });

      it('should handle setting an empty topics array', () => {
        const initialState = {
          ...defaultVassFormState,
          selectedTopics: [
            { topicId: '1', topicName: 'Topic 1' },
            { topicId: '2', topicName: 'Topic 2' },
          ],
        };
        const actual = formReducer(initialState, setSelectedTopics([]));

        expect(actual.selectedTopics).to.deep.equal([]);
      });
    });

    describe('setObfuscatedEmail', () => {
      it('should set the obfuscated email', () => {
        const email = 't***@example.com';
        const actual = formReducer(
          defaultVassFormState,
          setObfuscatedEmail(email),
        );

        expect(actual.obfuscatedEmail).to.equal(email);
      });

      it('should update the obfuscated email when one already exists', () => {
        const initialState = {
          ...defaultVassFormState,
          obfuscatedEmail: 'old***@example.com',
        };
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
          defaultVassFormState,
          setLowAuthFormData(payload),
        );

        expect(actual.uuid).to.equal(payload.uuid);
        expect(actual.lastName).to.equal(payload.lastName);
        expect(actual.dob).to.equal(payload.dob);
      });

      it('should update uuid, lastname, and dob when they already exist', () => {
        const initialState = {
          ...defaultVassFormState,
          uuid: 'old-uuid',
          lastName: 'OldName',
          dob: '1980-05-20',
        };
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
          defaultVassFormState,
          setFlowType(FLOW_TYPES.SCHEDULE),
        );

        expect(actual.flowType).to.equal(FLOW_TYPES.SCHEDULE);
      });

      it('should set the flow type to cancel', () => {
        const actual = formReducer(
          defaultVassFormState,
          setFlowType(FLOW_TYPES.CANCEL),
        );

        expect(actual.flowType).to.equal(FLOW_TYPES.CANCEL);
      });

      it('should update the flow type when one already exists', () => {
        const initialState = {
          ...defaultVassFormState,
          flowType: FLOW_TYPES.SCHEDULE,
        };
        const actual = formReducer(
          initialState,
          setFlowType(FLOW_TYPES.CANCEL),
        );

        expect(actual.flowType).to.equal(FLOW_TYPES.CANCEL);
      });
    });

    describe('clearFormData', () => {
      it('should clear all form data including hydrated flag and reset flowType', () => {
        const initialState = {
          ...defaultVassFormState,
          hydrated: true,
          selectedDate: '2025-01-15T10:00:00.000Z',
          selectedTopics: [
            { topicId: '1', topicName: 'Topic 1' },
            { topicId: '2', topicName: 'Topic 2' },
          ],
          obfuscatedEmail: 't***@example.com',
          uuid: 'c0ffee-1234-beef-5678',
          lastName: 'Doe',
          dob: '1990-01-15',
          flowType: FLOW_TYPES.CANCEL,
        };
        const actual = formReducer(initialState, clearFormData());

        expect(actual).to.deep.equal(defaultVassFormState);
      });

      it('should return initial state when clearing already empty data', () => {
        const actual = formReducer(defaultVassFormState, clearFormData());

        expect(actual).to.deep.equal(defaultVassFormState);
      });
    });

    describe('hydrateFormData', () => {
      it('should set hydrated to true and merge payload', () => {
        const payload = {
          selectedDate: '2025-03-01T10:00:00.000Z',
          selectedTopics: [{ topicId: '1', topicName: 'Topic 1' }],
          uuid: null,
        };
        const actual = formReducer(undefined, hydrateFormData(payload));

        expect(actual.hydrated).to.be.true;
        expect(actual.selectedDate).to.equal(payload.selectedDate);
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
          selectedDate: '2025-04-01T14:00:00.000Z',
          selectedTopics: [{ topicId: '2', topicName: 'Topic 2' }],
          flowType: FLOW_TYPES.CANCEL,
        };
        const actual = formReducer(undefined, hydrateFormData(payload));

        expect(actual.hydrated).to.be.true;
        expect(actual.uuid).to.equal(payload.uuid);
        expect(actual.lastName).to.equal(payload.lastName);
        expect(actual.dob).to.equal(payload.dob);
        expect(actual.obfuscatedEmail).to.equal(payload.obfuscatedEmail);
        expect(actual.selectedDate).to.equal(payload.selectedDate);
        expect(actual.selectedTopics).to.deep.equal(payload.selectedTopics);
        expect(actual.flowType).to.equal(FLOW_TYPES.CANCEL);
      });

      it('should only flip hydrated when payload is empty', () => {
        const actual = formReducer(undefined, hydrateFormData({}));

        expect(actual.hydrated).to.be.true;
        expect(actual.selectedDate).to.be.null;
        expect(actual.selectedTopics).to.deep.equal([]);
        expect(actual.uuid).to.be.null;
        expect(actual.flowType).to.equal(FLOW_TYPES.ANY);
      });
    });
  });

  describe('selectors', () => {
    describe('selectSelectedDate', () => {
      it('should select the date from state', () => {
        const state = createVassFormRootState({
          selectedDate: '2025-01-15T10:00:00.000Z',
        });
        const result = selectSelectedDate(state);
        expect(result).to.equal('2025-01-15T10:00:00.000Z');
      });

      it('should return null when no date is selected', () => {
        const state = createVassFormRootState();
        const result = selectSelectedDate(state);
        expect(result).to.be.null;
      });
    });

    describe('selectSelectedTopics', () => {
      it('should select the topics from state', () => {
        const topics = [
          { topicId: '1', topicName: 'Topic 1' },
          { topicId: '2', topicName: 'Topic 2' },
        ];
        const state = createVassFormRootState({ selectedTopics: topics });
        const result = selectSelectedTopics(state);
        expect(result).to.deep.equal(topics);
      });

      it('should return empty array when no topics are selected', () => {
        const state = createVassFormRootState();
        const result = selectSelectedTopics(state);
        expect(result).to.deep.equal([]);
      });
    });

    describe('selectHydrated', () => {
      it('should return hydration flag', () => {
        const state = createVassFormRootState({ hydrated: true });
        const result = selectHydrated(state);
        expect(result).to.be.true;
      });
    });

    describe('selectObfuscatedEmail', () => {
      it('should select the obfuscated email from state', () => {
        const state = createVassFormRootState({
          obfuscatedEmail: 't***@example.com',
        });
        const result = selectObfuscatedEmail(state);
        expect(result).to.equal('t***@example.com');
      });

      it('should return null when no obfuscated email is set', () => {
        const state = createVassFormRootState();
        const result = selectObfuscatedEmail(state);
        expect(result).to.be.null;
      });
    });

    describe('selectUuid', () => {
      it('should select the uuid from state', () => {
        const state = createVassFormRootState({
          uuid: 'c0ffee-1234-beef-5678',
        });
        const result = selectUuid(state);
        expect(result).to.equal('c0ffee-1234-beef-5678');
      });
    });

    describe('selectLastName', () => {
      it('should select the lastname from state', () => {
        const state = createVassFormRootState({ lastName: 'Doe' });
        const result = selectLastName(state);
        expect(result).to.equal('Doe');
      });

      it('should return null when no lastname is set', () => {
        const state = createVassFormRootState();
        const result = selectLastName(state);
        expect(result).to.be.null;
      });
    });

    describe('selectDob', () => {
      it('should select the dob from state', () => {
        const state = createVassFormRootState({ dob: '1990-01-15' });
        const result = selectDob(state);
        expect(result).to.equal('1990-01-15');
      });

      it('should return null when no dob is set', () => {
        const state = createVassFormRootState();
        const result = selectDob(state);
        expect(result).to.be.null;
      });
    });

    describe('selectFlowType', () => {
      it('should select the flowType from state', () => {
        const state = createVassFormRootState({
          flowType: FLOW_TYPES.SCHEDULE,
        });
        const result = selectFlowType(state);
        expect(result).to.equal(FLOW_TYPES.SCHEDULE);
      });

      it('should return cancel when flowType is cancel', () => {
        const state = createVassFormRootState({ flowType: FLOW_TYPES.CANCEL });
        const result = selectFlowType(state);
        expect(result).to.equal(FLOW_TYPES.CANCEL);
      });

      it('should return any when flowType is any (default)', () => {
        const state = createVassFormRootState();
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
      const formData = {
        selectedDate: '2025-01-15T10:00:00.000Z',
        selectedTopics: [{ topicId: '1', topicName: 'Topic 1' }],
        uuid: 'test-uuid',
      };
      sessionStorage.setItem('vass_current_uuid', JSON.stringify('test-uuid'));
      sessionStorage.setItem('vass_form', JSON.stringify(formData));

      const result = loadFormDataFromStorage();
      expect(result).to.deep.equal(formData);
    });
  });
});
