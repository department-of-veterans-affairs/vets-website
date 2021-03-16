import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';

import CompletedQuestionnaires from '../index';

import {
  createFakeListStore,
  createFakeListStoreEmptyList,
  createFakeListStoreForServiceDown,
} from './utils';

describe('health care questionnaire list - todo list', () => {
  it('No questionnaires -- service down message', () => {
    const fakeStore = createFakeListStoreForServiceDown();
    const component = mount(<CompletedQuestionnaires store={fakeStore} />);

    expect(component.exists('[data-testid="service-down-message"]')).to.be.true;

    component.unmount();
  });
  it('No questionnaires -- empty list', () => {
    const fakeStore = createFakeListStoreEmptyList();
    const component = mount(<CompletedQuestionnaires store={fakeStore} />);

    expect(component.exists('[data-testid="empty-message"]')).to.be.true;

    component.unmount();
  });
  it('has questionnaires', () => {
    const fakeStore = createFakeListStore();
    const component = mount(<CompletedQuestionnaires store={fakeStore} />);
    expect(component.exists('[data-testid="service-down-message"]')).to.be
      .false;

    expect(component.exists('[data-testid="empty-message"]')).to.be.false;
    expect(component.exists('[data-testid="questionnaire-list"]')).to.be.true;

    expect(
      component.find('[data-testid="questionnaire-list"]').children(),
    ).to.have.lengthOf(1);

    component.unmount();
  });
});
