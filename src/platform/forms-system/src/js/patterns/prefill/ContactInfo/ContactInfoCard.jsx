import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import { VaCardStatus } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
// this component is essentially a wrapper component
// it is needed because there is no other way to intercept a clicked link inside
// the va-card-status shadowDOM. Deprecate once va-link-action/va-card-status emits/forwards
// event for a clicked link

const ContactInfoCardBase = ({
  formKey,
  wrapper,
  editPath,
  required,
  headerLevel,
  headerText,
  tagText,
  tagStatus,
  linkText,
  error,
  children,
  ...rest
}) => {
  const { router } = rest;

  const cardRef = useRef(null);

  useEffect(
    () => {
      const card = cardRef.current;
      if (card) {
        const handleClick = e => {
          const path = e.composedPath();
          const linkElement = path.find(el => el.tagName === 'A');

          if (linkElement) {
            e.preventDefault();
            router.push({
              pathname: editPath,
              state: {
                formKey,
                keys: { wrapper },
              },
            });
          }
        };

        card.addEventListener('click', handleClick);
        return () => card.removeEventListener('click', handleClick);
      }
      return undefined;
    },
    [editPath, formKey, router, wrapper],
  );

  return (
    <VaCardStatus
      key={editPath}
      ref={cardRef}
      error={error}
      required={required}
      headerLevel={headerLevel}
      headerText={headerText}
      tagStatus={tagStatus}
      tagText={tagText}
      linkHref={editPath}
      linkText={linkText}
    >
      {children}
    </VaCardStatus>
  );
};

ContactInfoCardBase.propTypes = {
  children: PropTypes.node,
  editPath: PropTypes.string,
  error: PropTypes.string,
  formKey: PropTypes.string,
  headerLevel: PropTypes.string,
  headerText: PropTypes.string,
  linkText: PropTypes.string,
  required: PropTypes.bool,
  tagStatus: PropTypes.string,
  tagText: PropTypes.string,
  wrapper: PropTypes.string,
};

const ContactInfoCard = withRouter(ContactInfoCardBase);

export default ContactInfoCard;
