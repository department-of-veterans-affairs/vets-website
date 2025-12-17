import { expect } from 'chai';
import sinon from 'sinon';
import { renderHook } from '@testing-library/react-hooks';
import useCharacterLimit, {
  getInputElement,
  getCounterElement,
  getSrElement,
  getCounterText,
  createCounterElements,
  updateCounter,
  setupCharacterLimit,
  checkAndResetCounterIfCleared,
  createMutationObserverCallback,
  CHARACTER_LIMIT,
  RED_THRESHOLD,
  SCREEN_READER_UPDATE_DELAY,
} from '../../hooks/useCharacterLimit';

function setupQuerySelectorStub(sandbox, options = {}) {
  const {
    inputElement = null,
    counterElement = null,
    formElement = null,
    sendButton = null,
    webchatContainer = null,
    srElement = null,
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
    if (selector === '#charcount-message') {
      return srElement;
    }
    return null;
  });
}

describe('useCharacterLimit', () => {
  let sandbox;
  let clock;
  let mockInputElement;
  let mockCounterElement;
  let mockSrElement;
  let mockParentElement;

  beforeEach(() => {
    sandbox = sinon.sandbox.create();
    clock = sinon.useFakeTimers({
      toFake: ['setTimeout', 'clearTimeout'],
    });

    mockInputElement = {
      value: '',
      setAttribute: sandbox.stub(),
      getAttribute: sandbox.stub(),
      removeAttribute: sandbox.stub(),
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

    mockSrElement = {
      textContent: '',
      id: '',
      className: '',
      setAttribute: sandbox.stub(),
      parentElement: null,
    };

    mockParentElement = {
      appendChild: sandbox.stub(),
      removeChild: sandbox.stub(),
    };

    mockInputElement.parentElement = mockParentElement;
  });

  afterEach(() => {
    sandbox.restore();
    clock.restore();
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

  describe('getSrElement', () => {
    it('should find screen reader element by id selector', () => {
      sandbox.stub(document, 'querySelector').returns(mockSrElement);

      const result = getSrElement();

      expect(result).to.equal(mockSrElement);
      expect(document.querySelector.calledWith('#charcount-message')).to.be
        .true;
    });

    it('should return null if screen reader element is not found', () => {
      sandbox.stub(document, 'querySelector').returns(null);

      const result = getSrElement();

      expect(result).to.be.null;
    });
  });

  describe('getCounterText', () => {
    it('should return "x characters allowed" when currentLength is 0', () => {
      const result = getCounterText(0, CHARACTER_LIMIT);

      expect(result).to.equal('400 characters allowed');
    });

    it('should return "x characters left" when currentLength is greater than 0', () => {
      const result = getCounterText(10, CHARACTER_LIMIT);

      expect(result).to.equal('390 characters left');
    });

    it('should calculate characters left correctly', () => {
      const result = getCounterText(50, CHARACTER_LIMIT);

      expect(result).to.equal('350 characters left');
    });

    it('should handle edge case when at limit', () => {
      const result = getCounterText(CHARACTER_LIMIT, CHARACTER_LIMIT);

      expect(result).to.equal('0 characters left');
    });

    it('should use singular "character" when exactly 1 character is left', () => {
      const result = getCounterText(CHARACTER_LIMIT - 1, CHARACTER_LIMIT);

      expect(result).to.equal('1 character left');
    });

    it('should use plural "characters" when more than 1 character is left', () => {
      const result = getCounterText(CHARACTER_LIMIT - 2, CHARACTER_LIMIT);

      expect(result).to.equal('2 characters left');
    });

    it('should work with different character limits', () => {
      const customLimit = 200;
      const result = getCounterText(50, customLimit);

      expect(result).to.equal('150 characters left');
    });
  });

  describe('updateCounter', () => {
    it('should update counter text with current length', () => {
      mockInputElement.value = 'test';

      updateCounter(
        mockCounterElement,
        mockSrElement,
        mockInputElement,
        CHARACTER_LIMIT,
        RED_THRESHOLD,
      );

      expect(mockCounterElement.textContent).to.equal('396 characters left');
      expect(mockSrElement.textContent).to.equal('396 characters left');
      expect(mockCounterElement.classList.add.called).to.be.false;
      expect(mockCounterElement.classList.remove.called).to.be.true;
    });

    it('should add warning class when near limit', () => {
      mockInputElement.value = 'a'.repeat(RED_THRESHOLD);

      updateCounter(
        mockCounterElement,
        mockSrElement,
        mockInputElement,
        CHARACTER_LIMIT,
        RED_THRESHOLD,
      );

      expect(mockCounterElement.textContent).to.equal('10 characters left');
      expect(mockSrElement.textContent).to.equal('10 characters left');
      expect(mockCounterElement.classList.add.calledWith('warning')).to.be.true;
    });

    it('should add warning class when at limit', () => {
      mockInputElement.value = 'a'.repeat(CHARACTER_LIMIT);

      updateCounter(
        mockCounterElement,
        mockSrElement,
        mockInputElement,
        CHARACTER_LIMIT,
        RED_THRESHOLD,
      );

      expect(mockCounterElement.textContent).to.equal('0 characters left');
      expect(mockSrElement.textContent).to.equal('0 characters left');
      expect(mockCounterElement.classList.add.calledWith('warning')).to.be.true;
    });

    it('should remove warning class when below threshold', () => {
      mockInputElement.value = 'a'.repeat(RED_THRESHOLD - 1);

      updateCounter(
        mockCounterElement,
        mockSrElement,
        mockInputElement,
        CHARACTER_LIMIT,
        RED_THRESHOLD,
      );

      expect(mockCounterElement.textContent).to.equal('11 characters left');
      expect(mockSrElement.textContent).to.equal('11 characters left');
      expect(mockCounterElement.classList.remove.calledWith('warning')).to.be
        .true;
    });

    it('should use singular "character" when exactly 1 character is left', () => {
      mockInputElement.value = 'a'.repeat(CHARACTER_LIMIT - 1);

      updateCounter(
        mockCounterElement,
        mockSrElement,
        mockInputElement,
        CHARACTER_LIMIT,
        RED_THRESHOLD,
      );

      expect(mockCounterElement.textContent).to.equal('1 character left');
      expect(mockSrElement.textContent).to.equal('1 character left');
    });
  });

  describe('createCounterElements', () => {
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
      sandbox
        .stub(document, 'querySelector')
        .onFirstCall()
        .returns(mockCounterElement)
        .onSecondCall()
        .returns(mockSrElement);

      const result = createCounterElements();

      expect(result.visibleElement).to.equal(mockCounterElement);
      expect(result.srElement).to.equal(mockSrElement);
      expect(createElementStub.called).to.be.false;
    });

    it('should create and insert counter element if it does not exist', () => {
      mockSrElement.id = '';
      mockSrElement.className = '';
      mockSrElement.setAttribute = sandbox.stub();
      sandbox
        .stub(document, 'querySelector')
        .onFirstCall()
        .returns(null) // getCounterElement - counter doesn't exist
        .onSecondCall()
        .returns(mockFormElement) // form.webchat__send-box-text-box
        .onThirdCall()
        .returns(mockSendButton); // button.webchat__send-button
      sandbox
        .stub(document, 'createElement')
        .onFirstCall()
        .returns(mockCounterElement) // visible element
        .onSecondCall()
        .returns(mockSrElement); // screen reader element
      mockCounterElement.id = '';

      const result = createCounterElements();

      expect(result.visibleElement).to.equal(mockCounterElement);
      expect(result.srElement).to.equal(mockSrElement);
      expect(document.createElement.calledWith('div')).to.be.true;
      expect(document.createElement.calledWith('span')).to.be.true;
      expect(mockCounterElement.className).to.equal(
        'webchat-character-counter',
      );
      expect(mockCounterElement.setAttribute.calledWith('aria-hidden', 'true'))
        .to.be.true;
      expect(mockSrElement.id).to.equal('charcount-message');
      expect(mockSrElement.className).to.equal('sr-only');
      expect(mockSrElement.setAttribute.calledWith('aria-live', 'polite')).to.be
        .true;
      expect(mockSrElement.setAttribute.calledWith('aria-atomic', 'true')).to.be
        .true;
      expect(
        mockCounterParentElement.insertBefore.calledWith(
          mockCounterElement,
          mockSendButton,
        ),
      ).to.be.true;
      expect(
        mockCounterParentElement.insertBefore.calledWith(
          mockSrElement,
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

      const result = setupCharacterLimit(CHARACTER_LIMIT, RED_THRESHOLD);

      expect(result).to.be.undefined;
    });

    it('should set maxLength attribute on input element', () => {
      setupQuerySelectorStub(sandbox, {
        inputElement: mockInputElement,
        formElement: mockFormElement,
        sendButton: mockSendButton,
      });
      sandbox.stub(document, 'createElement').returns(mockCounterElement);

      setupCharacterLimit(CHARACTER_LIMIT, RED_THRESHOLD);

      expect(
        mockInputElement.setAttribute.calledWith(
          'maxLength',
          CHARACTER_LIMIT.toString(),
        ),
      ).to.be.true;
    });

    it('should create counter element', () => {
      setupQuerySelectorStub(sandbox, {
        inputElement: mockInputElement,
        formElement: mockFormElement,
        sendButton: mockSendButton,
      });
      sandbox.stub(document, 'createElement').returns(mockCounterElement);
      mockInputElement.getAttribute.returns(null);

      setupCharacterLimit(CHARACTER_LIMIT, RED_THRESHOLD);

      expect(document.createElement.calledWith('div')).to.be.true;
    });

    it('should set aria-describedby on input element', () => {
      setupQuerySelectorStub(sandbox, {
        inputElement: mockInputElement,
        formElement: mockFormElement,
        sendButton: mockSendButton,
      });
      sandbox.stub(document, 'createElement').returns(mockCounterElement);
      mockInputElement.getAttribute.returns(null);
      mockCounterElement.id = 'charcount-message';

      setupCharacterLimit(CHARACTER_LIMIT, RED_THRESHOLD);

      expect(mockInputElement.getAttribute.calledWith('aria-describedby')).to.be
        .true;
      expect(
        mockInputElement.setAttribute.calledWith(
          'aria-describedby',
          'charcount-message',
        ),
      ).to.be.true;
    });

    it('should append to existing aria-describedby on input element', () => {
      setupQuerySelectorStub(sandbox, {
        inputElement: mockInputElement,
        formElement: mockFormElement,
        sendButton: mockSendButton,
      });
      sandbox.stub(document, 'createElement').returns(mockCounterElement);
      mockInputElement.getAttribute.returns('input-message');
      mockCounterElement.id = 'charcount-message';

      setupCharacterLimit(CHARACTER_LIMIT, RED_THRESHOLD);

      expect(
        mockInputElement.setAttribute.calledWith(
          'aria-describedby',
          'input-message charcount-message',
        ),
      ).to.be.true;
    });

    it('should add input event listener', () => {
      setupQuerySelectorStub(sandbox, {
        inputElement: mockInputElement,
        formElement: mockFormElement,
        sendButton: mockSendButton,
      });
      sandbox.stub(document, 'createElement').returns(mockCounterElement);

      setupCharacterLimit(CHARACTER_LIMIT, RED_THRESHOLD);

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

      setupCharacterLimit(CHARACTER_LIMIT, RED_THRESHOLD);

      const addEventListenerCalls = mockInputElement.addEventListener.getCalls();
      const inputHandler = addEventListenerCalls.find(
        call => call.args[0] === 'input',
      )?.args[1];

      mockCounterElement.textContent = 'initial';

      inputHandler();

      expect(mockCounterElement.textContent).to.equal('396 characters left');
    });

    it('should clear pending timeout when new input event occurs', () => {
      setupQuerySelectorStub(sandbox, {
        inputElement: mockInputElement,
        formElement: mockFormElement,
        sendButton: mockSendButton,
      });
      sandbox
        .stub(document, 'createElement')
        .onFirstCall()
        .returns(mockCounterElement)
        .onSecondCall()
        .returns(mockSrElement);
      mockInputElement.value = 'test';
      mockInputElement.getAttribute.returns(null);
      const clearTimeoutStub = sandbox.stub(global, 'clearTimeout');

      setupCharacterLimit(CHARACTER_LIMIT, RED_THRESHOLD);

      const addEventListenerCalls = mockInputElement.addEventListener.getCalls();
      const inputHandler = addEventListenerCalls.find(
        call => call.args[0] === 'input',
      )?.args[1];

      inputHandler();
      expect(clearTimeoutStub.called).to.be.false;

      inputHandler();
      expect(clearTimeoutStub.called).to.be.true;
    });

    it('should add warning class when input is near limit', () => {
      setupQuerySelectorStub(sandbox, {
        inputElement: mockInputElement,
        formElement: mockFormElement,
        sendButton: mockSendButton,
      });
      sandbox
        .stub(document, 'createElement')
        .onFirstCall()
        .returns(mockCounterElement)
        .onSecondCall()
        .returns(mockSrElement);
      mockInputElement.value = 'a'.repeat(RED_THRESHOLD);
      mockInputElement.getAttribute.returns(null);

      setupCharacterLimit(CHARACTER_LIMIT, RED_THRESHOLD);

      const addEventListenerCalls = mockInputElement.addEventListener.getCalls();
      const inputHandler = addEventListenerCalls.find(
        call => call.args[0] === 'input',
      )?.args[1];

      inputHandler();

      expect(mockCounterElement.classList.add.calledWith('warning')).to.be.true;
    });

    it('should update screen reader element after delay', () => {
      setupQuerySelectorStub(sandbox, {
        inputElement: mockInputElement,
        formElement: mockFormElement,
        sendButton: mockSendButton,
      });
      sandbox
        .stub(document, 'createElement')
        .onFirstCall()
        .returns(mockCounterElement)
        .onSecondCall()
        .returns(mockSrElement);
      mockInputElement.value = 'test';
      mockInputElement.getAttribute.returns(null);

      setupCharacterLimit(CHARACTER_LIMIT, RED_THRESHOLD);

      expect(mockSrElement.textContent).to.equal('396 characters left');

      const addEventListenerCalls = mockInputElement.addEventListener.getCalls();
      const inputHandler = addEventListenerCalls.find(
        call => call.args[0] === 'input',
      )?.args[1];

      mockInputElement.value = 'test123';
      mockSrElement.textContent = 'initial';

      inputHandler();

      // Verify visible element is updated immediately
      expect(mockCounterElement.textContent).to.equal('393 characters left');
      expect(mockSrElement.textContent).to.equal('initial');

      // Verify visible element is updated after the delay
      clock.tick(SCREEN_READER_UPDATE_DELAY);
      expect(mockSrElement.textContent).to.equal('393 characters left');
    });

    it('should clear pending timeout on cleanup', () => {
      setupQuerySelectorStub(sandbox, {
        inputElement: mockInputElement,
        formElement: mockFormElement,
        sendButton: mockSendButton,
      });
      sandbox
        .stub(document, 'createElement')
        .onFirstCall()
        .returns(mockCounterElement)
        .onSecondCall()
        .returns(mockSrElement);
      mockCounterElement.parentElement = mockCounterParentElement;
      mockSrElement.parentElement = mockCounterParentElement;
      mockCounterParentElement.removeChild = sandbox.stub();
      mockInputElement.getAttribute.returns(null);
      const clearTimeoutStub = sandbox.stub(global, 'clearTimeout');

      const cleanup = setupCharacterLimit(CHARACTER_LIMIT, RED_THRESHOLD);

      const addEventListenerCalls = mockInputElement.addEventListener.getCalls();
      const inputHandler = addEventListenerCalls.find(
        call => call.args[0] === 'input',
      )?.args[1];
      inputHandler();

      clearTimeoutStub.resetHistory();

      cleanup();

      expect(clearTimeoutStub.called).to.be.true;
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
      mockInputElement.getAttribute.returns(null);

      const cleanup = setupCharacterLimit(CHARACTER_LIMIT, RED_THRESHOLD);

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
      mockInputElement.getAttribute.returns(null);

      const cleanup = setupCharacterLimit(CHARACTER_LIMIT, RED_THRESHOLD);

      cleanup();

      expect(
        mockCounterParentElement.removeChild.calledWith(mockCounterElement),
      ).to.be.true;
    });

    it('should remove counter ID from aria-describedby on cleanup', () => {
      setupQuerySelectorStub(sandbox, {
        inputElement: mockInputElement,
        formElement: mockFormElement,
        sendButton: mockSendButton,
      });
      sandbox.stub(document, 'createElement').returns(mockCounterElement);
      mockCounterElement.parentElement = mockCounterParentElement;
      mockCounterParentElement.removeChild = sandbox.stub();
      mockCounterElement.id = 'charcount-message';
      mockInputElement.getAttribute
        .onFirstCall()
        .returns(null)
        .onSecondCall()
        .returns('charcount-message');

      const cleanup = setupCharacterLimit(CHARACTER_LIMIT, RED_THRESHOLD);

      cleanup();

      expect(mockInputElement.removeAttribute.calledWith('aria-describedby')).to
        .be.true;
    });

    it('should preserve other IDs in aria-describedby on cleanup', () => {
      setupQuerySelectorStub(sandbox, {
        inputElement: mockInputElement,
        formElement: mockFormElement,
        sendButton: mockSendButton,
      });
      sandbox.stub(document, 'createElement').returns(mockCounterElement);
      mockCounterElement.parentElement = mockCounterParentElement;
      mockCounterParentElement.removeChild = sandbox.stub();
      mockCounterElement.id = 'charcount-message';
      mockInputElement.getAttribute
        .onFirstCall()
        .returns('input-message')
        .onSecondCall()
        .returns('input-message charcount-message');

      const cleanup = setupCharacterLimit(CHARACTER_LIMIT, RED_THRESHOLD);

      cleanup();

      expect(
        mockInputElement.setAttribute.calledWith(
          'aria-describedby',
          'input-message',
        ),
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
        CHARACTER_LIMIT,
        RED_THRESHOLD,
      );

      expect(result).to.equal('');
      expect(mockCounterElement.textContent).to.equal(
        `${CHARACTER_LIMIT} characters allowed`,
      );
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
        CHARACTER_LIMIT,
        RED_THRESHOLD,
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
        CHARACTER_LIMIT,
        RED_THRESHOLD,
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
        CHARACTER_LIMIT,
        RED_THRESHOLD,
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

      const callback = createMutationObserverCallback(
        refs,
        CHARACTER_LIMIT,
        RED_THRESHOLD,
      );

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

      const callback = createMutationObserverCallback(
        refs,
        CHARACTER_LIMIT,
        RED_THRESHOLD,
      );
      callback();

      expect(
        mockInputElement.setAttribute.calledWith(
          'maxLength',
          CHARACTER_LIMIT.toString(),
        ),
      ).to.be.true;
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

      const callback = createMutationObserverCallback(
        refs,
        CHARACTER_LIMIT,
        RED_THRESHOLD,
      );
      callback();

      expect(mockCleanup.called).to.be.true;
      expect(
        mockInputElement.setAttribute.calledWith(
          'maxLength',
          CHARACTER_LIMIT.toString(),
        ),
      ).to.be.true;
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
        srElement: mockSrElement,
      });

      const callback = createMutationObserverCallback(
        refs,
        CHARACTER_LIMIT,
        RED_THRESHOLD,
      );
      callback();

      expect(mockCounterElement.textContent).to.equal(
        `${CHARACTER_LIMIT} characters allowed`,
      );
      expect(mockSrElement.textContent).to.equal(
        `${CHARACTER_LIMIT} characters allowed`,
      );
      expect(refs.stateRef.current.previousInputValue).to.equal('');
    });

    it('should do nothing when input does not exist', () => {
      const refs = {
        cleanupRef: { current: null },
        stateRef: { current: { previousInputValue: '' } },
      };

      sandbox.stub(document, 'querySelector').returns(null);

      const callback = createMutationObserverCallback(
        refs,
        CHARACTER_LIMIT,
        RED_THRESHOLD,
      );
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

      expect(
        mockInputElement.setAttribute.calledWith(
          'maxLength',
          CHARACTER_LIMIT.toString(),
        ),
      ).to.be.true;
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
        webchatContainer: document.body,
      });
      sandbox.stub(document, 'createElement').returns(mockCounterElement);
      mockCounterElement.parentElement = mockCounterParentElement;
      mockCounterParentElement.removeChild = sandbox.stub();
      mockInputElement.getAttribute.returns(null);

      const { unmount } = renderHook(() => useCharacterLimit(true));

      expect(mockInputElement.addEventListener.calledWith('input')).to.be.true;

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
