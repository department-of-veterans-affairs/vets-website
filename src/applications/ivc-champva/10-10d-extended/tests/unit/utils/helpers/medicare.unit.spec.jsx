import { expect } from 'chai';
import { toHash } from '../../../../../shared/utilities';
import {
  generateParticipantName,
  getEligibleApplicantsWithoutMedicare,
} from '../../../../utils/helpers';

describe('1010d `generateParticipantName` util', () => {
  it('should return formatted participant name when match found', () => {
    const item = { medicareParticipant: toHash('123123123') };
    const formData = {
      applicants: [
        {
          applicantSsn: '123123123',
          applicantName: { first: 'Jane', last: 'Doe' },
        },
      ],
    };
    const res = generateParticipantName(item, undefined, formData);
    expect(res).to.eq('Jane Doe');
  });

  it('should return `Applicant` when no match found', () => {
    const item = { medicareParticipant: 'nonexistent' };
    const formData = {
      applicants: [
        {
          applicantSsn: '123123123',
          applicantName: { first: 'Jane', last: 'Doe' },
        },
      ],
    };
    const res = generateParticipantName(item, undefined, formData);
    expect(res).to.eq('Applicant');
  });

  it('should return `No participant` when item is null', () => {
    const formData = {
      applicants: [
        {
          applicantSsn: '123123123',
          applicantName: { first: 'Jane', last: 'Doe' },
        },
      ],
    };
    const res = generateParticipantName(null, undefined, formData);
    expect(res).to.eq('No participant');
  });

  it('should return `Applicant` when applicants array is empty', () => {
    const item = { medicareParticipant: toHash('123123123') };
    const formData = { applicants: [] };
    const res = generateParticipantName(item, undefined, formData);
    expect(res).to.eq('Applicant');
  });

  it('should format full name with middle name and suffix when present', () => {
    const item = { medicareParticipant: toHash('123123123') };
    const formData = {
      applicants: [
        {
          applicantSsn: '123123123',
          applicantName: {
            first: 'Jane',
            middle: 'Marie',
            last: 'Doe',
            suffix: 'Jr.',
          },
        },
      ],
    };
    const res = generateParticipantName(item, undefined, formData);
    expect(res).to.eq('Jane Doe Jr.');
  });
});

describe('1010d `getEligibleApplicantsWithoutMedicare` util', () => {
  it('should return applicants not assigned to a Medicare plan', () => {
    const applicantData = {
      applicants: [
        { applicantSsn: '123123123' },
        { applicantSsn: '321321321' },
      ],
      medicare: [{ medicareParticipant: toHash('123123123') }],
    };
    const res = getEligibleApplicantsWithoutMedicare(applicantData);
    expect(res).to.have.length(1);
    expect(res[0].applicantSsn).to.eq('321321321');
  });

  it('should return all applicants when no Medicare plans exist', () => {
    const applicantData = {
      applicants: [
        { applicantSsn: '123123123' },
        { applicantSsn: '321321321' },
        { applicantSsn: '456456456' },
      ],
      medicare: [],
    };
    const res = getEligibleApplicantsWithoutMedicare(applicantData);
    expect(res).to.have.length(3);
  });

  it('should return empty array when all applicants have Medicare', () => {
    const applicantData = {
      applicants: [
        { applicantSsn: '123123123' },
        { applicantSsn: '321321321' },
      ],
      medicare: [
        { medicareParticipant: toHash('123123123') },
        { medicareParticipant: toHash('321321321') },
      ],
    };
    const res = getEligibleApplicantsWithoutMedicare(applicantData);
    expect(res).to.have.length(0);
  });

  it('should return multiple unassigned applicants', () => {
    const applicantData = {
      applicants: [
        { applicantSsn: '123123123' },
        { applicantSsn: '321321321' },
        { applicantSsn: '456456456' },
        { applicantSsn: '789789789' },
      ],
      medicare: [{ medicareParticipant: toHash('123123123') }],
    };
    const res = getEligibleApplicantsWithoutMedicare(applicantData);
    expect(res).to.have.length(3);
    expect(res[0].applicantSsn).to.eq('321321321');
    expect(res[1].applicantSsn).to.eq('456456456');
    expect(res[2].applicantSsn).to.eq('789789789');
  });

  it('should return undefined when applicants array is missing', () => {
    const applicantData = {
      medicare: [{ medicareParticipant: toHash('123123123') }],
    };
    const res = getEligibleApplicantsWithoutMedicare(applicantData);
    expect(res).to.be.undefined;
  });

  it('should return undefined when formData is undefined', () => {
    const res = getEligibleApplicantsWithoutMedicare(undefined);
    expect(res).to.be.undefined;
  });
});
