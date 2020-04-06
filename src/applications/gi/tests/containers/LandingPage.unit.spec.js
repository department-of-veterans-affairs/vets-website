import React from 'react';
import sinon from 'sinon';
import { shallow, mount } from 'enzyme';
import { Provider } from 'react-redux';

import createCommonStore from '../../../../platform/startup/store';
import { LandingPage } from '../../containers/LandingPage';
import reducer from '../../reducers';

const defaultStore = createCommonStore(reducer);
const defaultProps = {
  ...defaultStore.getState(),
  showModal: sinon.spy(),
  setPageTitle: sinon.spy(),
  eligibilityChange: sinon.spy(),
};

describe('<LandingPage>', () => {
  test('should render', () => {
    const tree = shallow(<LandingPage {...defaultProps} />);
    expect(tree).toBeDefined();
    tree.unmount();
  });

  test('should handleSubmit correctly', () => {
    const props = {
      ...defaultProps,
      router: { push: sinon.spy() },
      location: { query: {} },
      autocomplete: { searchTerm: 'foo' },
      handleSubmit: sinon.spy(),
    };

    const tree = mount(
      <Provider store={defaultStore}>
        <LandingPage {...props} />
      </Provider>,
    );
    tree.find('form').simulate('submit');
    expect(props.router.push.called).toBe(true);
    tree.unmount();
  });

  test('should display VET TEC type of institution filter', () => {
    const props = {
      ...defaultProps,
      router: { push: sinon.spy() },
      location: { query: {} },
      autocomplete: { searchTerm: null },
      renderVetTecLogo: sinon.spy(),
    };

    const store = {
      ...defaultStore,
      state: {
        ...defaultProps,
        eligibility: {
          ...defaultProps.eligibility,
          militaryStatus: 'veteran',
          giBillChapter: '33',
        },
      },
    };
    const tree = mount(
      <Provider store={store}>
        <LandingPage {...props} />
      </Provider>,
    );

    const vetTecOption = tree
      .find('LandingPageTypeOfInstitutionFilter')
      .find('RadioButtons')
      .find('span')
      .find('button');
    expect(vetTecOption.text()).toBe('(Learn more)');
    tree.unmount();
  });
});
