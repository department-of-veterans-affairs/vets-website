import React from 'react';
import { render } from '@testing-library/react';
import IndividualsInvolvedCard from '../../components/IndividualsInvolvedCard';

describe('IndividualsInvolvedCard', () => {
  it('renders when service member', () => {
    const formData = {
      'view:serviceMember': true,
      name: {},
    };

    const tree = render(<IndividualsInvolvedCard formData={formData} />);

    tree.getByText('Service member');
  });

  it('renders when civilian', () => {
    const formData = {
      'view:serviceMember': false,
      name: {},
    };

    const tree = render(<IndividualsInvolvedCard formData={formData} />);

    tree.getByText('Civilian');
  });

  it('renders when name last name provided', () => {
    const formData = {
      name: {
        last: 'Polarbear',
      },
    };

    const tree = render(<IndividualsInvolvedCard formData={formData} />);

    tree.getByText('Polarbear');
  });

  it('renders when name first name provided', () => {
    const formData = {
      name: {
        first: 'Mark',
      },
    };

    const tree = render(<IndividualsInvolvedCard formData={formData} />);

    tree.getByText('Mark');
  });
});
