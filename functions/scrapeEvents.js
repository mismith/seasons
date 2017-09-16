const scrapeIt = require('scrape-it');
const moment = require('moment-mini');

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
      return {
        datetime: moment(`${row[1]} ${year}, ${row[2]}`, 'MMM D YYYY, H:mm A').format(),
        opponent: row[3].replace(/^vs /, ''),
      };
    }));
};