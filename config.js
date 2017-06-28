exports.DATABASE_URL = process.env.DATABASE_URL ||
                       global.DATABASE_URL ||
                      'mongodb://localhost/capstone-app';
exports.TEST_DATABASE_URL = (
                          	process.env.TEST_DATABASE_URL ||
	                   'mongodb://localhost/test-capstone-app');
exports.PORT = process.env.PORT || 8080;