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
import { PrivateDetailsDisplayNew } from '../../../components/evidence/PrivateDetailsDisplayNew';
import { privateEvidence } from '../../data/array-builder-evidence';
import { content as authContent } from '../../../components/4142/Authorization';
import {
  verifyHeader,
  verifyLink,
  verifyProviderPrivate,
  verifyResponse,
} from '../../unit-test-helpers';

const lcDetails = 'Testing limited consent';

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
  verifyResponse(listItems, 2, lcDetails);

  if (!reviewMode) {
    verifyLink('#edit-limitation', `/${LIMITED_CONSENT_DETAILS_URL}`);
  }
};

describe('PrivateDetailsDisplayNew', () => {
  describe('when no private evidence is provided', () => {
    it('should render nothing', () => {
      const { container } = render(<PrivateDetailsDisplayNew list={[]} />);

      expect(container.innerHTML).to.be.empty;
    });
  });

  describe('when on the app review page', () => {
    const evidenceWithAuthAndLc = {
      privateEvidence,
      auth4142: true,
      lcDetails,
      lcPrompt: 'Y',
    };

    it('should render the proper content', () => {
      const { container } = render(
        <PrivateDetailsDisplayNew
          data={evidenceWithAuthAndLc}
          isOnReviewPage
          reviewMode
          handlers={{ showModal: () => {} }}
          testing={false}
          showListOnly={false}
        />,
      );

      verifyEvidenceHeader();

      const listItems = $$('li', container);
      const headers = $$('h6', container);

      verifyAuthorization(headers, listItems, true);
      verifyLimitedConsentPrompt(headers, listItems, true);
      verifyLimitedConsentDetails(headers, listItems, true);

      const firstProvider = privateEvidence[0];
      const secondProvider = privateEvidence[1];
      const thirdProvider = privateEvidence[2];

      verifyProviderPrivate(
        headers,
        listItems,
        {
          providerName: firstProvider.privateTreatmentLocation,
          issues: 'Hypertension and Impotence',
          dates: `Oct. 10, 2019 – Oct. 11, 2019`,
        },
        3,
        0,
        true,
      );

      verifyProviderPrivate(
        headers,
        listItems,
        {
          providerName: secondProvider.privateTreatmentLocation,
          issues: 'Hypertension and Impotence',
          dates: `May 5, 2025 – May 6, 2025`,
        },
        4,
        1,
        true,
      );

      verifyProviderPrivate(
        headers,
        listItems,
        {
          providerName: thirdProvider.privateTreatmentLocation,
          issues: 'Hypertension; and Tendonitis, left ankle',
          dates: 'Aug. 1, 1997 – May 6, 2025',
        },
        5,
        2,
        true,
      );
    });
  });

  describe('when on the confirmation page', () => {
    const evidenceWithAuthAndLc = {
      privateEvidence,
      auth4142: true,
      lcDetails,
      lcPrompt: 'Y',
    };

    it('should render the proper content', () => {
      const { container } = render(
        <PrivateDetailsDisplayNew
          data={evidenceWithAuthAndLc}
          isOnReviewPage={false}
          reviewMode
          handlers={{ showModal: () => {} }}
          testing={false}
          showListOnly
        />,
      );

      verifyEvidenceHeader();

      const listItems = $$('li', container);
      const headers = $$('h5', container);

      verifyAuthorization(headers, listItems, true);
      verifyLimitedConsentPrompt(headers, listItems, true);
      verifyLimitedConsentDetails(headers, listItems, true);

      const firstProvider = privateEvidence[0];
      const secondProvider = privateEvidence[1];
      const thirdProvider = privateEvidence[2];

      verifyProviderPrivate(
        headers,
        listItems,
        {
          providerName: firstProvider.privateTreatmentLocation,
          issues: 'Hypertension and Impotence',
          dates: `Oct. 10, 2019 – Oct. 11, 2019`,
        },
        3,
        0,
        true,
      );

      verifyProviderPrivate(
        headers,
        listItems,
        {
          providerName: secondProvider.privateTreatmentLocation,
          issues: 'Hypertension and Impotence',
          dates: `May 5, 2025 – May 6, 2025`,
        },
        4,
        1,
        true,
      );

      verifyProviderPrivate(
        headers,
        listItems,
        {
          providerName: thirdProvider.privateTreatmentLocation,
          issues: 'Hypertension; and Tendonitis, left ankle',
          dates: 'Aug. 1, 1997 – May 6, 2025',
        },
        5,
        2,
        true,
      );
    });
  });

  describe('when parts of the data are missing', () => {
    const fullData = privateEvidence[0];

    const getContainer = dataToReplace => {
      const evidenceWithAuthAndLc = {
        privateEvidence: [
          {
            ...fullData,
            ...dataToReplace,
          },
        ],
        auth4142: true,
        lcDetails,
        lcPrompt: 'Y',
      };

      return render(
        <PrivateDetailsDisplayNew
          data={evidenceWithAuthAndLc}
          isOnReviewPage={false}
          reviewMode
          handlers={{ showModal: () => {} }}
          testing={false}
          showListOnly
        />,
      );
    };

    describe('when the provider name is missing', () => {
      it('should render the proper errors', () => {
        getContainer({ privateTreatmentLocation: '' });

        const error = $$('.usa-input-error-message')[0];
        expect(error.textContent).to.contain('Missing provider name');
      });
    });

    describe('when the issues are missing', () => {
      it('should render the proper errors', () => {
        getContainer({ issues: {} });

        const error = $$('.usa-input-error-message')[0];
        expect(error.textContent).to.contain('Missing condition');
      });
    });

    describe('when part of the address is missing', () => {
      it('should render the proper errors', () => {
        getContainer({ address: { city: '' } });

        const error = $$('.usa-input-error-message')[0];
        expect(error.textContent).to.contain('Incomplete address');
      });
    });

    describe('when the fromDate is missing', () => {
      it('should render the proper errors', () => {
        getContainer({ treatmentStart: '' });

        const error = $$('.usa-input-error-message')[0];
        expect(error.textContent).to.contain('Missing start date');
      });
    });

    describe('when the toDate is missing', () => {
      it('should render the proper errors', () => {
        getContainer({ treatmentEnd: '' });

        const error = $$('.usa-input-error-message')[0];
        expect(error.textContent).to.contain('Missing end date');
      });
    });

    describe('when both dates are missing', () => {
      it('should render the proper errors', () => {
        getContainer({ treatmentStart: '', treatmentEnd: '' });

        const error = $$('.usa-input-error-message')[0];
        expect(error.textContent).to.contain('Missing treatment dates');
      });
    });
  });

  it('should execute callback when removing an entry', () => {
    const removeSpy = sinon.spy();
    const handlers = { showModal: removeSpy };
    const evidenceWithAuthAndLc = {
      privateEvidence,
      auth4142: true,
      lcDetails,
      lcPrompt: 'Y',
    };

    const { container } = render(
      <PrivateDetailsDisplayNew
        data={evidenceWithAuthAndLc}
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
