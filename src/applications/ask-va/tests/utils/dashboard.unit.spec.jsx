import { expect } from 'chai';
import {
  flattenInquiry,
  categorizeByLOA,
  paginateArray,
} from '../../utils/dashboard';
import { mockInquiries } from './mock-inquiries';

describe('flattenInquiry', () => {
  it("hoists nested 'attributes' property into inquiry object", () => {
    const output = flattenInquiry(mockInquiries[0]);
    expect(output).to.have.property('status');
    expect(output).to.not.have.property('attributes');
  });

  it('standardizes the inquiry status property', () => {
    expect(flattenInquiry(mockInquiries[0]).status).to.equal('In progress');
  });
});

describe('splitInquiresByLOA', () => {
  it('returns ONLY personal and business inquiries', () => {
    const output = categorizeByLOA(mockInquiries);
    expect(output).to.have.property('personal');
    expect(output).to.have.property('business');
    expect(output).to.not.have.property('unauthenticated');
  });

  it('puts inquiries into the right buckets', () => {
    const output = categorizeByLOA(mockInquiries);
    expect(output.personal.length).to.equal(7);
    expect(output.business.length).to.equal(2);
  });

  it('flattens inquiries as they are categorized', () => {
    const output = categorizeByLOA(mockInquiries);
    expect(output.personal[0]).to.have.property('status');
    expect(output.personal[0].status).to.equal('In progress');
  });

  it('returns only the categories in the inquiries list', () => {
    const output = categorizeByLOA(mockInquiries);
    expect(output.uniqueCategories.length).to.equal(6);
  });
});

describe('paginateArray', () => {
  const testArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  it('Returns an array with sub-arrays of specified length', () => {
    const pages = paginateArray(testArray, 4);

    const totalPages = pages.length;
    const firstPageLength = pages[0].items.length;
    const secondPageFirstItem = pages[1].items[0];
    const lastPageFirstItem = pages[totalPages - 1].items[0];

    expect(totalPages).to.equal(3);
    expect(firstPageLength).to.equal(4);
    expect(secondPageFirstItem).to.equal(5);
    expect(lastPageFirstItem).to.equal(9);
  });

  it('returns the correct page-start and -end numbers', () => {
    const pages = paginateArray(testArray, 3);

    expect(pages[0].pageStart).to.equal(1);
    expect(pages[0].pageEnd).to.equal(3);
    expect(pages[1].pageStart).to.equal(4);
    expect(pages[1].pageEnd).to.equal(6);
  });
});
