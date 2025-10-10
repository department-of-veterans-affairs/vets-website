import { expect } from 'chai';
import formConfig from '../../../config/form';

const { currentEmploymentChapter } = formConfig.chapters;

describe('Current Employment Chapter', () => {
  it('should include all required pages', () => {
    expect(currentEmploymentChapter).to.exist;
    expect(currentEmploymentChapter.title).to.equal('Current employment');

    const { pages } = currentEmploymentChapter;
    expect(pages.militaryService).to.exist;
    expect(pages.currentIncome).to.exist;
    expect(pages.jobLeavingReason).to.exist;
    expect(pages.disabilityRetirement).to.exist;
    expect(pages.workersCompensation).to.exist;
    expect(pages.jobSearchSummary).to.exist;
    expect(pages.jobSearchEmployerContactInfo).to.exist;
    expect(pages.jobSearchDetails).to.exist;
  });

  it('should have correct page titles', () => {
    const { pages } = currentEmploymentChapter;
    expect(pages.militaryService.title).to.equal('Military service');
    expect(pages.currentIncome.title).to.equal('Current income');
    expect(pages.jobLeavingReason.title).to.equal('Job leaving reason');
    expect(pages.disabilityRetirement.title).to.equal(
      'Disability retirement benefits',
    );
    expect(pages.workersCompensation.title).to.equal(
      'Workers’ compensation benefits',
    );
    expect(pages.jobSearchSummary.title).to.equal('Job search history');
    expect(pages.jobSearchEmployerContactInfo.title).to.equal(
      'Contacted employer information',
    );
    expect(pages.jobSearchDetails.title).to.equal('Job search details');
  });

  it('should have correct page paths', () => {
    const { pages } = currentEmploymentChapter;
    expect(pages.militaryService.path).to.equal('military-service');
    expect(pages.currentIncome.path).to.equal('current-income');
    expect(pages.jobLeavingReason.path).to.equal(
      'leaving-work-due-to-disability',
    );
    expect(pages.disabilityRetirement.path).to.equal('disability-retirement');
    expect(pages.workersCompensation.path).to.equal('workers-compensation');
    expect(pages.jobSearchSummary.path).to.equal('job-search-summary');
    expect(pages.jobSearchEmployerContactInfo.path).to.equal(
      'job-search-employers/:index/employer-contact-info',
    );
    expect(pages.jobSearchDetails.path).to.equal(
      'job-search-employers/:index/job-search-details',
    );
  });

  it('should have uiSchema and schema for each page', () => {
    const { pages } = currentEmploymentChapter;

    // Test that each page has required schema properties
    Object.values(pages).forEach(page => {
      expect(page.uiSchema).to.exist;
      expect(page.schema).to.exist;
      expect(page.schema.type).to.equal('object');
    });
  });

  it('should have required fields validation', () => {
    const { pages } = currentEmploymentChapter;

    // Military service should require isCurrentlyServing
    expect(pages.militaryService.schema.required).to.include(
      'isCurrentlyServing',
    );

    // Current income should require gross income for past 12 months
    expect(pages.currentIncome.schema.required).to.include(
      'grossIncomeLastTwelveMonths',
    );

    // Job leaving reason should require the main question
    expect(pages.jobLeavingReason.schema.required).to.include(
      'leftJobDueToDisability',
    );

    // Disability retirement should require the answer
    expect(pages.disabilityRetirement.schema.required).to.include(
      'receivesDisabilityRetirement',
    );

    // Workers compensation should require the answer
    expect(pages.workersCompensation.schema.required).to.include(
      'receivesWorkersCompensation',
    );
  });
});
