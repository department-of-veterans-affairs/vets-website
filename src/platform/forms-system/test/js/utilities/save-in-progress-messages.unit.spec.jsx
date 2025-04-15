import { expect } from 'chai';

import { inProgressMessage } from '../../../src/js/utilities/save-in-progress-messages';

describe('inProgressMessage()', () => {
  it('should return a default message when the message is not set', () => {
    const formConfig = {
      saveInProgress: {
        messages: {},
      },
    };

    expect(inProgressMessage(formConfig)).to.eql(
      'Your application is in progress',
    );
  });

  it('should return a message from the formConfig when properly set', () => {
    const formConfig = {
      saveInProgress: {
        messages: {
          inProgress: 'Bippity boppity boo!',
        },
      },
    };

    expect(inProgressMessage(formConfig)).to.eql('Bippity boppity boo!');
  });

  it('should not override an empty string with the default message', () => {
    const formConfig = {
      saveInProgress: {
        messages: {
          inProgress: '',
        },
      },
    };

    expect(inProgressMessage(formConfig)).to.eql('');
  });
});
