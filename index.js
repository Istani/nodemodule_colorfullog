const fs = require('fs');
const path = require('path');
const __parentDir = require.main;

class ConsoleColors {
  constructor(name, foreground, background) {
    this.name = name;
    this.foreground = foreground;
    this.background = background;
  }
}
// https://github.com/shiena/ansicolor/blob/master/README.md
const allColors = [
  //new ConsoleColors('Black',          '\x1b[30m', '\x1b[40m'),
  new ConsoleColors('Red', '\x1b[31m', '\x1b[41m'),
  new ConsoleColors('Green', '\x1b[32m', '\x1b[42m'),
  new ConsoleColors('Yellow', '\x1b[33m', '\x1b[43m'),
  new ConsoleColors('Blue', '\x1b[34m', '\x1b[44m'),
  new ConsoleColors('Magenta', '\x1b[35m', '\x1b[45m'),
  new ConsoleColors('Cyan', '\x1b[36m', '\x1b[46m'),
  //new ConsoleColors('White',          '\x1b[37m', '\x1b[47m'),

  new ConsoleColors('Light Gray', '\x1b[90m', '\x1b[100m'),
  new ConsoleColors('Light Red', '\x1b[91m', '\x1b[101m'),
  new ConsoleColors('Light Green', '\x1b[92m', '\x1b[102m'),
  new ConsoleColors('Light Yellow', '\x1b[93m', '\x1b[103m'),
  new ConsoleColors('Light Blue', '\x1b[94m', '\x1b[104m'),
  new ConsoleColors('Light Magenta', '\x1b[95m', '\x1b[105m'),
  new ConsoleColors('Light Cyan', '\x1b[96m', '\x1b[106m'),
  new ConsoleColors('Light White', '\x1b[97m', '\x1b[107m'),
];
function findColorByName(color, name) {
  return color.name == name;
}

const DefaultColor = new ConsoleColors('Default', '\x1b[39m', '\x1b[49m');
const StringDefault = 'default'.toUpperCase();
const config_path = path.join(__dirname, 'colorfullog.config.json');

class Debug {
  constructor() {
    this.setupConfig();
    this.converter = require('./lib/converter.js');
  }
  setupConfig() {
    if (typeof this.config == 'undefined') {
      this.config = {};
    }
    if (fs.existsSync(config_path)) {
      this.config = require(config_path);
    }

    if (typeof this.config.colors == 'undefined') {
      this.config.colors = {};
    }

    if (typeof this.config.printType == 'undefined') {
      this.config.printType = true;
    }
    if (typeof this.config.printTime == 'undefined') {
      this.config.printTime = true;
    }
    this.saveConfig();
  }

  saveConfig() {
    fs.writeFileSync(config_path, JSON.stringify(this.config, null, 2));
  }

  log(text, type = StringDefault) {
    let output = this.getOutputString(text, type);
    let currentColor = this.getCurrentColor(type);

    console.log(currentColor.foreground + output + DefaultColor.foreground);
  }
  error(text, type = StringDefault) {
    let output = this.getOutputString(text, type);
    let currentColor = this.getCurrentColor(type);

    console.log(currentColor.background + output + DefaultColor.background);
  }

  getCurrentColor(type) {
    let currentColor = DefaultColor;

    type = type.toUpperCase();
    this.setupConfig();

    if (type != StringDefault) {
      if (typeof this.config.colors[type] == 'undefined') {
        this.config.colors[type] = this.getRandomColor().name;
        this.saveConfig();
      }
      currentColor = allColors.find((c) => c.name === this.config.colors[type]);
      if (typeof currentColor == 'undefined') {
        this.config.colors[type] = this.getRandomColor().name;
        this.saveConfig();
        currentColor = allColors.find(
          (c) => c.name === this.config.colors[type]
        );
      }
    }
    return currentColor;
  }
  getOutputString(text, type) {
    let output = '';
    type = type.toUpperCase();

    this.setupConfig();
    if (this.config.printTime) {
      output += new Date().toISOString() + ': ';
    }
    if (this.config.printType) {
      output += '[' + type + '] ';
    }
    output += text;
    return output;
  }

  getAllColors() {
    return allColors;
  }
  getRandomColor() {
    return allColors[Math.floor(Math.random() * allColors.length)];
  }
}

module.exports = new Debug();
