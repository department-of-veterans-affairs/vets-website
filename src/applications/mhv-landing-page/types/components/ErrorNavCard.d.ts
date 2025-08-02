export default ErrorNavCard;
/**
 * A navigation card only displayed when an error occurs.
 * @param {string} title the title for the navigation card
 * @param {string} iconClasses the icon the card diplays
 * @param {string} code the status code of the related error
 */
declare function ErrorNavCard({ iconClasses, title, code, userActionable, }: string): React.JSX.Element;
declare namespace ErrorNavCard {
    namespace propTypes {
        let title: PropTypes.Validator<string>;
        let code: PropTypes.Requireable<string>;
        let iconClasses: PropTypes.Requireable<string>;
    }
}
import React from 'react';
import PropTypes from 'prop-types';
