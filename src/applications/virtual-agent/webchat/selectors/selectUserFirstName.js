import _ from 'lodash';

export default function selectLoadingFeatureToggle(state) {
  return _.upperFirst(_.toLower(state.user.profile.userFullName.first));
}
