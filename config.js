exports.DATABASE_URL = process.env.DATABASE_URL ||
                       global.DATABASE_URL ||
                      'mongodb://surbhi:surbhi@clustercontactapp-shard-00-00.jzyeq.mongodb.net:27017,clustercontactapp-shard-00-01.jzyeq.mongodb.net:27017,clustercontactapp-shard-00-02.jzyeq.mongodb.net:27017/contactApp?ssl=true&replicaSet=atlas-vg3i2n-shard-0&authSource=admin&retryWrites=true&w=majority';
exports.TEST_DATABASE_URL = (
                          	process.env.TEST_DATABASE_URL ||
	                   'mongodb://surbhi:surbhi@clustercontactapp-shard-00-00.jzyeq.mongodb.net:27017,clustercontactapp-shard-00-01.jzyeq.mongodb.net:27017,clustercontactapp-shard-00-02.jzyeq.mongodb.net:27017/contactApp?ssl=true&replicaSet=atlas-vg3i2n-shard-0&authSource=admin&retryWrites=true&w=majority');
exports.PORT = process.env.PORT || 8080;

