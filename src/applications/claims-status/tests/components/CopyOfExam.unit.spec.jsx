import React from 'react';
import { render } from '@testing-library/react';
import CopyOfExam from '../../components/CopyOfExam';

describe('<CopyOfExam>', () => {
  it('should render component', () => {
    const { getByRole, getByText } = render(<CopyOfExam />);
    getByRole('heading', { name: 'Want a copy of your claim exam?' });
    getByRole('link', {
      name: 'VA Form 20-10206',
      href: 'https://va.gov/find-forms/about-form-20-10206/',
    });
    getByText(
      /You can submit the form using our online tool, or download a pdf of the form and send it by mail./i,
    );
  });
});
