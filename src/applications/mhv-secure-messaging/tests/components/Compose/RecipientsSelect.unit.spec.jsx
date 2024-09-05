import React from 'react';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import { waitFor } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';
import reducer from '../../../reducers';
import RecipientsSelect from '../../../components/ComposeForm/RecipientsSelect';
import * as Constants from '../../../util/constants';
import { selectVaSelect } from '../../../util/testUtils';

describe('RecipientsSelect', () => {
  const initialState = {
    user: {
      profile: {
        session: {
          ssoe: true,
        },
      },
    },
  };

  const recipientsList = [
    { id: 1, name: 'Recipient 1', signatureRequired: true },
    { id: 2, name: 'Recipient 2', signatureRequired: false },
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
    const onValueChange = sinon.spy();
    const setCheckboxMarked = sinon.spy();
    const setElectronicSignature = sinon.spy();
    const setAlertDisplayed = sinon.spy();
    const customProps = {
      onValueChange,
      setCheckboxMarked,
      setElectronicSignature,
      setAlertDisplayed,
    };
    const screen = setup({ props: customProps });
    const val = recipientsList[0].id;
    selectVaSelect(screen.container, val);
    const select = screen.getByTestId('compose-recipient-select');

    waitFor(() => {
      expect(setAlertDisplayed).to.be.calledOnce;
      expect(select).to.have.value(val);
      expect(onValueChange.calledOnce).to.be.true;
      expect(onValueChange.calledWith(recipientsList[0])).to.be.true;
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

    waitFor(() => {
      const alert = getByTestId('signature-alert');
      expect(setAlertDisplayed).to.be.calledOnce;
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

  it('displays the CantFindYourTeam component', () => {
    const { getByText } = setup({});
    const cantFindYourTeam = document.querySelector(
      'va-additional-info[trigger="If you can\'t find your team"]',
    );
    expect(cantFindYourTeam).to.exist;

    const editPreferencesLink = getByText(
      'Edit your message preferences on the previous version of secure messaging (opens in new tab)',
    );
    expect(editPreferencesLink).to.exist;
    expect(editPreferencesLink)
      .to.have.attribute('href')
      .to.contain(`mhv-portal-web/eauth?deeplinking=preferences`);

    const contactFacilityLink = getByText('Find your VA health facility');
    expect(contactFacilityLink).to.exist;
    expect(contactFacilityLink)
      .to.have.attribute('href')
      .to.contain('/find-locations/');
  });
});
