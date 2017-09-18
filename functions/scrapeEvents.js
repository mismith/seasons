const scrapeIt = require('scrape-it');
const moment = require('moment-timezone');

module.exports = function scrapeEvents(year) {
  return scrapeIt(`https://www.nhl.com/flames/schedule/${year}/MT/print`, {
    rows: {
      listItem: '.schedule-table tbody tr',
      data: {
        row: {
          listItem: 'td',
        },
      },
    },
  })
    .then(page => page.rows.map(row => row.row)) // make it an CSV-like array
    .then(rows => rows.filter(row => !/^@/.test(row[3]))) // only home games
    .then(rows => rows.map(row => {
      const monthNum = moment(row[1], 'MMM D').format('M');
      const adjustedYear = parseInt(year, 10) + (monthNum < 8 ? 1 : 0);
      return {
        datetime: moment.tz(`${row[1]} ${adjustedYear}, ${row[2]}`, 'MMM D YYYY, H:mm A', 'America/Edmonton').format(),
        opponent: row[3].replace(/^vs /, ''),
      };
    }));
    // .then(console.log);
};