import uniloc from 'uniloc';

let Router = uniloc({
	season: 'GET /season/:seasonId',
	seat: 'GET /season/:seasonId/seat/:seatId',
	game: 'GET /season/:seasonId/game/:gameId',
}, {
	'GET /': 'season',
	'GET /season': 'season',
});

Router.href = function() {
	return '#' + this.generate.apply(this, arguments);
};
export default Router;