import React from 'react';
import { renderInReduxProvider } from 'platform/testing/unit/react-testing-library-helpers';
import reducer from '../../reducer';

import MemorableDateOfBirthField from '../../components/MemorableDateOfBirthField';

const initialState = {};

describe('<MemorableDateOfBirthField>', () => {
  it('renders without crashing', () => {
    const screen = renderInReduxProvider(<MemorableDateOfBirthField />, {
      initialState,
      reducers: reducer,
    });

    screen.getByText('Date of birth');
    /*
    expect(tree.find('va-memorable-date').length).to.equal(1);
    tree.unmount();
    */
  });
});
