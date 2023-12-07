import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';

import AppContent from '../../components/AppContent';

const badStatusUser = {
  profile: {
    status: 'NOT_FOUND',
    verified: true,
  },
};

const unverifiedUser = {
  profile: {
    status: 'OK',
    verified: false,
  },
},


describe('<AppContent>', () => {
  context('when the users profile is not as expected', () => {
    it('should render an error when they are not verified', () => {
      const screen = render(<AppContent user={unverifiedUser} />)
    });
  });
});