import moment from 'moment';

const formatDate = date => moment(date).format('MMMM DD, YYYY');

export { formatDate };
