// FILEPATH: /Users/tzelei/dev/vets-website/src/applications/simple-forms/20-10206/components/viewElements.test.jsx
import React from 'react';

import { expect } from 'chai';
import { render } from '@testing-library/react';
import moment from 'moment';

import { DisabilityExamDate } from '../../../components/viewElements';

describe('DisabilityExamDate', () => {
  it('renders the exam date correctly', () => {
    const testDate = '2022-01-01';
    const { getByText } = render(
      <DisabilityExamDate formData={{ disabilityExamDate: testDate }} />,
    );

    expect(getByText('Exam date')).to.exist;
    expect(getByText(moment(testDate, 'YYYY-MM-DD').format('MMMM D, YYYY'))).to
      .exist;
  });
});
