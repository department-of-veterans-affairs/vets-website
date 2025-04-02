import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import UnsavedFieldNote from '../../components/UnsavedFieldNote';

const setup = (props = {}) => render(<UnsavedFieldNote {...props} />);

describe('<UnsavedFieldNote />', () => {
  it('renders', () => {
    const { container } = setup({ fieldName: 'location' });
    const note = 'Any updates you make to your location';
    expect(container.textContent).to.contain(note);
  });
});
