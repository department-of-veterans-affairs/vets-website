import React from 'react';
import { Provider } from 'react-redux';
import { expect } from 'chai';
import { fireEvent, waitFor, render } from '@testing-library/react';
import sinon from 'sinon-v20';
import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';
import { $, $$ } from 'platform/forms-system/src/js/utilities/ui';
import formConfig from '../../config/form';
import { EVIDENCE_VA } from '../../constants';
import { title } from '../../pages/evidenceVaPrompt';
import errorMessages from '../../../shared/content/errorMessages';

const mockStore = () => ({
  getState: () => ({
    form: { data: {} },
  }),
  subscribe: () => {},
  dispatch: () => {},
});

const {
  schema,
  uiSchema,
} = formConfig.chapters.evidence.pages.evidenceVaPrompt;

describe('VA evidence request page', () => {
  let onSubmit;

  beforeEach(() => {
    onSubmit = sinon.spy();
  });

  afterEach(() => {
    sinon.restore();
  });

  const renderContainer = (data = {}, formData = {}) => {
    return render(
      <Provider store={mockStore()}>
        <DefinitionTester
          definitions={{}}
          schema={schema}
          uiSchema={uiSchema}
          data={data}
          formData={formData}
          onSubmit={onSubmit}
        />
      </Provider>,
    );
  };

  describe('initial render', () => {
    it('should render with correct contents', () => {
      const { container } = renderContainer();
      const radio = $('va-radio', container);
      const options = $$('va-radio-option', container);
      const errorElements = $$('[error]', container);

      expect(radio).to.exist;
      expect(radio.getAttribute('label')).to.eq(title);
      expect(options.length).to.eq(2);
      expect(errorElements.length).to.eq(0);
    });

    it('should have no option selected by default', () => {
      const { container } = renderContainer();
      const checkedOptions = $$('va-radio-option[checked="true"]', container);

      expect(checkedOptions.length).to.eq(0);
    });
  });

  describe('validation', () => {
    it('should not allow submit with radios unselected (required)', async () => {
      const { container } = renderContainer();
      fireEvent.submit($('form', container));

      await waitFor(() => {
        const radios = $$('[error]', container);

        expect(radios.length).to.equal(1);
        expect(radios[0].getAttribute('error')).to.eq(
          errorMessages.requiredYesNo,
        );
        expect(onSubmit.called).to.be.false;
      });
    });

    it('should clear error when option is selected after validation error', async () => {
      const { container } = renderContainer();

      fireEvent.submit($('form', container));

      await waitFor(() => {
        expect($$('[error]', container).length).to.equal(1);
      });

      const radio = $('va-radio', container);
      radio.__events.vaValueChange({
        detail: { value: 'Y' },
      });

      await waitFor(() => {
        expect($('[error]', container)).to.not.exist;
      });
    });
  });

  describe('submit behavior', () => {
    it('should allow submit with an option selected', () => {
      const { container } = renderContainer({ [EVIDENCE_VA]: true });

      fireEvent.submit($('form', container));

      expect(container.innerHTML).to.contain('value="Y" checked="true"');
      expect($('[error]', container)).to.not.exist;
      expect(onSubmit.called).to.be.true;
    });
  });

  describe('form data persistence', () => {
    it('should render with previously saved data', () => {
      const savedData = { [EVIDENCE_VA]: false };
      const { container } = renderContainer(savedData, savedData);

      expect(container.innerHTML).to.contain('value="N" checked');
    });
  });

  describe('error messaging', () => {
    it('should show error message when validation fails', async () => {
      const { container } = renderContainer();
      fireEvent.submit($('form', container));

      await waitFor(() => {
        const radioWithError = $('[error]', container);

        expect(radioWithError).to.exist;
        expect(radioWithError.getAttribute('error')).to.contain(
          'You must answer yes or no',
        );
      });
    });
  });
});
