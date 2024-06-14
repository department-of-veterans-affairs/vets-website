import React from 'react';
import { expect } from 'chai';
import SkinDeep from 'skin-deep';

import { FormApp } from '../../../src/js/containers/FormApp';

const shallowFormApp = ({ formConfig, currentLocation, formData = null }) => {
  const routes = [{ pageList: [{ path: currentLocation.pathname }] }];
  return SkinDeep.shallowRender(
    <FormApp
      formConfig={formConfig}
      routes={routes}
      currentLocation={currentLocation}
      formData={formData}
    >
      <div className="child" />
    </FormApp>,
  );
};

describe('Schemaform <FormApp>', () => {
  it('should render children on intro page, but not form title or nav', () => {
    const formConfig = {};
    const currentLocation = {
      pathname: 'introduction',
      search: '',
    };
    const tree = shallowFormApp({ formConfig, currentLocation });

    expect(tree.everySubTree('.child')).not.to.be.empty;
    expect(tree.everySubTree('FormNav')).to.be.empty;
    expect(tree.everySubTree('FormTitle')).to.be.empty;
  });

  it('should show nav when the form is in progress', () => {
    const formConfig = {};
    const currentLocation = {
      pathname: '/veteran-information/personal-information',
      search: '',
    };
    const tree = shallowFormApp({ formConfig, currentLocation });

    expect(tree.everySubTree('.child')).not.to.be.empty;
    expect(tree.everySubTree('FormNav')).not.to.be.empty;
  });

  it('should show dynamic title', () => {
    const titles = ['Main title', 'Alternate title'];
    const formData = { test: false };
    const formConfig = {
      title: props => titles[props.formData.test ? 1 : 0],
    };
    const currentLocation = {
      pathname: '/veteran-information/personal-information',
      search: '',
    };

    const tree = shallowFormApp({ formConfig, currentLocation, formData });

    expect(tree.everySubTree('FormTitle')[0].props.title).to.equal(titles[0]);
    formData.test = true;
    tree.reRender({ formData, currentLocation, formConfig });
    expect(tree.everySubTree('FormTitle')[0].props.title).to.equal(titles[1]);
  });

  it('should show dynamic subTitle', () => {
    const subTitles = ['Main subTitle', 'Alternate subTitle'];
    const formData = { test: false };
    const formConfig = {
      title: 'Test',
      subTitle: props => subTitles[props.formData.test ? 1 : 0],
    };
    const currentLocation = {
      pathname: '/veteran-information/personal-information',
      search: '',
    };

    const tree = shallowFormApp({ formConfig, currentLocation, formData });

    expect(tree.everySubTree('FormTitle')[0].props.subTitle).to.equal(
      subTitles[0],
    );
    formData.test = true;
    tree.reRender({ formData, currentLocation, formConfig });
    expect(tree.everySubTree('FormTitle')[0].props.subTitle).to.equal(
      subTitles[1],
    );
  });

  it('should hide title, nav and layout classes when formOptions are set', () => {
    const formConfig = {
      formOptions: { noTitle: true, noTopNav: true, fullWidth: true },
    };
    const currentLocation = {
      pathname: '/veteran-information/personal-information',
      search: '',
    };
    const tree = shallowFormApp({ formConfig, currentLocation });

    expect(tree.everySubTree('.child')).not.to.be.empty;
    expect(tree.everySubTree('FormTitle')).to.be.empty;
    expect(tree.everySubTree('.row')).to.be.empty;
    expect(tree.everySubTree('.usa-width-two-thirds')).to.be.empty;
  });

  describe('hiding and displaying form title', () => {
    const mockPage = path => ({
      firstPage: { path, schema: { type: 'object', properties: {} } },
    });
    const formConfig = {
      title: 'Form Title',
      subTitle: 'Form Subtitle',
      chapters: {
        formTitleHiddenChapter: {
          title: 'Form Title Hidden',
          hideFormTitle: true,
          pages: mockPage('/form-title-hidden'),
        },
        formTitleExplicitlyDisplayedChapter: {
          title: 'Form Title Explicitly Displayed',
          hideFormTitle: false,
          pages: mockPage('/form-title-explicitly-displayed'),
        },
        formTitleImplictlyDisplayedChapter: {
          title: 'Form Title Implicitly Displayed',
          pages: mockPage('/form-title-implicitly-displayed'),
        },
      },
    };

    describe('when on a page where form title is hidden', () => {
      it('hides the form title', () => {
        const currentLocation = {
          pathname: '/form-title-hidden',
          search: '',
        };
        const tree = shallowFormApp({ formConfig, currentLocation });

        expect(tree.everySubTree('FormTitle')).to.be.empty;
      });
    });

    describe('when on a page where form title is explicitly displayed', () => {
      it('displays the form title', () => {
        const currentLocation = {
          pathname: '/form-title-explicitly-displayed',
          search: '',
        };
        const tree = shallowFormApp({ formConfig, currentLocation });

        expect(tree.everySubTree('FormTitle')).not.to.be.empty;
      });
    });

    describe('when on a page where form title is implicitly displayed', () => {
      it('displays the form title', () => {
        const currentLocation = {
          pathname: '/form-title-implicitly-displayed',
          search: '',
        };
        const tree = shallowFormApp({ formConfig, currentLocation });

        expect(tree.everySubTree('FormTitle')).not.to.be.empty;
      });
    });
  });
});
