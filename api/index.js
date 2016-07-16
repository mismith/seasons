let fs = require('fs'),
	csv = require('csv-parse'),
	moment = require('moment');

let rows = [];
fs.createReadStream('./home.csv')
	.pipe(csv({columns: true}))
	.on('data', row => {
		rows.push({
			datetime: moment(row.START_DATE + ' ' + row.START_TIME, 'MM/DD/YYYY h:mm A').format(),
			opponent: row.SUBJECT.replace(/ at .*$/, ''),
		});
	})
	.on('end', function() {
		console.log(rows);
	});