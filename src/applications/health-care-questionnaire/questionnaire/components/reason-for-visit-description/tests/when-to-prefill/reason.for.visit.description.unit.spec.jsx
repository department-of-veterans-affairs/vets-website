import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import sinon from 'sinon';

import ReasonForVisitDescriptionField from '../../ReasonForVisitDescriptionField';

import { createFakeReasonForVisitDescriptionStore } from '../utils';

describe('health care questionnaire -- reason for visit', () => {
  it('parsing reason from state -- no reason in value and no appointment', () => {
    const fakeStore = createFakeReasonForVisitDescriptionStore();
    const onChange = sinon.spy();
    const wrapper = mount(
      <ReasonForVisitDescriptionField
        store={fakeStore}
        id="1"
        schema={{ type: 'string' }}
        formContext={{}}
        value={''}
        onChange={onChange}
        options={{}}
      />,
    );
    expect(wrapper.find('textarea').exists()).to.be.true;
    expect(wrapper.find('textarea').props().value).to.be.equal('');
    wrapper.unmount();
  });
  it('parsing reason from state -- has reason in value', () => {
    const fakeStore = createFakeReasonForVisitDescriptionStore();
    const onChange = sinon.spy();
    const wrapper = mount(
      <ReasonForVisitDescriptionField
        store={fakeStore}
        id="1"
        schema={{ type: 'string' }}
        formContext={{}}
        value={'a good value'}
        onChange={onChange}
        options={{}}
      />,
    );
    expect(wrapper.find('textarea').exists()).to.be.true;
    expect(wrapper.find('textarea').props().value).to.be.equal('a good value');
    wrapper.unmount();
  });
  it('parsing reason from state -- no reason in value and no description in appointment', () => {
    const fakeStore = createFakeReasonForVisitDescriptionStore('');
    const onChange = sinon.spy();
    const wrapper = mount(
      <ReasonForVisitDescriptionField
        store={fakeStore}
        id="1"
        schema={{ type: 'string' }}
        formContext={{}}
        value={''}
        onChange={onChange}
        options={{}}
      />,
    );
    expect(wrapper.find('textarea').exists()).to.be.true;
    expect(wrapper.find('textarea').props().value).to.be.equal('');
    wrapper.unmount();
  });
  it('parsing reason from state -- no reason in value and has description in appointment', () => {
    const fakeStore = createFakeReasonForVisitDescriptionStore(
      'New issue: a really good value',
    );
    const onChange = sinon.spy();
    const wrapper = mount(
      <ReasonForVisitDescriptionField
        store={fakeStore}
        id="1"
        schema={{ type: 'string' }}
        formContext={{}}
        value={''}
        onChange={onChange}
        options={{}}
      />,
    );
    expect(wrapper.find('textarea').exists()).to.be.true;
    expect(onChange.called).to.be.true;
    expect(onChange.calledWith('a really good value')).to.be.true;
    wrapper.unmount();
  });
  it('parsing reason from state -- no reason in value and has description, but no reason  in appointment', () => {
    const fakeStore = createFakeReasonForVisitDescriptionStore(
      'this is a reason',
    );
    const onChange = sinon.spy();
    const wrapper = mount(
      <ReasonForVisitDescriptionField
        store={fakeStore}
        id="1"
        schema={{ type: 'string' }}
        formContext={{}}
        value={''}
        onChange={onChange}
        options={{}}
      />,
    );
    expect(wrapper.find('textarea').exists()).to.be.true;
    expect(onChange.called).to.be.true;
    expect(onChange.calledWith('this is a reason')).to.be.true;
    wrapper.unmount();
  });
  it('parsing reason from state -- has reason in value and has different description in appointment', () => {
    const fakeStore = createFakeReasonForVisitDescriptionStore(
      'New Issue: Not this',
    );
    const onChange = sinon.spy();
    const wrapper = mount(
      <ReasonForVisitDescriptionField
        store={fakeStore}
        id="1"
        schema={{ type: 'string' }}
        formContext={{}}
        value={'should be this'}
        onChange={onChange}
        options={{}}
      />,
    );
    expect(wrapper.find('textarea').exists()).to.be.true;
    expect(wrapper.find('textarea').props().value).to.be.equal(
      'should be this',
    );
    expect(onChange.called).to.be.false;
    wrapper.unmount();
  });
});
