import { expect } from 'chai';
import { Actions } from '../../util/actionTypes';
import { breadcrumbsReducer } from '../../reducers/breadcrumbs';
import { medicationsUrls } from '../../util/constants';

const breadcrumbs = {
  crumbs: [
    {
      url: `${medicationsUrls.MEDICATIONS_ABOUT}`,
      label: 'About medications',
    },
    {
      url: `${medicationsUrls.MEDICATIONS_URL}/1`,
      label: 'Medications',
    },
  ],
};

describe('Breadcrumbs reducer', () => {
  const initialState = {
    list: [],
    location: '',
  };
  it('should update the breadcrumbs list', () => {
    const action = {
      type: Actions.Breadcrumbs.SET_BREAD_CRUMBS,
      payload: breadcrumbs,
    };
    const nextState = breadcrumbsReducer(initialState, action);
    expect(nextState.list).to.exist;
  });
  it('remove breadcrumb should update the breadcrumbs list', () => {
    const stateWithList = {
      list: [
        {
          url: '/about',
          label: 'About medications',
        },
        {
          url: '/',
          label: 'Medications',
        },
        {
          url: '/refill',
          label: 'Refill prescriptions',
        },
      ],
    };
    const action = {
      type: Actions.Breadcrumbs.REMOVE_BREAD_CRUMB,
    };
    const nextState = breadcrumbsReducer(stateWithList, action);
    expect(nextState.list.length).to.equal(2);
  });
});
