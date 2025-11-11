import { expect } from 'chai';
import sinon from 'sinon';
import { renderHook } from '@testing-library/react-hooks';
import useCharacterLimit, {
  getInputElement,
  getCounterElement,
  createCounterElement,
  updateCounter,
  setupCharacterLimit,
  checkAndResetCounterIfCleared,
  createMutationObserverCallback,
} from '../../hooks/useCharacterLimit';

// Helper function to set up querySelector stub with common selectors
function setupQuerySelectorStub(sandbox, options = {}) {
  const {
    inputElement = null,
    counterElement = null,
    formElement = null,
    sendButton = null,
    webchatContainer = null,
  } = options;

  return sandbox.stub(document, 'querySelector').callsFake(selector => {
    if (selector.includes('input.webchat__send-box-text-box__input')) {
      return inputElement;
    }
    if (selector.includes('.webchat-character-counter')) {
      return counterElement;
    }
    if (selector.includes('form.webchat__send-box-text-box')) {
      return formElement;
    }
    if (selector.includes('button.webchat__send-button')) {
      return sendButton;
    }
    if (selector.includes('[data-testid="webchat"]')) {
      return webchatContainer;
    }
    return null;
  });
}

describe('useCharacterLimit', () => {
  let sandbox;
  let mockInputElement;
  let mockCounterElement;
  let mockParentElement;

  beforeEach(() => {
    sandbox = sinon.sandbox.create();

    mockInputElement = {
      value: '',
      setAttribute: sandbox.stub(),
      addEventListener: sandbox.stub(),
      removeEventListener: sandbox.stub(),
      closest: sandbox.stub(),
      parentElement: null,
      dispatchEvent: sandbox.stub(),
    };

    mockCounterElement = {
      textContent: '',
      classList: {
        add: sandbox.stub(),
        remove: sandbox.stub(),
      },
      parentElement: null,
      setAttribute: sandbox.stub(),
      getAttribute: sandbox.stub(),
    };

    mockParentElement = {
      appendChild: sandbox.stub(),
      removeChild: sandbox.stub(),
    };

    mockInputElement.parentElement = mockParentElement;
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('getInputElement', () => {
    it('should find input element by class selector', () => {
      sandbox.stub(document, 'querySelector').returns(mockInputElement);

      const result = getInputElement();

      expect(result).to.equal(mockInputElement);
      expect(
        document.querySelector.calledWith(
          'input.webchat__send-box-text-box__input',
        ),
      ).to.be.true;
    });

    it('should return null if input element is not found', () => {
      sandbox.stub(document, 'querySelector').returns(null);

      const result = getInputElement();

      expect(result).to.be.null;
    });
  });

  describe('getCounterElement', () => {
    it('should find counter element by class selector', () => {
      sandbox.stub(document, 'querySelector').returns(mockCounterElement);

      const result = getCounterElement();

      expect(result).to.equal(mockCounterElement);
      expect(document.querySelector.calledWith('.webchat-character-counter')).to
        .be.true;
    });

    it('should return null if counter element is not found', () => {
      sandbox.stub(document, 'querySelector').returns(null);

      const result = getCounterElement();

      expect(result).to.be.null;
    });
  });

  describe('updateCounter', () => {
    it('should update counter text with current length', () => {
      mockInputElement.value = 'test';
      const characterLimit = 400;
      const redThreshold = 350;

      updateCounter(
        mockCounterElement,
        mockInputElement,
        characterLimit,
        redThreshold,
      );

      expect(mockCounterElement.textContent).to.equal('396 characters left');
      expect(mockCounterElement.classList.add.called).to.be.false;
      expect(mockCounterElement.classList.remove.called).to.be.true;
    });

    it('should add warning class when near limit', () => {
      mockInputElement.value = 'a'.repeat(350);
      const characterLimit = 400;
      const redThreshold = 350;

      updateCounter(
        mockCounterElement,
        mockInputElement,
        characterLimit,
        redThreshold,
      );

      expect(mockCounterElement.textContent).to.equal('50 characters left');
      expect(mockCounterElement.classList.add.calledWith('warning')).to.be.true;
    });

    it('should add warning class when at limit', () => {
      mockInputElement.value = 'a'.repeat(400);
      const characterLimit = 400;
      const redThreshold = 350;

      updateCounter(
        mockCounterElement,
        mockInputElement,
        characterLimit,
        redThreshold,
      );

      expect(mockCounterElement.textContent).to.equal('0 characters left');
      expect(mockCounterElement.classList.add.calledWith('warning')).to.be.true;
    });

    it('should remove warning class when below threshold', () => {
      mockInputElement.value = 'a'.repeat(349);
      const characterLimit = 400;
      const redThreshold = 350;

      updateCounter(
        mockCounterElement,
        mockInputElement,
        characterLimit,
        redThreshold,
      );

      expect(mockCounterElement.textContent).to.equal('51 characters left');
      expect(mockCounterElement.classList.remove.calledWith('warning')).to.be
        .true;
    });
  });

  describe('createCounterElement', () => {
    let mockFormElement;
    let mockSendButton;
    let mockCounterParentElement;

    beforeEach(() => {
      mockFormElement = {
        parentElement: null,
      };
      mockSendButton = {};
      mockCounterParentElement = {
        insertBefore: sandbox.stub(),
      };
      mockFormElement.parentElement = mockCounterParentElement;
    });

    it('should return existing counter element if it exists', () => {
      const createElementStub = sandbox.stub(document, 'createElement');
      sandbox.stub(document, 'querySelector').returns(mockCounterElement);

      const result = createCounterElement();

      expect(result).to.equal(mockCounterElement);
      expect(createElementStub.called).to.be.false;
    });

    it('should create and insert counter element if it does not exist', () => {
      sandbox
        .stub(document, 'querySelector')
        .onFirstCall()
        .returns(null) // getCounterElement - counter doesn't exist
        .onSecondCall()
        .returns(mockFormElement) // form.webchat__send-box-text-box
        .onThirdCall()
        .returns(mockSendButton); // button.webchat__send-button
      sandbox.stub(document, 'createElement').returns(mockCounterElement);

      const result = createCounterElement();

      expect(result).to.equal(mockCounterElement);
      expect(document.createElement.calledWith('div')).to.be.true;
      expect(mockCounterElement.className).to.equal(
        'webchat-character-counter',
      );
      expect(mockCounterElement.setAttribute.calledWith('tabindex', '0')).to.be
        .true;
      expect(
        mockCounterParentElement.insertBefore.calledWith(
          mockCounterElement,
          mockSendButton,
        ),
      ).to.be.true;
    });
  });

  describe('setupCharacterLimit', () => {
    let mockFormElement;
    let mockSendButton;
    let mockCounterParentElement;

    beforeEach(() => {
      mockInputElement.value = '';
      mockFormElement = {
        parentElement: null,
      };
      mockSendButton = {};
      mockCounterParentElement = {
        insertBefore: sandbox.stub(),
      };
      mockFormElement.parentElement = mockCounterParentElement;
    });

    it('should return undefined if input element is not found', () => {
      sandbox.stub(document, 'querySelector').returns(null);

      const result = setupCharacterLimit(400, 350);

      expect(result).to.be.undefined;
    });

    it('should set maxLength attribute on input element', () => {
      setupQuerySelectorStub(sandbox, {
        inputElement: mockInputElement,
        formElement: mockFormElement,
        sendButton: mockSendButton,
      });
      sandbox.stub(document, 'createElement').returns(mockCounterElement);

      setupCharacterLimit(400, 350);

      expect(mockInputElement.setAttribute.calledWith('maxLength', '400')).to.be
        .true;
    });

    it('should create counter element', () => {
      setupQuerySelectorStub(sandbox, {
        inputElement: mockInputElement,
        formElement: mockFormElement,
        sendButton: mockSendButton,
      });
      sandbox.stub(document, 'createElement').returns(mockCounterElement);

      setupCharacterLimit(400, 350);

      expect(document.createElement.calledWith('div')).to.be.true;
    });

    it('should add input event listener', () => {
      setupQuerySelectorStub(sandbox, {
        inputElement: mockInputElement,
        formElement: mockFormElement,
        sendButton: mockSendButton,
      });
      sandbox.stub(document, 'createElement').returns(mockCounterElement);

      setupCharacterLimit(400, 350);

      expect(mockInputElement.addEventListener.calledWith('input')).to.be.true;
      expect(mockInputElement.addEventListener.calledWith('paste')).to.be.false;
    });

    it('should call updateCounter when input event is triggered', () => {
      setupQuerySelectorStub(sandbox, {
        inputElement: mockInputElement,
        formElement: mockFormElement,
        sendButton: mockSendButton,
      });
      sandbox.stub(document, 'createElement').returns(mockCounterElement);
      mockInputElement.value = 'test';

      setupCharacterLimit(400, 350);

      // Get the handler that was added
      const addEventListenerCalls = mockInputElement.addEventListener.getCalls();
      const inputHandler = addEventListenerCalls.find(
        call => call.args[0] === 'input',
      )?.args[1];

      // Reset counter textContent to track changes
      mockCounterElement.textContent = 'initial';

      // Simulate input event by calling the handler
      inputHandler();

      // Verify updateCounter was called (counter textContent should be updated)
      expect(mockCounterElement.textContent).to.equal('396 characters left');
    });

    it('should return cleanup function', () => {
      setupQuerySelectorStub(sandbox, {
        inputElement: mockInputElement,
        formElement: mockFormElement,
        sendButton: mockSendButton,
      });
      sandbox.stub(document, 'createElement').returns(mockCounterElement);
      mockCounterElement.parentElement = mockCounterParentElement;
      mockCounterParentElement.removeChild = sandbox.stub();

      const cleanup = setupCharacterLimit(400, 350);

      expect(cleanup).to.be.a('function');

      cleanup();

      expect(mockInputElement.removeEventListener.calledWith('input')).to.be
        .true;
    });

    it('should remove counter element on cleanup', () => {
      setupQuerySelectorStub(sandbox, {
        inputElement: mockInputElement,
        formElement: mockFormElement,
        sendButton: mockSendButton,
      });
      sandbox.stub(document, 'createElement').returns(mockCounterElement);
      mockCounterElement.parentElement = mockCounterParentElement;
      mockCounterParentElement.removeChild = sandbox.stub();

      const cleanup = setupCharacterLimit(400, 350);

      cleanup();

      expect(
        mockCounterParentElement.removeChild.calledWith(mockCounterElement),
      ).to.be.true;
    });
  });

  describe('checkAndResetCounterIfCleared', () => {
    it('should reset counter when input is cleared (changed from non-empty to empty)', () => {
      mockInputElement.value = '';
      sandbox.stub(document, 'querySelector').returns(mockCounterElement);

      const result = checkAndResetCounterIfCleared(
        mockInputElement,
        'previous text',
        400,
        350,
      );

      expect(result).to.equal('');
      expect(mockCounterElement.textContent).to.equal('400 characters left');
      expect(mockCounterElement.classList.add.called).to.be.false;
      expect(mockCounterElement.classList.remove.called).to.be.true;
    });

    it('should not reset counter when input was already empty', () => {
      mockInputElement.value = '';
      mockCounterElement.textContent = 'initial';
      sandbox.stub(document, 'querySelector').returns(mockCounterElement);

      const result = checkAndResetCounterIfCleared(
        mockInputElement,
        '',
        400,
        350,
      );

      expect(result).to.equal('');
      expect(mockCounterElement.textContent).to.equal('initial');
    });

    it('should not reset counter when input still has content', () => {
      mockInputElement.value = 'some text';
      mockCounterElement.textContent = 'initial';
      sandbox.stub(document, 'querySelector').returns(mockCounterElement);

      const result = checkAndResetCounterIfCleared(
        mockInputElement,
        'previous text',
        400,
        350,
      );

      expect(result).to.equal('some text');
      expect(mockCounterElement.textContent).to.equal('initial');
    });

    it('should not reset counter when counter element does not exist', () => {
      mockInputElement.value = '';
      sandbox.stub(document, 'querySelector').returns(null);

      const result = checkAndResetCounterIfCleared(
        mockInputElement,
        'previous text',
        400,
        350,
      );

      expect(result).to.equal('');
    });
  });

  describe('createMutationObserverCallback', () => {
    it('should return a function', () => {
      const refs = {
        cleanupRef: { current: null },
        stateRef: { current: { previousInputValue: '' } },
      };

      const callback = createMutationObserverCallback(refs, 400, 350);

      expect(callback).to.be.a('function');
    });

    it('should setup character limit when input exists but counter does not', () => {
      const refs = {
        cleanupRef: { current: null },
        stateRef: { current: { previousInputValue: '' } },
      };
      mockInputElement.value = 'test';
      const mockFormElement = {
        parentElement: { insertBefore: sandbox.stub() },
      };
      const mockSendButton = {};

      setupQuerySelectorStub(sandbox, {
        inputElement: mockInputElement,
        formElement: mockFormElement,
        sendButton: mockSendButton,
      });
      sandbox.stub(document, 'createElement').returns(mockCounterElement);

      const callback = createMutationObserverCallback(refs, 400, 350);
      callback();

      expect(mockInputElement.setAttribute.calledWith('maxLength', '400')).to.be
        .true;
      expect(refs.stateRef.current.previousInputValue).to.equal('test');
      expect(refs.cleanupRef.current).to.be.a('function');
    });

    it('should call existing cleanup before setting up character limit', () => {
      const mockCleanup = sandbox.stub();
      const refs = {
        cleanupRef: { current: mockCleanup },
        stateRef: { current: { previousInputValue: '' } },
      };
      mockInputElement.value = 'test';
      const mockFormElement = {
        parentElement: { insertBefore: sandbox.stub() },
      };
      const mockSendButton = {};

      setupQuerySelectorStub(sandbox, {
        inputElement: mockInputElement,
        formElement: mockFormElement,
        sendButton: mockSendButton,
      });
      sandbox.stub(document, 'createElement').returns(mockCounterElement);

      const callback = createMutationObserverCallback(refs, 400, 350);
      callback();

      expect(mockCleanup.called).to.be.true;
      expect(mockInputElement.setAttribute.calledWith('maxLength', '400')).to.be
        .true;
    });

    it('should check and reset counter when input exists and counter exists', () => {
      const refs = {
        cleanupRef: { current: null },
        stateRef: { current: { previousInputValue: 'previous text' } },
      };
      mockInputElement.value = '';

      setupQuerySelectorStub(sandbox, {
        inputElement: mockInputElement,
        counterElement: mockCounterElement,
      });

      const callback = createMutationObserverCallback(refs, 400, 350);
      callback();

      expect(mockCounterElement.textContent).to.equal('400 characters left');
      expect(refs.stateRef.current.previousInputValue).to.equal('');
    });

    it('should do nothing when input does not exist', () => {
      const refs = {
        cleanupRef: { current: null },
        stateRef: { current: { previousInputValue: '' } },
      };

      sandbox.stub(document, 'querySelector').returns(null);

      const callback = createMutationObserverCallback(refs, 400, 350);
      callback();

      expect(mockInputElement.setAttribute.called).to.be.false;
      expect(refs.stateRef.current.previousInputValue).to.equal('');
    });
  });

  describe('useCharacterLimit', () => {
    let mockFormElement;
    let mockSendButton;
    let mockCounterParentElement;

    beforeEach(() => {
      mockFormElement = {
        parentElement: null,
      };
      mockSendButton = {};
      mockCounterParentElement = {
        insertBefore: sandbox.stub(),
      };
      mockFormElement.parentElement = mockCounterParentElement;
    });

    it('should enforce character limit when enabled', () => {
      sandbox
        .stub(document, 'querySelector')
        .onFirstCall()
        .returns(mockInputElement) // getInputElement
        .onSecondCall()
        .returns(null) // getCounterElement - counter doesn't exist
        .onThirdCall()
        .returns(mockFormElement) // form.webchat__send-box-text-box
        .onCall(3)
        .returns(mockSendButton) // button.webchat__send-button
        .onCall(4)
        .returns(null); // [data-testid="webchat"] - webchat container
      sandbox.stub(document, 'createElement').returns(mockCounterElement);

      renderHook(() => useCharacterLimit(true));

      expect(mockInputElement.setAttribute.calledWith('maxLength', '400')).to.be
        .true;
    });

    it('should do nothing when disabled', () => {
      const createElementStub = sandbox.stub(document, 'createElement');
      sandbox.stub(document, 'querySelector').returns(null);

      renderHook(() => useCharacterLimit(false));

      expect(mockInputElement.setAttribute.called).to.be.false;
      expect(createElementStub.called).to.be.false;
    });

    it('should cleanup on unmount', () => {
      setupQuerySelectorStub(sandbox, {
        inputElement: mockInputElement,
        formElement: mockFormElement,
        sendButton: mockSendButton,
        webchatContainer: document.body,
      });
      sandbox.stub(document, 'createElement').returns(mockCounterElement);
      mockCounterElement.parentElement = mockCounterParentElement;
      mockCounterParentElement.removeChild = sandbox.stub();

      const { unmount } = renderHook(() => useCharacterLimit(true));

      expect(mockInputElement.addEventListener.calledWith('input')).to.be.true;

      // Get the handler that was added
      const addEventListenerCalls = mockInputElement.addEventListener.getCalls();
      const inputHandler = addEventListenerCalls.find(
        call => call.args[0] === 'input',
      )?.args[1];

      unmount();

      expect(
        mockInputElement.removeEventListener.calledWith('input', inputHandler),
      ).to.be.true;
    });
  });
});
