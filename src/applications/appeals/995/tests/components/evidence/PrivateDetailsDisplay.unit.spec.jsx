import React from 'react';
import { expect } from 'chai';
import { render, fireEvent } from '@testing-library/react';
import sinon from 'sinon';
import { $, $$ } from 'platform/forms-system/src/js/utilities/ui';
import {
  AUTHORIZATION_LABEL,
  EVIDENCE_PRIVATE_AUTHORIZATION_URL,
  LIMITED_CONSENT_DETAILS_URL,
  LIMITED_CONSENT_PROMPT_URL,
} from '../../../constants';
import { content } from '../../../content/evidence/summary';
import { promptQuestion } from '../../../pages/limitedConsentPrompt';
import { detailsQuestion } from '../../../pages/limitedConsentDetails';
import { PrivateDetailsDisplay } from '../../../components/evidence/PrivateDetailsDisplay';
import { records } from '../../data/evidence-records';
import { content as authContent } from '../../../components/4142/Authorization';
import {
  verifyHeader,
  verifyLink,
  verifyProviderPrivate,
  verifyResponse,
} from '../../unit-test-helpers';

const limitedConsentDetails = 'Testing limited consent content';

const verifyEvidenceHeader = container => {
  expect($('.private-title', container).textContent).to.contain(
    content.privateTitle,
  );
};

const verifyAuthorization = (headers, listItems, reviewMode = false) => {
  verifyHeader(headers, 0, authContent.title);
  verifyResponse(listItems, 0, AUTHORIZATION_LABEL);

  if (!reviewMode) {
    verifyLink(
      '#edit-private-authorization',
      `/${EVIDENCE_PRIVATE_AUTHORIZATION_URL}`,
    );
  }
};

const verifyLimitedConsentPrompt = (headers, listItems, reviewMode = false) => {
  verifyHeader(headers, 1, promptQuestion);
  verifyResponse(listItems, 1, 'Yes');

  if (!reviewMode) {
    verifyLink('#edit-limitation-y-n', `/${LIMITED_CONSENT_PROMPT_URL}`);
  }
};

const verifyLimitedConsentDetails = (
  headers,
  listItems,
  reviewMode = false,
) => {
  verifyHeader(headers, 2, detailsQuestion);
  verifyResponse(listItems, 2, limitedConsentDetails);

  if (!reviewMode) {
    verifyLink('#edit-limitation', `/${LIMITED_CONSENT_DETAILS_URL}`);
  }
};

