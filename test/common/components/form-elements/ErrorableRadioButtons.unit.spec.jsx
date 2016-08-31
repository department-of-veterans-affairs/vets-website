import React from 'react';
import ReactTestUtils from 'react-addons-test-utils';
import SkinDeep from 'skin-deep';
import { expect } from 'chai';

import ErrorableRadioButtons from '../../../../src/js/common/components/form-elements/ErrorableRadioButtons';
import RadioButtonsSubSection from '../../../../src/js/common/components/form-elements/RadioButtonsSubSection';
import { makeField } from '../../../../src/js/common/model/fields';

describe('<ErrorableRadioButtons>', () => {
  const options = [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }];

  it('ensure value changes propagate', (done) => {
    let myRadioButtons;

    const updatePromise = new Promise((resolve, _reject) => {
      myRadioButtons = ReactTestUtils.renderIntoDocument(
        <ErrorableRadioButtons label="test" options={options} value={makeField('test')} onValueChange={(update) => { resolve(update); }}/>
      );
      done();
    });

    const inputs = ReactTestUtils.scryRenderedDOMComponentsWithTag(myRadioButtons, 'input');
    ReactTestUtils.Simulate.click(inputs[0]);

    return expect(updatePromise).to.eventually.eql('Yes');
  });

  it('label attribute propagates', () => {
    const tree = SkinDeep.shallowRender(
      <ErrorableRadioButtons label="my label" options={options} value={makeField('test')} onValueChange={(_update) => {}}/>);

    // Ensure label text is correct.
    const labels = tree.everySubTree('label');
    expect(labels).to.have.lengthOf(3);
    expect(labels[0].text()).to.equal('my label');

    // Ensure label htmlFor is attached to label id.
    const inputs = tree.everySubTree('input');
    expect(inputs).to.have.lengthOf(2);
    expect(inputs[0].props.id).to.not.be.undefined;
    expect(inputs[0].props.id).to.equal(labels[1].props.htmlFor);
  });

  it('should render a subsection', () => {
    const optionsSub = [
      {
        value: 'test',
        label: 'Test'
      },
      {
        value: 'test2',
        label: 'Test2'
      }
    ];
    const tree = SkinDeep.shallowRender(
      <ErrorableRadioButtons
          label="my label"
          options={optionsSub}
          value={makeField('test')}
          onValueChange={(_update) => {}}>
        <RadioButtonsSubSection showIfValueChosen="test"/>
        <RadioButtonsSubSection showIfValueChosen="test2"/>
      </ErrorableRadioButtons>
      );

    expect(tree.everySubTree('RadioButtonsSubSection').length).to.equal(1);
  });
  it('should not render a subsection if not selected', () => {
    const optionsSub = [
      {
        value: 'test',
        label: 'Test'
      },
      {
        value: 'test2',
        label: 'Test2'
      }
    ];
    const tree = SkinDeep.shallowRender(
      <ErrorableRadioButtons
          label="my label"
          options={optionsSub}
          value={makeField('test')}
          onValueChange={(_update) => {}}>
        <RadioButtonsSubSection showIfValueChosen="test2"/>
      </ErrorableRadioButtons>
      );

    expect(tree.everySubTree('RadioButtonsSubSection').length).to.equal(0);
  });
});
