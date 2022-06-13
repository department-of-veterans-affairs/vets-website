import React from 'react';
import { axeCheck } from 'platform/forms-system/test/config/helpers';
import { MemoryRouter as Router } from 'react-router-dom';

import HealthCareHeader from '../../components/health-care/HealthCareHeader';

describe('authenticated experience -- my va -- health care', () => {
  describe('HealthCareHeader', () => {
    it('passes axeCheck', () => {
      axeCheck(
        <Router>
          <HealthCareHeader />
        </Router>,
      );
    });
  });
});
