import { expect } from 'chai';
import sinon from 'sinon';
import { usePersistentSelections } from './usePersistentSelections';

describe('usePersistentSelections', () => {
  const sandbox = sinon.createSandbox();
  afterEach(() => {
    sandbox.restore();
    localStorage.clear();
  });
  beforeEach(() => {
    localStorage.setItem(
      'vass-selections-123',
      JSON.stringify({
        selectedSlotTime: '2021-01-01T00:00:00.000Z',
        selectedTopics: ['topic1', 'topic2'],
      }),
    );
  });
  describe('when selections are in localStorage', () => {
    const uuid = '123';
    it('should save and retrieve selections', () => {
      const { getSaved } = usePersistentSelections(uuid);
      expect(getSaved()).to.deep.equal({
        selectedSlotTime: '2021-01-01T00:00:00.000Z',
        selectedTopics: ['topic1', 'topic2'],
      });
    });
    it('should save date selection and update only the date selection', () => {
      const { saveDateSelection, getSaved } = usePersistentSelections(uuid);
      saveDateSelection('2021-01-02T00:00:00.000Z');
      expect(getSaved()).to.deep.equal({
        selectedSlotTime: '2021-01-02T00:00:00.000Z',
        selectedTopics: ['topic1', 'topic2'],
      });
    });
    it('should save topics selection and update only the topics selection', () => {
      const { saveTopicsSelection, getSaved } = usePersistentSelections(uuid);
      saveTopicsSelection(['topic3', 'topic4']);
      expect(getSaved()).to.deep.equal({
        selectedSlotTime: '2021-01-01T00:00:00.000Z',
        selectedTopics: ['topic3', 'topic4'],
      });
    });
  });
  describe('when selections are not in localStorage', () => {
    const uuid = '456';
    it('should return initial selections', () => {
      const { getSaved } = usePersistentSelections(uuid);
      expect(getSaved()).to.deep.equal({
        selectedSlotTime: null,
        selectedTopics: [],
      });
    });

    it('should save date selection and update only the date selection', () => {
      const { saveDateSelection, getSaved } = usePersistentSelections(uuid);
      saveDateSelection('2021-01-02T00:00:00.000Z');
      expect(getSaved()).to.deep.equal({
        selectedSlotTime: '2021-01-02T00:00:00.000Z',
        selectedTopics: [],
      });
    });
    it('should save topics selection and update only the topics selection', () => {
      const { saveTopicsSelection, getSaved } = usePersistentSelections(uuid);
      saveTopicsSelection(['topic3', 'topic4']);
      expect(getSaved()).to.deep.equal({
        selectedSlotTime: null,
        selectedTopics: ['topic3', 'topic4'],
      });
    });
  });
  describe('when selections cannot be parsed', () => {
    it('should clear the invalid selections and return initial selections', () => {
      localStorage.setItem('vass-selections-123', 'invalid');
      const { getSaved } = usePersistentSelections('123');
      expect(getSaved()).to.deep.equal({
        selectedSlotTime: null,
        selectedTopics: [],
      });
      expect(localStorage.getItem('vass-selections-123')).to.be.null;
    });
  });
});
