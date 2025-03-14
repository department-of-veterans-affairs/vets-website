import sinon from 'sinon';
import { expect } from 'chai';
import { getPreviousYear, redirectIfFormIncomplete } from '../utilities/utils';

const pushStub = sinon.stub();
const router = {
  push: pushStub,
};

describe('utilities', () => {
  afterEach(() => {
    pushStub.resetHistory();
  });

  describe('redirectIfFormIncomplete', () => {
    // No zip or dependents
    it('should navigate the user to the homepage only if the criteria are met', () => {
      redirectIfFormIncomplete('', false, router, '', '');
      expect(pushStub.withArgs('introduction').calledOnce).to.be.true;
    });

    // No zip
    it('should navigate the user to the homepage only if the criteria are met', () => {
      redirectIfFormIncomplete('0', false, router, '', '');
      expect(pushStub.withArgs('introduction').calledOnce).to.be.true;
    });

    // No dependents
    it('should navigate the user to the homepage only if the criteria are met', () => {
      redirectIfFormIncomplete('', false, router, '', '78258');
      expect(pushStub.withArgs('introduction').calledOnce).to.be.true;
    });

    // Past mode - no inputs
    it('should navigate the user to the homepage only if the criteria are met', () => {
      redirectIfFormIncomplete('', true, router, '', '');
      expect(pushStub.withArgs('introduction').calledOnce).to.be.true;
    });

    // Past mode - no zip
    it('should navigate the user to the homepage only if the criteria are met', () => {
      redirectIfFormIncomplete('0', true, router, '2019', '');
      expect(pushStub.withArgs('introduction').calledOnce).to.be.true;
    });

    // Past mode - no year
    it('should navigate the user to the homepage only if the criteria are met', () => {
      redirectIfFormIncomplete('0', true, router, '', '78258');
      expect(pushStub.withArgs('introduction').calledOnce).to.be.true;
    });

    // Past mode - no dependents
    it('should navigate the user to the homepage only if the criteria are met', () => {
      redirectIfFormIncomplete('', true, router, '2019', '78258');
      expect(pushStub.withArgs('introduction').calledOnce).to.be.true;
    });
  });

  describe('getPreviousYear', () => {
    it('should return the correct year if pastMode is true', () => {
      expect(getPreviousYear(true, '2017')).to.eq(2016);
    });

    it('should return the correct year if pastMode is false', () => {
      const previousYear = new Date().getFullYear() - 1;
      expect(getPreviousYear(false, '')).to.eq(previousYear);
    });
  });
});
