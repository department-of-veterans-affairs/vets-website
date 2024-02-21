// import React from 'react';
import { render } from '@testing-library/react';
import { disabilityNameTitle } from '../../content/newDisabilityFollowUp';
import { NULL_CONDITION_STRING } from '../../constants';

describe('newDisabilityFollowUp', () => {
  describe('disabilityNameTitle', () => {
    it('should render when empty condition', () => {
      const formData = { condition: undefined };

      const tree = render(disabilityNameTitle({ formData }));
      tree.getByText(NULL_CONDITION_STRING);
    });

    it('should render when condition provided', () => {
      const formData = { condition: 'arm condition, left' };

      const tree = render(disabilityNameTitle({ formData }));
      tree.getByText('Arm Condition, Left');
    });
  });
});
