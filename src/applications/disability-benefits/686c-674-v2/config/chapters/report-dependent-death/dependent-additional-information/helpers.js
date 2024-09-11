import React from 'react';
import { capitalize } from 'lodash';

export const relationshipEnums = ['spouse', 'parent', 'child'];
export const relationshipLabels = {
  spouse: 'Spouse',
  parent: 'Dependent parent',
  child: 'Child',
};

export const childTypeEnums = [
  'childUnder18',
  'stepChild',
  'adopted',
  'disabled',
  'childOver18InSchool',
];
export const childTypeLabels = {
  childUnder18: 'Child under 18',
  stepChild: 'Stepchild',
  adopted: 'Adopted child',
  disabled: 'Child incapable of self-support',
  childOver18InSchool: 'Child 18-23 and in school',
};

export const DependentNameHeader = ({ formData }) => {
  const { first, last } = formData.fullName;
  return (
    <div>
      <p className="vads-u-font-weight--bold vads-u-font-size--h3 vads-u-border-bottom--2px vads-u-border-color--primary vads-u-font-family--serif">
        {first[0].toUpperCase()}
        {first.slice(1).toLowerCase()} {last[0].toUpperCase()}
        {last.slice(1).toLowerCase()}
      </p>
    </div>
  );
};

export const DependentRelationshipH3 = ({ formData }) => {
  const { first, last } = formData.fullName;

  return (
    <legend className="schemaform-block-title" id="root__title">
      <h3 className="vads-u-color--black vads-u-margin-top--0">
        Your relationship to {capitalize(first)} {capitalize(last)}
      </h3>
    </legend>
  );
};

export const DependentDeceasedWhenH3 = ({ formData }) => {
  const { first, last } = formData.fullName;

  return (
    <legend className="schemaform-block-title" id="root__title">
      <h3 className="vads-u-color--black vads-u-margin-top--0">
        When did {capitalize(first)} {capitalize(last)} die?
      </h3>
    </legend>
  );
};

export const DependentDeceasedWhereH3 = ({ formData }) => {
  const { first, last } = formData.fullName;

  return (
    <legend className="schemaform-block-title" id="root__title">
      <h3 className="vads-u-color--black vads-u-margin-top--0">
        Where did {capitalize(first)} {capitalize(last)} die?
      </h3>
    </legend>
  );
};
