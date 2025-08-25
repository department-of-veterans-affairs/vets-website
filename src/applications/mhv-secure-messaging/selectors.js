export const folder = state => state.sm.folders.folder;
export const selectSignature = state => state.sm.preferences.signature;
export const populatedDraft = state => {
  return (
    state.sm?.threadDetails?.draftInProgress?.messageId ||
    state.sm?.threadDetails?.draftInProgress?.category ||
    state.sm?.threadDetails?.draftInProgress?.subject ||
    state.sm?.threadDetails?.draftInProgress?.body ||
    state.sm?.threadDetails?.draftInProgress?.recipientId
  );
};
