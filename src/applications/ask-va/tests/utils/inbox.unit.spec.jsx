import { expect } from 'chai';
import {
  flattenInquiry,
  categorizeByLOA,
  paginateInquiries,
  filterAndSort,
} from '../../utils/inbox';
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

describe('paginateInquiries', () => {
  const testArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  it('Returns an array with sub-arrays of specified length', () => {
    const pages = paginateInquiries(testArray, 4);

    const totalPages = pages.length;
    const firstPageLength = pages[0].items.length;
    const secondPageFirstItem = pages[1].items[0];
    const lastPage = pages[totalPages - 1];
    const lastPageFirstItem = lastPage.items[0];
    const lastPageLastItem = lastPage.items[lastPage.items.length - 1];

    expect(totalPages).to.equal(3);
    expect(firstPageLength).to.equal(4);
    expect(secondPageFirstItem).to.equal(5);
    expect(lastPageFirstItem).to.equal(9);
    expect(lastPageLastItem).to.equal(10);
  });

  it('returns the correct page-start and -end numbers', () => {
    const pages = paginateInquiries(testArray, 3);

    expect(pages[0].pageStart).to.equal(1);
    expect(pages[0].pageEnd).to.equal(3);
    expect(pages[1].pageStart).to.equal(4);
    expect(pages[1].pageEnd).to.equal(6);

    // pageEnd can't be higher than number of items
    expect(pages[3].pageEnd).to.equal(10);
  });

  it("returns 0's if given array without inquiries", () => {
    const pages = paginateInquiries([], 4);

    expect(pages.length).to.equal(1);
    expect(pages).to.eql([
      {
        pageStart: 0,
        pageEnd: 0,
        items: [],
      },
    ]);
  });
});

describe('filterAndSort', () => {
  const flatInquiries = mockInquiries.map(flattenInquiry);

  it('returns all results if unfiltered', () => {
    const results = filterAndSort({ inquiriesArray: flatInquiries });
    expect(results.length).to.equal(flatInquiries.length);
  });

  it('filters by category', () => {
    const results = filterAndSort({
      inquiriesArray: flatInquiries,
      filters: { category: 'Veteran ID Card (VIC)' },
    });
    expect(results.length).to.equal(3);
  });

  it('filters by status', () => {
    const results = filterAndSort({
      inquiriesArray: flatInquiries,
      filters: { status: 'In progress' },
    });
    expect(results.length).to.equal(6);
  });

  it('filters by both category and status', () => {
    const results = filterAndSort({
      inquiriesArray: flatInquiries,
      filters: {
        category: 'Veteran ID Card (VIC)',
        status: 'In progress',
      },
    });
    expect(results.length).to.equal(1);
  });

  it('sorts by most recent lastUpdate', () => {
    const firstDateBeforeSort = new Date(flatInquiries[0].lastUpdate);
    expect(firstDateBeforeSort.getDate()).to.equal(12);

    // Sorts by date
    const results = filterAndSort({ inquiriesArray: flatInquiries });
    const firstDateAfterSort = new Date(results[0].lastUpdate);
    expect(firstDateAfterSort.getDate()).to.equal(19);

    // Sorts by time (2 items updated on same day)
    const getIndex = (arr, id) => arr.findIndex(item => item.id === id);

    const laterUpdateIndexBefore = getIndex(
      flatInquiries,
      '1aed76e7-5bbd-ef11-b8e9-001dd830a0af',
    );
    const earlierUpdateIndexBefore = getIndex(
      flatInquiries,
      '46a76c10-5bbd-ef11-b8e9-001dd805523c',
    );
    const laterUpdateIndexAfter = getIndex(
      results,
      '1aed76e7-5bbd-ef11-b8e9-001dd830a0af',
    );

    const earlierUpdateIndexAfter = getIndex(
      results,
      '46a76c10-5bbd-ef11-b8e9-001dd805523c',
    );

    expect(earlierUpdateIndexBefore < laterUpdateIndexBefore).to.be.true;
    expect(laterUpdateIndexAfter < earlierUpdateIndexAfter).to.be.true;
  });

  it('sorts by query: submitter question', () => {
    const results = filterAndSort({
      inquiriesArray: flatInquiries,
      filters: { query: 'Hemesh' },
    });

    expect(results.length).to.equal(1);
    const firstDateAfterSort = new Date(results[0].lastUpdate);
    expect(firstDateAfterSort.getDate()).to.equal(17);
  });

  it('sorts by query: inquiry number', () => {
    const results = filterAndSort({
      inquiriesArray: flatInquiries,
      filters: { query: '617' },
    });

    expect(results.length).to.equal(1);
    expect(results[0].id).to.equal('678b6a15-d1b0-ef11-b8e9-001dd830a0af');
  });

  it('sorts by query: category name', () => {
    const results = filterAndSort({
      inquiriesArray: flatInquiries,
      filters: { query: 'employment' },
    });

    expect(results.length).to.equal(2);
    expect(results[0].id).to.equal('37d37e1b-36b7-ef11-b8e9-001dd809b958');
  });
});
