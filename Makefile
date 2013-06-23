DOCS = docs/*.md
REPORTER = dot
default: @

test:
	@NODE_ENV=test ./node_modules/.bin/mocha test -b \
		--reporter $(REPORTER)
test-cov: lib-cov
	@CONNECT_TESTAB_COV=1 $(MAKE) test REPORTER=html-cov > coverage.html && rm -rf lib-cov

lib-cov:
	@type jscoverage >/dev/null 2>&1 || { echo >&2 "I require jscoverage  but it's not installed. " \
		" Aborting.\n Please install https://github.com/visionmedia/node-jscoverage"; exit 1; }
	@rm -rf lib-cov
	@jscoverage lib lib-cov

.PHONY: test test-cov
