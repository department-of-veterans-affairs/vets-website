import React from 'react';
import { expect } from 'chai';
import SkinDeep from 'skin-deep';

import ScheduleTimesReviewField from '../../containers/ScheduleTimesReviewField';
import {
  InformalConferenceAvailability,
  InformalConferenceTimeLabels,
} from '../../content/InformalConference';

// checkbox groups output some weird data
const Element = (name, formData) => (
  <div
    {...{
      name,
      formData,
    }}
  />
);
const uiSchema = informalConferenceChoice => ({
  'ui:options': {
    informalConferenceChoice,
  },
});

const text = value =>
  InformalConferenceAvailability(value).props.children.join('');
const time = value => InformalConferenceTimeLabels(value).props.children;

describe('Schemaform <ScheduleTimesReviewField>', () => {
  it('should not render an empty time slot', () => {
    const person = 'me';
    const slot = 'time0800to1000';
    const tree = SkinDeep.shallowRender(
      <ScheduleTimesReviewField uiSchema={uiSchema(person)}>
        <Element name={slot} formData={false} />
      </ScheduleTimesReviewField>,
    );
    expect(tree.subTree('dt')).to.be.false;
    expect(tree.subTree('dd')).to.be.false;
  });
  it('should render contact "me" label', () => {
    const person = 'me';
    const slot = 'time0800to1000';
    const tree = SkinDeep.shallowRender(
      <ScheduleTimesReviewField uiSchema={uiSchema(person)}>
        <Element name={slot} formData />
      </ScheduleTimesReviewField>,
    );
    expect(tree.subTree('dt').text()).to.equal(text(person));
    expect(tree.subTree('dd').text()).to.equal(time(slot));
  });
  it('should render contact "rep" label"', () => {
    const person = 'rep';
    const slot = 'time1230to1400';
    const tree = SkinDeep.shallowRender(
      <ScheduleTimesReviewField uiSchema={uiSchema(person)}>
        <Element name={slot} formData />
      </ScheduleTimesReviewField>,
    );
    expect(tree.subTree('dt').text()).to.equal(text(person));
    expect(tree.subTree('dd').text()).to.equal(time(slot));
  });
});
