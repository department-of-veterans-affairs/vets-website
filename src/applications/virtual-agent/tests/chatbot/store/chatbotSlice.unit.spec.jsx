import { expect } from 'chai';

import chatbotReducer, {
  chatbotActions,
  selectChatbotHasAcceptedDisclaimer,
} from '../../../chatbot/store/chatbotSlice';

describe('chatbotSlice', () => {
  it('returns the initial state when state is undefined', () => {
    const state = chatbotReducer(undefined, { type: 'UNKNOWN' });

    expect(state).to.deep.equal({ hasAcceptedDisclaimer: false });
  });

  it('sets hasAcceptedDisclaimer to true when acceptDisclaimer is dispatched', () => {
    const state = chatbotReducer(undefined, chatbotActions.acceptDisclaimer());

    expect(state.hasAcceptedDisclaimer).to.equal(true);
  });

  it('selectChatbotHasAcceptedDisclaimer returns false when state is missing', () => {
    const result = selectChatbotHasAcceptedDisclaimer({});

    expect(result).to.equal(false);
  });

  it('selectChatbotHasAcceptedDisclaimer returns true when accepted', () => {
    const result = selectChatbotHasAcceptedDisclaimer({
      chatbot: { hasAcceptedDisclaimer: true },
    });

    expect(result).to.equal(true);
  });
});
