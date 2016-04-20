/**
  TKolor by Pranithan
  -------------------
  2016-04-20
*/

var TKolor = new function ctor() {
  var TKrgb = function ctor(r, g, b) {
    if (
      typeof (r) == "number" &&
      typeof (g) == "number" &&
      typeof (b) == "number"
    ) {
      this.r = r,
      this.g = g,
      this.b = b
    }
    else
      throw "r, g or b is not number";
  };

  function hexToTKrgb(hexString) {
    if (!(
        /^\#([0-9]|[A-F]){3}$/i.test(hexString) ||
        /^\#([0-9]|[A-F]){6}$/i.test(hexString)))
      throw ("Input is not hexString");
    if (hexString.length == 3 + 1) {
      return new TKrgb(
          parseInt((new Array(3)).join(hexString.substr(1, 1)), 16)
        , parseInt((new Array(3)).join(hexString.substr(2, 1)), 16)
        , parseInt((new Array(3)).join(hexString.substr(3, 1)), 16)
        );
    } else {
      return new TKrgb(
          parseInt(hexString.substr(1, 2), 16)
        , parseInt(hexString.substr(3, 2), 16)
        , parseInt(hexString.substr(5, 2), 16)
        );
    }
  };

  function tkrgbToHex(tkrgb) {
    var
      rRet = tkrgb.r.toString(16),
      gRet = tkrgb.g.toString(16),
      bRet = tkrgb.b.toString(16);

    rRet = (rRet.length < 2) ? "0" + rRet : rRet;
    gRet = (gRet.length < 2) ? "0" + gRet : gRet;
    bRet = (bRet.length < 2) ? "0" + bRet : bRet;

    return "#" +
      rRet +
      gRet +
      bRet;
  };

  function rgbToTKrgb(rgbString) {
    var rgx256 = "(2[0-5]{2}|[1]?[1-9]?[0-9])";
    var rgx = "^rgb\\(\\s*" +
      rgx256 + "\\s*\\,\\s*" +
      rgx256 + "\\s*\\,\\s*" +
      rgx256 + "\\s*\\)$";
    if (!new RegExp(rgx, "i").test(rgbString))
      throw ("Input is not rgbString");
    rgbString = rgbString.replace("rgb(", "").replace(")", "");
    var rgb = rgbString.split(",");
    return new TKrgb(
      parseInt(rgb[0]),
      parseInt(rgb[1]),
      parseInt(rgb[2]));
  };

  function tkrgbToRGB(tkrgb) {
    return "rgb(" +
      tkrgb.r + ", " +
      tkrgb.g + ", " +
      tkrgb.b + ")";
  }

  function modifyTKrgbColor(tkrgb, intTransVal) {
    tkrgb.r += intTransVal;
    tkrgb.g += intTransVal;
    tkrgb.b += intTransVal;

    adjustProper256(tkrgb);

    return tkrgb;
  }

  function calcIncrementalTKrgbColorSet(tkrgbSrc, tkrgbDest, setSize) {
    var
      tkrgbStep = new TKrgb(
        (tkrgbDest.r - tkrgbSrc.r) / setSize,
        (tkrgbDest.g - tkrgbSrc.g) / setSize,
        (tkrgbDest.b - tkrgbSrc.b) / setSize);
    var tkrgbSet = [];
    for (var i = 0; i < setSize; i++) {
      var
        tkrgb = new TKrgb(
        tkrgbSrc.r,
        tkrgbSrc.g,
        tkrgbSrc.b);

      tkrgb.r += tkrgbStep.r * i,
      tkrgb.g += tkrgbStep.g * i,
      tkrgb.b += tkrgbStep.b * i;

      adjustProper256(tkrgb);
      tkrgbSet.push(new TKrgb(
        tkrgb.r,
        tkrgb.g,
        tkrgb.b
        ));
    }
    return tkrgbSet;
  }

  function adjustProper256(tkrgb) {
    tkrgb.r = tkrgb.r < 0 ? 0 : tkrgb.r;
    tkrgb.g = tkrgb.g < 0 ? 0 : tkrgb.g;
    tkrgb.b = tkrgb.b < 0 ? 0 : tkrgb.b;

    tkrgb.r = tkrgb.r > 255 ? 255 : tkrgb.r;
    tkrgb.g = tkrgb.g > 255 ? 255 : tkrgb.g;
    tkrgb.b = tkrgb.b > 255 ? 255 : tkrgb.b;

    tkrgb.r = parseInt(tkrgb.r);
    tkrgb.g = parseInt(tkrgb.g);
    tkrgb.b = parseInt(tkrgb.b);
  }

  this.RGBToHex = function (rgbString) {
    var tkrgb = rgbToTKrgb(rgbString);
    return tkrgbToHex(tkrgb);
  };

  this.HexToRGB = function (hexString) {
    var tkrgb = hexToTKrgb(hexString);
    return tkrgbToRGB(tkrgb);
  };

  this.ModifyHexColor = function (hexString, hexTransVal, outputType) {
    if (typeof (outputType) == "undefined") outputType = "HEX";

    var tkrgb = (hexString);
    var t = parseInt(hexTransVal, 16);
    tkrgb = modifyTKrgbColor(tkrgb, t);

    switch (outputType) {
      case "HEX":
        return tkrgbToHex(tkrgb);
      case "RGB":
        return tkrgbToRGB(tkrgb);
    }
  };

  this.ModifyRGBColor = function (rgbString, intTransVal, outputType) {
    if (typeof (outputType) == "undefined") outputType = "RGB";

    var tkrgb = rgbToTKrgb(rgbString);
    var t = parseInt(intTransVal);
    tkrgb = modifyTKrgbColor(tkrgb, t);

    switch (outputType) {
      case "HEX":
        return tkrgbToHex(tkrgb);
      case "RGB":
        return tkrgbToRGB(tkrgb);
    }
  };

  this.FindIncrementalRGBColorSet = function (rgbStringSrc, rgbStringDest, setSize, outputType) {
    if (typeof (outputType) == "undefined") outputType = "RGB";
    var tkrgbSrc, tkrgbDest;
    try {
      tkrgbSrc = rgbToTKrgb(rgbStringSrc);
    } catch (e) {
      throw ("Error getting value from rgbStringSrc")
    }
    try {
      tkrgbDest = rgbToTKrgb(rgbStringDest);
    } catch (e) {
      throw ("Error getting value from rgbStringDest")
    }

    var tkrgbSet = calcIncrementalTKrgbColorSet(tkrgbSrc, tkrgbDest, setSize);

    var ret = [];
    switch (outputType) {
      case "HEX":
        for (var i in tkrgbSet) {
          ret.push(tkrgbToHex(tkrgbSet[i]));
        }
        break;
      case "RGB":
        for (var i in tkrgbSet) {
          ret.push(tkrgbToRGB(tkrgbSet[i]));
        }
        break;
    }
    return ret;
  };
};