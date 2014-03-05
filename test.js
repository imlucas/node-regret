var regret = require('./'),
  assert = require('assert');

describe('regret', function(){
  afterEach(function(){
    regret.clear();
  });
  it('should interpolate other matchers', function(){
    regret.add('date.iso', /\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+-[0-5]\d/,
      '2014-02-13T18:00:04.709-0500');

    regret.add('mongodb.log', /({{date.iso}}+) \[(\w+)\](?:\s{2})(.*)/,
      '2014-02-13T18:00:04.709-0500 [initandlisten] db version v2.5.6-pre-',
      ['date', 'name', 'message']);

    var text = '2014-02-18T14:34:06.272-0500 [clientcursormon]  mapped (incl journal view):320',
      res = regret('mongodb.log', text);

    assert.equal(res.date, '2014-02-18T14:34:06.272-0500');
    assert.equal(res.name, 'clientcursormon');
    assert.equal(res.message, 'mapped (incl journal view):320');
  });

  it('should support namespaces', function(){
    regret.add('mongodb.log', /\[(\w+)\](?:\s{2})(.*)/,
      '[clientcursormon]  mapped (incl journal view):320', ['name', 'message']);

    regret.add('mongodb.logShutdown', /(\w+)\:(?:\s{1})(.*)/,
      'dbexit: really exiting now', ['name', 'message']);

    var text = 'dbexit: really exiting now',
      res = regret(/^mongodb.log/, text);

    assert.equal(res.date, undefined);
    assert.equal(res.name, 'dbexit');
    assert.equal(res.message, 'really exiting now');
  });
});
