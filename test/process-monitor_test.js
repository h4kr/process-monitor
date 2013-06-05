var procmon = require('../lib/process-monitor.js');

//
// Expose unit tests to nodeunit.
//
exports['process-monitor'] = {
  'initialization': function(test) {
    test.expect(3);

    test.ok(procmon.monitor({ pid: 1 }), 'should initialize with a single PID.');
    test.ok(procmon.monitor({ pid: [ 1, 2 ] }), 'should initialize with an array of PIDs.');
    test.throws(function() {
      procmon.monitor();
    }, TypeError, 'should throw type error with no initialization object');

    test.done();
  },
  'starting and stopping': function(test) {
    test.expect(2);
    var testMon = procmon.monitor({ pid: 1 });

    testMon.start();
    test.strictEqual(testMon.isRunning, true, 'should start.');
    testMon.stop();
    test.strictEqual(testMon.isRunning, false, 'should stop.');

    test.done();
  },
  'stats event': function(test) {
    var statsMon = procmon.monitor({ pid: process.pid, interval: 500, format: '{cpu}% CPU - {mem} MEM' }).start();
    test.expect(4);

    statsMon.once('stats', function(stats) {
      test.ok(stats, 'stats event should be called and provide stats object');
      test.ok(stats.cpu, 'stats object should have cpu property');
      test.ok(stats.mem, 'stats object should have mem property');
      test.ok(stats.out, 'should output formatted string results');

      test.done();
    });
  },
  'connections event': function(test) {
    var conMon = procmon.monitor({ pid: process.pid, interval: 500 }).start();
    test.expect(1);

    conMon.once('connections', function(con) {
      test.ok(con, 'connections event should be called and provide connections object');

      test.done();
    });
  }
};
