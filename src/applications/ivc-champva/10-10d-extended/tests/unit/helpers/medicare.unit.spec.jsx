import React from 'react';
import { Provider } from 'react-redux';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import { toHash } from '../../../../shared/utilities';
import {
  generateParticipantName,
  getEligibleApplicantsWithoutMedicare,
  medicarePageTitleUI,
} from '../../../helpers/medicare';

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

describe('1010d `medicarePageTitleUI` util', () => {
  const DEFAULT_ITEM = { medicareParticipant: toHash('123123123') };

  const subject = ({ applicants, item = DEFAULT_ITEM } = {}) => {
    const uiSchema = medicarePageTitleUI('Medicare plan types');
    const TitleComponent = uiSchema['ui:title'];
    const mockStore = {
      getState: () => ({
        form: { data: { applicants } },
      }),
      subscribe: () => {},
      dispatch: () => {},
    };
    const { container } = render(
      <Provider store={mockStore}>
        <div>{TitleComponent({ formData: item })}</div>
      </Provider>,
    );
    return container.textContent;
  };

  it('should return a UI schema object with ui:title property', () => {
    const res = medicarePageTitleUI('Medicare plan types');
    expect(res).to.have.property('ui:title');
  });

  it('should generate title with participant name when applicant found', () => {
    const res = subject({
      applicants: [
        {
          applicantSsn: '123123123',
          applicantName: { first: 'John', last: 'Smith' },
        },
      ],
    });
    expect(res).to.equal('John Smith’s Medicare plan types');
  });

  it('should generate title with `Applicant` when no match found', () => {
    const res = subject({
      item: { medicareParticipant: toHash('321321321') },
      applicants: [
        {
          applicantSsn: '123123123',
          applicantName: { first: 'Jane', last: 'Doe' },
        },
      ],
    });
    expect(res).to.equal('Applicant’s Medicare plan types');
  });

  it('should generate title with `No participant` when item is null', () => {
    const res = subject({ item: null, applicants: [] });
    expect(res).to.equal('No participant’s Medicare plan types');
  });

  it('should include description when provided', () => {
    const res = medicarePageTitleUI('Medicare plan types', 'Test description');
    expect(res).to.have.property('ui:title');
    expect(typeof res['ui:title']).to.equal('function');
  });

  it('should generate title with over-65 applicant name when no participant match', () => {
    const res = subject({
      item: { medicareParticipant: toHash('999999999') },
      applicants: [
        {
          applicantSsn: '123123123',
          applicantDob: '1950-01-01',
          applicantName: { first: 'Elder', last: 'Applicant' },
        },
        {
          applicantSsn: '321321321',
          applicantDob: '2000-01-01',
          applicantName: { first: 'Younger', last: 'Applicant' },
        },
      ],
    });
    expect(res).to.equal('Elder Applicant’s Medicare plan types');
  });
});
