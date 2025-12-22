import { expect } from 'chai';
import formReducer, {
  setSelectedDate,
  setSelectedTopics,
  clearFormData,
  hydrateFormData,
  selectSelectedDate,
  selectSelectedTopics,
  selectHydrated,
} from './formSlice';

describe('formSlice', () => {
  describe('reducer', () => {
    it('should return initial state', () => {
      const initialState = formReducer(undefined, { type: 'unknown' });
      expect(initialState).to.deep.equal({
        hydrated: false,
        selectedDate: null,
        selectedTopics: [],
      });
    });

    describe('setSelectedDate', () => {
      it('should set the selected date', () => {
        const initialState = {
          hydrated: false,
          selectedDate: null,
          selectedTopics: [],
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
        };
        const actual = formReducer(initialState, setSelectedTopics([]));

        expect(actual.selectedTopics).to.deep.equal([]);
      });
    });

    describe('clearFormData', () => {
      it('should clear all form data', () => {
        const initialState = {
          hydrated: false,
          selectedDate: '2025-01-15T10:00:00.000Z',
          selectedTopics: ['topic-1', 'topic-2'],
        };
        const actual = formReducer(initialState, clearFormData());

        expect(actual.selectedDate).to.be.null;
        expect(actual.selectedTopics).to.deep.equal([]);
      });

      it('should return initial state when clearing already empty data', () => {
        const initialState = {
          hydrated: false,
          selectedDate: null,
          selectedTopics: [],
        };
        const actual = formReducer(initialState, clearFormData());

        expect(actual.selectedDate).to.be.null;
        expect(actual.selectedTopics).to.deep.equal([]);
      });
    });

    describe('hydrateFormData', () => {
      it('should set hydrated to true and merge payload', () => {
        const payload = {
          selectedSlotTime: '2025-03-01T10:00:00.000Z',
          selectedTopics: [{ topicId: '1', topicName: 'Topic 1' }],
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
          },
        };
        const result = selectHydrated(state);
        expect(result).to.be.true;
      });
    });
  });
});
