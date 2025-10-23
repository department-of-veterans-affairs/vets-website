import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import SchemaForm from 'platform/forms-system/src/js/components/SchemaForm';
import contactInformationPage from '../../../../pages/01-personal-information-chapter/contactInformation';

describe('Contact information page', () => {
  it('renders the title, phone field, type of phone options, and all radio options', () => {
    const { container, getByText } = render(
      <SchemaForm
        name="contactInformation"
        title={contactInformationPage.title}
        schema={contactInformationPage.schema}
        uiSchema={contactInformationPage.uiSchema}
        data={{
          phone: {
            callingCode: 1,
            countryCode: 'US',
            contact: '206-555-0100',
          },
          typeOfPhone: 'CELL',
          canReceiveTexts: true,
          email: 'test@example.com',
        }}
        onChange={() => {}}
        onSubmit={() => {}}
      />,
    );

    expect(getByText('Contact information')).to.exist;

    const vaPhoneInput = container.querySelector('va-telephone-input');
    expect(vaPhoneInput).to.exist;
    expect(vaPhoneInput.getAttribute('label')).to.equal('Primary phone number');

    const vaRadio = container.querySelector('va-radio');
    expect(vaRadio).to.exist;
    expect(vaRadio.getAttribute('label')).to.equal('Type of phone');

    const html = container.innerHTML;
    expect(html).to.include('Cell');
    expect(html).to.include('Home');
    expect(html).to.include('Work');
  });
});
