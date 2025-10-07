import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import ConfirmationNewDisabilities from '../../components/ConfirmationNewDisabilities';

describe('ConfirmationNewDisabilities', () => {
  it('should render correctly with selected new disabilities', () => {
    const formData = {
      newDisabilities: [
        {
          condition: 'Condition 1',
          cause: 'NEW',
          primaryDescription: 'Primary description 1',
        },
        {
          condition: 'Condition 2',
          cause: 'SECONDARY',
          primaryDescription: 'Primary description 2',
          'view:secondaryFollowUp': {
            causedByDisability: 'Condition A',
            causedByDisabilityDescription: 'Caused by description A',
          },
        },
      ],
    };
    const { container, getByText } = render(
      <ConfirmationNewDisabilities formData={formData} />,
    );
    expect(container.querySelectorAll('h4')).to.have.length(2);
    expect(getByText('Condition 1')).to.exist;
    expect(getByText(/new condition; Primary description 1/i)).to.exist;
    expect(getByText('Condition 2')).to.exist;
    expect(getByText(/secondary condition; Primary description 2/i)).to.exist;
    expect(getByText(/caused by Condition A; Caused by description A/i)).to
      .exist;
  });

  it('should render nothing when no new disabilities are provided', () => {
    const formData = {
      newDisabilities: [],
    };
    const { container } = render(
      <ConfirmationNewDisabilities formData={formData} />,
    );
    expect(container.querySelectorAll('h4')).to.have.length(0);
  });

  it('should render nothing when formData is empty', () => {
    const { container } = render(<ConfirmationNewDisabilities formData={{}} />);

    expect(container.querySelectorAll('h4')).to.have.length(0);
  });
});
