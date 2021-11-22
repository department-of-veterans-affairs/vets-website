import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';

import createCommonStore from 'platform/startup/store';
import { LandingPage } from '../../containers/LandingPage';
import reducer from '../../reducers';

const defaultStore = createCommonStore(reducer);
const defaultProps = {
  ...defaultStore.getState(),
  dispatchShowModal: () => {},
  dispatchSetPageTitle: () => {},
  dispatchEligibilityChange: () => {},
};

describe('<LandingPage>', () => {
  it('should render', () => {
    const tree = mount(
      <MemoryRouter>
        <LandingPage {...defaultProps} />
      </MemoryRouter>,
    );
    expect(tree).to.not.be.undefined;
    tree.unmount();
  });

  it('should display VET TEC type of institution filter', () => {
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
      <MemoryRouter>
        <Provider store={store}>
          <LandingPage {...props} />
        </Provider>
      </MemoryRouter>,
    );

    const vetTecOption = tree.find(
      'LandingPageTypeOfInstitutionFilter RadioButtons span button',
    );
    expect(vetTecOption.text()).to.equal('(Learn more)');
    tree.unmount();
  });
});
