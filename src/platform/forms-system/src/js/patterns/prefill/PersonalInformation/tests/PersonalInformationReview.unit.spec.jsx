import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { $$ } from 'platform/forms-system/src/js/utilities/ui';
import {
  PersonalInformationReview,
  defaultConfig,
} from '../PersonalInformationReview';

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

const getData = ({
  ssn = '1234',
  vaFileLastFour = '5678',
  config = {},
  dataAdapter = {},
  title = 'Personal information',
} = {}) => ({
  data: {
    ssn,
    vaFileNumber: vaFileLastFour,
  },
  config: { ...defaultConfig, ...config },
  dataAdapter,
  title,
});

describe('<PersonalInformationReview>', () => {
  it('should render all review page personal information data', () => {
    const store = createMockStore();
    const props = getData();
    const { container, getByText } = render(
      <Provider store={store}>
        <PersonalInformationReview {...props} />
      </Provider>,
    );

    expect(getByText('Personal information')).to.exist;
    expect(getByText('Name')).to.exist;
    expect(container.textContent).to.include('John Michael Doe, Jr.');
    expect(getByText('Last 4 digits of Social Security number')).to.exist;
    expect(container.textContent).to.include('1 2 3 4');
    expect(getByText('Date of birth')).to.exist;
    expect(container.textContent).to.include('January 15, 1980');
  });

  it('should render with custom title', () => {
    const store = createMockStore();
    const customTitle = 'Veteran information';
    const props = getData({ title: customTitle });
    const { getByText } = render(
      <Provider store={store}>
        <PersonalInformationReview {...props} />
      </Provider>,
    );

    expect(getByText(customTitle)).to.exist;
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
        <PersonalInformationReview {...props} />
      </Provider>,
    );

    expect(getByText('Last 4 digits of VA file number')).to.exist;
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
        <PersonalInformationReview {...props} />
      </Provider>,
    );

    expect(getByText('Sex')).to.exist;
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
        <PersonalInformationReview {...props} />
      </Provider>,
    );

    expect(getByTestId('name-not-available')).to.exist;
  });

  it('should show "Not available" for missing SSN', () => {
    const store = createMockStore();
    const props = getData({ ssn: null });
    const { getByTestId } = render(
      <Provider store={store}>
        <PersonalInformationReview {...props} />
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
        <PersonalInformationReview {...props} />
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
        <PersonalInformationReview {...props} />
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
        <PersonalInformationReview {...props} />
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
        <PersonalInformationReview {...props} />
      </Provider>,
    );

    expect(container.textContent).to.not.include('Name');
    expect(container.textContent).to.not.include('Social Security number');
    expect(container.textContent).to.not.include('Date of birth');
  });

  it('should render name without suffix', () => {
    const store = createMockStore({
      ...mockProfile,
      userFullName: {
        first: 'Jane',
        middle: 'Ann',
        last: 'Smith',
        suffix: null,
      },
    });
    const props = getData();
    const { container } = render(
      <Provider store={store}>
        <PersonalInformationReview {...props} />
      </Provider>,
    );

    expect(container.textContent).to.include('Jane Ann Smith');
    // Check that suffix comma is not in the name section (still might appear elsewhere)
    const nameSection = container.querySelector('.review-row dd');
    expect(nameSection.textContent).to.not.match(/,\s*$/);
  });

  it('should render name without middle name', () => {
    const store = createMockStore({
      ...mockProfile,
      userFullName: {
        first: 'Jane',
        middle: null,
        last: 'Smith',
        suffix: null,
      },
    });
    const props = getData();
    const { container } = render(
      <Provider store={store}>
        <PersonalInformationReview {...props} />
      </Provider>,
    );

    expect(container.textContent).to.include('Jane');
    expect(container.textContent).to.include('Smith');
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
        <PersonalInformationReview {...props} />
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
        <PersonalInformationReview {...props} />
      </Provider>,
    );

    expect(container.textContent).to.include('4 3 2 1');
  });

  it('should have proper data-dd-action-name attributes for privacy', () => {
    const store = createMockStore();
    const props = getData({
      config: {
        vaFileNumber: { show: true },
        sex: { show: true },
      },
    });
    const { container } = render(
      <Provider store={store}>
        <PersonalInformationReview {...props} />
      </Provider>,
    );

    expect(
      $$('dd.dd-privacy-hidden[data-dd-action-name]', container).length,
    ).to.eq(4);
  });
});
