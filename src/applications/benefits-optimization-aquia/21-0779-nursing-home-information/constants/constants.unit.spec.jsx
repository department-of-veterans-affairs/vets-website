import { expect } from 'chai';

import { TITLE, SUBTITLE } from './constants';

describe('Constants', () => {
  describe('TITLE', () => {
    it('should export TITLE constant', () => {
      expect(TITLE).to.exist;
    });

    it('should have a non-empty TITLE', () => {
      expect(TITLE).to.be.a('string');
      expect(TITLE.length).to.be.greaterThan(0);
    });

    it('should have expected TITLE value', () => {
      expect(TITLE).to.equal(
        'Submit nursing home information in connection with claim for Aid and Attendance',
      );
    });

    it('should have TITLE that includes key terms', () => {
      expect(TITLE.toLowerCase()).to.include('nursing home');
      expect(TITLE.toLowerCase()).to.include('information');
    });
  });

  describe('SUBTITLE', () => {
    it('should export SUBTITLE constant', () => {
      expect(SUBTITLE).to.exist;
    });

    it('should have a non-empty SUBTITLE', () => {
      expect(SUBTITLE).to.be.a('string');
      expect(SUBTITLE.length).to.be.greaterThan(0);
    });

    it('should have expected SUBTITLE value', () => {
      expect(SUBTITLE).to.equal(
        'Request for Nursing Home Information in Connection with Claim for Aid and Attendance (VA Form 21-0779)',
      );
    });

    it('should have SUBTITLE that includes form number', () => {
      expect(SUBTITLE).to.include('21-0779');
    });

    it('should have SUBTITLE that includes VA Form reference', () => {
      expect(SUBTITLE).to.include('VA Form');
    });

    it('should have SUBTITLE that includes Aid and Attendance', () => {
      expect(SUBTITLE).to.include('Aid and Attendance');
    });

    it('should have SUBTITLE that includes Nursing Home', () => {
      expect(SUBTITLE).to.include('Nursing Home');
    });
  });

  describe('Constants Structure', () => {
    it('should have TITLE shorter than SUBTITLE', () => {
      expect(TITLE.length).to.be.lessThan(SUBTITLE.length);
    });

    it('should export exactly 3 constants', () => {
      const constants = require('./constants');
      const exportedKeys = Object.keys(constants);
      expect(exportedKeys).to.have.lengthOf(3);
      expect(exportedKeys).to.include('TITLE');
      expect(exportedKeys).to.include('SUBTITLE');
      expect(exportedKeys).to.include('API_ENDPOINTS');
    });
  });
});
