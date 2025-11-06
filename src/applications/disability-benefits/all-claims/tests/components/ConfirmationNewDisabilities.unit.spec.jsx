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
          conditionDate: '2020-01-15',
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
    const { container, getByText, getAllByText } = render(
      <ConfirmationNewDisabilities formData={formData} />,
    );
    expect(container.querySelectorAll('h4')).to.have.length(2);
    expect(getByText('Condition 1')).to.exist;
    expect(getAllByText('Type of condition')).to.have.length(2);
    expect(getByText('New condition')).to.exist;
    expect(getAllByText('Cause')).to.have.length(2);
    expect(
      getByText(
        'My condition was caused by an injury or exposure during my military service.',
      ),
    ).to.exist;
    expect(getAllByText('Description')).to.have.length(3);
    expect(getByText('Primary description 1')).to.exist;
    expect(getByText('Date')).to.exist;
    expect(getByText('January 15, 2020')).to.exist;
    expect(getByText('Condition 2')).to.exist;
    expect(getByText('Secondary condition')).to.exist;
    expect(
      getByText(
        'My condition was caused by another service-connected disability I already have. (For example, I have a limp that caused lower-back problems.)',
      ),
    ).to.exist;
    expect(getByText('Primary description 2')).to.exist;
    expect(getByText('Caused by')).to.exist;
    expect(getByText('Condition A')).to.exist;
    expect(getByText('Caused by description A')).to.exist;
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