describe('PrivateDetailsDisplay', () => {
  describe('when no private evidence is provided', () => {
    it('should render nothing', () => {
      const { container } = render(<PrivateDetailsDisplay list={[]} />);

      expect(container.innerHTML).to.be.empty;
    });
  });

  describe('when on the evidence review page', () => {
    it('should render the proper content', () => {
      const { container } = render(
        <PrivateDetailsDisplay
          list={records().providerFacility}
          limitedConsent={limitedConsentDetails}
          isOnReviewPage={undefined}
          reviewMode={false}
          handlers={{ showModal: () => {} }}
          privacyAgreementAccepted
          testing={false}
          showListOnly={false}
          limitedConsentResponse
        />,
      );

      verifyEvidenceHeader();

      const listItems = $$('li', container);
      const headers = $$('h5', container);

      verifyAuthorization(headers, listItems);
      verifyLimitedConsentPrompt(headers, listItems);
      verifyLimitedConsentDetails(headers, listItems);

      verifyProviderPrivate(
        headers,
        listItems,
        {
          providerName: 'Provider One',
          issues: 'Hypertension, Right Knee Injury, and Migraines',
          dates: 'May 6, 2015 – May 8, 2015',
        },
        3,
        0,
        false,
      );

      verifyProviderPrivate(
        headers,
        listItems,
        {
          providerName: 'Provider Two',
          issues: 'Right Knee Injury and Migraines',
          dates: 'Dec 13, 2010 – Dec 15, 2010',
        },
        4,
        1,
        false,
      );

      verifyProviderPrivate(
        headers,
        listItems,
        {
          providerName: 'Provider Three',
          issues: 'Hypertension and Right Knee Injury',
          dates: 'Mar 13, 2018 – May 26, 2020',
        },
        5,
        2,
        false,
      );
    });
  });

  describe('when on the app review page', () => {
    it('should render the proper content', () => {
      const { container } = render(
        <PrivateDetailsDisplay
          list={records().providerFacility}
          limitedConsent={limitedConsentDetails}
          isOnReviewPage
          reviewMode
          handlers={{ showModal: () => {} }}
          privacyAgreementAccepted
          testing={false}
          showListOnly={false}
          limitedConsentResponse
        />,
      );

      verifyEvidenceHeader();

      const listItems = $$('li', container);
      const headers = $$('h6', container);

      verifyAuthorization(headers, listItems, true);
      verifyLimitedConsentPrompt(headers, listItems, true);
      verifyLimitedConsentDetails(headers, listItems, true);

      verifyProviderPrivate(
        headers,
        listItems,
        {
          providerName: 'Provider One',
          issues: 'Hypertension, Right Knee Injury, and Migraines',
          dates: 'May 6, 2015 – May 8, 2015',
        },
        3,
        0,
        true,
      );

      verifyProviderPrivate(
        headers,
        listItems,
        {
          providerName: 'Provider Two',
          issues: 'Right Knee Injury and Migraines',
          dates: 'Dec 13, 2010 – Dec 15, 2010',
        },
        4,
        1,
        true,
      );

      verifyProviderPrivate(
        headers,
        listItems,
        {
          providerName: 'Provider Three',
          issues: 'Hypertension and Right Knee Injury',
          dates: 'Mar 13, 2018 – May 26, 2020',
        },
        5,
        2,
        true,
      );
    });
  });

  describe('when on the confirmation page', () => {
    it('should render the proper content', () => {
      const { container } = render(
        <PrivateDetailsDisplay
          list={records().providerFacility}
          limitedConsent={limitedConsentDetails}
          isOnReviewPage={false}
          reviewMode
          handlers={{ showModal: () => {} }}
          privacyAgreementAccepted
          testing={false}
          showListOnly
          limitedConsentResponse
        />,
      );

      verifyEvidenceHeader();

      const listItems = $$('li', container);
      const headers = $$('h5', container);

      verifyAuthorization(headers, listItems, true);
      verifyLimitedConsentPrompt(headers, listItems, true);
      verifyLimitedConsentDetails(headers, listItems, true);

      verifyProviderPrivate(
        headers,
        listItems,
        {
          providerName: 'Provider One',
          issues: 'Hypertension, Right Knee Injury, and Migraines',
          dates: 'May 6, 2015 – May 8, 2015',
          address: [
            '123 Main Street',
            'Street address 2',
            'San Antonio, TX 78258',
          ],
        },
        3,
        0,
        true,
      );

      verifyProviderPrivate(
        headers,
        listItems,
        {
          providerName: 'Provider Two',
          issues: 'Right Knee Injury and Migraines',
          dates: 'Dec 13, 2010 – Dec 15, 2010',
          address: ['456 Elm Street', 'Tallahassee, FL 87582'],
        },
        4,
        1,
        true,
      );

      verifyProviderPrivate(
        headers,
        listItems,
        {
          providerName: 'Provider Three',
          issues: 'Hypertension and Right Knee Injury',
          dates: 'Mar 13, 2018 – May 26, 2020',
          address: ['987 Oak Street', 'Madison, AL 18375'],
        },
        5,
        2,
        true,
      );
    });
  });

  describe('when parts of the data are missing', () => {
    const fullData = {
      providerFacilityName: 'Provider Three',
      providerFacilityAddress: {
        country: 'USA',
        street: '987 Oak Street',
        street2: '',
        city: 'Madison',
        state: 'AL',
        postalCode: '18375',
      },
      issues: ['Hypertension', 'Right Knee Injury'],
      treatmentDateRange: {
        from: '2018-03-13',
        to: '2020-05-26',
      },
    };

    const getContainer = partialData => {
      return render(
        <PrivateDetailsDisplay
          list={[partialData]}
          limitedConsent={limitedConsentDetails}
          isOnReviewPage={false}
          reviewMode
          handlers={{ showModal: () => {} }}
          privacyAgreementAccepted
          testing={false}
          showListOnly
          limitedConsentResponse
        />,
      );
    };

    describe('when the provider name is missing', () => {
      it('should render the proper errors', () => {
        const partialData = { ...fullData, providerFacilityName: '' };
        getContainer(partialData);

        const error = $$('.usa-input-error-message')[0];
        expect(error.textContent).to.contain('Missing provider name');
      });
    });

    describe('when the issues are missing', () => {
      it('should render the proper errors', () => {
        const partialData = { ...fullData, issues: [] };
        getContainer(partialData);

        const error = $$('.usa-input-error-message')[0];
        expect(error.textContent).to.contain('Missing condition');
      });
    });

    describe('when part of the address is missing', () => {
      it('should render the proper errors', () => {
        const partialData = {
          ...fullData,
          providerFacilityAddress: {
            ...fullData.providerFacilityAddress,
            city: '',
          },
        };

        getContainer(partialData);

        const error = $$('.usa-input-error-message')[0];
        expect(error.textContent).to.contain('Incomplete address');
      });
    });

    describe('when the fromDate is missing', () => {
      it('should render the proper errors', () => {
        const partialData = {
          ...fullData,
          treatmentDateRange: {
            ...fullData.treatmentDateRange,
            from: undefined,
          },
        };

        getContainer(partialData);

        const error = $$('.usa-input-error-message')[0];
        expect(error.textContent).to.contain('Missing start date');
      });
    });

    describe('when the toDate is missing', () => {
      it('should render the proper errors', () => {
        const partialData = {
          ...fullData,
          treatmentDateRange: {
            ...fullData.treatmentDateRange,
            to: '',
          },
        };

        getContainer(partialData);

        const error = $$('.usa-input-error-message')[0];
        expect(error.textContent).to.contain('Missing end date');
      });
    });

    describe('when both dates are missing', () => {
      it('should render the proper errors', () => {
        const partialData = {
          ...fullData,
          treatmentDateRange: {
            ...fullData.treatmentDateRange,
            from: '',
            to: '',
          },
        };

        getContainer(partialData);

        const error = $$('.usa-input-error-message')[0];
        expect(error.textContent).to.contain('Missing treatment dates');
      });
    });
  });

  it('should execute callback when removing an entry', () => {
    const removeSpy = sinon.spy();
    const handlers = { showModal: removeSpy };

    const { container } = render(
      <PrivateDetailsDisplay
        list={records().providerFacility}
        handlers={handlers}
        testing
      />,
    );

    const buttons = $$('.remove-item', container);
    fireEvent.click(buttons[0]);
    expect(removeSpy.calledOnce).to.be.true;
    expect(removeSpy.args[0][0].target.getAttribute('data-index')).to.eq('0');
    expect(removeSpy.args[0][0].target.getAttribute('data-type')).to.eq(
      'private',
    );
    fireEvent.click(buttons[1]);
    expect(removeSpy.calledTwice).to.be.true;
    expect(removeSpy.args[1][0].target.getAttribute('data-index')).to.eq('1');
    expect(removeSpy.args[1][0].target.getAttribute('data-type')).to.eq(
      'private',
    );
  });
});
