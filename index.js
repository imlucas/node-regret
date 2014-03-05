"use strict";

// Don't let the regex party get out of control.
function regret(name, input){
  var matchers, res = null, re, matches, matcher;
  if(typeof name.exec === 'function'){
    matchers = Object.keys(regret.matchers).filter(function(m){
      return name.test(m);
    }).map(function(m){
      return regret.matchers[m];
    });
  }
  else {
    matchers = regret.matchers[name] ? [regret.matchers[name]] : [];
  }

  if(matchers.length === 0){
    return undefined;
  }

  while(matchers.length > 0){
    matcher = matchers.shift();
    matches = matcher.pattern.exec(input);

    if(!matches){
      continue;
    }
    res = {};

    // pop off the input string
    matches.shift();
    res._matcher_name = matcher.name;
    matches.map(function(p, i){
      res[matcher.captures[i]] = p;
    });
    break;
  }
  return res;
}
regret.matchers = {};

regret.add = function(name, pattern, example, captures){
  captures = captures || [];

  var source = pattern.source,
    matcher = new RegExp('{{([' + Object.keys(regret.matchers).join('|') + ']+)}}', 'g');

  source = source.replace(matcher, function(match, name, offset){
    if(!regret.matchers[name]){
      throw new Error('Unregistered template `' + name + '`');
    }

    return match.replace(new RegExp('{{' + name + '}}', 'g'),
      regret.matchers[name].pattern.source);
  });

  regret.matchers[name] = {
    example: example,
    pattern: new RegExp(source),
    captures: captures,
    name: name
  };
  return regret;
};

regret.clear = function(){
  regret.matchers = {};
};

module.exports = regret;
