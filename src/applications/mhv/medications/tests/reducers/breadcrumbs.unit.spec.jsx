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
  location: {
    url: `${medicationsUrls.PRESCRIPTION_DETAILS}/000`,
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
