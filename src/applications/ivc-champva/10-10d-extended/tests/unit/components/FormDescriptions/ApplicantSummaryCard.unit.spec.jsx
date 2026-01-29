import { render } from '@testing-library/react';
import { expect } from 'chai';
import ApplicantSummaryCard from '../../../../components/FormDescriptions/ApplicantSummaryCard';

const DEFAULT_ITEM = {
  applicantDob: '1990-05-15',
  applicantPhone: '555-123-4567',
  applicantAddress: {
    street: '123 Main St',
    city: 'Springfield',
    state: 'IL',
  },
  applicantRelationshipToSponsor: {
    relationshipToVeteran: 'spouse',
  },
};

const subject = item => {
  const result = ApplicantSummaryCard(item);
  if (!result) return { listItems: [], textContent: '' };

  const { container } = render(result);
  return {
    listItems: container.querySelectorAll('li'),
    textContent: container.textContent,
  };
};

describe('10-10d <ApplicantSummaryCard>', () => {
  it('should render all fields when data is complete', () => {
    const { listItems, textContent } = subject(DEFAULT_ITEM);
    expect(listItems).to.have.lengthOf(4);
    expect(textContent).to.include('05/15/1990');
    expect(textContent).to.include('123 Main St Springfield, IL');
    expect(textContent).to.include('555-123-4567');
    expect(textContent).to.include('Spouse');
  });

  it('should capitalize Veteran relationship value', () => {
    const { textContent } = subject({
      ...DEFAULT_ITEM,
      applicantRelationshipToSponsor: {
        relationshipToVeteran: 'child',
      },
    });
    expect(textContent).to.include('Child');
  });

  it('should display "other" relationship when specified', () => {
    const { textContent } = subject({
      ...DEFAULT_ITEM,
      applicantRelationshipToSponsor: {
        relationshipToVeteran: 'other',
        otherRelationshipToVeteran: 'stepchild',
      },
    });
    expect(textContent).to.include('Stepchild');
  });

  it('should handle missing date of birth', () => {
    const { textContent } = subject({
      ...DEFAULT_ITEM,
      applicantDob: undefined,
    });
    expect(textContent).to.include('Date of birth:');
    expect(textContent).to.not.include('/1990');
  });

  it('should handle invalid date of birth', () => {
    const { textContent } = subject({
      ...DEFAULT_ITEM,
      applicantDob: '1990-13-01',
    });
    expect(textContent).to.include('Date of birth:');
    expect(textContent).to.not.include('/1990');
  });

  it('should handle missing address fields', () => {
    const { textContent } = subject({
      ...DEFAULT_ITEM,
      applicantAddress: {},
    });
    expect(textContent).to.include('Address:');
  });

  it('should format address with only street', () => {
    const { textContent } = subject({
      ...DEFAULT_ITEM,
      applicantAddress: { street: '123 Main St' },
    });
    expect(textContent).to.include('123 Main St');
  });

  it('should format address with city and state', () => {
    const { textContent } = subject({
      ...DEFAULT_ITEM,
      applicantAddress: {
        city: 'Boston',
        state: 'MA',
      },
    });
    expect(textContent).to.include('Boston, MA');
  });

  it('should format address with only city', () => {
    const { textContent } = subject({
      ...DEFAULT_ITEM,
      applicantAddress: { city: 'Boston' },
    });
    expect(textContent).to.include('Boston');
  });

  it('should format address with only state', () => {
    const { textContent } = subject({
      ...DEFAULT_ITEM,
      applicantAddress: { state: 'TX' },
    });
    expect(textContent).to.include('TX');
  });

  it('should handle missing phone number', () => {
    const { textContent } = subject({
      ...DEFAULT_ITEM,
      applicantPhone: undefined,
    });
    expect(textContent).to.include('Phone number:');
  });

  it('should handle missing relationship data', () => {
    const { textContent } = subject({
      ...DEFAULT_ITEM,
      applicantRelationshipToSponsor: {},
    });
    expect(textContent).to.include('Relationship to Veteran:');
  });

  it('should handle when item is undefined', () => {
    const { listItems } = subject(undefined);
    expect(listItems).to.have.lengthOf(4);
  });
});
