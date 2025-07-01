import React from 'react';
import { expect } from 'chai';
import { fireEvent, waitFor } from '@testing-library/react';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import reducer from '../../reducers';
import RecentCareTeams from '../../containers/RecentCareTeams';
import { selectVaRadio } from '../../util/testUtils';
import { Paths } from '../../util/constants';

describe('RecentCareTeams container', () => {
  const baseState = {
    sm: {
      recipients: {
        recentRecipients: [
          { triageTeamId: 1, name: 'Team One', healthCareSystemName: 'VAMC A' },
          { triageTeamId: 2, name: 'Team Two', healthCareSystemName: 'VAMC B' },
        ],
      },
    },
  };

  const setup = ({ setupState = baseState, history = null }) => {
    return renderWithStoreAndRouter(<RecentCareTeams />, {
      initialState: setupState,
      reducers: reducer,
      path: '/',
      history,
    });
  };

  it('renders loading indicator when recentRecipients is undefined', () => {
    const testState = {
      sm: {
        recipients: { recentRecipients: undefined },
        app: { isPilot: true },
      },
    };
    const screen = setup({ setupState: testState });
    expect(
      screen.container.querySelector('va-loading-indicator'),
    ).to.have.attribute('message', 'Loading...');
  });

  it('renders recent care teams as radio options', () => {
    const { getByText, container } = setup({});
    expect(getByText('Recent care teams')).to.exist;
    const radioOptions = container.querySelectorAll('va-radio-option');
    expect(radioOptions).to.have.length(3);
    expect(radioOptions[0]).to.have.attribute('label', 'Team One');
    expect(radioOptions[0]).to.have.attribute('value', '1');
    expect(radioOptions[0]).to.have.attribute('description', 'VAMC A');

    expect(radioOptions[1]).to.have.attribute('label', 'Team Two');
    expect(radioOptions[1]).to.have.attribute('description', 'VAMC B');
    expect(radioOptions[1]).to.have.attribute('value', '2');

    expect(radioOptions[2]).to.have.attribute('label', 'A different care team');
  });

  it('shows error if continue is clicked without selection', async () => {
    const { container } = setup({});
    fireEvent.click(container.querySelector('va-button[text="Continue"]'));
    await waitFor(() => {
      expect(container.querySelector('va-radio')).to.have.attribute(
        'error',
        'Select a care team',
      );
    });
  });

  it('navigates to select care team if "A different care team" is selected', async () => {
    const { container, history } = setup({});
    selectVaRadio(container, 'other');
    fireEvent.click(container.querySelector('va-button[text="Continue"]'));
    await waitFor(() => {
      expect(history.push.calledWith('/new-message/select-care-team/')).to.be
        .true;
    });
  });

  it('navigates to start message if a care team is selected', async () => {
    const { container, history } = setup({});
    selectVaRadio(container, '1');
    fireEvent.click(container.querySelector('va-button[text="Continue"]'));
    await waitFor(() => {
      expect(history.push.calledWith('/new-message/start-message/')).to.be.true;
    });
  });

  it('redirects if recentRecipients is null (no recent care teams)', async () => {
    const testState = { sm: { recipients: { recentRecipients: null } } };
    const { history } = setup({
      setupState: testState,
    });
    await waitFor(() => {
      expect(
        history.push.calledWith(`${Paths.COMPOSE}${Paths.SELECT_CARE_TEAM}/`),
      ).to.be.true;
    });
  });

  it('sets focus to h1 after render', async () => {
    const { getByText } = setup({});
    const h1 = getByText('Recent care teams');
    await waitFor(() => {
      expect(document.activeElement).to.equal(h1);
    });
  });
});
