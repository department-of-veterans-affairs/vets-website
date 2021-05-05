import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import sinon from 'sinon';

import ReasonForVisitDescriptionField from '../../ReasonForVisitDescriptionField';

import { createFakeReasonForVisitDescriptionStore } from '../utils';

describe('health care questionnaire -- reason to visit description -- when to render --', () => {
  it('parsing reason from state -- text widget is rendered by default', () => {
    const fakeStore = createFakeReasonForVisitDescriptionStore();
    const onChange = sinon.spy();
    const wrapper = mount(
      <ReasonForVisitDescriptionField
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
  it('parsing reason from state -- text widget should not render on review page', () => {
    const fakeStore = createFakeReasonForVisitDescriptionStore();
    const onChange = sinon.spy();
    const wrapper = mount(
      <ReasonForVisitDescriptionField
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
  it('parsing reason from state -- text widget should  render on review page and edit Mode', () => {
    const fakeStore = createFakeReasonForVisitDescriptionStore();
    const onChange = sinon.spy();
    const wrapper = mount(
      <ReasonForVisitDescriptionField
        store={fakeStore}
        id="1"
        schema={{ type: 'string' }}
        formContext={{
          onReviewPage: true,
          reviewMode: false,
        }}
        value={'something'}
        onChange={onChange}
        options={{}}
      />,
    );

    expect(wrapper.find('[data-testid="editField"]').exists()).to.be.true;
    wrapper.unmount();
  });
});
