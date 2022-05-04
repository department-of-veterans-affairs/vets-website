import React from 'react';
import { render } from '@testing-library/react';
import OMBInfo from '../../src/form-builder/OMBInfo';

describe('OMBInfo', () => {

  test('Renders OMBInfo with only required property: expDate should return expDate', () => {
    const { container } = render(
      <OMBInfo expDate="12/12/2013" />
    );

    const ombInfoContainer = container.querySelector(".omb-info")?.innerHTML;

    expect(ombInfoContainer).toContain("12/12/2013");
  });

  test('Renders OMBInfo with all properties', () => {
    const { container } = render(
      <OMBInfo expDate="12/12/2013" resBurden={1} ombNumber="123-ABC" />
    );

    const ombInfoContainer = container.querySelector(".omb-info")?.innerHTML;

    expect(ombInfoContainer).toContain("12/12/2013");
    expect(ombInfoContainer).toContain("Respondent burden: <strong>1 minutes</strong>");
    expect(ombInfoContainer).toContain("OMB Control #: <strong>123-ABC</strong>");
  });
}); 