import React from 'react';
import { Provider } from 'react-redux';
import { render } from '@testing-library/react';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { expect } from 'chai';
import { Toggler } from 'platform/utilities/feature-toggles';
import formConfig from '../../config/form';
import ConfirmationPage, {
  getNextStepsActionsPlaceholders,
} from '../../containers/ConfirmationPage';

const veteranData = {
  benefitSelection: {
    compensation: true,
    pension: true,
  },
  veteranFullName: {
    first: 'Jack',
    middle: 'W',
    last: 'Veteran',
    suffix: 'Jr.',
  },
  preparerIdentification: 'VETERAN',
  statementOfTruthSignature: 'Jack W Veteran',
};

const survivorData = {
  relationshipToVeteran: {
    relationshipToVeteran: 'spouse',
  },
  veteranId: {
    ssn: '454544545',
  },
  benefitSelection: {
    survivor: true,
  },
  thirdPartyPreparerRole: 'alternate',
  thirdPartyPreparerFullName: {
    first: 'Alternate',
    last: 'Signer',
  },
  preparerIdentification: 'THIRD_PARTY_SURVIVING_DEPENDENT',
  veteranFullName: {
    first: 'Jack',
    middle: 'W',
    last: 'Veteran',
  },
  statementOfTruthSignature: 'Jack W Veteran',
};

const responseNew = {
  confirmationNumber: '123456',
  expirationDate: '2024-11-30T17:56:30.512Z',
};

const responseNewBenefitsClaims = {
  ...responseNew,
  submissionApi: 'intentToFile',
};

const responseNewBenefitsIntake = {
  ...responseNew,
  submissionApi: 'benefitsIntake',
};

const responseExisting = {
  confirmationNumber: '123456',
  expirationDate: '2024-11-30T17:56:30.512Z',
  compensationIntent: {
    creationDate: '2022-12-02T13:31:51-06:00',
    expirationDate: '2023-12-02T13:31:49-06:00',
    type: 'compensation',
    status: 'active',
  },
  pensionIntent: {
    creationDate: '2022-12-02T13:31:51-06:00',
    expirationDate: '2023-12-02T13:31:49-06:00',
    type: 'pension',
    status: 'active',
  },
  survivorIntent: {
    creationDate: '2022-12-02T13:31:51-06:00',
    expirationDate: '2023-12-02T13:31:49-06:00',
    type: 'survivor',
    status: 'active',
  },
};

const responseExistingBenefitsClaims = {
  ...responseExisting,
  submissionApi: 'intentToFile',
};

const responseExistingBenefitsIntake = {
  ...responseExisting,
  submissionApi: 'benefitsIntake',
};

function makeStore(
  response,
  data,
  confirmationPageFeatureToggleEnabled = false,
) {
  return {
    form: {
      formId: formConfig.formId,
      submission: {
        response,
        timestamp: Date.now(),
      },
      data,
    },
    featureToggles: {
      [Toggler.TOGGLE_NAMES
        .form210966ConfirmationPage]: confirmationPageFeatureToggleEnabled,
    },
  };
}

const STORE_VETERAN_FIRST_TIME = makeStore(responseNew, veteranData);
const STORE_SURVIVOR_FIRST_TIME = makeStore(responseNew, survivorData);
const STORE_VETERAN_EXISTING = makeStore(responseExisting, veteranData);
const STORE_SURVIVOR_EXISTING = makeStore(responseExisting, survivorData);
const STORE_VETERAN_FIRST_TIME_BENEFITS_CLAIMS = makeStore(
  responseNewBenefitsClaims,
  veteranData,
  true,
);
const STORE_VETERAN_FIRST_TIME_BENEFITS_INTAKE = makeStore(
  responseNewBenefitsIntake,
  veteranData,
  true,
);
const STORE_SURVIVOR_FIRST_TIME_BENEFITS_CLAIMS = makeStore(
  responseNewBenefitsClaims,
  survivorData,
  true,
);
const STORE_SURVIVOR_FIRST_TIME_BENEFITS_INTAKE = makeStore(
  responseNewBenefitsIntake,
  survivorData,
  true,
);
const STORE_VETERAN_EXISTING_BENEFITS_CLAIMS = makeStore(
  responseExistingBenefitsClaims,
  veteranData,
  true,
);
const STORE_SURVIVOR_EXISTING_BENEFITS_INTAKE = makeStore(
  responseExistingBenefitsIntake,
  survivorData,
  true,
);

