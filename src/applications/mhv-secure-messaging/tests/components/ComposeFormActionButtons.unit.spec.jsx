import { expect } from 'chai';
import ComposeFormActionButtons from '../../components/ComposeForm/ComposeFormActionButtons';

describe('ComposeFormActionButtons', () => {
  const defaultProps = {
    onSend: () => {},
    onSaveDraft: () => {},
    formPopulated: false,
    setDeleteButtonClicked: () => {},
    cannotReply: false,
    draftBody: '',
    draftId: null,
    draftsCount: 0,
    navigationError: null,
    refreshThreadCallback: () => {},
    setNavigationError: () => {},
    setUnsavedNavigationError: () => {},
    messageBody: '',
    draftSequence: null,
    setHideDraft: () => {},
    setIsEditing: () => {},
    savedComposeDraft: false,
  };

  it('should pass redirectPath prop to DeleteDraft component', () => {
    const redirectPath = '/my-health/medications';

    const props = {
      ...defaultProps,
      redirectPath,
    };

    // Render the component and examine its children
    const element = ComposeFormActionButtons(props);

    // Find the DeleteDraft component in the children
    const deleteDraftElement = element.props.children[2];

    // Verify DeleteDraft receives the redirectPath prop
    expect(deleteDraftElement.props).to.have.property(
      'redirectPath',
      redirectPath,
    );
  });

  it('should not pass redirectPath prop to DeleteDraft when not provided', () => {
    // Render the component and examine its children
    const element = ComposeFormActionButtons(defaultProps);

    // Find the DeleteDraft component in the children
    const deleteDraftElement = element.props.children[2];

    // Verify DeleteDraft receives undefined when not provided
    expect(deleteDraftElement.props).to.have.property(
      'redirectPath',
      undefined,
    );
  });
});
