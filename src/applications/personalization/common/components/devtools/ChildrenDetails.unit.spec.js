import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import ChildrenDetails from './ChildrenDetails';

// Create a mock child component for testing
const MockChildComponent = ({ text }) => <div>{text}</div>;

describe('<ChildrenDetails />', () => {
  it('renders details for valid React children', () => {
    const { getAllByText } = render(
      <ChildrenDetails>
        <MockChildComponent text="Child 1" />
        <MockChildComponent text="Child 2" />
      </ChildrenDetails>,
    );

    // Use getAllByText to retrieve all instances
    const childDetails = getAllByText(/MockChildComponent/);

    // Assert that the correct number of children are rendered
    expect(childDetails.length).to.equal(2);

    // Assert details of each child
    expect(childDetails[0].textContent).to.include('Child 1');
    expect(childDetails[1].textContent).to.include('Child 2');
  });

  it('returns null for non-React elements', () => {
    const { container } = render(
      <ChildrenDetails>
        {null}
        {undefined}
        String Child
      </ChildrenDetails>,
    );

    // Check if no details are rendered for non-React elements
    expect(container.firstChild).to.be.null;
  });
});
