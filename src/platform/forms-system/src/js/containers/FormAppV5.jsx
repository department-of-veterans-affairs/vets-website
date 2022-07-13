import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import Scroll from 'react-scroll';
import { useLocation } from 'react-router-dom';

import { isLoggedIn } from 'platform/user/selectors';

import FormNav from '../components/FormNavV5';
import FormTitle from '../components/FormTitle';
// import { isInProgress } from '../helpers';
import { setGlobalScroll } from '../utilities/ui';

const { Element } = Scroll;

function FormApp(props) {
  let nonFormPages = [];
  const currentLocation = useLocation();

  const { formConfig, children, formData } = props;
  const trimmedPathname = currentLocation.pathname.replace(/\/$/, '');
  const lastPathComponent = currentLocation.pathname.split('/').pop();
  const isIntroductionPage = trimmedPathname.endsWith('introduction');
  const isConfirmationPage = trimmedPathname.endsWith('confirmation');

  const isNonFormPage = nonFormPages.includes(lastPathComponent);
  const Footer = formConfig.footerContent;
  const title =
    typeof formConfig.title === 'function'
      ? formConfig.title(props)
      : formConfig.title;

  let renderedChildren = children;

  // Show title only if:
  // 1. we're not on the intro page *or* one of the additionalRoutes
  //    specified in the form config
  // 2. there is a title specified in the form config
  const formTitle = <FormTitle title={title} subTitle={formConfig.subTitle} />;

  // Show nav only if we're not on the intro, form-saved, error, confirmation
  // page or one of the additionalRoutes specified in the form config
  // Also add form classes only if on an actual form page
  const formNav = (
    <FormNav
      formData={formData}
      formConfig={formConfig}
      currentPath={trimmedPathname}
      isLoggedIn={props.isLoggedIn}
      inProgressFormId={props.inProgressFormId}
    />
  );

  renderedChildren = (
    <div className="progress-box progress-box-schemaform">{children}</div>
  );

  const footer = (
    <Footer formConfig={formConfig} currentLocation={currentLocation} />
  );

  useEffect(
    () => {
      const { additionalRoutes } = props.formConfig;

      if (additionalRoutes) {
        nonFormPages = additionalRoutes.map(route => route.path);
      }

      setGlobalScroll();

      if (window.History) {
        window.History.scrollRestoration = 'manual';
      }
    },
    [currentLocation.pathname],
  );

  return (
    <div>
      <div className="row">
        <div className="usa-width-two-thirds medium-8 columns">
          <Element name="topScrollElement" />
          {!isNonFormPage && !isIntroductionPage && !isConfirmationPage
            ? formTitle
            : ''}
          {!isNonFormPage && !isIntroductionPage && !isConfirmationPage
            ? formNav
            : ''}
          {renderedChildren}
        </div>
      </div>
      {footer}
      <span
        className="js-test-location hidden"
        data-location={trimmedPathname}
        hidden
      />
    </div>
  );
}

const mapStateToProps = state => ({
  formData: state.form.data,
  isLoggedIn: isLoggedIn(state),
  inProgressFormId: state.form.loadedData?.metadata?.inProgressFormId,
});

export default connect(mapStateToProps)(FormApp);

export { FormApp };
