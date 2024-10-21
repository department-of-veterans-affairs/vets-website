import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { render } from '@testing-library/react';

import TravelPayStatusCheckboxes from '../../components/TravelPayStatusCheckboxes';

it('should still render when an unknown status is given', () => {
  const onStatusFilterChange = sinon.spy();
  const props = {
    statusesToFilterBy: ['SAVED', 'CLOSED', 'something else'],
    checkedStatusFilters: [],
    onStatusFilterChange,
  };

  render(<TravelPayStatusCheckboxes {...props} />);
  const statusFilters = document.querySelectorAll('va-checkbox');

  expect(statusFilters.length).to.eq(3);
});
