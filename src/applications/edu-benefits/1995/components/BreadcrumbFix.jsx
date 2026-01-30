import { useEffect } from 'react';

/**
 * Fixes breadcrumbs on the form-saved page to make the introduction link clickable.
 *
 * The breadcrumbs are rendered server-side by content-build, but the last breadcrumb
 * becomes an anchor link (#content) when the web component detects it matches the
 * current page. This component dynamically adds a 4th breadcrumb labeled "VA Form 22-1995"
 * when on the form-saved page, which makes "Change your education benefits" clickable
 * and properly navigates to the introduction. The breadcrumb is automatically removed
 * when navigating away from the form-saved page.
 */
const BreadcrumbFix = () => {
  useEffect(() => {
    // Add a small delay to ensure breadcrumbs are fully rendered
    const timeoutId = setTimeout(() => {
      const breadcrumbComponent = document.querySelector('va-breadcrumbs');
      if (!breadcrumbComponent) {
        return;
      }

      try {
        // Get current breadcrumb list
        const breadcrumbListAttr = breadcrumbComponent.getAttribute(
          'breadcrumb-list',
        );
        if (!breadcrumbListAttr) {
          return;
        }

        const breadcrumbList = JSON.parse(breadcrumbListAttr);
        const isFormSavedPage = window.location.pathname.includes(
          '/form-saved',
        );
        const hasFormSavedCrumb = breadcrumbList.some(
          crumb => crumb.href && crumb.href.includes('/form-saved'),
        );

        if (isFormSavedPage && !hasFormSavedCrumb) {
          // Add "VA Form 22-1995" breadcrumb when on form-saved page
          breadcrumbList.push({
            href:
              '/education/apply-for-education-benefits/application/1995/form-saved',
            label: 'VA Form 22-1995',
            isRouterLink: false,
            lang: 'en-US',
          });
          breadcrumbComponent.setAttribute(
            'breadcrumb-list',
            JSON.stringify(breadcrumbList),
          );
        } else if (!isFormSavedPage && hasFormSavedCrumb) {
          // Remove "Form saved" breadcrumb when navigating away
          const filteredList = breadcrumbList.filter(
            crumb => !crumb.href || !crumb.href.includes('/form-saved'),
          );
          breadcrumbComponent.setAttribute(
            'breadcrumb-list',
            JSON.stringify(filteredList),
          );
        }
      } catch (error) {
        // Silently fail if breadcrumb manipulation fails
      }
    }, 100);

    return () => clearTimeout(timeoutId);
  });

  return null; // This component doesn't render anything
};

export default BreadcrumbFix;
