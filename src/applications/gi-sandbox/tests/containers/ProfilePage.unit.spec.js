import React from 'react';
import { expect } from 'chai';
import { MemoryRouter } from 'react-router-dom';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';

import createCommonStore from 'platform/startup/store';
import { ProfilePage } from '../../containers/ProfilePage';
import reducer from '../../reducers';

const defaultStore = createCommonStore(reducer);

const defaultProps = {
  ...defaultStore.getState(),
  dispatchFetchProfile: () => {},
  dispatchSetPageTitle: () => {},
  dispatchShowModal: () => {},
  dispatchHideModal: () => {},
  match: { params: { facilityCode: 'a', preSelectedProgram: '' } },
};

describe('<ProfilePage>', () => {
  it('should render', () => {
    const tree = mount(
      <MemoryRouter>
        <ProfilePage {...defaultProps} />
      </MemoryRouter>,
    );
    expect(tree.find('div[name="profilePage"]').length).to.eq(1);
    tree.unmount();
  });

  it('should render VET TEC institution', () => {
    const vetTecProps = {
      ...defaultProps,
      profile: {
        ...defaultProps.profile,
        attributes: {
          type: 'FOR PROFIT',
          vetTecProvider: true,
          city: 'Test',
          state: 'TN',
          country: 'USA',
          programs: [{ description: 'TEST' }],
        },
      },
    };
    const tree = mount(
      <MemoryRouter initialEntries={[`/2V111111/TEST`]}>
        <Provider store={defaultStore}>
          <ProfilePage {...vetTecProps} />
        </Provider>
      </MemoryRouter>,
    );
    expect(tree.find('VetTecInstitutionProfile').length).to.eq(1);
    tree.unmount();
  });

  it('should show LoadingState when profile is fetching', () => {
    const inProgressProps = {
      ...defaultProps,
      profile: { inProgress: true },
    };
    const tree = mount(
      <MemoryRouter>
        <ProfilePage {...inProgressProps} />
      </MemoryRouter>,
    );
    expect(tree.find('LoadingIndicator').length).to.eq(1);
    tree.unmount();
  });

  it('should show error message when profile failed', () => {
    const errorProps = {
      ...defaultProps,
      profile: { inProgress: true, error: 'Service Unavailable' },
    };
    const tree = mount(
      <MemoryRouter>
        <ProfilePage {...errorProps} />
      </MemoryRouter>,
    );
    expect(tree.find('ServiceError').length).to.eq(1);
    tree.unmount();
  });
});
