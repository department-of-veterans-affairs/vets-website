import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import CopyOfExam from '../../components/CopyOfExam';

describe('<CopyOfExam>', () => {
  it('should render component', () => {
    const { getByRole, getByText, getByTestId } = render(<CopyOfExam />);
    getByRole('heading', { name: 'Want a copy of your claim exam?' });

    const link = getByTestId('va-form-20-10206-link');
    expect(link).to.exist;
    expect(link.getAttribute('href')).to.equal(
      'https://va.gov/find-forms/about-form-20-10206/',
    );
    expect(link.getAttribute('text')).to.equal('VA Form 20-10206');

    getByText(
      /You can submit the form using our online tool, or download a pdf of the form and send it by mail./i,
    );
  });
});
