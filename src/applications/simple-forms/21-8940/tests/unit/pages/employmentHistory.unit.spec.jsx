import { expect } from 'chai';
import formConfig from '../../../config/form';

const { employmentHistoryChapter } = formConfig.chapters;

describe('Employment History Chapter', () => {
  it('should include all required pages', () => {
    expect(employmentHistoryChapter).to.exist;
    expect(employmentHistoryChapter.title).to.equal('Employment history');

    const { pages } = employmentHistoryChapter;
    expect(pages.employmentHistoryIntro).to.exist;
    expect(pages.employmentHistorySummary).to.exist;
    expect(pages.employerInformation).to.exist;
    expect(pages.workDetails).to.exist;
    expect(pages.employmentDates).to.exist;
  });

  it('should have correct page titles', () => {
    const { pages } = employmentHistoryChapter;
    expect(pages.employmentHistoryIntro.title).to.equal(
      'Employment history introduction',
    );
    expect(pages.employmentHistorySummary.title).to.equal(
      'Review your employment history',
    );
    expect(pages.employerInformation.title).to.equal('Employer information');
    expect(pages.workDetails.title).to.equal('Work details');
    expect(pages.employmentDates.title).to.equal('Employment dates');
  });

  it('should have correct page paths', () => {
    const { pages } = employmentHistoryChapter;
    expect(pages.employmentHistoryIntro.path).to.equal(
      'employment-history-intro',
    );
    expect(pages.employmentHistorySummary.path).to.equal(
      'employment-history-summary',
    );
    expect(pages.employerInformation.path).to.equal(
      'employment-history/:index/employer-information',
    );
    expect(pages.workDetails.path).to.equal(
      'employment-history/:index/work-details',
    );
    expect(pages.employmentDates.path).to.equal(
      'employment-history/:index/employment-dates',
    );
  });

  it('should have required uiSchema and schema properties', () => {
    const { pages } = employmentHistoryChapter;

    Object.values(pages).forEach(page => {
      expect(page.uiSchema).to.exist;
      expect(page.schema).to.exist;
    });
  });
});
