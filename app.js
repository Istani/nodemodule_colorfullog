var debug = require("@istani/debug")(require('./package.json').name);
var debug2 = require("@istani/debug")(require('./package.json').name+"2");

debug.log("This is a Text");
debug2.log("This is a Text too");