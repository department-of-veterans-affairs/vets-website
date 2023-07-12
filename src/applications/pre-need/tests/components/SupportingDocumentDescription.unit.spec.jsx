import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import sinon from 'sinon';

import SupportingDocumentsDescription from '../../components/SupportingDocumentsDescription';
import * as helpers from '../../utils/helpers';

describe('SupportingDocumentsDescription', () => {
  let isVeteranStub;

  beforeEach(() => {
    isVeteranStub = sinon.stub(helpers, 'isVeteran');
  });

  afterEach(() => {
    isVeteranStub.restore();
  });

  it('renders the correct description if isVeteran returns true', () => {
    isVeteranStub.returns(true);

    const formData = {
      relationshipToVet: '1',
    };
    const wrapper = shallow(
      <SupportingDocumentsDescription formData={formData} />,
    );

    const veteranDescription = wrapper.find('p').at(2);

    expect(veteranDescription.text()).to.contain(
      'your  DD214 or other separation papers.',
    );
    wrapper.unmount();
  });

  it('renders the correct description if isVeteran returns false', () => {
    isVeteranStub.returns(false);

    const formData = {
      relationshipToVet: '2',
    };
    const wrapper = shallow(
      <SupportingDocumentsDescription formData={formData} />,
    );

    const nonVeteranDescription = wrapper.find('p').at(2);

    expect(nonVeteranDescription.text()).to.contain(
      "your sponsor's DD214 or other separation papers.",
    );
    wrapper.unmount();
  });

  it('renders the correct mailing address', () => {
    const wrapper = shallow(
      <SupportingDocumentsDescription formData={{ relationshipToVet: '2' }} />,
    );
    const mailingAddress = wrapper.find('p').at(6);

    expect(mailingAddress.text()).to.contain('NCA Intake Center');
    expect(mailingAddress.text()).to.contain('P.O. Box 5237');
    expect(mailingAddress.text()).to.contain('Janesville, WI 53547');
    wrapper.unmount();
  });
});
