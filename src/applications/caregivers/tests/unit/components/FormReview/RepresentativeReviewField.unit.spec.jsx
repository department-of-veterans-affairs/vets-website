import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
<<<<<<< HEAD

=======
>>>>>>> main
import RepresentativeReviewField from '../../../../components/FormReview/RepresentativeReviewField';
import content from '../../../../locales/en/content.json';

describe('CG <RepresentativeReviewField>', () => {
<<<<<<< HEAD
  const getData = ({ formData = undefined }) => ({
    props: {
      uiSchema: { 'ui:title': 'Review Field Title' },
      formData,
    },
  });
  const subject = ({ props }) => {
=======
  const uiTitle = 'Review Field Title';
  const subject = ({ formData = undefined } = {}) => {
    const props = {
      uiSchema: { 'ui:title': uiTitle },
      formData,
    };
>>>>>>> main
    const { container } = render(
      <RepresentativeReviewField>
        <div {...props} />
      </RepresentativeReviewField>,
    );
    const selectors = () => ({
      title: container.querySelector('dt', '.review-row'),
      value: container.querySelector('dd', '.review-row'),
    });
<<<<<<< HEAD
    return { container, selectors };
  };

  context('when the component renders with value of `yes`', () => {
    it('should render the correct field title & value text', () => {
      const { props } = getData({ formData: 'yes' });
      const { selectors } = subject({ props });
      expect(selectors().title).to.contain.text(props.uiSchema['ui:title']);
      expect(selectors().value).to.contain.text(
        content['sign-as-rep-yes-text'],
      );
    });
  });

  context('when the component renders with value of `no`', () => {
    it('should render the correct field title & value text', () => {
      const { props } = getData({ formData: 'no' });
      const { selectors } = subject({ props });
      expect(selectors().title).to.contain.text(props.uiSchema['ui:title']);
      expect(selectors().value).to.contain.text(content['sign-as-rep-no-text']);
    });
  });

  context('when the component renders with value of `undefined`', () => {
    it('should render the correct field title & value text', () => {
      const { props } = getData({});
      const { selectors } = subject({ props });
      expect(selectors().title).to.contain.text(props.uiSchema['ui:title']);
      expect(selectors().value).to.contain.text(content['sign-as-rep-no-text']);
    });
=======
    return { selectors };
  };

  it('should render the correct field title & value text when the component renders with value of `yes`', () => {
    const { selectors } = subject({ formData: 'yes' });
    const { title, value } = selectors();
    expect(title).to.contain.text(uiTitle);
    expect(value).to.contain.text(content['sign-as-rep-yes-text']);
  });

  it('should render the correct field title & value text when the component renders with value of `no`', () => {
    const { selectors } = subject({ formData: 'no' });
    const { title, value } = selectors();
    expect(title).to.contain.text(uiTitle);
    expect(value).to.contain.text(content['sign-as-rep-no-text']);
  });

  it('should render the correct field title & value text when the component renders with value of `undefined`', () => {
    const { selectors } = subject();
    const { title, value } = selectors();
    expect(title).to.contain.text(uiTitle);
    expect(value).to.contain.text(content['sign-as-rep-no-text']);
>>>>>>> main
  });
});
