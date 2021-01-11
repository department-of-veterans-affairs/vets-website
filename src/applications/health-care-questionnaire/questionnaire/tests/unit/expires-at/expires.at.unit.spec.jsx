import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import sinon from 'sinon';

import moment from 'moment';

import ExpiresAt from '../../../components/expires-at/ExpiresAt';

import { createFakeExpiresAtStore } from '../utils/createFakeStores';

describe('health care questionnaire -- expires at ', () => {
  it('does call the onChange event', () => {
    const fakeStore = createFakeExpiresAtStore();
    const onChange = sinon.spy();
    const wrapper = mount(<ExpiresAt store={fakeStore} onChange={onChange} />);

    expect(onChange.called).to.be.true;
    wrapper.unmount();
  });
  it('does call the onChange with correct values', () => {
    const testDate = moment().add(10, 'days');
    const fakeStore = createFakeExpiresAtStore(testDate);
    const onChange = sinon.spy();
    const wrapper = mount(<ExpiresAt store={fakeStore} onChange={onChange} />);

    expect(onChange.called).to.be.true;
    expect(onChange.calledWith(10)).to.be.true;
    wrapper.unmount();
  });
});
