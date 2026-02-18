import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { DocumentTypeSelect, getUiSchema } from '../../pages/uploadDocuments';
import { serviceStatuses } from '../../constants';

const mockStore = configureStore([]);

const renderWithStore = formData => {
  const store = mockStore({
    form: {
      data: formData,
    },
  });
  return render(
    <Provider store={store}>
      <DocumentTypeSelect />
    </Provider>,
  );
};

describe('DocumentTypeSelect component', () => {
  it('should show no options for ADSM without Purple Heart', () => {
    const { container } = renderWithStore({
      identity: serviceStatuses.ADSM,
      militaryHistory: {
        purpleHeartRecipient: false,
      },
    });

    const options = container.querySelectorAll('option');
    expect(options).to.have.length(0);
  });

  it('should show Purple Heart Certificate for ADSM with Purple Heart', () => {
    const { container } = renderWithStore({
      identity: serviceStatuses.ADSM,
      militaryHistory: {
        purpleHeartRecipient: true,
      },
    });

    const options = container.querySelectorAll('option');
    expect(options).to.have.length(1);
    expect(options[0].textContent).to.equal('Purple Heart Certificate');
    expect(options[0].value).to.equal('Purple Heart Certificate');
  });
});

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
