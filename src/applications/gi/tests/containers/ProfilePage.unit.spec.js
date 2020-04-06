import React from 'react';
import SkinDeep from 'skin-deep';

import createCommonStore from '../../../../platform/startup/store';
import { ProfilePage } from '../../containers/ProfilePage';
import reducer from '../../reducers';

const defaultProps = createCommonStore(reducer).getState();

describe('<ProfilePage>', () => {
  it('should render', () => {
    const tree = SkinDeep.shallowRender(<ProfilePage {...defaultProps} />);
    const vdom = tree.getRenderOutput();
    expect(vdom).toBeDefined();
  });

  it('should render VET TEC institution', () => {
    const vetTecProps = {
      ...defaultProps,
      showModal: () => {},
      profile: {
        ...defaultProps.profile,
        attributes: {
          type: 'FOR PROFIT',
          vetTecProvider: true,
        },
      },
      params: {
        preSelectedProgram: '',
      },
    };
    const tree = SkinDeep.shallowRender(<ProfilePage {...vetTecProps} />);
    expect(tree.subTree('VetTecInstitutionProfile')).toBeTruthy();
  });

  it('should show LoadingState when profile is fetching', () => {
    const inProgressProps = {
      ...defaultProps,
      profile: { inProgress: true },
    };
    const tree = SkinDeep.shallowRender(<ProfilePage {...inProgressProps} />);
    const vdom = tree.getRenderOutput();
    expect(vdom).toBeDefined();
    expect(tree.subTree('LoadingIndicator')).toBeTruthy();
  });

  it('should show error message when profile failed', () => {
    const errorProps = {
      ...defaultProps,
      profile: { inProgress: true, error: 'Service Unavailable' },
    };
    const tree = SkinDeep.shallowRender(<ProfilePage {...errorProps} />);
    expect(tree.subTree('ServiceError')).toBeTruthy();
  });
});
