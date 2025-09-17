import React from 'react';
import PropTypes from 'prop-types';
import FormTitle from 'platform/forms-system/src/js/components/FormTitle';
import { VaBreadcrumbs } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

const IntroductionPage = ({ onNext }) => (
  <div>
    <VaBreadcrumbs
      breadcrumbList={[
        {
          href: '#',
          label: 'Custom home',
        },
        {
          href: '#',
          label: 'Disability Benefits',
        },
        {
          href: '#',
          label: 'Sign In',
        },
      ]}
      homeVeteransAffairs
      label="Breadcrumb"
    />

    <FormTitle title="Sign In" />

    <form>
      <va-text-input
        label="Email"
        value="L.jackson.vet@email.com"
        inputmode="email"
        autocomplete="username"
      />

      <va-text-input
        label="Password"
        type="password"
        value="************"
        autocomplete="current-password"
        class="vads-u-margin-top--2"
      />

      <va-button onClick={onNext} class="vads-u-margin-top--4" text="Submit" />
    </form>

    <div className="vads-u-margin-top--6">
      <va-need-help>
        <div slot="content">
          <p>
            If you have questions or need help filling out this form, please
            call us at <va-telephone contact="8008271000" />. We’re here Monday
            through Friday, 8:00 a.m to 9:00 p.m ET.
          </p>
          <p>
            If you have hearing loss, call <va-telephone contact="711" tty />.
          </p>
        </div>
      </va-need-help>
      <br />
    </div>
  </div>
);

IntroductionPage.propTypes = {
  onNext: PropTypes.func.isRequired,
};

export default IntroductionPage;
