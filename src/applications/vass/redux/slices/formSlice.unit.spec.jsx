import { expect } from 'chai';
import formReducer, {
  setSelectedDate,
  setSelectedTopics,
  setToken,
  setObfuscatedEmail,
  clearFormData,
  hydrateFormData,
  selectSelectedDate,
  selectSelectedTopics,
  selectHydrated,
  selectToken,
  selectObfuscatedEmail,
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
        token: null,
      });
    });

    describe('setSelectedDate', () => {
      it('should set the selected date', () => {
        const initialState = {
          hydrated: false,
          selectedDate: null,
          selectedTopics: [],
          obfuscatedEmail: null,
          token: null,
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
          token: null,
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
          token: null,
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
          token: null,
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
          token: null,
        };
        const actual = formReducer(initialState, setSelectedTopics([]));

        expect(actual.selectedTopics).to.deep.equal([]);
      });
    });

    describe('setToken', () => {
      it('should set the token', () => {
        const initialState = {
          hydrated: false,
          selectedDate: null,
          selectedTopics: [],
          obfuscatedEmail: null,
          token: null,
        };
        const token = 'abc123';
        const actual = formReducer(initialState, setToken(token));

        expect(actual.token).to.equal(token);
      });

      it('should update the token when one already exists', () => {
        const initialState = {
          hydrated: false,
          selectedDate: null,
          selectedTopics: [],
          obfuscatedEmail: null,
          token: 'old-token',
        };
        const newToken = 'new-token';
        const actual = formReducer(initialState, setToken(newToken));

        expect(actual.token).to.equal(newToken);
      });
    });

    describe('setObfuscatedEmail', () => {
      it('should set the obfuscated email', () => {
        const initialState = {
          hydrated: false,
          selectedDate: null,
          selectedTopics: [],
          obfuscatedEmail: null,
          token: null,
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
          token: null,
        };
        const newEmail = 'new***@example.com';
        const actual = formReducer(initialState, setObfuscatedEmail(newEmail));

        expect(actual.obfuscatedEmail).to.equal(newEmail);
      });
    });

    describe('clearFormData', () => {
      it('should clear all form data', () => {
        const initialState = {
          hydrated: false,
          selectedDate: '2025-01-15T10:00:00.000Z',
          selectedTopics: ['topic-1', 'topic-2'],
          obfuscatedEmail: 't***@example.com',
          token: 'abc123',
        };
        const actual = formReducer(initialState, clearFormData());

        expect(actual.selectedDate).to.be.null;
        expect(actual.selectedTopics).to.deep.equal([]);
        expect(actual.obfuscatedEmail).to.be.null;
        expect(actual.token).to.be.null;
      });

      it('should return initial state when clearing already empty data', () => {
        const initialState = {
          hydrated: false,
          selectedDate: null,
          selectedTopics: [],
          obfuscatedEmail: null,
          token: null,
        };
        const actual = formReducer(initialState, clearFormData());

        expect(actual.selectedDate).to.be.null;
        expect(actual.selectedTopics).to.deep.equal([]);
        expect(actual.obfuscatedEmail).to.be.null;
        expect(actual.token).to.be.null;
      });
    });

    describe('hydrateFormData', () => {
      it('should set hydrated to true and merge payload', () => {
        const payload = {
          selectedSlotTime: '2025-03-01T10:00:00.000Z',
          selectedTopics: [{ topicId: '1', topicName: 'Topic 1' }],
          token: null,
        };
        const actual = formReducer(undefined, hydrateFormData(payload));

        expect(actual.hydrated).to.be.true;
        expect(actual.selectedDate).to.equal(payload.selectedSlotTime);
        expect(actual.selectedTopics).to.deep.equal(payload.selectedTopics);
      });

      it('should only flip hydrated when payload is empty', () => {
        const actual = formReducer(undefined, hydrateFormData({}));

        expect(actual.hydrated).to.be.true;
        expect(actual.selectedDate).to.be.null;
        expect(actual.selectedTopics).to.deep.equal([]);
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
            token: null,
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
            token: null,
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
            token: null,
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
            token: null,
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
            token: null,
          },
        };
        const result = selectHydrated(state);
        expect(result).to.be.true;
      });
    });

    describe('selectToken', () => {
      it('should select the token from state', () => {
        const state = {
          vassForm: {
            hydrated: false,
            selectedDate: null,
            selectedTopics: [],
            obfuscatedEmail: null,
            token: 'abc123',
          },
        };
        const result = selectToken(state);
        expect(result).to.equal('abc123');
      });

      it('should return null when no token is set', () => {
        const state = {
          vassForm: {
            hydrated: false,
            selectedDate: null,
            selectedTopics: [],
            obfuscatedEmail: null,
            token: null,
          },
        };
        const result = selectToken(state);
        expect(result).to.be.null;
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
            token: null,
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
            token: null,
          },
        };
        const result = selectObfuscatedEmail(state);
        expect(result).to.be.null;
      });
    });
  });
});
