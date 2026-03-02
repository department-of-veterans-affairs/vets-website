import { expect } from 'chai';
import React from 'react';
import { renderWithStoreAndRouterV6 } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import MedicationsListHeader from '../../../components/MedicationsList/MedicationsListHeader';
import reducers from '../../../reducers';
import { MEDS_BY_MAIL_FACILITY_ID } from '../../../util/constants';

describe('MedicationsListHeader component', () => {
  const defaultProps = {
    showRxRenewalDeleteDraftSuccessAlert: false,
    showRxRenewalMessageSuccessAlert: false,
  };

  const setup = (
    props = {},
    initialState = {
      user: {
        profile: {
          facilities: [],
        },
      },
    },
  ) =>
    renderWithStoreAndRouterV6(
      <MedicationsListHeader {...defaultProps} {...props} />,
      {
        initialState,
        reducers,
      },
    );

  it('renders without errors', () => {
    const screen = setup();
    expect(screen).to.exist;
  });

  it('displays the medications page title', () => {
    const screen = setup();
    const title = screen.getByTestId('list-page-title');
    expect(title.textContent).to.equal('Medications');
  });

  it('displays the title notes message', () => {
    const screen = setup();
    const titleNotes = screen.getByTestId('Title-Notes');
    expect(titleNotes.textContent).to.include(
      'Bring your medications list to each appointment',
    );
  });

  it('displays link to allergies and reactions', () => {
    const screen = setup();
    const allergiesLink = screen.getByTestId('allergies-link');
    expect(allergiesLink.getAttribute('href')).to.equal(
      '/my-health/medical-records/allergies',
    );
  });

  it('displays RxRenewalDeleteDraftSuccessAlert when prop is true', () => {
    const screen = setup({
      showRxRenewalDeleteDraftSuccessAlert: true,
    });
    expect(screen).to.exist;
  });

  it('displays RxRenewalMessageSuccessAlert when prop is true', () => {
    const screen = setup({
      showRxRenewalMessageSuccessAlert: true,
    });
    expect(screen).to.exist;
  });

  it('does not display RxRenewalDeleteDraftSuccessAlert when prop is false', () => {
    const screen = setup({
      showRxRenewalDeleteDraftSuccessAlert: false,
    });
    const alert = screen.queryByTestId('rx-renewal-delete-draft-success-alert');
    expect(alert).to.not.exist;
  });

  it('does not display RxRenewalMessageSuccessAlert when prop is true', () => {
    const screen = setup({
      showRxRenewalMessageSuccessAlert: false,
    });
    const alert = screen.queryByTestId('rx-renewal-message-success-alert');
    expect(alert).to.not.exist;
  });

  it('displays MedsByMailContent when user has meds by mail facility', () => {
    const initialState = {
      user: {
        profile: {
          facilities: [
            {
              facilityId: MEDS_BY_MAIL_FACILITY_ID,
              isCerner: false,
            },
          ],
        },
      },
    };
    const screen = setup({}, initialState);
    // Actually verify MedsByMailContent is rendered
    expect(screen.getByTestId('meds-by-mail-header')).to.exist;

    // And verify the extra "Meds by Mail" text is NOT in the title notes
    const titleNotes = screen.getByTestId('Title-Notes');
    expect(titleNotes.textContent).to.not.include('Meds by Mail');
  });

  it('does not display MedsByMailContent when user does not have meds by mail facility', () => {
    const screen = setup();
    const medsByMailHeader = screen.queryByTestId('meds-by-mail-header');
    expect(medsByMailHeader).to.not.exist;

    const titleNotes = screen.getByTestId('Title-Notes');
    expect(titleNotes.textContent).to.include('Meds by Mail');
  });
});
