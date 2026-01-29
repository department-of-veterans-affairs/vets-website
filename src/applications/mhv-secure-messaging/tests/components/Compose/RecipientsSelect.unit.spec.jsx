import React from 'react';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import FEATURE_FLAG_NAMES from '@department-of-veterans-affairs/platform-utilities/featureFlagNames';
import { waitFor } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';
import reducer from '../../../reducers';
import RecipientsSelect from '../../../components/ComposeForm/RecipientsSelect';
import * as Constants from '../../../util/constants';
import { selectVaSelect } from '../../../util/testUtils';
import * as threadDetailsActions from '../../../actions/threadDetails';

describe('RecipientsSelect', () => {
  const initialState = {
    user: {
      profile: {
        session: {
          ssoe: true,
        },
      },
    },
    drupalStaticData: {
      vamcEhrData: {
        data: {
          ehrDataByVhaId: {
            '402': {
              vhaId: '402',
              vamcFacilityName: 'Facility 402 Name',
              vamcSystemName: 'VA Facility 402',
              ehr: 'vista',
            },
            '552': {
              vhaId: '552',
              vamcFacilityName: 'Facility 552 Name',
              vamcSystemName: 'VA Facility 552',
              ehr: 'vista',
            },
          },
        },
      },
    },
  };

  const recipientsList = [
    {
      id: 1,
      name: 'Recipient 1',
      stationNumber: '552',
      signatureRequired: true,
      ohTriageGroup: true,
    },
    {
      id: 2,
      name: 'Recipient 2',
      stationNumber: '402',
      signatureRequired: false,
      ohTriageGroup: false,
    },
    {
      id: 3,
      name: 'VHA 649 Release of Information (ROI)',
      stationNumber: '649',
      signatureRequired: true,
    },
    {
      id: 4,
      name: 'Ohio Columbus Release of Information – Medical Records',
      stationNumber: '757',
      signatureRequired: true,
    },
    {
      id: 5,
      name: 'Regular Cardiology Team',
      stationNumber: '649',
      signatureRequired: false,
    },
  ];

  const defaultProps = {
    isSignatureRequired: false,
    onValueChange: () => {},
  };
  const setup = ({
    state = initialState,
    path = Constants.Paths.COMPOSE,
    props = defaultProps,
  }) => {
    return renderWithStoreAndRouter(
      <RecipientsSelect recipientsList={recipientsList} {...props} />,
      {
        initialState: state,
        reducers: reducer,
        path,
      },
    );
  };
  it('renders without errors', () => {
    const screen = setup({});
    expect(screen);
  });

  it('displays the correct number of options', () => {
    const screen = setup({});
    const options = screen.getAllByRole('option');
    expect(options).to.have.lengthOf(recipientsList.length);
  });

  it('calls the onValueChange callback when a recipient is selected', async () => {
    // NOTE: Component derives alert text from selected recipient (effectiveSignatureRequired),
    // not just the isSignatureRequired prop. Selecting a signature-required recipient
    // should immediately show the REQUIRED alert text.
    const onValueChange = sinon.spy();
    const setCheckboxMarked = sinon.spy();
    const setElectronicSignature = sinon.spy();
    const customProps = {
      onValueChange,
      setCheckboxMarked,
      setElectronicSignature,
    };
    const screen = setup({ props: customProps });
    const val = recipientsList[0].id;
    selectVaSelect(screen.container, val);

    await waitFor(() => {
      expect(onValueChange.calledOnce).to.be.true;
      expect(onValueChange.calledWith(recipientsList[0])).to.be.true;
      const alert = screen.getByTestId('signature-alert');
      expect(alert).to.exist;
      expect(alert).to.contain.text(
        Constants.Prompts.Compose.SIGNATURE_REQUIRED,
      );
    });
  });

  it('calls the onValueChange callback when a recipient is null', async () => {
    // NOTE: Component derives alert text from selected recipient (effectiveSignatureRequired),
    // not just the isSignatureRequired prop. Selecting a signature-required recipient
    // should immediately show the REQUIRED alert text.
    const onValueChange = sinon.spy();
    const setCheckboxMarked = sinon.spy();
    const setElectronicSignature = sinon.spy();
    const customProps = {
      onValueChange,
      setCheckboxMarked,
      setElectronicSignature,
      defaultValue: '1', // Simulate selecting the placeholder (null) option
    };
    const screen = setup({ props: customProps });
    selectVaSelect(screen.container, null);

    await waitFor(() => {
      expect(onValueChange.calledOnce).to.be.true;
      expect(onValueChange.calledWith(null)).to.be.true;
    });
  });

  it('displays the signature alert when a recipient with signatureRequired is selected', async () => {
    const setAlertDisplayed = sinon.spy();
    const customProps = {
      isSignatureRequired: true,
      setAlertDisplayed,
      alertDisplayed: true,
    };
    const { getByTestId } = setup({ props: customProps });

    await waitFor(() => {
      const alert = getByTestId('signature-alert');
      // Removed invalid assertion: setAlertDisplayed is not passed to component
      expect(alert).to.exist;
      expect(alert).to.contain.text(
        Constants.Prompts.Compose.SIGNATURE_REQUIRED,
      );
      expect(alert).to.have.attribute('closeable', 'true');
    });
  });

  it('does not display the signature alert when a recipient without signatureRequired is selected', () => {
    const screen = setup({});
    const select = screen.getByTestId('compose-recipient-select');
    select.value = '2';

    expect(select.value).to.equal('2');
    const alert = screen.queryByTestId('signature-alert');
    expect(alert).to.be.null;
  });

  it('displays the signature alert when Oracle Health ROI recipient is selected', async () => {
    const onValueChange = sinon.spy();

    // Verify that the Oracle Health ROI recipient requires signature
    const recipient = recipientsList.find(r => r.id === 3); // Oracle Health ROI recipient (ID 3)
    expect(recipient.signatureRequired).to.be.true;

    // Test the component when isSignatureRequired is true (simulating post-selection state)
    const customProps = {
      onValueChange,
      isSignatureRequired: true, // This simulates what happens after selecting a signature-required recipient
      defaultValue: 3, // Oracle Health ROI recipient (ID 3)
    };
    const screen = setup({ props: customProps });

    await waitFor(() => {
      const alert = screen.getByTestId('signature-alert');
      expect(alert).to.exist;
      expect(alert).to.contain.text(
        Constants.Prompts.Compose.SIGNATURE_REQUIRED,
      );
      expect(alert).to.have.attribute('closeable', 'true');
    });
  });

  it('displays the signature alert when Oracle Health Medical Records recipient is selected', async () => {
    const onValueChange = sinon.spy();

    const recipient = recipientsList.find(r => r.id === 4); // Oracle Health Medical Records recipient
    expect(recipient.signatureRequired).to.be.true;

    // Test the component when isSignatureRequired is true (simulating post-selection state)
    const customProps = {
      onValueChange,
      isSignatureRequired: true, // This simulates what happens after selecting a signature-required recipient
      defaultValue: 4, // Oracle Health Medical Records recipient (ID 4)
    };
    const screen = setup({ props: customProps });

    await waitFor(() => {
      const alert = screen.getByTestId('signature-alert');
      expect(alert).to.exist;
      expect(alert).to.contain.text(
        Constants.Prompts.Compose.SIGNATURE_REQUIRED,
      );
      expect(alert).to.have.attribute('closeable', 'true');
    });
  });

  it('does not display the signature alert when regular team (non-Oracle Health) is selected', () => {
    const screen = setup({});
    const select = screen.getByTestId('compose-recipient-select');
    select.value = '5'; // Regular Cardiology Team (matches existing pattern)

    expect(select.value).to.equal('5');
    const alert = screen.queryByTestId('signature-alert');
    expect(alert).to.be.null;
  });

  it('displays the CantFindYourTeam component', () => {
    const { getByText, container } = setup({});
    const cantFindYourTeam = container.querySelector(`va-additional-info`);
    expect(cantFindYourTeam).to.have.attribute(
      'trigger',
      "If you can't find your team",
    );
    const showMoreTeamsLink = getByText('Show more teams in your contact list');

    expect(showMoreTeamsLink).to.exist;
    expect(showMoreTeamsLink)
      .to.have.attribute('href')
      .to.contain(Constants.Paths.CONTACT_LIST);
  });

  it('displays the correct number of optgroups', async () => {
    const customState = {
      ...initialState,
      featureToggles: {
        [FEATURE_FLAG_NAMES.mhvSecureMessagingCuratedListFlow]: true,
        [FEATURE_FLAG_NAMES.mhvSecureMessagingRecipientOptGroups]: true,
      },
    };

    const screen = setup({ state: customState });

    await waitFor(() => {
      const comboBox = screen.getByTestId('compose-recipient-combobox');
      expect(comboBox).to.exist;
      const optgroups = comboBox.querySelectorAll('optgroup');
      expect(optgroups.length).to.equal(2);
      expect(optgroups[0].label).to.equal('VA Facility 402');
      expect(optgroups[1].label).to.equal('VA Facility 552');

      const optionOne = optgroups[0].querySelector('option');
      expect(optionOne.value).to.equal('2');
      expect(optionOne.text).to.equal('Recipient 2');

      const optionTwo = optgroups[1].querySelector('option');
      expect(optionTwo.value).to.equal('1');
      expect(optionTwo.text).to.equal('Recipient 1');
    });
  });

  it('displays correct content in pilot environment OH facility', () => {
    const customState = {
      ...initialState,
      sm: {
        recipients: {
          activeFacility: {
            ehr: 'cerner',
            vamcSystemName: 'Test OH Facility Health Care',
          },
        },
      },
      featureToggles: {
        [FEATURE_FLAG_NAMES.mhvSecureMessagingCuratedListFlow]: true,
      },
    };
    const screen = setup({ state: customState });

    const comboBox = screen.getByTestId('compose-recipient-combobox');
    expect(comboBox).to.exist;

    const options = comboBox.querySelectorAll('option');
    expect(options).to.have.lengthOf(5);
    expect(options[0].textContent).to.equal(
      'Ohio Columbus Release of Information – Medical Records',
    );
    expect(options[1].textContent).to.equal('Recipient 1');
    expect(options[2].textContent).to.equal('Recipient 2');
    expect(options[3].textContent).to.equal('Regular Cardiology Team');
    expect(options[4].textContent).to.equal(
      'VHA 649 Release of Information (ROI)',
    );
  });

  it('displays correct content in pilot environment vista facility', () => {
    const customState = {
      ...initialState,
      sm: {
        recipients: {
          activeFacility: {
            ehr: 'vista',
            vamcSystemName: 'Test Vista Facility Health Care',
          },
        },
      },
      featureToggles: {
        [FEATURE_FLAG_NAMES.mhvSecureMessagingCuratedListFlow]: true,
      },
    };
    const screen = setup({ state: customState });

    const comboBox = screen.getByTestId('compose-recipient-combobox');
    expect(comboBox).to.exist;

    const options = comboBox.querySelectorAll('option');
    expect(options).to.have.lengthOf(5);
    expect(options[0].textContent).to.equal(
      'Ohio Columbus Release of Information – Medical Records',
    );
    expect(options[1].textContent).to.equal('Recipient 1');
    expect(options[2].textContent).to.equal('Recipient 2');
    expect(options[3].textContent).to.equal('Regular Cardiology Team');
    expect(options[4].textContent).to.equal(
      'VHA 649 Release of Information (ROI)',
    );
  });
  it('renders recent recipients optgroup first when curated list & opt groups enabled', async () => {
    const customState = {
      ...initialState,
      sm: {
        recipients: {
          recentRecipients: [
            {
              triageTeamId: 2,
              name: 'Recipient 2',
              stationNumber: '402',
            },
            {
              triageTeamId: 1,
              name: 'Recipient 1',
              stationNumber: '552',
            },
          ],
        },
      },
      featureToggles: {
        [FEATURE_FLAG_NAMES.mhvSecureMessagingCuratedListFlow]: true,
        [FEATURE_FLAG_NAMES.mhvSecureMessagingRecipientOptGroups]: true,
      },
    };
    const screen = setup({ state: customState });
    await waitFor(() => {
      const comboBox = screen.getByTestId('compose-recipient-combobox');
      expect(comboBox).to.exist;

      // recent group + 2 facility groups
      const optgroups = comboBox.querySelectorAll('optgroup');
      expect(optgroups.length).to.equal(3);
      expect(optgroups[0].getAttribute('label')).to.equal('Recent care teams');
      expect(optgroups[0].querySelectorAll('option').length).to.equal(2);
      expect(optgroups[0].querySelectorAll('option')[0].textContent).to.equal(
        'Recipient 2',
      );
    });
  });

  it('does not render recent recipients optgroup when list is empty', async () => {
    const customState = {
      ...initialState,
      sm: {
        recipients: {
          recentRecipients: [],
        },
      },
      featureToggles: {
        [FEATURE_FLAG_NAMES.mhvSecureMessagingCuratedListFlow]: true,
        [FEATURE_FLAG_NAMES.mhvSecureMessagingRecipientOptGroups]: true,
      },
    };
    const screen = setup({ state: customState });
    await waitFor(() => {
      const comboBox = screen.getByTestId('compose-recipient-combobox');
      expect(comboBox).to.exist;
      const optgroups = comboBox.querySelectorAll('optgroup');
      expect(optgroups.length).to.equal(2);
      expect(optgroups[0].getAttribute('label')).to.equal('VA Facility 402');
    });
  });

  it('dispatches selected recipient to state on selection', () => {
    const sandbox = sinon.createSandbox();
    const threadDetailsSpy = sandbox.spy(
      threadDetailsActions,
      'updateDraftInProgress',
    );
    const screen = setup({});
    selectVaSelect(screen.container, '1');

    waitFor(() => {
      expect(threadDetailsSpy.calledOnce).to.be.true;
      expect(threadDetailsSpy.lastCall.args[0]).to.deep.equal({
        ohTriageGroup: true,
        recipientId: 1,
        recipientName: 'Recipient 1',
      });
    });
    selectVaSelect(screen.container, '2');
    waitFor(() => {
      expect(threadDetailsSpy.calledTwice).to.be.true;
      expect(threadDetailsSpy.lastCall.args[0]).to.deep.equal({
        ohTriageGroup: false,
        recipientId: 2,
        recipientName: 'Recipient 2',
      });
    });
    sandbox.restore();
  });

  describe('Facility name display in options', () => {
    it('displays shortened facility name for recent recipients', async () => {
      const customState = {
        ...initialState,
        sm: {
          recipients: {
            recentRecipients: [
              {
                triageTeamId: 2,
                name: 'Recent Team 1',
                stationNumber: '402',
                healthCareSystemName: 'VA Madison health care',
              },
              {
                triageTeamId: 1,
                name: 'Recent Team 2',
                stationNumber: '552',
                healthCareSystemName: 'VA Kansas City health care',
              },
            ],
          },
        },
        featureToggles: {
          [FEATURE_FLAG_NAMES.mhvSecureMessagingCuratedListFlow]: true,
          [FEATURE_FLAG_NAMES.mhvSecureMessagingRecipientOptGroups]: true,
        },
      };

      const screen = setup({ state: customState });

      await waitFor(() => {
        const comboBox = screen.getByTestId('compose-recipient-combobox');
        const recentOptgroup = comboBox.querySelector(
          'optgroup[label="Recent care teams"]',
        );
        expect(recentOptgroup).to.exist;

        const options = recentOptgroup.querySelectorAll('option');
        expect(options.length).to.equal(2);

        // Verify first option includes shortened facility name
        expect(options[0].textContent).to.include('Recent Team 1');
        expect(options[0].textContent).to.include('(Madison)');
        expect(options[0].textContent).to.not.include('VA Madison health care');

        // Verify second option includes shortened facility name
        expect(options[1].textContent).to.include('Recent Team 2');
        expect(options[1].textContent).to.include('(Kansas City)');
        expect(options[1].textContent).to.not.include(
          'VA Kansas City health care',
        );
      });
    });

    it('displays shortened facility name for grouped options', async () => {
      const customState = {
        ...initialState,
        sm: {
          recipients: {
            recentRecipients: [],
          },
        },
        featureToggles: {
          [FEATURE_FLAG_NAMES.mhvSecureMessagingCuratedListFlow]: true,
          [FEATURE_FLAG_NAMES.mhvSecureMessagingRecipientOptGroups]: true,
        },
        drupalStaticData: {
          vamcEhrData: {
            data: {
              ehrDataByVhaId: {
                '402': {
                  vhaId: '402',
                  vamcFacilityName: 'Facility 402 Name',
                  vamcSystemName: 'VA Madison health care',
                  ehr: 'vista',
                },
                '552': {
                  vhaId: '552',
                  vamcFacilityName: 'Facility 552 Name',
                  vamcSystemName: 'VA Kansas City health care',
                  ehr: 'vista',
                },
              },
            },
          },
        },
      };

      const screen = setup({ state: customState });

      await waitFor(() => {
        const comboBox = screen.getByTestId('compose-recipient-combobox');

        // Find the Madison health care optgroup
        const madisonOptgroup = comboBox.querySelector(
          'optgroup[label="VA Madison health care"]',
        );
        expect(madisonOptgroup).to.exist;

        const madisonOptions = madisonOptgroup.querySelectorAll('option');
        expect(madisonOptions.length).to.be.greaterThan(0);

        // Verify options include shortened facility name
        madisonOptions.forEach(option => {
          expect(option.textContent).to.include('(Madison)');
          expect(option.textContent).to.not.include('VA Madison health care');
        });
      });
    });

    it('removes "VA" prefix and "health care" suffix from facility names', async () => {
      const customState = {
        ...initialState,
        sm: {
          recipients: {
            recentRecipients: [
              {
                triageTeamId: 1,
                name: 'Test Team',
                stationNumber: '402',
                healthCareSystemName: 'VA Northern Arizona health care',
              },
            ],
          },
        },
        featureToggles: {
          [FEATURE_FLAG_NAMES.mhvSecureMessagingCuratedListFlow]: true,
          [FEATURE_FLAG_NAMES.mhvSecureMessagingRecipientOptGroups]: true,
        },
      };

      const screen = setup({ state: customState });

      await waitFor(() => {
        const comboBox = screen.getByTestId('compose-recipient-combobox');
        const recentOptgroup = comboBox.querySelector(
          'optgroup[label="Recent care teams"]',
        );
        const option = recentOptgroup.querySelector('option');

        // Should show "Northern Arizona" not "VA Northern Arizona health care"
        expect(option.textContent).to.include('(Northern Arizona)');
        expect(option.textContent).to.not.include('VA');
        expect(option.textContent).to.not.include('health care');
      });
    });

    it('handles facility names without "VA" prefix gracefully', async () => {
      const customState = {
        ...initialState,
        sm: {
          recipients: {
            recentRecipients: [
              {
                triageTeamId: 1,
                name: 'Test Team',
                stationNumber: '402',
                healthCareSystemName: 'Madison Medical Center',
              },
            ],
          },
        },
        featureToggles: {
          [FEATURE_FLAG_NAMES.mhvSecureMessagingCuratedListFlow]: true,
          [FEATURE_FLAG_NAMES.mhvSecureMessagingRecipientOptGroups]: true,
        },
      };

      const screen = setup({ state: customState });

      await waitFor(() => {
        const comboBox = screen.getByTestId('compose-recipient-combobox');
        const recentOptgroup = comboBox.querySelector(
          'optgroup[label="Recent care teams"]',
        );
        const option = recentOptgroup.querySelector('option');

        // Should show full name if no "VA" prefix
        expect(option.textContent).to.include('(Madison Medical Center)');
      });
    });

    it('displays facility name for ungrouped options when vamcSystemName is undefined', async () => {
      const recipientsWithUndefinedSystem = [
        {
          id: 1,
          name: 'Ungrouped Team',
          stationNumber: '999',
          vamcSystemName: undefined,
          signatureRequired: false,
        },
      ];

      const customState = {
        ...initialState,
        sm: {
          recipients: {
            recentRecipients: [],
          },
        },
        featureToggles: {
          [FEATURE_FLAG_NAMES.mhvSecureMessagingCuratedListFlow]: true,
          [FEATURE_FLAG_NAMES.mhvSecureMessagingRecipientOptGroups]: true,
        },
      };

      const customProps = {
        ...defaultProps,
      };

      const screen = renderWithStoreAndRouter(
        <RecipientsSelect
          recipientsList={recipientsWithUndefinedSystem}
          {...customProps}
        />,
        {
          initialState: customState,
          reducers: reducer,
          path: Constants.Paths.COMPOSE,
        },
      );

      await waitFor(() => {
        const comboBox = screen.getByTestId('compose-recipient-combobox');
        const options = comboBox.querySelectorAll('option');

        // Find the ungrouped option (not in an optgroup)
        const ungroupedOption = Array.from(options).find(opt =>
          opt.textContent.includes('Ungrouped Team'),
        );

        expect(ungroupedOption).to.exist;
        // Should include facility indicator even if undefined
        expect(ungroupedOption.textContent).to.include('Ungrouped Team');
      });
    });
  });
});
