class Converter {
  constructor() {
    
  };
  buffer_hex2text(buff) {
    buff = buff.toString("hex");
    buff = buff.toUpperCase();

    var zeichen = 0;
    var newString = "";
    for (var i = 0; i < buff.length; i++) {
      zeichen++;
      newString += buff[i];
      if (zeichen == 2) {
        newString += " ";
        zeichen = 0;
      }
    }
    return newString;
  }
}
module.exports=new Converter();