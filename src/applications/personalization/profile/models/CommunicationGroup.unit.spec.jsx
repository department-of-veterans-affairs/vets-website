import { expect } from 'chai';

import CommunicationGroup from './CommunicationGroup';
import CommunicationChannel from './CommunicationChannel';

describe('CommunicationGroup model', () => {
  describe('constructor', () => {
    it('throws an error if not given an id', () => {
      expect(() => {
        // eslint-disable-next-line no-new
        new CommunicationGroup({ notAnId: 1, communicationChannels: [] });
      }).to.throw(Error, /id.*number/i);
    });
    it('throws an error if not given a communicationChannels array', () => {
      expect(() => {
        // eslint-disable-next-line no-new
        new CommunicationGroup({ id: 1 });
      }).to.throw(Error, /channels.*array/i);
    });
  });

  describe('getUpdatedChannels()', () => {
    let baseGroup;
    beforeEach(() => {
      baseGroup = new CommunicationGroup({
        id: 1,
        communicationChannels: [
          new CommunicationChannel({ type: 1, parentItemId: 1 }),
          new CommunicationChannel({ type: 2, parentItemId: 1 }),
          new CommunicationChannel({
            type: 1,
            parentItemId: 2,
            isAllowed: true,
            permissionId: 123,
          }),
        ],
      });
    });
    it('returns an empty array when the groups are identical', () => {
      const wipGroup = baseGroup.clone();
      const updatedChannels = baseGroup.getUpdatedChannels(wipGroup);
      expect(updatedChannels).to.deep.equal([]);
    });
    it("returns an empty array when the group's ids do not match", () => {
      const wipGroup = new CommunicationGroup({
        id: 2,
        communicationChannels: [
          new CommunicationChannel({ type: 1, parentItemId: 4 }),
          new CommunicationChannel({ type: 2, parentItemId: 4 }),
          new CommunicationChannel({
            type: 1,
            parentItemId: 5,
            isAllowed: true,
            permissionId: 456,
          }),
        ],
      });
      const updatedChannels = baseGroup.getUpdatedChannels(wipGroup);
      expect(updatedChannels).to.deep.equal([]);
    });
    it("returns the argument group's CommunicationChannels that are different", () => {
      const wipGroup = baseGroup.clone();
      wipGroup.channels[0].setIsAllowed(true);
      wipGroup.channels[2].setIsAllowed(false);
      const updatedChannels = baseGroup.getUpdatedChannels(wipGroup);
      expect(updatedChannels.length).to.equal(2);
      expect(updatedChannels[0].isAllowed).to.be.true;
      expect(updatedChannels[1].isAllowed).to.be.false;
    });
  });

  describe('clone', () => {
    it('returns an identical CommunicationGroup', () => {
      const baseGroup = new CommunicationGroup({
        id: 1,
        communicationChannels: [
          new CommunicationChannel({
            type: 1,
            parentItemId: 1,
            isAllowed: true,
            permissionId: 123,
          }),
          new CommunicationChannel({ type: 2, parentItemId: 1 }),
          new CommunicationChannel({
            type: 1,
            parentItemId: 2,
            isAllowed: false,
            permissionId: 456,
          }),
        ],
      });
      const clonedGroup = baseGroup.clone();
      expect(baseGroup.getUpdatedChannels(clonedGroup)).to.deep.equal([]);
    });
  });
});
