module.exports = process.env.CONNECT_TESTAB_COV ? require('./lib-cov/connect-testab') : require('./lib/connect-testab');
