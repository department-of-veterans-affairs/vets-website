import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';

import PrescriptionFillImage from '../../../components/PrescriptionDetails/PrescriptionFillImage';
import * as helpers from '../../../util/helpers';

describe('PrescriptionFillImage component', () => {
  const setup = (prescriptionFill = {}) =>
    render(<PrescriptionFillImage prescriptionFill={prescriptionFill} />);

  it('renders with empty props', () => {
    const screen = setup();
    const noImageMessage = screen.getByTestId('no-image');
    expect(noImageMessage).to.exist;
    expect(noImageMessage).to.have.text('Image not available');
  });

  it('displays the image when cmopNdcNumber is provided', () => {
    const screen = setup({
      cmopNdcNumber: '12345678901',
      prescriptionName: 'Test Medication',
    });
    const image = screen.getByTestId('rx-image');
    expect(image).to.exist;
  });

  it('displays "Image not available" when cmopNdcNumber is null', () => {
    const screen = setup({
      cmopNdcNumber: null,
      prescriptionName: 'Test Medication',
    });
    const noImageMessage = screen.getByTestId('no-image');
    expect(noImageMessage).to.exist;
    expect(noImageMessage).to.have.text('Image not available');
  });

  it('displays "Image not available" when cmopNdcNumber is undefined', () => {
    const screen = setup({
      prescriptionName: 'Test Medication',
    });
    const noImageMessage = screen.getByTestId('no-image');
    expect(noImageMessage).to.exist;
    expect(noImageMessage).to.have.text('Image not available');
  });

  it('displays "Image not available" when cmopNdcNumber is an empty string', () => {
    const screen = setup({
      cmopNdcNumber: '',
      prescriptionName: 'Test Medication',
    });
    const noImageMessage = screen.getByTestId('no-image');
    expect(noImageMessage).to.exist;
    expect(noImageMessage).to.have.text('Image not available');
  });

  it('uses the prescription name as the alt text for the image', () => {
    const prescriptionName = 'METFORMIN HCL 500MG TAB';
    const screen = setup({
      cmopNdcNumber: '12345678901',
      prescriptionName,
    });
    const image = screen.getByTestId('rx-image');
    expect(image.getAttribute('alt')).to.equal(
      `Example of ${prescriptionName}`,
    );
  });

  it('sets image src using getImageUri(cmopNdcNumber)', () => {
    const cmopNdcNumber = '12345678901';
    const screen = setup({
      cmopNdcNumber,
      prescriptionName: 'Test Medication',
    });

    const image = screen.getByTestId('rx-image');
    expect(image.getAttribute('src')).to.equal(
      helpers.getImageUri(cmopNdcNumber),
    );
  });
});
