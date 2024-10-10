import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import IntroductionPage from '../../containers/IntroductionPage';

describe('Edu 10282 <IntroductionPage>', () => {
  it('should render', () => {
    const tree = shallow(
      <IntroductionPage
        route={{
          formConfig: {},
        }}
      />,
    );

    expect(tree.find('FormTitle').props().title).to.contain('Apply');
    tree.unmount();
  });
});
