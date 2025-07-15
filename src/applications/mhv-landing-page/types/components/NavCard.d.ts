export const externalLinkText: "(opens in new tab)";
export default NavCard;
/**
 * A navigation card.
 * @param {string} icon an optional icon to display to the left of the title
 * @param {string} iconClasses an optional style for the icon
 * @param {string} introduction an optional introduction text to display below the title
 * @param {string} links optional links display in the card
 * @param {string} title the title for the navigation card
 * @param {string} tag an optional tag to display to the right of the title
 */
declare function NavCard({ icon, iconClasses, introduction, title, links, tag, }: string): React.JSX.Element;
declare namespace NavCard {
    namespace propTypes {
        let title: PropTypes.Validator<string>;
        let icon: PropTypes.Requireable<string>;
        let iconClasses: PropTypes.Requireable<string>;
        let introduction: PropTypes.Requireable<string>;
        let links: PropTypes.Requireable<PropTypes.InferProps<{
            text: PropTypes.Requireable<NonNullable<string | PropTypes.ReactElementLike>>;
            href: PropTypes.Requireable<string>;
            isExternal: PropTypes.Requireable<boolean>;
            omitExternalLinkText: PropTypes.Requireable<boolean>;
        }>[]>;
        let tag: PropTypes.Requireable<string>;
    }
}
import React from 'react';
import PropTypes from 'prop-types';
