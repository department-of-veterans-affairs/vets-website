import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import titleCase from '@department-of-veterans-affairs/platform-utilities/titleCase';
import MedicalRecords, {
  recordTypes,
  pageTitle,
} from '../../components/MedicalRecords';

describe('MHV Landing Page -- temporary Medical Records page', () => {
  it('renders', () => {
    const props = { blueButtonUrl: 'va.gov/bluebutton' };
    const { getByRole, getByTestId, getByText } = render(
      <MedicalRecords {...props} />,
    );
    getByTestId('mhvMedicalRecords');
    getByRole('heading', { level: 1, name: pageTitle });
    const name = 'Go back to the previous version of My HealtheVet';
    const link = getByRole('link', { name });
    expect(link.getAttribute('href')).to.eq(props.blueButtonUrl);
    recordTypes.forEach(type => getByText(type));
    expect(document.title).to.eql(titleCase(pageTitle));
  });
});
