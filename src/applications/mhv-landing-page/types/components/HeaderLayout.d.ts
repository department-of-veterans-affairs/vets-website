export default HeaderLayout;
declare function HeaderLayout({ showWelcomeMessage }: {
    showWelcomeMessage?: boolean;
}): React.JSX.Element;
declare namespace HeaderLayout {
    namespace propTypes {
        let showMhvGoBack: PropTypes.Requireable<boolean>;
        let showWelcomeMessage: PropTypes.Requireable<boolean>;
        let ssoe: PropTypes.Requireable<boolean>;
    }
}
import React from 'react';
import PropTypes from 'prop-types';
