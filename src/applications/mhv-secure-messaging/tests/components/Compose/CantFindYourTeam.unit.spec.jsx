import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { waitFor } from '@testing-library/dom';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import CantFindYourTeam from '../../../components/ComposeForm/CantFindYourTeam';
import { teamNotListedReasons } from '../../../util/constants';
import reducer from '../../../reducers';

describe('CantFindYourTeam component', () => {
  const defaultState = {
    sm: {
      recipients: {
        activeFacility: null,
      },
    },
  };

  let useFeatureTogglesStub;

  afterEach(() => {
    if (useFeatureTogglesStub) {
      useFeatureTogglesStub.restore();
    }
  });

  describe('when mhvSecureMessagingCuratedListFlow is false', () => {
    it('renders the legacy version with correct trigger text', async () => {
      useFeatureTogglesStub = sinon
        .stub(require('../../../hooks/useFeatureToggles'), 'default')
        .returns({
          mhvSecureMessagingCuratedListFlow: false,
        });

      const { container } = renderWithStoreAndRouter(<CantFindYourTeam />, {
        initialState: defaultState,
        reducers: reducer,
      });

      expect(container.querySelector('va-additional-info')).to.exist;
      await waitFor(() => {
        const additionalInfo = container.querySelector('va-additional-info');
        expect(additionalInfo).to.exist;
        expect(additionalInfo.getAttribute('trigger')).to.equal(
          "If you can't find your team",
        );
      });
      const additionalInfo = container.querySelector('va-additional-info');
      expect(additionalInfo.getAttribute('data-dd-action-name')).to.equal(
        "If You Can't Find Your Team Dropdown",
      );
    });

    it('should render default team not found reasons in legacy flow', async () => {
      useFeatureTogglesStub = sinon
        .stub(require('../../../hooks/useFeatureToggles'), 'default')
        .returns({
          mhvSecureMessagingCuratedListFlow: false,
        });

      const { container } = renderWithStoreAndRouter(<CantFindYourTeam />, {
        initialState: defaultState,
        reducers: reducer,
      });
      await waitFor(() => {
        const additionalInfo = container.querySelector('va-additional-info');
        expect(additionalInfo).to.exist;
        expect(additionalInfo.getAttribute('data-dd-action-name')).to.equal(
          "If You Can't Find Your Team Dropdown",
        );
      });
      expect(container.textContent).to.include(
        'Here are some reasons a care team may be missing from your contact list:',
      );
      const ul = container.querySelector('ul');
      expect(ul.textContent).to.include(
        'Your account isn’t connected to the teamThe team doesn’t use secure messagingYou removed the team from your list',
      );
      expect(
        container.querySelector(
          'a[data-dd-action-name="Show more teams in your contact list link"]',
        ),
      ).to.exist;
    });

    it('displays the legacy link to show more teams', async () => {
      useFeatureTogglesStub = sinon
        .stub(require('../../../hooks/useFeatureToggles'), 'default')
        .returns({
          mhvSecureMessagingCuratedListFlow: false,
        });

      const { container } = renderWithStoreAndRouter(<CantFindYourTeam />, {
        initialState: defaultState,
        reducers: reducer,
      });

      const contactLink = container.querySelector('a[href*="contact-list"]');
      expect(contactLink).to.exist;
      expect(contactLink.textContent).to.equal(
        'Show more teams in your contact list',
      );
      expect(contactLink.getAttribute('data-dd-action-name')).to.equal(
        'Show more teams in your contact list link',
      );
    });
  });

  describe('when mhvSecureMessagingCuratedListFlow is true', () => {
    describe('and facility is Cerner', () => {
      const cernerState = {
        sm: {
          recipients: {
            activeFacility: {
              ehr: 'cerner',
            },
          },
        },
      };

      it('renders the Cerner-specific version', async () => {
        useFeatureTogglesStub = sinon
          .stub(require('../../../hooks/useFeatureToggles'), 'default')
          .returns({
            mhvSecureMessagingCuratedListFlow: true,
          });

        const { getByText } = renderWithStoreAndRouter(<CantFindYourTeam />, {
          initialState: cernerState,
          reducers: reducer,
        });

        const p1 =
          'If you can’t find your care team, try entering the first few letters of your facility’s location, your provider’s name, or a type of care.';
        const p2 =
          'If you still can’t find your care team, they may not use secure messaging. Or they may be part of a different VA health care system.';
        expect(getByText(p1)).to.exist;
        expect(getByText(p2)).to.exist;
      });

      it('does not display the contact list link for Cerner', async () => {
        useFeatureTogglesStub = sinon
          .stub(require('../../../hooks/useFeatureToggles'), 'default')
          .returns({
            mhvSecureMessagingCuratedListFlow: true,
          });

        const { container } = renderWithStoreAndRouter(<CantFindYourTeam />, {
          initialState: cernerState,
          reducers: reducer,
        });

        expect(
          container.querySelector(
            'a[href="/my-health/secure-messages/contact-list/"]',
          ),
        ).to.not.exist;
      });
    });

    describe('and facility is not Cerner', () => {
      const nonCernerState = {
        sm: {
          recipients: {
            activeFacility: {
              ehr: 'vista',
            },
          },
        },
      };

      it('renders the curated list flow version', async () => {
        useFeatureTogglesStub = sinon
          .stub(require('../../../hooks/useFeatureToggles'), 'default')
          .returns({
            mhvSecureMessagingCuratedListFlow: true,
          });

        const { container } = renderWithStoreAndRouter(<CantFindYourTeam />, {
          initialState: nonCernerState,
          reducers: reducer,
        });

        expect(container.querySelector('.cant-fnd-your-team')).to.exist;
        expect(container.textContent).to.include(
          'Your care team may not be listed for these reasons:',
        );
        expect(container.textContent).to.include(
          'You can send messages to other care teams by adding them to your contact list.',
        );
      });

      it('displays all team not listed reasons', async () => {
        useFeatureTogglesStub = sinon
          .stub(require('../../../hooks/useFeatureToggles'), 'default')
          .returns({
            mhvSecureMessagingCuratedListFlow: true,
          });

        const { container } = renderWithStoreAndRouter(<CantFindYourTeam />, {
          initialState: nonCernerState,
          reducers: reducer,
        });

        teamNotListedReasons.forEach(reason => {
          expect(container.textContent).to.include(reason);
        });
      });

      it('displays the update contact list link', async () => {
        useFeatureTogglesStub = sinon
          .stub(require('../../../hooks/useFeatureToggles'), 'default')
          .returns({
            mhvSecureMessagingCuratedListFlow: true,
          });

        const { container } = renderWithStoreAndRouter(<CantFindYourTeam />, {
          initialState: nonCernerState,
          reducers: reducer,
        });

        const link = container.querySelector('a[href*="contact-list"]');
        expect(link).to.exist;
        expect(link.textContent).to.equal('Update your contact list');
        expect(link.getAttribute('data-dd-action-name')).to.equal(
          'Update your contact list link',
        );
      });
    });

    describe('when activeFacility is null', () => {
      it('renders the non-Cerner version when activeFacility is null', async () => {
        useFeatureTogglesStub = sinon
          .stub(require('../../../hooks/useFeatureToggles'), 'default')
          .returns({
            mhvSecureMessagingCuratedListFlow: true,
          });

        const { container } = renderWithStoreAndRouter(<CantFindYourTeam />, {
          initialState: defaultState,
          reducers: reducer,
        });

        expect(container.querySelector('.cant-fnd-your-team')).to.exist;
        expect(container.textContent).to.include(
          'Your care team may not be listed for these reasons:',
        );
      });
    });
  });

  describe('accessibility and data attributes', () => {
    it('has correct data-dd-action-name attribute', async () => {
      useFeatureTogglesStub = sinon
        .stub(require('../../../hooks/useFeatureToggles'), 'default')
        .returns({
          mhvSecureMessagingCuratedListFlow: false,
        });

      const { container } = renderWithStoreAndRouter(<CantFindYourTeam />, {
        initialState: defaultState,
        reducers: reducer,
      });

      await waitFor(() => {
        const additionalInfo = container.querySelector('va-additional-info');
        expect(additionalInfo).to.exist;
        expect(additionalInfo.getAttribute('data-dd-action-name')).to.equal(
          "If You Can't Find Your Team Dropdown",
        );
      });
    });

    it('has proper CSS classes', async () => {
      useFeatureTogglesStub = sinon
        .stub(require('../../../hooks/useFeatureToggles'), 'default')
        .returns({
          mhvSecureMessagingCuratedListFlow: false,
        });

      renderWithStoreAndRouter(<CantFindYourTeam />, {
        initialState: defaultState,
        reducers: reducer,
      });

      expect(document.querySelector('.vads-u-margin-top--2')).to.exist;
    });

    it('has proper list structure for team reasons', async () => {
      useFeatureTogglesStub = sinon
        .stub(require('../../../hooks/useFeatureToggles'), 'default')
        .returns({
          mhvSecureMessagingCuratedListFlow: true,
        });

      const { container } = renderWithStoreAndRouter(<CantFindYourTeam />, {
        initialState: defaultState,
        reducers: reducer,
      });

      const list = container.querySelector('ul.vads-u-margin-y--0');
      expect(list).to.exist;

      const listItems = container.querySelectorAll('ul.vads-u-margin-y--0 li');
      expect(listItems).to.have.lengthOf(teamNotListedReasons.length);
    });
  });

  describe('integration with Redux state', () => {
    it('responds to changes in activeFacility.ehr', async () => {
      const stateWithCerner = {
        sm: {
          recipients: {
            activeFacility: {
              ehr: 'cerner',
            },
          },
        },
      };

      useFeatureTogglesStub = sinon
        .stub(require('../../../hooks/useFeatureToggles'), 'default')
        .returns({
          mhvSecureMessagingCuratedListFlow: true,
        });

      const { container } = renderWithStoreAndRouter(<CantFindYourTeam />, {
        initialState: stateWithCerner,
        reducers: reducer,
      });

      // Should show Cerner-specific content
      expect(container.textContent).to.include(
        'try entering the first few letters',
      );
      expect(container.textContent).to.include('of your facility');
      expect(container.textContent).to.include('s location');

      // Should not show contact list link
      expect(
        container.querySelector(
          'a[href="/my-health/secure-messages/contact-list/"]',
        ),
      ).to.not.exist;
    });

    it('handles missing recipients state gracefully', async () => {
      const incompleteState = {
        sm: {},
      };

      useFeatureTogglesStub = sinon
        .stub(require('../../../hooks/useFeatureToggles'), 'default')
        .returns({
          mhvSecureMessagingCuratedListFlow: true,
        });

      expect(() => {
        renderWithStoreAndRouter(<CantFindYourTeam />, {
          initialState: incompleteState,
          reducers: reducer,
        });
      }).to.not.throw();
    });
  });
});
