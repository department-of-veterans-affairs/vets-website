import React from 'react';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import { expect } from 'chai';
import reducers from '../../../reducers';
import DraftSavedInfo from '../../../components/ComposeForm/DraftSavedInfo';
import { dateFormat } from '../../../util/helpers';
import { ErrorMessages } from '../../../util/constants';

describe('DraftSavedInfo component', () => {
  const initialState = {
    sm: {
      threadDetails: {
        isSaving: false,
        lastSaveTime: '2020-01-01T00:00:00.000Z',
        saveError: false,
      },
    },
  };

  const intialProps = {
    attachments: undefined,
  };

  const setup = (state = initialState, props = intialProps) => {
    return renderWithStoreAndRouter(<DraftSavedInfo {...props} />, {
      initialState: state,
      reducers,
      path: '/new-message/',
    });
  };

  it('return "Saving..." when isSaving is true', () => {
    const customState = {
      sm: {
        threadDetails: {
          ...initialState.sm.threadDetails,
          isSaving: true,
        },
      },
    };
    const screen = setup(customState);
    expect(screen.getByText('Saving...')).to.exist;
    const alert = document.querySelector('va-alert');
    expect(alert.getAttribute('status')).to.equal('success');
    expect(alert.getAttribute('aria-live')).to.equal('polite');
    expect(alert.getAttribute('visible')).to.equal('true');
  });

  it('returns the last save time when lastSaveTime is defined', () => {
    const screen = setup();
    const formattedDate = `Your message was saved on ${dateFormat(
      initialState.sm.threadDetails.lastSaveTime,
      'MMMM D, YYYY [at] h:mm a z',
    )}.`;
    expect(screen.getByText(formattedDate)).to.exist;
    const alert = document.querySelector('va-alert');
    expect(alert.getAttribute('status')).to.equal('success');
    expect(alert.getAttribute('aria-live')).to.equal('polite');
    expect(alert.getAttribute('visible')).to.equal('true');
  });

  it('returns an error message when saveError is true', () => {
    const customState = {
      sm: {
        threadDetails: {
          saveError: true,
        },
      },
    };
    const screen = setup(customState);
    expect(screen.getByText(ErrorMessages.ComposeForm.UNABLE_TO_SAVE_OTHER)).to
      .exist;
    const alert = document.querySelector('va-alert');
    expect(alert.getAttribute('status')).to.equal('error');
    expect(alert.getAttribute('visible')).to.equal('true');
  });
});
