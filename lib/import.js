
const { readdirSync, statSync, readdir, writeFileSync, readFile, existsSync} = require('fs');
const { join } = require('path');
const fs = require('fs');
const path = require('path');

var args = process.argv.slice(2).reduce((acc, arg) => {
    let [k, v = true] = arg.split('=')
    acc[k] = v
    return acc
}, {})

if(args["--help"] === true || Object.keys(args).length === 0){
  console.log('\x1b[38;2;63;81;181m',`
                     __                                           __      __
    ____  ____  ____/ /__        ____________________      ____  / /___  / /_
   / __ \\/ __ \\/ __  / _ \\______/ ___/ ___/ ___/ ___/_____/ __ \\/ / __ \\/ __ \\
  / / / / /_/ / /_/ /  __/_____(__  ) /__(__  |__  )_____/ /_/ / / /_/ / /_/ /
 /_/ /_/\\____/\\__,_/\\___/     /____/\\___/____/____/      \\__, /_/\\____/_.___/
                                                        /____/
`,'\x1b[0m');
  console.log(`
node-scss-glob generates scss imports for entire folders.

USAGE:
    node-scss-glob -o=<file> [-d=<directory> -I=<directory> -e=<file> -E=<directory> -a]

OPTIONS:
  -o=FILE
      selects output file of globbed imports.
  -d=[DIRECTORY...]
      selects root directory to recursivly glob (brackets are required around the array, and not symbolic).
  -e=[FILE...]
      selects files to exclude from globbing (brackets are required around the array, and not symbolic).
  -E=[DIRECTORY...]
      selects folders to exclude from globbing (brackets are required around the array, and not symbolic).
  -a
      option to add imports onto previously globbed.
    `);
}else{//////////////////////////////////////////////////////////////////////////

if (existsSync(args["-o"])){
  var outputfile = args["-o"];
}else{
    console.error("\x1b[31m","FATAL ERR: Output file must be valid.  Exiting...",'\x1b[0m');
    process.exit(22);
}

var dirnames = [];
if(args["-d"] === undefined || args["-d"] === null || args["-d"] === "" || args["-d"] === true){
  dirnames.push(outputfile.substring(0, outputfile.lastIndexOf("/") + 1));
}else{
  var dirnames = args["-d"].replace("[","").replace("]","").split(',');
}

if(args["-a"] === undefined || args["-a"] === null || args["-a"] === ""){
  var add = false;
}else if(Boolean(args["-a"]) !== true && Boolean(args["-a"]) !== false){
  console.error("\x1b[33m", "WARN: Arguement 'add to previous' needs to be a bolean, defaulting to false.",'\x1b[0m');
  var add = false;
}else{
  var add = Boolean(args["-a"]);
}

if(args["-e"] === undefined || args["-e"] === null || args["-e"] === "" || args["-e"] === true){
  var excludeFiles = [];
}else{
  var excludeFiles = args["-e"].replace("[","").replace("]","").split(',');
}

if(args["-E"] === undefined || args["-E"] === null || args["-E"] === "" || args["-E"] === true){
  var excludeFolders = [];
}else{
  var excludeFolders = args["-E"].replace("[","").replace("]","").split(',');
}


function waitfor(test, expectedValue, msec, count, callback) {
    // Check if condition met. If not, re-check later (msec).
    while (test() !== expectedValue) {
        count++;
        setTimeout(function() {
            waitfor(test, expectedValue, msec, count, callback);
        }, msec);
        return;
    }
    // Condition finally met. callback() can be executed.
    //console.log(source + ': ' + test() + ', expected: ' + expectedValue + ', ' + count + ' loops.');
    callback();
}



const dirs = p => readdirSync(p).filter(f => statSync(join(p, f)).isDirectory() && f.indexOf("_") === -1);

function emptyMultiArray(array){
  for (i in array){
    if (array[i].length === 0){
      var ret = true;
    }else{
      var ret = false;
    }
  }
  return ret;
}

var d = [];
for (i in dirnames){
  d.push(dirs(dirnames[i]));
}
//console.log(d);

var importstring = ["waiting"];

function filewalker(dir, done) {
    let results = [];

    fs.readdir(dir, function(err, list) {
        if (err) return done(err);

        var pending = list.length;

        if (!pending) return done(null, results);

        list.forEach(function(file){
            file = path.resolve(dir, file);

            fs.stat(file, function(err, stat){
                // If directory, execute a recursive call
                if (stat && stat.isDirectory()) {
                    // Add directory to array [comment if you need to remove the directories from the array]
                    // results.push(file);

                    filewalker(file, function(err, res){
                        results = results.concat(res);
                        if (!--pending) done(null, results);
                    });
                } else {
                  if(!excludeFiles.includes(path.relative(process.env.PWD, file)) && excludeFiles.indexOf(file) === -1 && !excludeFolders.includes(path.relative(process.env.PWD, file.substring(0, file.lastIndexOf("/") + 1))) && excludeFolders.indexOf(file.substring(0, file.lastIndexOf("/") + 1)) === -1 && (function(){if(excludeFolders.length > 0){for(i in excludeFolders){if(file.substring(0, file.lastIndexOf("/") + 1).indexOf(excludeFolders[i]) === -1){return true}else{return false}}}else{return true}})()){
                    results.push(file);
                  }
                  if (!--pending) done(null, results);
                }
            });
        });
    });
};
var importstring2 = [];
        for (f in dirnames){
          if (dirs(dirnames[f]).length !== 0){
            //console.log(dirnames[f]);
            var dirname = dirnames[f];
            var wd = dirname;
            //console.log(wd);

            filewalker(wd, function(err,items) {
                for (var x in items) {
                    if (items[x].indexOf('.scss') > -1 && items[x].indexOf(outputfile.substring(outputfile.lastIndexOf("/") + 1).substr(1)) === -1){
                        var loc = /*cd + "/" +*/ path.relative(outputfile.substring(0, outputfile.lastIndexOf("/") + 1), items[x]).replace('.scss','');
                        if (loc.substr(0, loc.indexOf('_')).slice(-1) === "/" || loc.substr(0, loc.indexOf('_')).slice(-1) === '' ){
                            var loc = loc.replace('_','');
                        }
                        importstring.push("@import '" + loc + "';\n");
                    }
                }
                global.importstring = importstring;
              importstring = importstring.filter(item => item !== "waiting");
            });
          }else{
            var dirname = dirnames[f];
            //importstring2.push(`/*${path.relative(outputfile.substring(0, outputfile.lastIndexOf("/") + 1), dirname)}*/\n`);
            var files = readdirSync(dirname);
            files.forEach(file => {
              var file = path.resolve(dirname, file);
              if (file.includes(".scss") && file.indexOf(outputfile.substring(outputfile.lastIndexOf("/") + 1).substr(1)) === -1 && !excludeFiles.includes(path.relative(process.env.PWD, file)) && excludeFiles.indexOf(file) === -1 && !excludeFolders.includes(path.relative(process.env.PWD, file.substring(0, file.lastIndexOf("/") + 1))) && excludeFolders.indexOf(file.substring(0, file.lastIndexOf("/") + 1)) === -1 && (function(){if(excludeFolders.length > 0){for(i in excludeFolders){if(file.substring(0, file.lastIndexOf("/") + 1).indexOf(excludeFolders[i]) === -1){return true}else{return false}}}else{return true}})()){
                var loc = /*cd + "/" +*/ path.relative(outputfile.substring(0, outputfile.lastIndexOf("/") + 1), file).replace('.scss','');
                if (loc.substr(0, loc.indexOf('_')).slice(-1) === "/"){
                    var loc = loc.replace('_','');
                }
                importstring2.push("@import '" + loc + "';\n");
              }
            });
            importstring = importstring.filter(item => item !== "waiting");
          }
        }

waitfor(function(){return importstring.indexOf("waiting") === -1},true,50,0,function(){
  readFile(outputfile, 'utf8', function (err,data) {

    if (err) {
      return console.log(err);
    }
    if (add === false){
      if (data.includes("/*START AUTO GLOBBED*/")){
        var result = data.replace(data.substring(
            data.lastIndexOf("/*START AUTO GLOBBED*/"),
            data.lastIndexOf("/*END AUTO GLOBBED*/") + 20
        ), "/*START AUTO GLOBBED*/\n" + importstring.join('') + importstring2.join('') + "/*END AUTO GLOBBED*/");
      }else{
        var result = "/*START AUTO GLOBBED*/\n" + importstring.join('') +importstring2.join('') + "/*END AUTO GLOBBED*/" + data;
      }
    }else{
      var result = data.substr(0, data.lastIndexOf("/*END AUTO GLOBBED*/")) + importstring.join('') + importstring2.join('') + data.substr(data.lastIndexOf("/*END AUTO GLOBBED*/"));
    }
    console.log('\x1b[30;1m',result,'\x1b[0m');

    writeFileSync(outputfile, result, {encoding:'utf8',flag:'w'}, function (err) {
        if (err) return console.log(err);
     });
  });
});

//}



}///////////////////////////////////////////////////////////////////////////////