describe('Confirmation page V2', () => {
  const middleware = [thunk];
  const mockStore = configureStore(middleware);

  it('it should show status success and the correct name of person for a veteran submitting for the first time (benefits claims)', () => {
    const { container, getByText } = render(
      <Provider store={mockStore(STORE_VETERAN_FIRST_TIME_BENEFITS_CLAIMS)}>
        <ConfirmationPage route={{ formConfig }} />
      </Provider>,
    );
    expect(container.querySelector('va-alert')).to.have.attr(
      'status',
      'success',
    );
    getByText(/Jack/);
    getByText(/Your form submission was successful on/);
    getByText(/You have until/);
    expect(
      container.querySelector(
        'va-link-action[text="Complete your pension claim"]',
      ),
    ).to.exist;
    expect(
      container.querySelector(
        'va-link-action[text="Complete your disability compensation claim"]',
      ),
    ).to.exist;
  });

  it('it should show status success and the correct name of person for a veteran submitting for the first time (benefits intake)', () => {
    const { container, getByText } = render(
      <Provider store={mockStore(STORE_VETERAN_FIRST_TIME_BENEFITS_INTAKE)}>
        <ConfirmationPage route={{ formConfig }} />
      </Provider>,
    );
    expect(container.querySelector('va-alert')).to.have.attr(
      'status',
      'success',
    );
    getByText(/Jack/);
    getByText(/Form submission started on/);
    getByText(/It can take up to 30 days/);
    getByText(/After we review your form/);
    expect(
      container.querySelector(
        'va-link-action[text="Complete your pension claim"]',
      ),
    ).to.exist;
    expect(
      container.querySelector(
        'va-link-action[text="Complete your disability compensation claim"]',
      ),
    ).to.exist;
  });

  it('it should show status success and the correct name of person for a survivor submitting for the first time (benefits claims)', () => {
    const { container, getByText } = render(
      <Provider store={mockStore(STORE_SURVIVOR_FIRST_TIME_BENEFITS_CLAIMS)}>
        <ConfirmationPage route={{ formConfig }} />
      </Provider>,
    );
    expect(container.querySelector('va-alert')).to.have.attr(
      'status',
      'success',
    );
    getByText(/Alternate/);
    getByText(/Your form submission was successful on/);
    getByText(/You have until/);
    expect(
      container.querySelector(
        'va-link-action[text="Complete your pension for survivors claim"]',
      ),
    ).to.exist;
  });

  it('it should show status success and the correct name of person for a survivor submitting for the first time (benefits intake)', () => {
    const { container, getByText } = render(
      <Provider store={mockStore(STORE_SURVIVOR_FIRST_TIME_BENEFITS_INTAKE)}>
        <ConfirmationPage route={{ formConfig }} />
      </Provider>,
    );
    expect(container.querySelector('va-alert')).to.have.attr(
      'status',
      'success',
    );
    getByText(/Alternate/);
    getByText(/Form submission started on/);
    getByText(/It can take up to 30 days/);
    getByText(/After we review your form/);
    expect(
      container.querySelector(
        'va-link-action[text="Complete your pension for survivors claim"]',
      ),
    ).to.exist;
  });

  it('it should show status success and the correct name of person for a veteran submitting for the second time (benefits claims)', () => {
    const { container, getByText } = render(
      <Provider store={mockStore(STORE_VETERAN_EXISTING_BENEFITS_CLAIMS)}>
        <ConfirmationPage route={{ formConfig }} />
      </Provider>,
    );
    expect(container.querySelector('va-alert')).to.have.attr(
      'status',
      'success',
    );
    getByText(/Jack/);
    getByText(/Your form submission was successful on/);
    getByText(/You have until/);
    expect(
      container.querySelector(
        'va-link-action[text="Complete your pension claim"]',
      ),
    ).to.exist;
    expect(
      container.querySelector(
        'va-link-action[text="Complete your disability compensation claim"]',
      ),
    ).to.exist;
  });

  it('it should show status success and the correct name of person for a survivor submitting for the second time (benefits intake)', () => {
    const { container, getByText } = render(
      <Provider store={mockStore(STORE_SURVIVOR_EXISTING_BENEFITS_INTAKE)}>
        <ConfirmationPage route={{ formConfig }} />
      </Provider>,
    );
    expect(container.querySelector('va-alert')).to.have.attr(
      'status',
      'success',
    );
    getByText(/Alternate/);
    getByText(/Form submission started on/);
    getByText(/It can take up to 30 days/);
    getByText(/After we review your form/);
    expect(
      container.querySelector(
        'va-link-action[text="Complete your pension for survivors claim"]',
      ),
    ).to.exist;
  });

  it('should return correct getNextStepsActionsPlaceholders for a veteran with new benefits', () => {
    const formData = {
      benefitSelection: {
        compensation: true,
        pension: true,
      },
    };
    const placeholders = getNextStepsActionsPlaceholders(formData);
    expect(placeholders.actionsNew).to.deep.equal(['compensation', 'pension']);
    expect(placeholders.actionsExisting).to.deep.equal([]);
  });

  it('should return correct getNextStepsActionsPlaceholders for a veteran with mixed benefits', () => {
    const formData = {
      benefitSelection: {
        pension: true,
      },
      'view:activeCompensationITF': responseExisting.compensationIntent,
    };
    const placeholders = getNextStepsActionsPlaceholders(formData);
    expect(placeholders.actionsNew).to.deep.equal(['pension']);
    expect(placeholders.actionsExisting).to.deep.equal(['compensation']);
  });

  it('should return correct getNextStepsActionsPlaceholders for a veteran with existing benefits', () => {
    const formData = {
      benefitSelection: {},
      'view:activePensionITF': responseExisting.pensionIntent,
      'view:activeCompensationITF': responseExisting.compensationIntent,
    };
    const placeholders = getNextStepsActionsPlaceholders(formData);
    expect(placeholders.actionsNew).to.deep.equal([]);
    expect(placeholders.actionsExisting).to.deep.equal([
      'compensation',
      'pension',
    ]);
  });

  it('should return correct getNextStepsActionsPlaceholders for a survivor', () => {
    const formData = {
      benefitSelection: {
        survivor: true,
      },
      'view:activePensionITF': responseExisting.pensionIntent,
      'view:activeCompensationITF': responseExisting.compensationIntent,
    };
    const placeholders = getNextStepsActionsPlaceholders(formData);
    expect(placeholders.actionsNew).to.deep.equal(['survivor']);
    expect(placeholders.actionsExisting).to.deep.equal([
      'compensation',
      'pension',
    ]);
  });
});

