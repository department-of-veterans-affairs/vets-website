import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';
import * as dateUtils from 'platform/utilities/date/index';
import * as uiMask from 'platform/forms-system/src/js/utilities/ui/mask-string';
import VeteranInformationReviewPage from '../../../components/VeteranInformationReviewPage';

const defaultProfile = {
  dob: '1980-12-31',
  userFullName: {
    first: 'Jane',
    middle: 'A',
    last: 'Doe',
    suffix: 'Jr.',
  },
};
const defaultFormData = {
  veteranInformation: {
    ssnLastFour: '4321',
  },
};

describe('VeteranInformationReviewPage', () => {
  let useSelectorStub;
  let dateStub;
  let maskStub;

  beforeEach(() => {
    useSelectorStub = sinon.stub(require('react-redux'), 'useSelector');
    dateStub = sinon.stub(dateUtils, 'formatDateParsedZoneLong');
    maskStub = sinon.stub(uiMask, 'srSubstitute');
  });

  afterEach(() => {
    useSelectorStub.restore();
    dateStub.restore();
    maskStub.restore();
  });

  it('renders all personal info fields with normal data', () => {
    useSelectorStub.callsFake(selector =>
      selector({ user: { profile: defaultProfile } }),
    );
    dateStub.returns('December 31, 1980');
    maskStub.returns('●●●–●●-4 3 2 1');
    const { container } = render(
      <VeteranInformationReviewPage formData={defaultFormData} />,
    );

    expect(container.textContent).to.include('Your personal information');
    expect(container.textContent).to.include('Jane');
    expect(container.textContent).to.include('A');
    expect(container.textContent).to.include('Doe');
    expect(container.textContent).to.include('Jr.');
    expect(container.textContent).to.include('December 31, 1980');
    expect(container.textContent).to.include('●●●–●●-4 3 2 1');
    expect(container.textContent).to.not.include('Missing');
  });

  it('shows error if last name missing', () => {
    useSelectorStub.callsFake(selector =>
      selector({
        user: {
          profile: {
            ...defaultProfile,
            userFullName: { ...defaultProfile.userFullName, last: undefined },
          },
        },
      }),
    );
    dateStub.returns('January 1, 1970');
    maskStub.returns('●●●–●●-9 9 9 9');
    const { container } = render(
      <VeteranInformationReviewPage
        formData={{ veteranInformation: { ssnLastFour: '9999' } }}
      />,
    );
    expect(container.textContent).to.include('Missing last name');
  });

  it('shows error if SSN missing', () => {
    useSelectorStub.callsFake(selector =>
      selector({ user: { profile: defaultProfile } }),
    );
    dateStub.returns('January 1, 1970');
    maskStub.returns('irrelevant');
    const { container } = render(
      <VeteranInformationReviewPage formData={{}} />,
    );
    expect(container.textContent).to.include('Missing SSN');
  });

  it('shows error if date of birth missing', () => {
    useSelectorStub.callsFake(selector =>
      selector({
        user: {
          profile: { ...defaultProfile, dob: undefined },
        },
      }),
    );
    dateStub.returns(null);
    maskStub.returns('●●●–●●-4 3 2 1');
    const { container } = render(
      <VeteranInformationReviewPage formData={defaultFormData} />,
    );
    expect(container.textContent).to.include('Missing date of birth');
  });

  it('does not render middle name or suffix if missing', () => {
    useSelectorStub.callsFake(selector =>
      selector({
        user: {
          profile: {
            ...defaultProfile,
            userFullName: { first: 'Jack', last: 'Smith' },
          },
        },
      }),
    );
    dateStub.returns('March 1, 1950');
    maskStub.returns('●●●–●●-7 7 7 7');
    const { container } = render(
      <VeteranInformationReviewPage
        formData={{ veteranInformation: { ssnLastFour: '7777' } }}
      />,
    );
    expect(container.textContent).to.not.include('Middle name');
    expect(container.textContent).to.not.include('Suffix');
    expect(container.textContent).to.include('Jack');
    expect(container.textContent).to.include('Smith');
    expect(container.textContent).to.include('●●●–●●-7 7 7 7');
  });

  it('masks SSN with srSubstitute', () => {
    useSelectorStub.callsFake(selector =>
      selector({ user: { profile: defaultProfile } }),
    );
    dateStub.returns('September 10, 1991');
    maskStub.callsFake((maskValue, srLabel) => {
      expect(maskValue).to.equal('●●●–●●-4321');
      expect(srLabel).to.equal('ending with 4 3 2 1');
      return 'MASKED-4321';
    });
    const { container } = render(
      <VeteranInformationReviewPage formData={defaultFormData} />,
    );
    expect(container.textContent).to.include('MASKED-4321');
  });

  it('shows additional info section with instructions', () => {
    useSelectorStub.callsFake(selector =>
      selector({ user: { profile: defaultProfile } }),
    );
    dateStub.returns('March 15, 1992');
    maskStub.returns('●●●–●●-1 2 3 4');
    const { container } = render(
      <VeteranInformationReviewPage formData={defaultFormData} />,
    );
    const additionalInfo = container.querySelector('va-additional-info');
    expect(additionalInfo).to.not.be.null;
    expect(additionalInfo.getAttribute('trigger')).to.include(
      'Why you can’t edit your personal information online',
    );

    const vaTelephone = container.querySelector(
      'va-telephone[contact="8008271000"]',
    );
    expect(vaTelephone).to.not.be.null;
    const ttyPhone = container.querySelector(
      'va-telephone[contact="771"][tty]',
    );
    expect(ttyPhone).to.not.be.null;
  });

  it('shows error if all info is missing', () => {
    useSelectorStub.callsFake(selector => selector({ user: { profile: {} } }));
    dateStub.returns(null);
    maskStub.returns('');
    const { container } = render(
      <VeteranInformationReviewPage formData={{}} />,
    );
    expect(container.textContent).to.include('Missing last name');
    expect(container.textContent).to.include('Missing SSN');
    expect(container.textContent).to.include('Missing date of birth');
  });
});
