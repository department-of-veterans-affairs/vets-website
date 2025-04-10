import { expect } from 'chai';
import sinon from 'sinon';
import { suppliesUi } from '../../utils/helpers';

describe('suppliesUi', () => {
  it('calls checkboxGroupUI to define the form UI', () => {
    const checkboxGroupUI = sinon.spy();
    const props = {
      title: 'A title',
      tile: false,
      description: 'A description',
      hint: 'A hint',
      replaceSchema: () => {},
      updateUiSchema: () => {},
      checkboxGroupUI,
    };
    suppliesUi(props);
    delete props.checkboxGroupUI;
    expect(checkboxGroupUI.calledOnce).to.be.true;
    const extraProps = { labels: {}, required: false };
    expect(checkboxGroupUI.calledWith({ ...props, ...extraProps })).to.be.true;
  });
});
