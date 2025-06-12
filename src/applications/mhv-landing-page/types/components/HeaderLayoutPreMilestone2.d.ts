export default HeaderLayoutPreMilestone2;
declare function HeaderLayoutPreMilestone2({ showWelcomeMessage, showMhvGoBack, ssoe, }: {
    showWelcomeMessage?: boolean;
    showMhvGoBack?: boolean;
    ssoe?: boolean;
}): React.JSX.Element;
declare namespace HeaderLayoutPreMilestone2 {
    namespace propTypes {
        let showMhvGoBack: PropTypes.Requireable<boolean>;
        let showWelcomeMessage: PropTypes.Requireable<boolean>;
        let ssoe: PropTypes.Requireable<boolean>;
    }
}
import React from 'react';
import PropTypes from 'prop-types';
