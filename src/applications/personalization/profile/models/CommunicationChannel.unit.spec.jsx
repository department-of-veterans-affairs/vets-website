import { expect } from 'chai';

import CommunicationChannel from './CommunicationChannel';

describe('CommunicationChannel model', () => {
  describe('constructor', () => {
    it('throws an error when `options.type` is not included or not a valid channel type', () => {
      expect(() => {
        // eslint-disable-next-line no-new
        new CommunicationChannel({ parentItemId: 1 });
      }).to.throw(Error, /Invalid Argument/i);
      expect(() => {
        // eslint-disable-next-line no-new
        new CommunicationChannel({ type: '1' });
      }).to.throw(Error, /Invalid Argument/i);
      expect(() => {
        // eslint-disable-next-line no-new
        new CommunicationChannel({ type: 3 });
      }).to.throw(Error, /Invalid Argument/i);
    });
    it('throws an error when `options.parentItemId` is not included or not a number', () => {
      expect(() => {
        // eslint-disable-next-line no-new
        new CommunicationChannel({ type: 1 });
      }).to.throw(Error, /Invalid Argument/i);
      expect(() => {
        // eslint-disable-next-line no-new
        new CommunicationChannel({ parentItemId: '1' });
      }).to.throw(Error, /Invalid Argument/i);
    });
  });

  describe('getApiCallObject()', () => {
    context('when no permissions have been set yet', () => {
      it('returns an object with the correct shape that we can use with the `saveCommunicationPreferencesGroup` thunk creator', () => {
        const commChannel = new CommunicationChannel({
          type: 1,
          parentItemId: 1,
        });
        commChannel.setIsAllowed(true);
        const apiCallObject = commChannel.getApiCallObject();
        expect(apiCallObject.method).to.equal('POST');
        expect(apiCallObject.endpoint).to.equal(
          '/profile/communication_preferences',
        );
        expect(apiCallObject.isAllowed).to.equal(true);
        expect(apiCallObject.payload).to.deep.equal({
          communicationItem: {
            id: 1,
            communicationChannel: {
              id: 1,
              communicationPermission: {
                allowed: true,
              },
            },
          },
        });
      });
    });
    context('when permission is flipped from true to false', () => {
      it('returns an object with the correct shape that we can use with the `saveCommunicationPreferencesGroup` thunk creator', () => {
        const commChannel = new CommunicationChannel({
          type: 1,
          parentItemId: 1,
          permissionId: 1001,
          isAllowed: true,
        });
        commChannel.setIsAllowed(false);
        const apiCallObject = commChannel.getApiCallObject();
        expect(apiCallObject.method).to.equal('PATCH');
        expect(apiCallObject.endpoint).to.equal(
          '/profile/communication_preferences/1001',
        );
        expect(apiCallObject.isAllowed).to.equal(false);
        expect(apiCallObject.payload).to.deep.equal({
          communicationItem: {
            id: 1,
            communicationChannel: {
              id: 1,
              communicationPermission: {
                allowed: false,
              },
            },
          },
        });
      });
    });
  });

  describe('isIdenticalTo()', () => {
    let commChannel1;
    let commChannel2;
    beforeEach(() => {
      commChannel1 = new CommunicationChannel({
        type: 1,
        parentItemId: 1,
        permissionId: 1000,
        isAllowed: true,
      });
      commChannel2 = new CommunicationChannel({
        type: 1,
        parentItemId: 1,
        permissionId: 1000,
        isAllowed: true,
      });
    });
    context('when it is not passed-in a communication-channel', () => {
      it('throws an error', () => {
        expect(() => {
          commChannel1.isIdenticalTo();
        }).to.throw(Error, /Invalid Argument/i);
        expect(() => {
          commChannel1.isIdenticalTo({});
        }).to.throw(Error, /Invalid Argument/i);
      });
    });
    context(
      'when it is identical to the passed-in communication channel',
      () => {
        it('returns true', () => {
          expect(commChannel1.isIdenticalTo(commChannel2)).to.be.true;
        });
      },
    );
    context(
      'when the passed-in communication channel is different than itself',
      () => {
        it('returns false', () => {
          // this serves as a test of the setIsAllowed() method
          commChannel2.setIsAllowed(false);
          expect(commChannel1.isIdenticalTo(commChannel2)).to.be.false;
        });
      },
    );
  });

  describe('clone', () => {
    it('returns an identical new instance that can be edited independent of the source instance', () => {
      let baseChannel = new CommunicationChannel({
        type: 1,
        parentItemId: 1,
      });
      let clone = baseChannel.clone();
      expect(baseChannel.isIdenticalTo(clone)).to.be.true;
      clone.setIsAllowed(true);
      expect(baseChannel.isIdenticalTo(clone)).to.be.false;
      clone.setIsAllowed(false);
      expect(baseChannel.isIdenticalTo(clone)).to.be.true;
      baseChannel = new CommunicationChannel({
        type: 1,
        parentItemId: 1,
        isAllowed: true,
        permissionId: 123,
      });
      clone = baseChannel.clone();
      expect(baseChannel.isIdenticalTo(clone)).to.be.true;
      clone.setIsAllowed(false);
      expect(baseChannel.isIdenticalTo(clone)).to.be.false;
      clone.setIsAllowed(true);
      expect(baseChannel.isIdenticalTo(clone)).to.be.true;
    });
  });
});
