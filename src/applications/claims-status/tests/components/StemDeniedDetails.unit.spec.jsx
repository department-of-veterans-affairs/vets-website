import React from 'react';
import { expect } from 'chai';
import { fireEvent } from '@testing-library/dom';
import sinon from 'sinon';
import * as recordEventModule from '~/platform/monitoring/record-event';
import { renderWithRouter } from '../utils';

import StemDeniedDetails from '../../components/StemDeniedDetails';

const props = {
  deniedAt: '2024-01-01',
  isEnrolledStem: false,
  isPursuingTeachingCert: false,
};

describe('<StemDeniedDetails>', () => {
  it('should render', () => {
    const { getByText, queryByText } = renderWithRouter(
      <StemDeniedDetails {...props} />,
    );
    getByText('Your Edith Nourse Rogers STEM Scholarship application');
    getByText('Your application was denied on Jan. 1, 2024');
    expect(
      queryByText(
        'You meet the degree requirements for the Rogers STEM Scholarship.',
      ),
    ).not.to.exist;
  });

  it('should render when isEnrolledStem is true', () => {
    const { getByText } = renderWithRouter(
      <StemDeniedDetails {...props} isEnrolledStem />,
    );
    getByText('Your Edith Nourse Rogers STEM Scholarship application');
    getByText('Your application was denied on Jan. 1, 2024');
    getByText(
      'You meet the degree requirements for the Rogers STEM Scholarship.',
    );
  });

  it('should render when isPursuingTeachingCert is true', () => {
    const { getByText } = renderWithRouter(
      <StemDeniedDetails {...props} isPursuingTeachingCert />,
    );
    getByText('Your Edith Nourse Rogers STEM Scholarship application');
    getByText('Your application was denied on Jan. 1, 2024');
    getByText(
      'You meet the degree requirements for the Rogers STEM Scholarship.',
    );
  });

  it('when click EdithNorthRodgersStemLink, should call record event', () => {
    const recordEventStub = sinon.stub(recordEventModule, 'default');
    const { getByTestId } = renderWithRouter(<StemDeniedDetails {...props} />);

    const EdithNorthRodgersStemLink = getByTestId(
      'edith-north-rodgers-stem-link',
    );
    expect(EdithNorthRodgersStemLink).to.exist;
    expect(EdithNorthRodgersStemLink.getAttribute('href')).to.equal(
      'https://www.va.gov/education/other-va-education-benefits/stem-scholarship/',
    );
    expect(EdithNorthRodgersStemLink.getAttribute('text')).to.equal(
      'Edith Nourse Rogers STEM Scholarship',
    );

    fireEvent.click(EdithNorthRodgersStemLink);

    const header = 'More resources about VA benefits';
    const section =
      'Learn more about eligibility and how to apply for this scholarship.';
    expect(
      recordEventStub.calledWith({
        event: 'nav-linkslist',
        'links-list-section-header': section,
        'links-list-header': header,
      }),
    ).to.be.true;
    recordEventStub.restore();
  });

  it('when click FindVAFormLink, should call record event', () => {
    const recordEventStub = sinon.stub(recordEventModule, 'default');
    const { getByTestId } = renderWithRouter(<StemDeniedDetails {...props} />);

    const FindVAFormLink = getByTestId('find-va-form-link');
    expect(FindVAFormLink).to.exist;
    expect(FindVAFormLink.getAttribute('href')).to.equal(
      'https://www.va.gov/vaforms',
    );
    expect(FindVAFormLink.getAttribute('text')).to.equal('Find a VA Form');
    fireEvent.click(FindVAFormLink);

    const header = 'Find a VA Form';
    const section = 'Search for a VA form.';
    expect(
      recordEventStub.calledWith({
        event: 'nav-linkslist',
        'links-list-section-header': section,
        'links-list-header': header,
      }),
    ).to.be.true;
    recordEventStub.restore();
  });

  it('when click GIBillCompToolLink, should call record event', () => {
    const recordEventStub = sinon.stub(recordEventModule, 'default');
    const { getByTestId } = renderWithRouter(<StemDeniedDetails {...props} />);

    const GIBillCompToolLink = getByTestId('gi-bill-comp-tool-link');
    expect(GIBillCompToolLink).to.exist;
    expect(GIBillCompToolLink.getAttribute('href')).to.equal(
      'https://www.va.gov/education/gi-bill-comparison-tool',
    );
    expect(GIBillCompToolLink.getAttribute('text')).to.equal(
      'GI Bill® Comparison Tool',
    );

    fireEvent.click(GIBillCompToolLink);

    const header = 'GI Bill® Comparison Tool';
    const section =
      'Get information on a school’s value and affordability; and compare estimated benefits by school.';
    expect(
      recordEventStub.calledWith({
        event: 'nav-linkslist',
        'links-list-section-header': section,
        'links-list-header': header,
      }),
    ).to.be.true;
    recordEventStub.restore();
  });
});
