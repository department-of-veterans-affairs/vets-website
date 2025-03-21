import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import moment from 'moment';

import { ConfirmationPageContent } from '../../components/ConfirmationPageContent';

const formId = '22-1111';

const submission = {
  response: {
    attributes: {
      confirmationNumber: '1',
      regionalOffice: 'Moon',
    },
  },
  submittedAt: 'Jan 1, 2021',
};

describe('Edu Benefits <ConfirmationPageContent>', () => {
  it('should render', () => {
    const tree = shallow(
      <ConfirmationPageContent formId={formId} submission={submission} />,
    );
    expect(tree).to.not.be.undefined;
    tree.unmount();
  });

  it('should display formId', () => {
    const tree = shallow(
      <ConfirmationPageContent formId={formId} submission={submission} />,
    );
    expect(tree.find('.confirmation-header span').text()).to.equal(
      `(Form ${formId})`,
    );
    tree.unmount();
  });

  it('should display default text', () => {
    const tree = shallow(
      <ConfirmationPageContent formId={formId} submission={submission} />,
    );
    expect(tree.find('.confirmation-page-title').text()).to.equal(
      "We've received your application.",
    );
    expect(tree.find('h1').text()).to.equal('Update your education benefits');
    tree.unmount();
  });

  it('should display printHeader', () => {
    const tree = shallow(
      <ConfirmationPageContent
        formId={formId}
        submission={submission}
        printHeader="Apply for the Rogers STEM Scholarship"
      />,
    );
    expect(tree.find('h1').text()).to.equal(
      'Apply for the Rogers STEM Scholarship',
    );
    tree.unmount();
  });

  it('should display applicant name', () => {
    const tree = shallow(
      <ConfirmationPageContent
        formId={formId}
        submission={submission}
        name={{
          first: 'Test',
          middle: 'M',
          last: 'Personage',
          suffix: 'Jr',
        }}
      />,
    );
    expect(tree.find('.applicant-name').text()).to.equal(
      'for Test M Personage Jr',
    );
    tree.unmount();
  });

  it('should display default formName', () => {
    const tree = shallow(
      <ConfirmationPageContent formId={formId} submission={submission} />,
    );
    expect(tree.find('.confirmation-header').text()).to.include(
      'Education benefit application',
    );
    tree.unmount();
  });

  it('should display formName', () => {
    const tree = shallow(
      <ConfirmationPageContent
        formId={formId}
        submission={submission}
        formName="Rogers STEM Scholarship"
      />,
    );
    expect(tree.find('.confirmation-header').text()).to.include(
      'Rogers STEM Scholarship',
    );
    tree.unmount();
  });

  it('should display confirmation number', () => {
    const tree = shallow(
      <ConfirmationPageContent
        formId={formId}
        submission={submission}
        formName="Rogers STEM Scholarship"
      />,
    );
    expect(
      tree
        .find('li')
        .at(0)
        .text(),
    ).contains(submission.response.attributes.confirmationNumber);

    tree.unmount();
  });

  it('should display date received', () => {
    const tree = shallow(
      <ConfirmationPageContent formId={formId} submission={submission} />,
    );
    expect(
      tree
        .find('li')
        .at(1)
        .text(),
    ).contains(moment(submission.submittedAt).format('MMM D, YYYY'));

    tree.unmount();
  });

  it('should display regional office', () => {
    const tree = shallow(
      <ConfirmationPageContent formId={formId} submission={submission} />,
    );
    const claimInfo = tree.find('li').at(2);
    expect(claimInfo.text()).contains(
      submission.response.attributes.regionalOffice,
    );

    tree.unmount();
  });

  it('should render confirmation guidance', () => {
    const tree = shallow(
      <ConfirmationPageContent formId={formId} submission={submission} />,
    );
    expect(tree.find('.confirmation-guidance-container')).to.not.be.undefined;
    tree.unmount();
  });

  it('should render document explanation accordion', () => {
    const tree = shallow(
      <ConfirmationPageContent
        formId={formId}
        submission={submission}
        docExplanationHeader="TEST"
        docExplanation={<div>Explanation</div>}
      />,
    );
    expect(tree.find('#collapsiblePanel').text()).to.contain('TEST');
    tree.unmount();
  });

  it.skip('should expand document explanation accordion on click', () => {
    const tree = shallow(
      <ConfirmationPageContent
        formId={formId}
        submission={submission}
        docExplanationHeader="TEST"
        docExplanation={<div>Explanation</div>}
      />,
    );
    // Check to see that div.usa-accordion-content doesn't exist
    expect(tree.find('.usa-accordion-content').length).to.eq(0);

    tree.find('.doc-explanation').simulate('click');

    // Check to see that div.usa-accordion-content exists after expanding
    expect(tree.find('.usa-accordion-content').length).to.eq(1);

    expect(tree.find('.usa-accordion-content').text()).to.contain(
      'Explanation',
    );
    tree.unmount();
  });

  it('should render back button', () => {
    const tree = shallow(
      <ConfirmationPageContent formId={formId} submission={submission} />,
    );
    expect(tree.find('.schemaform-back-buttons button')).to.not.be.undefined;
    tree.unmount();
  });
});
