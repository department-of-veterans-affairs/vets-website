import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';

import { FormApp } from '../../../src/js/containers/FormApp';

const renderFormApp = ({ formConfig, currentLocation, formData = null }) => {
  const routes = [{ pageList: [{ path: currentLocation.pathname }] }];
  return render(
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
  beforeEach(() => {
    if (!document.body.dataset) document.body.dataset = {};
  });
  it('should render children on intro page, but not form title or nav', () => {
    const formConfig = {};
    const currentLocation = {
      pathname: 'introduction',
      search: '',
    };
    const { container, queryByTestId } = renderFormApp({
      formConfig,
      currentLocation,
    });

    expect(container.querySelector('.child')).to.exist;
    expect(queryByTestId('navFormDiv')).to.not.exist;
    expect(queryByTestId('form-title')).to.not.exist;
  });

  it('should show nav when the form is in progress', () => {
    const formConfig = {
      chapters: {
        test: {
          title: 'Test',
          pages: {
            test: { path: '/veteran-information/personal-information' },
          },
        },
      },
    };
    const currentLocation = {
      pathname: '/veteran-information/personal-information',
      search: '',
    };
    const { container, queryByTestId } = renderFormApp({
      formConfig,
      currentLocation,
    });

    expect(container.querySelector('.child')).to.exist;
    expect(queryByTestId('navFormDiv')).to.exist;
  });

  it('should show dynamic title', () => {
    const titles = ['Main title', 'Alternate title'];
    let formData = { test: false };
    const formConfig = {
      title: props => titles[props.formData.test ? 1 : 0],
      chapters: {
        test: {
          title: 'Test',
          pages: {
            test: { path: '/veteran-information/personal-information' },
          },
        },
      },
    };
    const currentLocation = {
      pathname: '/veteran-information/personal-information',
      search: '',
    };
    const routes = [{ pageList: [{ path: currentLocation.pathname }] }];

    const { getByTestId, rerender } = renderFormApp({
      formConfig,
      currentLocation,
      formData,
    });

    expect(getByTestId('form-title').textContent).to.equal(titles[0]);
    formData = { test: true };
    rerender(
      <FormApp
        formConfig={formConfig}
        routes={routes}
        currentLocation={currentLocation}
        formData={formData}
      >
        <div className="child" />
      </FormApp>,
    );
    expect(getByTestId('form-title').textContent).to.equal(titles[1]);
  });

  it('should show dynamic subTitle', () => {
    const subTitles = ['Main subTitle', 'Alternate subTitle'];
    let formData = { test: false };
    const formConfig = {
      title: 'Test',
      subTitle: props => subTitles[props.formData.test ? 1 : 0],
      chapters: {
        test: {
          title: 'Test',
          pages: {
            test: { path: '/veteran-information/personal-information' },
          },
        },
      },
    };
    const currentLocation = {
      pathname: '/veteran-information/personal-information',
      search: '',
    };
    const routes = [{ pageList: [{ path: currentLocation.pathname }] }];

    const { getByTestId, rerender } = renderFormApp({
      formConfig,
      currentLocation,
      formData,
    });

    expect(getByTestId('form-subtitle').textContent).to.equal(subTitles[0]);
    formData = { test: true };
    rerender(
      <FormApp
        formConfig={formConfig}
        routes={routes}
        currentLocation={currentLocation}
        formData={formData}
      >
        <div className="child" />
      </FormApp>,
    );
    expect(getByTestId('form-subtitle').textContent).to.equal(subTitles[1]);
  });

  it('should hide title, nav and layout classes when formOptions are set', () => {
    const formConfig = {
      formOptions: { noTitle: true, noTopNav: true, fullWidth: true },
    };
    const currentLocation = {
      pathname: '/veteran-information/personal-information',
      search: '',
    };
    const { container, queryByTestId } = renderFormApp({
      formConfig,
      currentLocation,
    });

    expect(container.querySelector('.child')).to.exist;
    expect(queryByTestId('form-title')).to.not.exist;
    expect(container.querySelector('.row')).to.not.exist;
    expect(container.querySelector('.usa-width-two-thirds')).to.not.exist;
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
        const { queryByTestId } = renderFormApp({
          formConfig,
          currentLocation,
        });

        expect(queryByTestId('form-title')).to.not.exist;
      });
    });

    describe('when on a page where form title is explicitly displayed', () => {
      it('displays the form title', () => {
        const currentLocation = {
          pathname: '/form-title-explicitly-displayed',
          search: '',
        };
        const { queryByTestId } = renderFormApp({
          formConfig,
          currentLocation,
        });

        expect(queryByTestId('form-title')).to.exist;
      });
    });

    describe('when on a page where form title is implicitly displayed', () => {
      it('displays the form title', () => {
        const currentLocation = {
          pathname: '/form-title-implicitly-displayed',
          search: '',
        };
        const { queryByTestId } = renderFormApp({
          formConfig,
          currentLocation,
        });

        expect(queryByTestId('form-title')).to.exist;
      });
    });
  });
});
