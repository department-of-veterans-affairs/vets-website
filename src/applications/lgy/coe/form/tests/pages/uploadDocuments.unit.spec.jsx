import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import { getUiSchema } from '../../pages/uploadDocuments';
import { serviceStatuses } from '../../constants';

describe('uploadDocuments page', () => {
  describe('statement of service accordion', () => {
    const renderTitleDescription = identity => {
      const formData = { identity };
      const uiSchema = getUiSchema();
      const titleDescription = uiSchema['ui:title']({ formData });
      return render(<div>{titleDescription}</div>);
    };

    const statusesWithAccordion = [serviceStatuses.ADSM, serviceStatuses.NADNA];

    const statusesWithoutAccordion = [
      serviceStatuses.VETERAN,
      serviceStatuses.DNANA,
      serviceStatuses.DRNA,
    ];

    statusesWithAccordion.forEach(status => {
      it(`should display accordion for ${status} service status`, () => {
        const { getByTestId } = renderTitleDescription(status);
        const accordion = getByTestId('statement-of-service-accordion');
        expect(accordion).to.exist;
        expect(accordion.textContent).to.include('Statement of service');
      });
    });

    statusesWithoutAccordion.forEach(status => {
      it(`should not display accordion for ${status} service status`, () => {
        const { queryByTestId } = renderTitleDescription(status);
        const accordion = queryByTestId('statement-of-service-accordion');
        expect(accordion).to.not.exist;
      });
    });
  });
});
