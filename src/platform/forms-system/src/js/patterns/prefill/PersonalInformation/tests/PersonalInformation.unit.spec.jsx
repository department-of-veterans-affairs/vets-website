import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import sinon from 'sinon';
import { PersonalInformation, defaultConfig } from '../PersonalInformation';

const mockProfile = {
  dob: '1980-01-15',
  gender: 'M',
  userFullName: {
    first: 'John',
    middle: 'Michael',
    last: 'Doe',
    suffix: 'Jr.',
  },
};

const createMockStore = (profile = mockProfile) =>
  createStore(() => ({
    user: {
      profile,
    },
  }));

const MockNavButtons = () => (
  <div>
    <va-button type="button">Back</va-button>
    <va-button type="button">Continue</va-button>
  </div>
);

const getData = ({
  ssn = '1234',
  vaFileLastFour = '5678',
  config = {},
  dataAdapter = {},
  errorMessage = null,
  background = false,
} = {}) => ({
  data: {
    ssn,
    vaFileNumber: vaFileLastFour,
  },
  config: { ...defaultConfig, ...config },
  dataAdapter,
  errorMessage,
  background,
  NavButtons: MockNavButtons,
  goBack: () => {},
  goForward: () => {},
  formOptions: {},
});

describe('<PersonalInformation>', () => {
  let sandbox;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('should render with all default fields', () => {
    const store = createMockStore();
    const props = getData();
    const { container, getByText } = render(
      <Provider store={store}>
        <PersonalInformation {...props} />
      </Provider>,
    );

    expect(container.querySelector('va-card')).to.exist;
    expect(getByText('Name:')).to.exist;
    expect(container.textContent).to.include('John Michael Doe, Jr.');
    expect(getByText('Last 4 digits of Social Security Number:')).to.exist;
    expect(container.textContent).to.include('1 2 3 4');
    expect(getByText('Date of birth:')).to.exist;
    expect(container.textContent).to.include('January 15, 1980');
  });

  it('should render with background on va-card', () => {
    const store = createMockStore();
    const props = getData({ background: true });
    const { container } = render(
      <Provider store={store}>
        <PersonalInformation {...props} />
      </Provider>,
    );

    const card = container.querySelector('va-card');
    expect(card).to.exist;
    expect(card.hasAttribute('background')).to.be.true;
  });

  it('should render full SSN when showFullSSN is true', () => {
    const store = createMockStore();
    const props = getData({
      ssn: '123456789',
      config: {
        ssn: {
          show: true,
          required: false,
          showFullSSN: true,
        },
      },
    });
    const { container, getByText } = render(
      <Provider store={store}>
        <PersonalInformation {...props} />
      </Provider>,
    );

    expect(getByText('Social Security Number:')).to.exist;
    // Mask should show last 4 digits with masking
    expect(container.textContent).to.match(/6\s*7\s*8\s*9/);
  });

  it('should render VA file number when configured', () => {
    const store = createMockStore();
    const props = getData({
      config: {
        vaFileNumber: {
          show: true,
          required: false,
        },
      },
    });
    const { container, getByText } = render(
      <Provider store={store}>
        <PersonalInformation {...props} />
      </Provider>,
    );

    expect(getByText('Last 4 digits of VA file number:')).to.exist;
    expect(container.textContent).to.include('5 6 7 8');
  });

  it('should render sex when configured', () => {
    const store = createMockStore();
    const props = getData({
      config: {
        sex: {
          show: true,
          required: false,
        },
      },
    });
    const { container, getByText } = render(
      <Provider store={store}>
        <PersonalInformation {...props} />
      </Provider>,
    );

    expect(getByText('Sex:')).to.exist;
    expect(container.textContent).to.include('Male');
  });

  it('should show "Not available" for missing name', () => {
    const store = createMockStore({
      ...mockProfile,
      userFullName: {},
    });
    const props = getData();
    const { getByTestId } = render(
      <Provider store={store}>
        <PersonalInformation {...props} />
      </Provider>,
    );

    expect(getByTestId('name-not-available')).to.exist;
  });

  it('should show "Not available" for missing SSN', () => {
    const store = createMockStore();
    const props = getData({ ssn: null });
    const { getByTestId } = render(
      <Provider store={store}>
        <PersonalInformation {...props} />
      </Provider>,
    );

    expect(getByTestId('ssn-not-available')).to.exist;
  });

  it('should show "Not available" for missing date of birth', () => {
    const store = createMockStore({
      ...mockProfile,
      dob: null,
    });
    const props = getData();
    const { getByTestId } = render(
      <Provider store={store}>
        <PersonalInformation {...props} />
      </Provider>,
    );

    expect(getByTestId('dob-not-available')).to.exist;
  });

  it('should show "Not available" for missing VA file number when shown', () => {
    const store = createMockStore();
    const props = getData({
      vaFileLastFour: null,
      config: {
        vaFileNumber: {
          show: true,
          required: false,
        },
      },
    });
    const { getByTestId } = render(
      <Provider store={store}>
        <PersonalInformation {...props} />
      </Provider>,
    );

    expect(getByTestId('va-file-number-not-available')).to.exist;
  });

  it('should show "Not available" for missing sex when shown', () => {
    const store = createMockStore({
      ...mockProfile,
      gender: null,
    });
    const props = getData({
      config: {
        sex: {
          show: true,
          required: false,
        },
      },
    });
    const { getByTestId } = render(
      <Provider store={store}>
        <PersonalInformation {...props} />
      </Provider>,
    );

    expect(getByTestId('sex-not-available')).to.exist;
  });

  it('should hide fields when show is false', () => {
    const store = createMockStore();
    const props = getData({
      config: {
        name: { show: false },
        ssn: { show: false },
        dateOfBirth: { show: false },
      },
    });
    const { container } = render(
      <Provider store={store}>
        <PersonalInformation {...props} />
      </Provider>,
    );

    expect(container.textContent).to.not.include('Name:');
    expect(container.textContent).to.not.include('Social Security Number');
    expect(container.textContent).to.not.include('Date of birth:');
  });

  it('should show error alert for missing required data', () => {
    const store = createMockStore({
      ...mockProfile,
      userFullName: {},
    });
    const props = getData({
      ssn: null,
      config: {
        name: { show: true, required: true },
        ssn: { show: true, required: true },
      },
    });
    const { container, getByText } = render(
      <Provider store={store}>
        <PersonalInformation {...props} />
      </Provider>,
    );

    const alert = container.querySelector('va-alert[status="error"]');
    expect(alert).to.exist;
    expect(getByText('We need more information')).to.exist;
  });

  it('should render custom error message when provided', () => {
    const store = createMockStore({
      ...mockProfile,
      userFullName: {},
    });
    const customErrorMessage = 'Custom error message text';
    const props = getData({
      ssn: null,
      config: {
        name: { show: true, required: true },
        ssn: { show: true, required: true },
      },
      errorMessage: customErrorMessage,
    });
    const { container, getByText } = render(
      <Provider store={store}>
        <PersonalInformation {...props} />
      </Provider>,
    );

    const alert = container.querySelector('va-alert[status="error"]');
    expect(alert).to.exist;
    expect(getByText(customErrorMessage)).to.exist;
  });

  it('should render custom error message component when provided as function', () => {
    const store = createMockStore({
      ...mockProfile,
      userFullName: {},
    });
    const customErrorMessage = ({ missingFields }) => (
      <div>Missing fields: {missingFields.join(', ')}</div>
    );
    const props = getData({
      ssn: null,
      config: {
        name: { show: true, required: true },
        ssn: { show: true, required: true },
      },
      errorMessage: customErrorMessage,
    });
    const { container, getByText } = render(
      <Provider store={store}>
        <PersonalInformation {...props} />
      </Provider>,
    );

    const alert = container.querySelector('va-alert[status="error"]');
    expect(alert).to.exist;
    expect(getByText(/Missing fields: name, ssn/)).to.exist;
  });

  it('should render default note', () => {
    const store = createMockStore();
    const props = getData();
    const { getByTestId } = render(
      <Provider store={store}>
        <PersonalInformation {...props} />
      </Provider>,
    );

    expect(getByTestId('default-note')).to.exist;
  });

  it('should render NavButtons', () => {
    const store = createMockStore();
    const props = getData();
    const { getByText } = render(
      <Provider store={store}>
        <PersonalInformation {...props} />
      </Provider>,
    );

    expect(getByText('Back')).to.exist;
    expect(getByText('Continue')).to.exist;
  });

  it('should handle data adapter for SSN path', () => {
    const store = createMockStore();
    const props = getData({
      ssn: '9876',
      dataAdapter: {
        ssnPath: 'veteran.ssnLastFour',
      },
    });
    props.data = {
      veteran: {
        ssnLastFour: '9876',
      },
    };
    const { container } = render(
      <Provider store={store}>
        <PersonalInformation {...props} />
      </Provider>,
    );

    expect(container.textContent).to.include('9 8 7 6');
  });

  it('should handle data adapter for VA file number path', () => {
    const store = createMockStore();
    const props = getData({
      vaFileLastFour: '4321',
      config: {
        vaFileNumber: {
          show: true,
          required: false,
        },
      },
      dataAdapter: {
        vaFileNumberPath: 'veteran.vaFileLastFour',
      },
    });
    props.data = {
      veteran: {
        vaFileLastFour: '4321',
      },
    };
    const { container } = render(
      <Provider store={store}>
        <PersonalInformation {...props} />
      </Provider>,
    );

    expect(container.textContent).to.include('4 3 2 1');
  });
});
