import moment from 'moment';

export default function formatEventName(event){
	if (event.opponent && event.datetime) {
		return event.opponent + ' on ' + moment(event.datetime).format('MMM D');
	}
	return 'Event name';
};