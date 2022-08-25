import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getMessage, loadingComplete } from '../actions';
import SectionGuideButton from '../components/SectionGuideButton';
import Breadcrumbs from '../components/shared/Breadcrumbs';
import BeforeMessageAddlInfo from '../components/BeforeMessageAddlInfo';
import ComposeForm from '../components/ComposeForm';

const Compose = () => {
  const dispatch = useDispatch();
  const { isLoading, message, error } = useSelector(state => state.message);
  const isDraft = window.location.pathname.includes('/draft');

  useEffect(
    () => {
      const messageId = window.location.pathname.split('/').pop();
      if (isDraft) {
        dispatch(getMessage(messageId));
      } else {
        dispatch(loadingComplete());
      }
    },
    [isDraft, dispatch],
  );

  let pageTitle;
  let breadcrumbName;
  let breadcrumbLink;

  if (isDraft) {
    breadcrumbName = 'Drafts';
    breadcrumbLink = '/drafts';
    pageTitle = 'Edit draft';
  } else {
    breadcrumbName = 'Compose message';
    breadcrumbLink = '/compose';
    pageTitle = 'Compose message';
  }

  const content = () => {
    if (isLoading) {
      return (
        <va-loading-indicator
          message="Loading your secure message..."
          setFocus
          class="vads-u-margin-y--9"
        />
      );
    }
    if (error) {
      return (
        <va-alert status="error" visible class="vads-u-margin-y--9">
          <h2 slot="headline">We’re sorry. Something went wrong on our end</h2>
          <p>
            You can’t view your secure message because something went wrong on
            our end. Please check back soon.
          </p>
        </va-alert>
      );
    }
    return <ComposeForm message={message} />;
  };

  return (
    <div className="vads-l-grid-container compose-container">
      <Breadcrumbs link={breadcrumbLink} pageName={breadcrumbName} />
      <SectionGuideButton sectionName={pageTitle} />

      <h1 className="page-title">{pageTitle}</h1>
      <section className="emergency-note">
        <p>
          <strong>Note: </strong>
          Call <a href="tel:911">911</a> if you have a medical emergency. If
          you’re in crisis and need to talk to someone now, call the{' '}
          <a href="tel:988">Veterans Crisis Line</a>. To speak with a VA
          healthcare team member right away, contact your local VA call center.
        </p>
      </section>
      <div>
        <BeforeMessageAddlInfo />
      </div>

      {content()}
    </div>
  );
};

export default Compose;
