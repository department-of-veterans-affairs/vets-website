// Dependencies.
import React from 'react';
import { expect } from 'chai';
import { mount, shallow } from 'enzyme';
import moment from 'moment';

// Relative imports.
import SearchResult, { deriveLatestIssue } from '../../components/SearchResult';
import { FORM_MOMENT_PRESENTATION_DATE_FORMAT } from '../../constants';
import FormTitle from '../../components/FormTitle';

describe('Find VA Forms <SearchResult />', () => {
  const formMetaInfo = {
    query: '10-10CG',
    currentPage: 1,
    totalResultsCount: 1,
    totalResultsPages: 1,
    currentPositionOnPage: 1,
  };
  const form = {
    id: '10-10CG',
    attributes: {
      deletedAt: null,
      firstIssuedOn: '2011-05-01',
      formDetailsUrl:
        'https://www.va.gov/health-care/about-caregiver-assistance-form-10-10cg/',
      formName: '10-10CG',
      formToolIntro:
        'You can apply online instead of filling out and sending us the paper form.',
      formToolUrl:
        'https://www.va.gov/family-member-benefits/apply-for-caregiver-assistance-form-10-10cg/introduction',
      formType: null,
      formUsage:
        '<p>Use VA Form 10-10CG to apply for the Program of Comprehensive Assistance for Family Caregivers. Each time a new caregiver is appointed, a new VA Form 10-10CG is required.</p>',
      language: 'en',
      lastRevisionOn: '2020-09-21',
      pages: 5,
      relatedForms: ['10-10d', '10-7959C'],
      sha256:
        'ad611f1779e6e28f1ac5184a202c93492f76b6bd49c76c0c4b8a781c1c751d44',
      title:
        'Instructions and Application for Comprehensive Assistance for Family Caregivers Program',
      url: 'https://www.va.gov/vaforms/medical/pdf/10-10CG.pdf',
      validPdf: true,
    },
  };

  it('should render child component', () => {
    const tree = mount(
      <SearchResult form={form} formMetaInfo={formMetaInfo} />,
    );
    // does parent contain child?
    expect(tree.contains(FormTitle));
    tree.unmount();
  });

  it('should have download or redirect attribute for form PDF dependant on CORS', () => {
    const tree = mount(
      <SearchResult formMetaInfo={formMetaInfo} form={form} />,
    );
    const isSameOrigin = form.attributes.url.startsWith(window.location.origin);

    if (isSameOrigin) expect(tree.exists('[download=true]')).to.equal(true);
    else expect(tree.exists('[target="_blank"]')).to.equal(true);

    tree.unmount();
  });

  it('should have a button', () => {
    const tree = mount(
      <SearchResult formMetaInfo={formMetaInfo} form={form} />,
    );
    expect(tree.exists('.usa-button')).to.equal(true);
    tree.unmount();
  });

  it('should discern latest date', () => {
    const tree = shallow(
      <SearchResult formMetaInfo={formMetaInfo} form={form} />,
    );
    const date1 = '2050-01-01';
    const date2 = '2020-01-01';
    const nullDate = null;
    const emptyStringDate = '';

    const latestDate1 = deriveLatestIssue(date1, date2);
    expect(latestDate1).to.equal(
      moment(date1).format(FORM_MOMENT_PRESENTATION_DATE_FORMAT),
    );

    const latestDate2 = deriveLatestIssue(date1, nullDate);
    expect(latestDate2).to.equal(
      moment(date1).format(FORM_MOMENT_PRESENTATION_DATE_FORMAT),
    );

    const latestDate3 = deriveLatestIssue(emptyStringDate, nullDate);
    expect(latestDate3).to.equal('N/A');

    const latestDate4 = deriveLatestIssue(emptyStringDate, date2);
    expect(latestDate4).to.equal(
      moment(date2).format(FORM_MOMENT_PRESENTATION_DATE_FORMAT),
    );

    tree.unmount();
  });
});
