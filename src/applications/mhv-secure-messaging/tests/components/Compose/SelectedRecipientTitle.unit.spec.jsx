import React from 'react';
import { expect } from 'chai';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import SelectedRecipientTitle from '../../../components/ComposeForm/SelectedRecipientTitle';
import { Paths } from '../../../util/constants';
import reducer from '../../../reducers';

describe('SelectedRecipientTitle component', () => {
  const mockDraftInProgress = {
    careSystemName: 'VA Long Beach Healthcare System',
    recipientName: 'Primary Care Team',
  };

  const defaultProps = {
    draftInProgress: mockDraftInProgress,
  };

  const renderComponent = (props = defaultProps, initialState = {}) =>
    renderWithStoreAndRouter(<SelectedRecipientTitle {...props} />, {
      initialState,
      reducers: reducer,
      path: Paths.COMPOSE,
    });

  it('renders without errors', () => {
    const screen = renderComponent();

    expect(screen.getByText('To')).to.exist;
    expect(screen.getByTestId('compose-recipient-title')).to.exist;
    expect(screen.getByText('Select a different care team')).to.exist;
  });

  it('displays the correct recipient information', () => {
    const screen = renderComponent();

    const recipientTitle = screen.getByTestId('compose-recipient-title');
    expect(recipientTitle).to.have.text(
      'VA Long Beach Healthcare System - Primary Care Team',
    );
  });

  it('applies correct styling classes', () => {
    const screen = renderComponent();

    const container = screen.getByTestId('compose-recipient-title')
      .parentElement;
    expect(container).to.have.class('vads-u-margin-top--3');

    const toLabel = screen.getByText('To');
    expect(toLabel).to.have.class('vads-u-margin-bottom--0');

    const recipientTitle = screen.getByTestId('compose-recipient-title');
    expect(recipientTitle).to.have.class('vads-u-font-weight--bold');
    expect(recipientTitle).to.have.class('vads-u-margin-y--0');
  });

  it('has correct data attributes for data masking', () => {
    const screen = renderComponent();

    const recipientTitle = screen.getByTestId('compose-recipient-title');
    expect(recipientTitle).to.have.attribute('data-dd-privacy', 'mask');
    expect(recipientTitle).to.have.attribute(
      'data-dd-action-name',
      'Care System - Team recipient title',
    );
  });

  it('renders the "Select a different care team" link with correct path', () => {
    const screen = renderComponent();

    const selectDifferentTeamLink = screen.getByRole('link', {
      name: 'Select a different care team',
    });
    expect(selectDifferentTeamLink).to.exist;
    expect(selectDifferentTeamLink).to.have.attribute(
      'href',
      `${Paths.COMPOSE}${Paths.SELECT_CARE_TEAM}`,
    );
  });

  it('has correct data attribute for the select different care team link', () => {
    const screen = renderComponent();

    const selectDifferentTeamLink = screen.getByRole('link', {
      name: 'Select a different care team',
    });
    expect(selectDifferentTeamLink).to.have.attribute(
      'data-dd-action-name',
      'Select a different care team link',
    );
  });

  it('handles missing care system name gracefully', () => {
    const propsWithMissingCareSystem = {
      draftInProgress: {
        recipientName: 'Primary Care Team',
      },
    };

    const screen = renderComponent(propsWithMissingCareSystem);

    const recipientTitle = screen.getByTestId('compose-recipient-title');
    expect(recipientTitle).to.have.text(' - Primary Care Team');
  });

  it('handles missing recipient name gracefully', () => {
    const propsWithMissingRecipient = {
      draftInProgress: {
        careSystemName: 'VA Long Beach Healthcare System',
      },
    };

    const screen = renderComponent(propsWithMissingRecipient);

    const recipientTitle = screen.getByTestId('compose-recipient-title');
    expect(recipientTitle).to.have.text('VA Long Beach Healthcare System - ');
  });

  it('handles completely missing draftInProgress object', () => {
    const propsWithoutDraft = {
      draftInProgress: {},
    };

    const screen = renderComponent(propsWithoutDraft);

    const recipientTitle = screen.getByTestId('compose-recipient-title');
    expect(recipientTitle).to.have.text(' - ');
  });

  it('handles undefined draftInProgress prop gracefully', () => {
    const propsWithUndefinedDraft = {
      draftInProgress: undefined,
    };

    const screen = renderComponent(propsWithUndefinedDraft);

    const recipientTitle = screen.getByTestId('compose-recipient-title');
    expect(recipientTitle).to.have.text(' - ');
  });

  it('handles null draftInProgress prop gracefully', () => {
    const propsWithNullDraft = {
      draftInProgress: null,
    };

    const screen = renderComponent(propsWithNullDraft);

    const recipientTitle = screen.getByTestId('compose-recipient-title');
    expect(recipientTitle).to.have.text(' - ');
  });

  it('renders with special characters in care system and recipient names', () => {
    const propsWithSpecialChars = {
      draftInProgress: {
        careSystemName: 'VA Medical Center & Clinic',
        recipientName: "Dr. Smith's Team",
      },
    };

    const screen = renderComponent(propsWithSpecialChars);

    const recipientTitle = screen.getByTestId('compose-recipient-title');
    expect(recipientTitle).to.have.text(
      "VA Medical Center & Clinic - Dr. Smith's Team",
    );
  });

  it('renders with long care system and recipient names', () => {
    const propsWithLongNames = {
      draftInProgress: {
        careSystemName: 'Very Long VA Healthcare System Name That Might Wrap',
        recipientName: 'Very Long Primary Care Team Name That Might Also Wrap',
      },
    };

    const screen = renderComponent(propsWithLongNames);

    const recipientTitle = screen.getByTestId('compose-recipient-title');
    expect(recipientTitle).to.have.text(
      'Very Long VA Healthcare System Name That Might Wrap - Very Long Primary Care Team Name That Might Also Wrap',
    );
  });
});
