REPORTER = spec
COVERAGE_OPTS = --lines 90 --statements 90 --branches 80 --functions 90
BIN= ./node_modules/.bin

test: test-unit check-coverage test-acceptance
test-unit:
	@NODE_ENV=test $(BIN)/mocha \
		--reporter $(REPORTER) 

test-acceptance:
	@NODE_ENV=test $(BIN)/mocha test/acceptance \
		--reporter $(REPORTER) 
clean-coverage:
	-rm -rf lib-cov
	-rm -rf html-report
	-rm coverage-final.json 

lib-cov: clean-coverage
	$(BIN)/istanbul instrument lib --output lib-cov --no-compact

check-coverage: test-cov
	$(BIN)/istanbul check-coverage $(COVERAGE_OPTS)

test-cov: lib-cov 
	CONNECT_TESTAB_COV=1 \
	ISTANBUL_REPORTERS=text-summary,html,json \
	$(MAKE) test-unit REPORTER=mocha-istanbul 
.PHONY: test test-cov
