// Don't let the regex party get out of control.

function regret(name, input){
  if(!regret.patterns[name]){
    throw new Error('Unknown pattern `' + name + '`');
  }
  var pattern = regret.patterns[name],
    re = pattern.pattern,
    res = {},
    matches = re.exec(input);

  if(matches === null){
    return null;
  }

  matches.shift();
  matches.map(function(p, i){
    res[pattern.captures[i]] = p;
  });
  re.lastIndex = 0;
  return res;
}
regret.patterns = {};

regret.add = function(name, pattern, example, captures){
  captures = captures || [];

  var source = pattern.source,
    matcher = new RegExp('{{([' + Object.keys(regret.patterns).join('|') + ']+)}}', 'g');

  source = source.replace(matcher, function(match, name, offset){
    if(!regret.patterns[name]){
      throw new Error('Unregistered template `' + name + '`');
    }

    return match.replace(new RegExp('{{' + name + '}}', 'g'),
      regret.patterns[name].pattern.source);
  });

  regret.patterns[name] = {
    'example': example,
    'pattern': new RegExp(source, 'g'),
    'captures': captures
  };
  return regret.patterns[name];
};

module.exports = regret;
