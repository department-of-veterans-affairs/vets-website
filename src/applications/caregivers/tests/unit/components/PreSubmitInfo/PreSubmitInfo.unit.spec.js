import React from 'react';
import { Provider } from 'react-redux';
import { render } from '@testing-library/react';
import { expect } from 'chai';

import PreSubmitInfo from '../../../../components/PreSubmitInfo';

describe('CG <PreSubmitCheckboxGroup>', () => {
  const getData = ({ signAsRepresentativeYesNo } = {}) => ({
    props: {
      onSectionComplete: () => {},
      formData: {
        primaryFullName: {
          first: 'Mary',
          middle: '',
          last: 'Smith',
        },
        veteranFullName: {
          first: 'John',
          middle: '',
          last: 'Smith',
        },
        signAsRepresentativeYesNo,
        'view:hasPrimaryCaregiver': true,
        'view:hasSecondaryCaregiverOne': false,
        'view:hasSecondaryCaregiverTwo': false,
      },
      showError: false,
    },
    mockStore: {
      getState: () => ({
        form: {
          submission: {
            status: false,
          },
        },
      }),
      subscribe: () => {},
      dispatch: () => {},
    },
  });

  it('should render PreSubmitInfo to sign as veteran with primary caregiver', () => {
    const { mockStore, props } = getData({
      signAsRepresentativeYesNo: 'no',
    });

    const view = render(
      <Provider store={mockStore}>
        <PreSubmitInfo.CustomComponent {...props} />
      </Provider>,
    );

    expect(
      view.container.querySelectorAll('va-text-input')[0],
    ).to.have.attribute('label', 'Veteran’s full name');
    expect(
      view.container.querySelectorAll('va-text-input')[1],
    ).to.have.attribute(
      'label',
      'Primary Family Caregiver applicant’s full name',
    );
  });

  it('should render PreSubmitInfo to sign as representative with primary caregiver', () => {
    const { mockStore, props } = getData({
      signAsRepresentativeYesNo: 'yes',
    });

    const view = render(
      <Provider store={mockStore}>
        <PreSubmitInfo.CustomComponent {...props} />
      </Provider>,
    );

    expect(
      view.container.querySelectorAll('va-text-input')[0],
    ).to.have.attribute(
      'label',
      'Enter your name to sign as the Veteran’s representative',
    );
    expect(
      view.container.querySelectorAll('va-text-input')[1],
    ).to.have.attribute(
      'label',
      'Primary Family Caregiver applicant’s full name',
    );
  });
});
