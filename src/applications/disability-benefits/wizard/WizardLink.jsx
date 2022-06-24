import React from 'react';
import { connect } from 'react-redux';

import manifest from 'applications/disability-benefits/all-claims/manifest.json';
import { show526Wizard } from 'applications/disability-benefits/all-claims/utils';

/*
 * Showing the wizard on the Intro page, so when set, this shows the link
 * on the hub page; this file & the `createWizard` files won't be neccessary
 * once we get the flipper to 100% and the Drupal page includes a direct link to
 * the introduction page
 */
const WizardLink = ({ showWizard, module }) => {
  const { Wizard, pages } = module.default;
  return showWizard ? (
    <a href={`${manifest.rootUrl}/start`} className="vads-c-action-link--green">
      Let’s get started
    </a>
  ) : (
    <Wizard pages={pages} expander buttonText="Let's get started" />
  );
};

const mapStateToProps = state => ({
  showWizard: show526Wizard(state),
});

export default connect(mapStateToProps)(WizardLink);
