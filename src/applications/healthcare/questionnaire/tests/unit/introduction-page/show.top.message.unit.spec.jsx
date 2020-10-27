import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';

import IntroductionPage from '../../../containers/IntroductionPage';

import { createFakeIntroductionPageStore } from '../utils/createFakeStores';

describe('healthcare-questionnaire - introduction page  -', () => {
  it('thing!', () => {
    const fakeStore = createFakeIntroductionPageStore();
    const wrapper = mount(<IntroductionPage store={fakeStore} />);

    expect(true).to.equal(true);
    wrapper.unmount();
  });
});
