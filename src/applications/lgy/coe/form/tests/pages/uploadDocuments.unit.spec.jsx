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
  it('should show Discharge papers for VETERAN', () => {
    const { container } = renderWithStore({
      identity: serviceStatuses.VETERAN,
    });

    const options = container.querySelectorAll('option');
    expect(options).to.have.length(1);
    expect(options[0].textContent).to.equal('Discharge papers (DD214)');
  });

  it('should show Statement of Service for ADSM without Purple Heart', () => {
    const { container } = renderWithStore({
      identity: serviceStatuses.ADSM,
      militaryHistory: {
        purpleHeartRecipient: false,
      },
    });

    const options = container.querySelectorAll('option');
    expect(options).to.have.length(1);
    expect(options[0].textContent).to.equal('Statement of Service');
  });

  it('should show Statement of Service and Purple Heart Certificate for ADSM with Purple Heart', () => {
    const { container } = renderWithStore({
      identity: serviceStatuses.ADSM,
      militaryHistory: {
        purpleHeartRecipient: true,
      },
    });

    const options = container.querySelectorAll('option');
    expect(options).to.have.length(2);
    expect(options[0].textContent).to.equal('Statement of Service');
    expect(options[1].textContent).to.equal('Purple Heart Certificate');
  });

  it('should show 3 document types for NADNA', () => {
    const { container } = renderWithStore({
      identity: serviceStatuses.NADNA,
    });

    const options = container.querySelectorAll('option');
    expect(options).to.have.length(3);
    expect(options[0].textContent).to.equal('Statement of Service');
    expect(options[1].textContent).to.equal('Creditable number of years');
    expect(options[2].textContent).to.equal('Retirement Points Statement');
  });

  it('should show 4 document types for DNANA', () => {
    const { container } = renderWithStore({
      identity: serviceStatuses.DNANA,
    });

    const options = container.querySelectorAll('option');
    expect(options).to.have.length(4);
    expect(options[0].textContent).to.equal('Separation and Report of Service');
    expect(options[1].textContent).to.equal('Retirement Points Accounting');
    expect(options[2].textContent).to.equal('Proof of character of service');
    expect(options[3].textContent).to.equal(
      'Department of Defense Discharge Certificate',
    );
  });

  it('should show 4 document types for DRNA', () => {
    const { container } = renderWithStore({
      identity: serviceStatuses.DRNA,
    });

    const options = container.querySelectorAll('option');
    expect(options).to.have.length(4);
    expect(options[0].textContent).to.equal('Separation and Report of Service');
    expect(options[1].textContent).to.equal('Retirement Points Accounting');
    expect(options[2].textContent).to.equal('Proof of character of service');
    expect(options[3].textContent).to.equal(
      'Department of Defense Discharge Certificate',
    );
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
