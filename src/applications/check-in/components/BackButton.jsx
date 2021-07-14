import React from 'react';

export default function BackButton({ router }) {
  const handleClick = () => {
    const { goBack } = router;
    goBack();
  };
  return (
    <>
      <nav
        aria-label="Breadcrumb"
        aria-live="polite"
        className="va-nav-breadcrumbs va-nav-breadcrumbs--mobile"
      >
        <ul className="row va-nav-breadcrumbs-list columns">
          <li>
            <a href="#" onClick={handleClick}>
              Back to last screen
            </a>
          </li>
        </ul>
      </nav>
    </>
  );
}
