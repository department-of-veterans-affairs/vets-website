import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import { Provider } from 'react-redux';
import sinon from 'sinon';
import { veteranInformation } from '../../../../../config/chapters/veteran-information/veteranInformation';
import VeteranInformation from '../../../../../components/VeteranInformationComponent';

const generateStore = (userProfile = {}) => ({
  dispatch: sinon.spy(),
  subscribe: sinon.spy(),
  getState: () => ({
    user: { profile: userProfile },
  }),
});

const renderComponent = (formData = {}, userProfile = {}) => {
  const mockStore = generateStore(userProfile);
  return render(
    <Provider store={mockStore}>
      <VeteranInformation formData={formData} />
    </Provider>,
  );
};

describe('veteranInformation config', () => {
  it('should export a schema object', () => {
    expect(veteranInformation).to.have.property('schema');
    expect(veteranInformation.schema.type).to.equal('object');
    expect(veteranInformation.schema.properties).to.have.property(
      'veteranInformation',
    );
    expect(
      veteranInformation.schema.properties.veteranInformation.type,
    ).to.equal('object');
  });

  it('should export a uiSchema object', () => {
    expect(veteranInformation).to.have.property('uiSchema');
    expect(veteranInformation.uiSchema).to.have.property('ui:description');
    expect(veteranInformation.uiSchema).to.have.property('ui:objectViewField');
  });

  it('should render the VeteranInformation component as description', () => {
    const store = generateStore({
      dob: '1990-01-01',
      userFullName: {
        first: 'John',
        last: 'Doe',
      },
    });

    const DescriptionComponent = veteranInformation.uiSchema['ui:description'];
    const { container, getByText } = render(
      <Provider store={store}>
        <DescriptionComponent
          formData={{ veteranInformation: { ssnLastFour: '1234' } }}
        />
      </Provider>,
    );

    expect(container.querySelector('va-card')).to.not.be.null;
    expect(getByText(/Name:/)).to.not.be.null;
    expect(getByText(/John Doe/)).to.not.be.null;
    expect(getByText(/Date of birth:/)).to.not.be.null;
    expect(getByText(/January 1, 1990/)).to.not.be.null;
  });
});

describe('VeteranInformation component', () => {
  it('should render <va-card> with full veteran name and suffix', () => {
    const { container } = renderComponent(
      { veteranInformation: { ssnLastFour: '5555' } },
      {
        dob: '1990-01-01',
        userFullName: {
          first: 'John',
          middle: '',
          last: 'Doe',
          suffix: 'Sr.',
        },
      },
    );

    const card = container.querySelector('va-card');
    const nameText = container.querySelector(
      '[data-dd-action-name="Veteran’s name"]',
    );

    expect(card).to.not.be.null;
    expect(nameText?.textContent).to.include('John Doe, Sr.');
    expect(container.textContent).to.include('January 1, 1990');
    expect(container.textContent).to.include('5555');
  });

  it('should render name without suffix', () => {
    const { container } = renderComponent(
      { veteranInformation: { ssnLastFour: '1234' } },
      {
        dob: '1980-06-15',
        userFullName: {
          first: 'Jane',
          middle: '',
          last: 'Smith',
          suffix: undefined,
        },
      },
    );

    const nameText = container.querySelector(
      '[data-dd-action-name="Veteran’s name"]',
    );
    expect(nameText?.textContent).to.include('Jane Smith');
    expect(nameText?.textContent).to.not.include(',');
  });

  it('should handle missing veteranInformation in formData', () => {
    const { container } = renderComponent(
      {},
      {
        dob: '1975-02-10',
        userFullName: { first: 'No', last: 'Data' },
      },
    );

    const ssnField = container.querySelector('.ssn');
    expect(ssnField).to.be.null;
  });

  it('should handle missing userFullName in profile', () => {
    const { container } = renderComponent(
      { veteranInformation: { ssnLastFour: '1234' } },
      {
        dob: '1985-04-12',
        userFullName: { last: 'Doe' },
      },
    );

    const nameText = container.querySelector(
      '[data-dd-action-name="Veteran’s name"]',
    );
    expect(nameText).to.exist;
    expect(nameText.textContent).to.include('Doe');
  });

  it('should skip DOB if not provided', () => {
    const { container } = renderComponent(
      { veteranInformation: { ssnLastFour: '1234' } },
      {
        userFullName: { first: 'Skip', last: 'DOB' },
      },
    );

    const dobField = container.querySelector(
      '[data-dd-action-name="Veteran’s date of birth"]',
    );
    expect(dobField.textContent).to.eq('');
  });
});
