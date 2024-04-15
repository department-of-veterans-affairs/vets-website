import { expect } from 'chai';
import { render } from '@testing-library/react';
import { ratedDisabilitiesAlert } from '../../content/ratedDisabilities';

describe('ratedDisabilities', () => {
  describe('ratedDisabilitiesAlert', () => {
    it('does not render when form not submitted', () => {
      const formContext = {
        submitted: false,
      };

      const tree = render(ratedDisabilitiesAlert({ formContext }));

      expect(tree.queryByText('We need you to add a disability')).to.be.null;
    });
  });

  it('renders when form submitted', () => {
    const formContext = {
      submitted: true,
    };

    const tree = render(ratedDisabilitiesAlert({ formContext }));

    tree.getByText('We need you to add a disability');
  });
});
