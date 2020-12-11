import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import {
  ConfirmationPageTitle,
  ConfirmationPageSummary,
  ConfirmationGuidance,
  ConfirmationReturnHome,
} from '../../components/ConfirmationPage';
import moment from 'moment';

const form = {
  formId: '22-9999',
  submission: {
    response: {
      attributes: {},
      confirmationNumber: '1',
      regionalOffice: 'Moon',
    },
    submittedAt: 'Jan 1, 2021',
  },
  data: {
    applicantFullName: {
      first: 'Jane',
      last: 'Doe',
    },
  },
};

describe('Edu Benefits <ConfirmationPageTitle>', () => {
  it('should render', () => {
    const tree = shallow(<ConfirmationPageTitle formId={form.formId} />);
    expect(tree).to.not.be.undefined;
    tree.unmount();
  });

  it('should display formId', () => {
    const tree = shallow(<ConfirmationPageTitle formId={form.formId} />);
    expect(tree.find('span').text()).to.equal(`Form ${form.formId}`);
    tree.unmount();
  });

  it('should display default text', () => {
    const tree = shallow(<ConfirmationPageTitle formId={form.formId} />);
    expect(tree.find('.confirmation-page-title').text()).to.equal(
      "We've received your application.",
    );
    expect(tree.find('h1').text()).to.equal('Update your education benefits');
    tree.unmount();
  });

  it('should display printHeader', () => {
    const tree = shallow(
      <ConfirmationPageTitle
        formId={form.formId}
        printHeader={'Apply for the Rogers STEM Scholarship'}
      />,
    );
    expect(tree.find('h1').text()).to.equal(
      'Apply for the Rogers STEM Scholarship',
    );
    tree.unmount();
  });
});

describe('Edu Benefits <ConfirmationPageSummary>', () => {
  it('should render', () => {
    const tree = shallow(
      <ConfirmationPageSummary
        formId={form.formId}
        response={form.submission.response}
        submission={form.submission}
        name={form.data.applicantFullName}
      />,
    );
    expect(tree).to.not.be.undefined;
    tree.unmount();
  });

  it('should display formId', () => {
    const tree = shallow(
      <ConfirmationPageSummary
        formId={form.formId}
        response={form.submission.response}
        submission={form.submission}
        name={form.data.applicantFullName}
      />,
    );
    expect(tree.find('h4').text()).to.include(`(Form ${form.formId})`);
    tree.unmount();
  });

  it('should display default formName', () => {
    const tree = shallow(
      <ConfirmationPageSummary
        formId={form.formId}
        response={form.submission.response}
        submission={form.submission}
        name={form.data.applicantFullName}
      />,
    );
    expect(tree.find('h4').text()).to.include('Education benefit application');
    tree.unmount();
  });

  it('should display formName', () => {
    const tree = shallow(
      <ConfirmationPageSummary
        formId={form.formId}
        response={form.submission.response}
        submission={form.submission}
        name={form.data.applicantFullName}
        formName={'Rogers STEM Scholarship'}
      />,
    );
    expect(tree.find('h4').text()).to.include('Rogers STEM Scholarship');
    tree.unmount();
  });

  it('should display name', () => {
    const tree = shallow(
      <ConfirmationPageSummary
        formId={form.formId}
        response={form.submission.response}
        submission={form.submission}
        name={form.data.applicantFullName}
      />,
    );
    const name = tree.find('span').at(1);
    expect(name.text()).contains(form.data.applicantFullName.first);
    expect(name.text()).contains(form.data.applicantFullName.last);

    tree.unmount();
  });

  it('should display confirmation number', () => {
    const tree = shallow(
      <ConfirmationPageSummary
        formId={form.formId}
        response={form.submission.response}
        submission={form.submission}
        name={form.data.applicantFullName}
      />,
    );
    const claimInfo = tree.find('li').at(0);
    expect(claimInfo.text()).contains(
      form.submission.response.confirmationNumber,
    );

    tree.unmount();
  });

  it('should display date received', () => {
    const tree = shallow(
      <ConfirmationPageSummary
        formId={form.formId}
        response={form.submission.response}
        submission={form.submission}
        name={form.data.applicantFullName}
      />,
    );
    const claimInfo = tree.find('li').at(1);
    expect(claimInfo.text()).contains(
      moment(form.submission.submittedAt).format('MMM D, YYYY'),
    );

    tree.unmount();
  });

  it('should display regional office', () => {
    const tree = shallow(
      <ConfirmationPageSummary
        formId={form.formId}
        response={form.submission.response}
        submission={form.submission}
        name={form.data.applicantFullName}
      />,
    );
    const claimInfo = tree.find('li').at(2);
    expect(claimInfo.text()).contains(form.submission.response.regionalOffice);

    tree.unmount();
  });
});

describe('Edu Benefits <ConfirmationGuidance>', () => {
  it('should render', () => {
    const tree = shallow(<ConfirmationGuidance />);
    expect(tree).to.not.be.undefined;
    tree.unmount();
  });
});

describe('Edu Benefits <ConfirmationReturnHome>', () => {
  it('should render', () => {
    const tree = shallow(<ConfirmationReturnHome />);
    expect(tree).to.not.be.undefined;
    tree.unmount();
  });
});