describe('Confirmation page V1', () => {
  const middleware = [thunk];
  const mockStore = configureStore(middleware);

  it('it should show status success and the correct name of person for a veteran submitting for the first time', () => {
    const { container, getByText } = render(
      <Provider store={mockStore(STORE_VETERAN_FIRST_TIME)}>
        <ConfirmationPage />
      </Provider>,
    );
    expect(container.querySelector('va-alert')).to.have.attr(
      'status',
      'success',
    );
    getByText(/Jack W Veteran/);
    container.querySelector(
      'va-link-action[text="Complete your pension claim"]',
    );
    container.querySelector(
      'va-link-action[text="Complete your disability compensation claim"]',
    );
  });

  it('it should show status success and the correct name of person for a survivor submitting for the first time', () => {
    const { container, getByText } = render(
      <Provider store={mockStore(STORE_SURVIVOR_FIRST_TIME)}>
        <ConfirmationPage />
      </Provider>,
    );
    expect(container.querySelector('va-alert')).to.have.attr(
      'status',
      'success',
    );
    getByText(/Jack W Veteran/);
    container.querySelector(
      'va-link-action[text="Complete your pension for survivors claim"]',
    );
  });

  it('it should show status success and the correct name of person for a veteran submitting for a second time', () => {
    const { container, getByText } = render(
      <Provider store={mockStore(STORE_VETERAN_EXISTING)}>
        <ConfirmationPage />
      </Provider>,
    );
    expect(container.querySelector('va-alert')).to.have.attr(
      'status',
      'success',
    );
    getByText(/Jack W Veteran/);
    container.querySelector(
      'va-link-action[text="Complete your pension claim"]',
    );
    container.querySelector(
      'va-link-action[text="Complete your disability compensation claim"]',
    );
  });

  it('it should show status success and the correct name of person for a survivor submitting for a second time', () => {
    const { container, getByText } = render(
      <Provider store={mockStore(STORE_SURVIVOR_EXISTING)}>
        <ConfirmationPage />
      </Provider>,
    );
    expect(container.querySelector('va-alert')).to.have.attr(
      'status',
      'success',
    );
    getByText(/Jack W Veteran/);
    container.querySelector(
      'va-link-action[text="Complete your pension for survivors claim"]',
    );
  });

  // confirmation v1 tests end
});
