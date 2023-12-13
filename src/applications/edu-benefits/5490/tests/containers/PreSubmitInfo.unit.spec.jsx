import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';

import { Provider } from 'react-redux';
import { combineReducers, createStore } from 'redux';
import { commonReducer } from 'platform/startup/store';
import PreSubmitInfo from '../../containers/PreSubmitInfo';

const fakeStore = createStore(
  combineReducers({
    ...commonReducer,
  }),
);

describe('<PreSubmitInfo>', () => {
  it('should render', () => {
    const tree = render(
      <Provider store={fakeStore}>
        <PreSubmitInfo
          formData={{}}
          showError={() => {}}
          onSectionComplete={() => {}}
          setPreSubmit={() => {}}
        />
      </Provider>,
    );

    const privacyCheckbox = tree.container.querySelector(
      'va-privacy-agreement',
    );

    expect(tree).to.not.be.undefined;
    expect(privacyCheckbox).does.exist;
  });
  it('should render activeDutyNote', () => {
    const data = {
      relativeDateOfBirth: '1970-01-01',
      'view:applicantServed': false,
    };
    // "relativeDateOfBirth": "1970-01-01",
    const tree = render(
      <Provider store={fakeStore}>
        <PreSubmitInfo
          formData={data}
          showError={() => {}}
          onSectionComplete={() => {}}
          setPreSubmit={() => {}}
        />
      </Provider>,
    );

    const privacyCheckbox = tree.container.querySelector(
      'va-privacy-agreement',
    );

    expect(tree).to.not.be.undefined;
    expect(privacyCheckbox).does.exist;
  });
  it('should render activeDutyNote for (hasServed && allServicePeriodsHaveEndDate)', () => {
    const data = {
      relativeDateOfBirth: '1970-01-01',
      'view:applicantServed': true,
      toursOfDuty: [
        {
          serviceBranch: 'Army',
          dateRange: {
            from: '2001-01-01',
            to: '2003-03-02',
          },
          serviceStatus: 'Honorable',
        },
        {
          serviceBranch: 'Navy',
          dateRange: {
            from: '2005-03-02',
            to: '2006-01-02',
          },
          serviceStatus: 'Great',
        },
      ],
    };
    const tree = render(
      <Provider store={fakeStore}>
        <PreSubmitInfo
          formData={data}
          showError={() => {}}
          onSectionComplete={() => {}}
          setPreSubmit={() => {}}
        />
      </Provider>,
    );

    const privacyCheckbox = tree.container.querySelector(
      'va-privacy-agreement',
    );

    expect(tree).to.not.be.undefined;
    expect(privacyCheckbox).does.exist;
  });
  it('should render not over eighteen (!hasServed  )', () => {
    const lastYear = new Date().getFullYear() - 1;
    const data = {
      relativeDateOfBirth: `${lastYear}-01-01`,
      'view:applicantServed': false,
      toursOfDuty: [
        {
          serviceBranch: 'Army',
          dateRange: {
            from: '2001-01-01',
            to: '2003-03-02',
          },
          serviceStatus: 'Honorable',
        },
        {
          serviceBranch: 'Navy',
          dateRange: {
            from: '2005-03-02',
            to: '2006-01-02',
          },
          serviceStatus: 'Great',
        },
      ],
    };
    const tree = render(
      <Provider store={fakeStore}>
        <PreSubmitInfo
          formData={data}
          showError={() => {}}
          onSectionComplete={() => {}}
          setPreSubmit={() => {}}
        />
      </Provider>,
    );

    const privacyCheckbox = tree.container.querySelector(
      'va-privacy-agreement',
    );

    expect(tree).to.not.be.undefined;
    expect(privacyCheckbox).does.exist;
  });
  it('should render not over eighteen (hasServed && allServicePeriodsHaveEndDate)', () => {
    const lastYear = new Date().getFullYear() - 1;
    const data = {
      relativeDateOfBirth: `${lastYear}-01-01`,
      'view:applicantServed': true,
      toursOfDuty: [
        {
          serviceBranch: 'Army',
          dateRange: {
            from: '2001-01-01',
            to: '2003-03-02',
          },
          serviceStatus: 'Honorable',
        },
        {
          serviceBranch: 'Navy',
          dateRange: {
            from: '2005-03-02',
            to: '2006-01-02',
          },
          serviceStatus: 'Great',
        },
      ],
    };
    const tree = render(
      <Provider store={fakeStore}>
        <PreSubmitInfo
          formData={data}
          showError={() => {}}
          onSectionComplete={() => {}}
          setPreSubmit={() => {}}
        />
      </Provider>,
    );

    const privacyCheckbox = tree.container.querySelector(
      'va-privacy-agreement',
    );

    expect(tree).to.not.be.undefined;
    expect(privacyCheckbox).does.exist;
  });
  it('should render not over eighteen !eighteenOrOver(formData.relativeDateOfBirth) && hasServed && !allServicePeriodsHaveEndDate', () => {
    const lastYear = new Date().getFullYear() - 1;
    const data = {
      relativeDateOfBirth: `${lastYear}-01-01`,
      'view:applicantServed': true,
    };
    const tree = render(
      <Provider store={fakeStore}>
        <PreSubmitInfo
          formData={data}
          showError={() => {}}
          onSectionComplete={() => {}}
          setPreSubmit={() => {}}
        />
      </Provider>,
    );

    const privacyCheckbox = tree.container.querySelector(
      'va-privacy-agreement',
    );

    expect(tree).to.not.be.undefined;
    expect(privacyCheckbox).does.exist;
  });
});
