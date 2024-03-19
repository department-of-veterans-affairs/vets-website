import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';

import { setupI18n, teardownI18n } from '../../../utils/i18n/i18n';
import CheckInProvider from '../../../tests/unit/utils/CheckInProvider';

import SeeStaff from '../SeeStaff';

describe('check in', () => {
  beforeEach(() => {
    setupI18n();
  });
  afterEach(() => {
    teardownI18n();
  });
  describe('SeeStaff', () => {
    it('has a header', () => {
      const component = render(
        <CheckInProvider store={{ seeStaffMessage: 'message test' }}>
          <SeeStaff />
        </CheckInProvider>,
      );

      expect(component.getByText('message test')).to.exist;
    });
  });
});
