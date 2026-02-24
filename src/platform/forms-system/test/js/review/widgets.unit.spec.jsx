import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';

import {
  CheckboxWidget,
  TextWidget,
  DateWidget,
  SelectWidget,
  yesNo,
} from '../../../src/js/review/widgets';

describe('Schemaform review widgets', () => {
  describe('<CheckboxWidget>', () => {
    it('should render', () => {
      const { container } = render(<CheckboxWidget value />);

      expect(container.textContent).to.equal('Selected');
    });
    it('should render empty for false', () => {
      const { container } = render(<CheckboxWidget />);

      expect(container.textContent).to.equal('');
    });
    it('should render custom value for true', () => {
      const { container } = render(
        <CheckboxWidget value schema={{ enumNames: ['Yes!'] }} />,
      );

      expect(container.textContent).to.equal('Yes!');
    });
    it('should render custom value for false', () => {
      const { container } = render(
        <CheckboxWidget schema={{ enumNames: ['Yes', 'Nope'] }} />,
      );

      expect(container.textContent).to.equal('Nope');
    });
  });
  describe('<TextWidget>', () => {
    it('should render', () => {
      const { container } = render(<TextWidget value="Testing" />);

      expect(container.textContent).to.equal('Testing');
    });
  });
  describe('<DateWidget>', () => {
    it('should render', () => {
      const { container } = render(
        <DateWidget value="2010-01-02" options={{}} />,
      );

      expect(container.textContent).to.equal('01/02/2010');
    });
    it('should render month year', () => {
      const { container } = render(
        <DateWidget value="2010-01-02" options={{ monthYear: true }} />,
      );

      expect(container.textContent).to.equal('01/2010');
    });
  });
  describe('<SelectWidget>', () => {
    it('should render', () => {
      const enumOptions = [
        {
          value: 'Test',
          label: 'Label',
        },
      ];
      const { container } = render(
        <SelectWidget options={{ enumOptions }} value="Test" />,
      );

      expect(container.textContent).to.equal('Label');
    });
    it('should render empty', () => {
      const enumOptions = [
        {
          value: 'Test',
          label: 'Label',
        },
      ];
      const { container } = render(
        <SelectWidget options={{ enumOptions }} value="" />,
      );

      expect(container.textContent).to.be.empty;
    });
    it('should render label from options', () => {
      const enumOptions = [
        {
          value: 'Test',
          label: 'Label',
        },
      ];

      const labels = {
        Test: 'Other',
      };
      const { container } = render(
        <SelectWidget options={{ enumOptions, labels }} value="Test" />,
      );

      expect(container.textContent).to.equal('Other');
    });
  });
  describe('<yesNo>', () => {
    it('should render true', () => {
      const YesNo = yesNo;
      const { container } = render(<YesNo value />);

      expect(container.textContent).to.equal('Yes');
    });
    it('should render false', () => {
      const YesNo = yesNo;
      const { container } = render(<YesNo value={false} />);

      expect(container.textContent).to.equal('No');
    });
    it('should render undefined', () => {
      const YesNo = yesNo;
      const { container } = render(<YesNo />);

      expect(container.textContent).to.be.empty;
    });
    it('should render labels', () => {
      const YesNo = yesNo;
      const { container } = render(
        <YesNo
          value
          options={{
            labels: {
              Y: 'Whatever',
            },
          }}
        />,
      );

      expect(container.textContent).to.equal('Whatever');
    });
    it('should render reversed', () => {
      const YesNo = yesNo;
      const { container } = render(
        <YesNo
          value={false}
          options={{
            yesNoReverse: true,
          }}
        />,
      );

      expect(container.textContent).to.equal('Yes');
    });
  });
});
