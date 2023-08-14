import { expect } from 'chai';
import { getDate } from '../../utils/dates';

import { addAreaOfDisagreement } from '../../utils/submit';

const validDate1 = getDate({ offset: { months: -2 } });
const issue1 = {
  raw: {
    type: 'contestableIssue',
    attributes: {
      ratingIssueSubjectText: 'tinnitus',
      description: 'both ears',
      approxDecisionDate: validDate1,
      decisionIssueId: 1,
      ratingIssueReferenceId: '2',
      ratingDecisionReferenceId: '3',
      ratingIssuePercentNumber: '10',
    },
  },
  result: {
    type: 'contestableIssue',
    attributes: {
      issue: 'tinnitus - 10% - both ears',
      decisionDate: validDate1,
      decisionIssueId: 1,
      ratingIssueReferenceId: '2',
      ratingDecisionReferenceId: '3',
    },
  },
};

const validDate2 = getDate({ offset: { months: -4 } });
const issue2 = {
  raw: {
    type: 'contestableIssue',
    attributes: {
      ratingIssueSubjectText: 'left knee',
      approxDecisionDate: validDate2,
      decisionIssueId: 4,
      ratingIssueReferenceId: '5',
    },
  },
  result: {
    type: 'contestableIssue',
    attributes: {
      issue: 'left knee - 0%',
      decisionDate: validDate2,
      decisionIssueId: 4,
      ratingIssueReferenceId: '5',
    },
  },
};

describe('addAreaOfDisagreement', () => {
  it('should process a single choice', () => {
    const formData = {
      areaOfDisagreement: [
        {
          disagreementOptions: {
            serviceConnection: true,
            effectiveDate: false,
          },
        },
        {
          disagreementOptions: {
            effectiveDate: true,
          },
          otherEntry: '',
        },
      ],
    };
    const result = addAreaOfDisagreement(
      [issue1.result, issue2.result],
      formData,
    );
    expect(result[0].attributes.disagreementArea).to.equal(
      'service connection',
    );
    expect(result[1].attributes.disagreementArea).to.equal('effective date');
  });
  it('should process multiple choices', () => {
    const formData = {
      areaOfDisagreement: [
        {
          disagreementOptions: {
            serviceConnection: true,
            effectiveDate: true,
            evaluation: true,
          },
          otherEntry: '',
        },
      ],
    };
    const result = addAreaOfDisagreement([issue1.result], formData);
    expect(result[0].attributes.disagreementArea).to.equal(
      'service connection,effective date,disability evaluation',
    );
  });
  it('should process other choice', () => {
    const formData = {
      areaOfDisagreement: [
        {
          disagreementOptions: {
            serviceConnection: true,
            effectiveDate: true,
            evaluation: true,
          },
          otherEntry: 'this is an other entry',
        },
      ],
    };
    const result = addAreaOfDisagreement([issue1.result], formData);
    expect(result[0].attributes.disagreementArea).to.equal(
      'service connection,effective date,disability evaluation,this is an other entry',
    );
  });
  it('should not throw a JS error with no disagreement options', () => {
    const formData = {
      areaOfDisagreement: [],
    };
    const result = addAreaOfDisagreement([issue1.result], formData);
    expect(result[0].attributes.disagreementArea).to.equal('');
  });
});
