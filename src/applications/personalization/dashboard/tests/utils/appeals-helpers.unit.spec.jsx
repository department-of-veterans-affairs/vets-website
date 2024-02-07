import { expect } from 'chai';

import {
  formatDate,
  getAojDescription,
  getDocketName,
  getHearingType,
} from '../../utils/appeals-helpers';

describe('formatDate', () => {
  it('should format date', () => {
    expect(formatDate('2/6/2024')).to.equal('February 06, 2024');
  });
});

describe('getHearingType', () => {
  it('should return correct hearing type', () => {
    expect(getHearingType('video')).to.equal('videoconference');
  });
});

describe('getDocketName', () => {
  it('should return correct docket name if it exists', () => {
    expect(getDocketName('directReview')).to.equal('Direct Review');
    expect(getDocketName('evidenceSubmission')).to.equal('Evidence Submission');
    expect(getDocketName('hearingRequest')).to.equal('Hearing Request');
  });
  it("returns argument if docket name doesn't exist", () => {
    expect(getDocketName('nonExistentDocket')).to.equal('nonExistentDocket');
  });
});

describe('getAojDescription', () => {
  it('should return correct jurisdiction name if it exists', () => {
    expect(getAojDescription('vha')).to.equal('Veterans Health Administration');
    expect(getAojDescription('nca')).to.equal(
      'National Cemetery Administration',
    );
  });
  it("returns AOJ if juristdiction doesn't exist", () => {
    expect(getAojDescription('otherAoj')).to.equal(
      'Agency of Original Jurisdiction',
    );
  });
});
