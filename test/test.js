var qlimit = require('..');
var Q = require('q');
var assert = require('assert');


describe('qlimit', function() {
  it('should not exceed the maximum concurrency of one', function(done) {
    var limit = qlimit(1);

    var count = 0;
    return Q.all([1,2,3,4,5,6,7,8,9,10].map(limit(function(i) {
        count++;
        assert.strictEqual(count, 1);
        return Q.delay(1)
          .then(function() {
            count--;
            assert.strictEqual(count, 0);
          });
      })))
      .nodeify(done);
  });

  it('should not exceed the maximum concurrency of two', function(done) {
    var limit = qlimit(2);

    var count = 0;
    return Q.all([1,2,3,4,5,6,7,8,9,10].map(limit(function(i) {
        count++;
        assert(count <= 2, "On iteration " + i + " count was " + count);
        return Q.delay(10)
          .then(function() {
            count--;
            assert(count < 2);
          });
      })))
      .nodeify(done);
  });

  it('should deal with promises failing', function(done) {
    var limit = qlimit(2);

    var rules = [false, false, true, false, false, false, false, false];
    return Q.allSettled(rules.map(limit(function(crash) {
      return Q.fcall(function() {
        if(crash) throw new Error('Crash');
      });
    })))
    .then(function(results) {
      rules.forEach(function(rule, index) {
        if(rule) {
          assert.strictEqual(results[index].state, 'rejected');
        } else {
          assert.strictEqual(results[index].state, 'fulfilled');
        }
      });
    })
    .nodeify(done);

  });

  it('should allow specific services to be limited', function(done) {
    var limit = qlimit(1);

    var count = 0;
    var totalCount = 0;
    var limitedFunction = limit(function(c) {
      count++;
      totalCount++;
      assert.strictEqual(count, 1);
      assert.strictEqual(totalCount, c);
      return Q.delay(10)
        .then(function() {
          count--;
          assert.strictEqual(count, 0);
        });
    });

    return Q.all([
        limitedFunction(1),
        limitedFunction(2),
        limitedFunction(3)
      ])
      .nodeify(done);

  });

});
