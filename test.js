var regret = require('./'),
  assert = require('assert');

describe('regret', function(){
  it('should work', function(){
    regret.add('isoDate', /\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+-[0-5]\d/,
      '2014-02-13T18:00:04.709-0500');

    regret.add('mongodbLogLine', /({{isoDate}}+) \[(\w+)\](?:\s{2})(.*)/,
      '2014-02-13T18:00:04.709-0500 [initandlisten] db version v2.5.6-pre-',
      ['date', 'name', 'message']);

    var text = '2014-02-18T14:34:06.272-0500 [clientcursormon]  mapped (incl journal view):320',
      res = regret('mongodbLogLine', text);

    assert.equal(res.date, '2014-02-18T14:34:06.272-0500');
    assert.equal(res.name, 'clientcursormon');
    assert.equal(res.message, 'mapped (incl journal view):320');
  });
});
