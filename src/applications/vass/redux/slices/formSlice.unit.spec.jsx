import { expect } from 'chai';
import formReducer, {
  setSelectedDate,
  setSelectedTopics,
  setObfuscatedEmail,
  setLowAuthFormData,
  clearFormData,
  hydrateFormData,
  loadFormDataFromStorage,
  selectSelectedDate,
  selectSelectedTopics,
  selectHydrated,
  selectObfuscatedEmail,
  selectUuid,
  selectLastname,
  selectDob,
} from './formSlice';

describe('formSlice', () => {
  describe('reducer', () => {
    it('should return initial state', () => {
      const initialState = formReducer(undefined, { type: 'unknown' });
      expect(initialState).to.deep.equal({
        hydrated: false,
        selectedDate: null,
        selectedTopics: [],
        obfuscatedEmail: null,
        uuid: null,
        lastname: null,
        dob: null,
      });
    });

    describe('setSelectedDate', () => {
      it('should set the selected date', () => {
        const initialState = {
          hydrated: false,
          selectedDate: null,
          selectedTopics: [],
          obfuscatedEmail: null,
          uuid: null,
          lastname: null,
          dob: null,
        };
        const dateString = '2025-01-15T10:00:00.000Z';
        const actual = formReducer(initialState, setSelectedDate(dateString));

        expect(actual.selectedDate).to.equal(dateString);
        expect(actual.selectedTopics).to.deep.equal([]);
      });

      it('should update the selected date when one already exists', () => {
        const initialState = {
          hydrated: false,
          selectedDate: '2025-01-15T10:00:00.000Z',
          selectedTopics: ['topic-1'],
          obfuscatedEmail: null,
          uuid: null,
          lastname: null,
          dob: null,
        };
        const newDateString = '2025-02-20T14:30:00.000Z';
        const actual = formReducer(
          initialState,
          setSelectedDate(newDateString),
        );

        expect(actual.selectedDate).to.equal(newDateString);
        expect(actual.selectedTopics).to.deep.equal(['topic-1']);
      });
    });

    describe('setSelectedTopics', () => {
      it('should set the selected topics', () => {
        const initialState = {
          hydrated: false,
          selectedDate: null,
          selectedTopics: [],
          obfuscatedEmail: null,
          uuid: null,
          lastname: null,
          dob: null,
        };
        const topics = ['topic-1', 'topic-2', 'topic-3'];
        const actual = formReducer(initialState, setSelectedTopics(topics));

        expect(actual.selectedTopics).to.deep.equal(topics);
        expect(actual.selectedDate).to.be.null;
      });

      it('should update the selected topics when some already exist', () => {
        const initialState = {
          hydrated: false,
          selectedDate: '2025-01-15T10:00:00.000Z',
          selectedTopics: ['topic-1'],
          obfuscatedEmail: null,
          uuid: null,
          lastname: null,
          dob: null,
        };
        const newTopics = ['topic-2', 'topic-3'];
        const actual = formReducer(initialState, setSelectedTopics(newTopics));

        expect(actual.selectedTopics).to.deep.equal(newTopics);
        expect(actual.selectedDate).to.equal('2025-01-15T10:00:00.000Z');
      });

      it('should handle setting an empty topics array', () => {
        const initialState = {
          hydrated: false,
          selectedDate: null,
          selectedTopics: ['topic-1', 'topic-2'],
          obfuscatedEmail: null,
          uuid: null,
          lastname: null,
          dob: null,
        };
        const actual = formReducer(initialState, setSelectedTopics([]));

        expect(actual.selectedTopics).to.deep.equal([]);
      });
    });

    describe('setObfuscatedEmail', () => {
      it('should set the obfuscated email', () => {
        const initialState = {
          hydrated: false,
          selectedDate: null,
          selectedTopics: [],
          obfuscatedEmail: null,
          uuid: null,
          lastname: null,
          dob: null,
        };
        const email = 't***@example.com';
        const actual = formReducer(initialState, setObfuscatedEmail(email));

        expect(actual.obfuscatedEmail).to.equal(email);
      });

      it('should update the obfuscated email when one already exists', () => {
        const initialState = {
          hydrated: false,
          selectedDate: null,
          selectedTopics: [],
          obfuscatedEmail: 'old***@example.com',
          uuid: null,
          lastname: null,
          dob: null,
        };
        const newEmail = 'new***@example.com';
        const actual = formReducer(initialState, setObfuscatedEmail(newEmail));

        expect(actual.obfuscatedEmail).to.equal(newEmail);
      });
    });

    describe('setLowAuthFormData', () => {
      it('should set uuid, lastname, and dob', () => {
        const initialState = {
          hydrated: false,
          selectedDate: null,
          selectedTopics: [],
          obfuscatedEmail: null,
          uuid: null,
          lastname: null,
          dob: null,
        };
        const payload = {
          uuid: 'c0ffee-1234-beef-5678',
          lastname: 'Doe',
          dob: '1990-01-15',
        };
        const actual = formReducer(initialState, setLowAuthFormData(payload));

        expect(actual.uuid).to.equal(payload.uuid);
        expect(actual.lastname).to.equal(payload.lastname);
        expect(actual.dob).to.equal(payload.dob);
      });

      it('should update uuid, lastname, and dob when they already exist', () => {
        const initialState = {
          hydrated: false,
          selectedDate: null,
          selectedTopics: [],
          obfuscatedEmail: null,
          uuid: 'old-uuid',
          lastname: 'OldName',
          dob: '1980-05-20',
        };
        const payload = {
          uuid: 'new-uuid',
          lastname: 'NewName',
          dob: '1995-12-25',
        };
        const actual = formReducer(initialState, setLowAuthFormData(payload));

        expect(actual.uuid).to.equal(payload.uuid);
        expect(actual.lastname).to.equal(payload.lastname);
        expect(actual.dob).to.equal(payload.dob);
      });
    });

    describe('clearFormData', () => {
      it('should clear all form data including hydrated flag', () => {
        const initialState = {
          hydrated: true,
          selectedDate: '2025-01-15T10:00:00.000Z',
          selectedTopics: ['topic-1', 'topic-2'],
          obfuscatedEmail: 't***@example.com',
          uuid: 'c0ffee-1234-beef-5678',
          lastname: 'Doe',
          dob: '1990-01-15',
        };
        const actual = formReducer(initialState, clearFormData());

        expect(actual.hydrated).to.be.false;
        expect(actual.selectedDate).to.be.null;
        expect(actual.selectedTopics).to.deep.equal([]);
        expect(actual.obfuscatedEmail).to.be.null;
        expect(actual.uuid).to.be.null;
        expect(actual.lastname).to.be.null;
        expect(actual.dob).to.be.null;
      });

      it('should return initial state when clearing already empty data', () => {
        const initialState = {
          hydrated: false,
          selectedDate: null,
          selectedTopics: [],
          obfuscatedEmail: null,
          uuid: null,
          lastname: null,
          dob: null,
        };
        const actual = formReducer(initialState, clearFormData());

        expect(actual.hydrated).to.be.false;
        expect(actual.selectedDate).to.be.null;
        expect(actual.selectedTopics).to.deep.equal([]);
        expect(actual.obfuscatedEmail).to.be.null;
        expect(actual.uuid).to.be.null;
        expect(actual.lastname).to.be.null;
        expect(actual.dob).to.be.null;
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
      });

      it('should hydrate all form fields from payload', () => {
        const payload = {
          uuid: 'test-uuid',
          lastname: 'Smith',
          dob: '1985-05-15',
          obfuscatedEmail: 's***@example.com',
          selectedDate: '2025-04-01T14:00:00.000Z',
          selectedTopics: [{ topicId: '2', topicName: 'Topic 2' }],
        };
        const actual = formReducer(undefined, hydrateFormData(payload));

        expect(actual.hydrated).to.be.true;
        expect(actual.uuid).to.equal(payload.uuid);
        expect(actual.lastname).to.equal(payload.lastname);
        expect(actual.dob).to.equal(payload.dob);
        expect(actual.obfuscatedEmail).to.equal(payload.obfuscatedEmail);
        expect(actual.selectedDate).to.equal(payload.selectedDate);
        expect(actual.selectedTopics).to.deep.equal(payload.selectedTopics);
      });

      it('should only flip hydrated when payload is empty', () => {
        const actual = formReducer(undefined, hydrateFormData({}));

        expect(actual.hydrated).to.be.true;
        expect(actual.selectedDate).to.be.null;
        expect(actual.selectedTopics).to.deep.equal([]);
        expect(actual.uuid).to.be.null;
      });
    });
  });

  describe('selectors', () => {
    describe('selectSelectedDate', () => {
      it('should select the date from state', () => {
        const state = {
          vassForm: {
            hydrated: false,
            selectedDate: '2025-01-15T10:00:00.000Z',
            selectedTopics: [],
            obfuscatedEmail: null,
            uuid: null,
            lastname: null,
            dob: null,
          },
        };
        const result = selectSelectedDate(state);
        expect(result).to.equal('2025-01-15T10:00:00.000Z');
      });

      it('should return null when no date is selected', () => {
        const state = {
          vassForm: {
            hydrated: false,
            selectedDate: null,
            selectedTopics: [],
            obfuscatedEmail: null,
            uuid: null,
            lastname: null,
            dob: null,
          },
        };
        const result = selectSelectedDate(state);
        expect(result).to.be.null;
      });
    });

    describe('selectSelectedTopics', () => {
      it('should select the topics from state', () => {
        const state = {
          vassForm: {
            hydrated: false,
            selectedDate: null,
            selectedTopics: ['topic-1', 'topic-2'],
            obfuscatedEmail: null,
            uuid: null,
            lastname: null,
            dob: null,
          },
        };
        const result = selectSelectedTopics(state);
        expect(result).to.deep.equal(['topic-1', 'topic-2']);
      });

      it('should return empty array when no topics are selected', () => {
        const state = {
          vassForm: {
            hydrated: false,
            selectedDate: null,
            selectedTopics: [],
            obfuscatedEmail: null,
            uuid: null,
            lastname: null,
            dob: null,
          },
        };
        const result = selectSelectedTopics(state);
        expect(result).to.deep.equal([]);
      });
    });

    describe('selectHydrated', () => {
      it('should return hydration flag', () => {
        const state = {
          vassForm: {
            hydrated: true,
            selectedDate: null,
            selectedTopics: [],
            obfuscatedEmail: null,
            uuid: null,
            lastname: null,
            dob: null,
          },
        };
        const result = selectHydrated(state);
        expect(result).to.be.true;
      });
    });

    describe('selectObfuscatedEmail', () => {
      it('should select the obfuscated email from state', () => {
        const state = {
          vassForm: {
            hydrated: false,
            selectedDate: null,
            selectedTopics: [],
            obfuscatedEmail: 't***@example.com',
            uuid: null,
            lastname: null,
            dob: null,
          },
        };
        const result = selectObfuscatedEmail(state);
        expect(result).to.equal('t***@example.com');
      });

      it('should return null when no obfuscated email is set', () => {
        const state = {
          vassForm: {
            hydrated: false,
            selectedDate: null,
            selectedTopics: [],
            obfuscatedEmail: null,
            uuid: null,
            lastname: null,
            dob: null,
          },
        };
        const result = selectObfuscatedEmail(state);
        expect(result).to.be.null;
      });
    });

    describe('selectUuid', () => {
      it('should select the uuid from state', () => {
        const state = {
          vassForm: {
            hydrated: false,
            selectedDate: null,
            selectedTopics: [],
            obfuscatedEmail: null,
            uuid: 'c0ffee-1234-beef-5678',
            lastname: null,
            dob: null,
          },
        };
        const result = selectUuid(state);
        expect(result).to.equal('c0ffee-1234-beef-5678');
      });
    });

    describe('selectLastname', () => {
      it('should select the lastname from state', () => {
        const state = {
          vassForm: {
            hydrated: false,
            selectedDate: null,
            selectedTopics: [],
            obfuscatedEmail: null,
            uuid: null,
            lastname: 'Doe',
            dob: null,
          },
        };
        const result = selectLastname(state);
        expect(result).to.equal('Doe');
      });

      it('should return null when no lastname is set', () => {
        const state = {
          vassForm: {
            hydrated: false,
            selectedDate: null,
            selectedTopics: [],
            obfuscatedEmail: null,
            uuid: null,
            lastname: null,
            dob: null,
          },
        };
        const result = selectLastname(state);
        expect(result).to.be.null;
      });
    });

    describe('selectDob', () => {
      it('should select the dob from state', () => {
        const state = {
          vassForm: {
            hydrated: false,
            selectedDate: null,
            selectedTopics: [],
            obfuscatedEmail: null,
            uuid: null,
            lastname: null,
            dob: '1990-01-15',
          },
        };
        const result = selectDob(state);
        expect(result).to.equal('1990-01-15');
      });

      it('should return null when no dob is set', () => {
        const state = {
          vassForm: {
            hydrated: false,
            selectedDate: null,
            selectedTopics: [],
            obfuscatedEmail: null,
            uuid: null,
            lastname: null,
            dob: null,
          },
        };
        const result = selectDob(state);
        expect(result).to.be.null;
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
