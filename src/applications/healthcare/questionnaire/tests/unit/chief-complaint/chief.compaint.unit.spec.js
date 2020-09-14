import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import sinon from 'sinon';

import ChiefComplaintField from '../../../components/chief-complaint/ChiefComplaintField';

import { createFakeChiefComplaint } from '../utils/createFakeStores';

describe('healthcare-questionnaire - chief complaint -', () => {
  it('Chief Complaint -- parsing reason from state -- text widget is rendered by default', () => {
    const fakeStore = createFakeChiefComplaint();
    const onChange = sinon.spy();
    const wrapper = mount(
      <ChiefComplaintField
        store={fakeStore}
        id="1"
        schema={{ type: 'string' }}
        formContext={{}}
        value={'something'}
        onChange={onChange}
        options={{}}
      />,
    );
    expect(wrapper.find('[data-testid="editField"]').exists()).to.be.true;
    wrapper.unmount();
  });
  it('Chief Complaint -- parsing reason from state -- text widget should not render on review page', () => {
    const fakeStore = createFakeChiefComplaint();
    const onChange = sinon.spy();
    const wrapper = mount(
      <ChiefComplaintField
        store={fakeStore}
        id="1"
        schema={{ type: 'string' }}
        formContext={{
          onReviewPage: true,
          reviewMode: true,
        }}
        value={'something'}
        onChange={onChange}
        options={{}}
      />,
    );

    expect(wrapper.find('[data-testid="editField"]').exists()).to.be.false;
    wrapper.unmount();
  });
});
