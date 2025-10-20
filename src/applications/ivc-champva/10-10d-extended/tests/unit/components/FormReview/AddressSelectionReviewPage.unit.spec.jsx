import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import AddressSelectionReviewPage, {
  formatDataValue,
  getScopedData,
} from '../../../../components/FormReview/AddressSelectionReviewPage';
import {
  FIELD_NAME,
  NOT_SHARED,
  OPTION_YES_LABEL,
} from '../../../../components/FormPages/AddressSelectionPage';
import content from '../../../../locales/en/content.json';

// declare static content
const REVIEW_OPTION_NO = content['review--no-option'];

describe('10-10d <AddressSelectionReviewPage>', () => {
  const subject = ({
    title = 'Address selection',
    index = undefined,
    data = {},
  } = {}) => {
    const props = { pagePerItemIndex: index, editPage: () => {}, data, title };
    const { container } = render(<AddressSelectionReviewPage {...props} />);
    const dt = () => container.querySelector('dt');
    const dd = () => container.querySelector('dd');
    return { dt, dd };
  };

  it('should render an em dash when there is no selected value', () => {
    const { dd } = subject();
    expect(dd().textContent.trim()).to.equal('—');
  });

  it('should render `No` when an option is not applicable', () => {
    const { dd } = subject({ data: { [FIELD_NAME]: NOT_SHARED } });
    expect(dd().textContent.trim()).to.equal('No');
  });

  it('should render a formatted JSON address with the `Yes, use` prefix when an option is applicable', () => {
    const value = JSON.stringify({
      street: '123 A St',
      street2: 'Apt 4',
      city: 'Denver',
      state: 'CO',
      country: 'USA',
    });
    const { dd } = subject({ data: { [FIELD_NAME]: value } });
    expect(dd().textContent.trim()).to.equal(
      `${OPTION_YES_LABEL} 123 A St, Apt 4, Denver, CO, USA`,
    );
  });

  it('should render `Do you` when role=applicant and pagePerItemIndex=0', () => {
    const data = { certifierRole: 'applicant', applicants: [{}] };
    const { dt } = subject({ data, index: 0 });
    expect(dt().textContent).to.match(/^Do you/i);
  });

  it('should render `Does the applicant` when role=applicant and index>0', () => {
    const data = { certifierRole: 'applicant', applicants: [{}, {}] };
    const { dt } = subject({ data, index: 1 });
    expect(dt().textContent).to.match(/^Does the applicant/i);
  });

  it('should render `Does the Veteran` when not in array mode', () => {
    const data = { certifierRole: 'veteran' };
    const { dt } = subject({ data });
    expect(dt().textContent).to.match(/^Does the Veteran/i);
  });

  it('should properly scope data in array mode (reads applicants[index])', () => {
    const first = { [FIELD_NAME]: NOT_SHARED };
    const second = {
      [FIELD_NAME]: JSON.stringify({
        street: '55 B Rd',
        city: 'Austin',
        state: 'TX',
      }),
    };
    const data = { certifierRole: 'applicant', applicants: [first, second] };
    const { dd } = subject({ data, index: 1 });
    expect(dd().textContent.trim()).to.equal(
      `${OPTION_YES_LABEL} 55 B Rd, Austin, TX`,
    );
  });
});

describe('10-10d `formatDataValue` helper', () => {
  it('should return empty string for falsy input', () => {
    expect(formatDataValue('')).to.equal('');
    expect(formatDataValue(null)).to.equal('');
    expect(formatDataValue(undefined)).to.equal('');
  });

  it('should return the NOT_SHARED label for "na"', () => {
    expect(formatDataValue('na')).to.equal(REVIEW_OPTION_NO);
  });

  it('should format JSON address with prefix by default', () => {
    const v = JSON.stringify({ street: 'X', city: 'Y', state: 'Z' });
    expect(formatDataValue(v)).to.equal(`${OPTION_YES_LABEL} X, Y, Z`);
  });

  it('should format JSON address without prefix when withPrefix=false', () => {
    const v = JSON.stringify({ street: 'X', city: 'Y', state: 'Z' });
    expect(formatDataValue(v, { withPrefix: false })).to.equal('X, Y, Z');
  });

  it('should fall back to string when JSON parse fails', () => {
    expect(formatDataValue('not-json')).to.equal(
      `${OPTION_YES_LABEL} not-json`,
    );
  });
});

describe('10-10d `getScopedData` helper', () => {
  it('should return root data when not in array mode', () => {
    const d = { foo: 1 };
    expect(getScopedData(d, null)).to.deep.equal(d);
    expect(getScopedData(d, '')).to.deep.equal(d);
  });

  it('should return applicants[n] in array mode', () => {
    const d = { applicants: [{ id: 1 }, { id: 2 }] };
    expect(getScopedData(d, 0)).to.deep.equal({ id: 1 });
    expect(getScopedData(d, '1')).to.deep.equal({ id: 2 });
  });
});
