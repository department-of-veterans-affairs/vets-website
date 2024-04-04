import { expect } from 'chai';
import { Actions } from '../../util/actionTypes';
import { breadcrumbsReducer } from '../../reducers/breadcrumbs';

const breadcrumbs = {
  crumbs: [
    {
      url: '/my-health/medications/about',
      label: 'About medications',
    },
    {
      url: '/my-health/medications/1',
      label: 'Medications',
    },
  ],
  location: {
    url: `/my-health/medications/prescription/000`,
    label: 'Prescription Name',
  },
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
    expect(nextState.location).to.exist;
  });
});
