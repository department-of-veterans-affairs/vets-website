import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';

import FinancialHardshipViewField from '../../../components/FinancialHardshipViewField';
import { FINANCIAL_HARDSHIP_DESCRIPTION } from '../../../config/constants';

describe('<FinancialHardshipViewField />', () => {
  const mockFormData = {
    financialHardshipDocuments: [
      { name: 'Test Document', size: 12345 },
      { name: 'Another Test Document', size: 67890 },
    ],
  };
  let wrapper;

  afterEach(done => {
    if (wrapper) {
      wrapper.unmount();
      wrapper = null;
    }
    done();
  });

  it('renders without crashing', done => {
    // eslint-disable-next-line @department-of-veterans-affairs/enzyme-unmount
    wrapper = mount(
      <FinancialHardshipViewField
        defaultEditButton={() => {}}
        formData={mockFormData}
      />,
    );
    expect(wrapper.exists()).to.equal(true);
    done();
  });

  it('renders FINANCIAL_HARDSHIP_DESCRIPTION', done => {
    // eslint-disable-next-line @department-of-veterans-affairs/enzyme-unmount
    wrapper = mount(
      <FinancialHardshipViewField
        defaultEditButton={() => {}}
        formData={mockFormData}
      />,
    );
    expect(wrapper.contains(FINANCIAL_HARDSHIP_DESCRIPTION)).to.equal(true);
    done();
  });

  it('renders financialHardshipDocuments when provided', done => {
    // eslint-disable-next-line @department-of-veterans-affairs/enzyme-unmount
    wrapper = mount(
      <FinancialHardshipViewField
        defaultEditButton={() => {}}
        formData={mockFormData}
      />,
    );
    expect(wrapper.find('.va-growable-background')).to.have.lengthOf(
      mockFormData.financialHardshipDocuments.length,
    );
    done();
  });
});
