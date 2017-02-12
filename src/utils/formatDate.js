import moment from 'moment';

export default function formatDate(datetime){
  return moment(datetime).format('h:mma, ddd, MMM D, YYYY');
};