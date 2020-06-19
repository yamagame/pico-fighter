/**
 * picopicoengine.js v0.1.1
 *
 * develop by H.Yamaguchi
 * http://yamagame.secret.jp/
 * Released under the MIT license.
 */


//-----------------------------
(function (window) {

  var sysconsole = console;

  picopicoengine = {
    native: false,
    webaudio: false
  }

  function callnative(cmd) {
    var d = document;
    var r = "IFRAME";
    var e = d.createElement(r);
    e.src = "picopicoengine://run";
    picopicoengine.command = cmd;
    d.documentElement
      .appendChild(e);
    e.parentNode
      .removeChild(e);
    e = null;
  }

  var ua = navigator.userAgent.toLowerCase();

  var safari = /safari/.test(ua);
  var ios = /iphone|ipod|ipad/.test(ua);
  var t = /picopicogameenginewebview/.test(ua);
  //if (!t && ios && safari) {
  picopicoengine.webaudio = true;
  //}
  picopicoengine.native = t;

  if (picopicoengine.native) {
    console = new Object();
    console.log = function (log) {
      var iframe = document
        .createElement("IFRAME");
      log = encodeURIComponent(log);
      iframe
        .setAttribute("src"
          , "js-call:#iOS#" + log);
      document
        .documentElement
        .appendChild(iframe);
      iframe
        .parentNode
        .removeChild(iframe);
      iframe = null;
    }
    console.debug = console.log;
    console.info = console.log;
    console.warn = console.log;
    console.error = console.log;
  }

  //-----------------------------
  //: ppfont
  var ppfont = {
    strtable: [
      "", "А", "Б", "В", "Г", "Д", "Е", "Ё", "Ж", "З", "★", "Й", "К", "Л", "М", "Н",
      "♪", "О", "н", "П", "Р", "С", "Т", "У", "Ф", "Х", "◎", "蛇", "→", "←", "↑", "↓",
      "　", "！", "”", "＃", "＄", "％", "＆", "’", "（", "）", "＊", "＋", "，", "－", "．", "／",
      "０", "１", "２", "３", "４", "５", "６", "７", "８", "９", "：", "；", "＜", "＝", "＞", "？",
      "＠", "Ａ", "Ｂ", "Ｃ", "Ｄ", "Ｅ", "Ｆ", "Ｇ", "Ｈ", "Ｉ", "Ｊ", "Ｋ", "Ｌ", "Ｍ", "Ｎ", "Ｏ",
      "Ｐ", "Ｑ", "Ｒ", "Ｓ", "Ｔ", "Ｕ", "Ｖ", "Ｗ", "Ｘ", "Ｙ", "Ｚ", "［", "￥", "］", "＾", "＿",
      "｀", "ａ", "ｂ", "ｃ", "ｄ", "ｅ", "ｆ", "ｇ", "ｈ", "ｉ", "ｊ", "ｋ", "ｌ", "ｍ", "ｎ", "ｏ",
      "ｐ", "ｑ", "ｒ", "ｓ", "ｔ", "ｕ", "ｖ", "ｗ", "ｘ", "ｙ", "ｚ", "｛", "￤", "｝", "~", "＼",
      "◇", "━", "┃", "┏", "┓", "┛", "┗", "┣", "┳", "┫", "┻", "╋", "┠", "┯", "┨", "┷",
      "┴", "┬", "├", "┼", "┤", "─", "│", "┿", "┌", "┐", "└", "┘", "┝", "┰", "┥", "┸",
      "―", "。", "「", "」", "、", "・", "ヲ", "ァ", "ィ", "ゥ", "ェ", "ォ", "ャ", "ュ", "ョ", "ッ",
      "ー", "ア", "イ", "ウ", "エ", "オ", "カ", "キ", "ク", "ケ", "コ", "サ", "シ", "ス", "セ", "ソ",
      "タ", "チ", "ツ", "テ", "ト", "ナ", "ニ", "ヌ", "ネ", "ノ", "ハ", "ヒ", "フ", "ヘ", "ホ", "マ",
      "ミ", "ム", "メ", "モ", "ヤ", "ユ", "ヨ", "ラ", "リ", "ル", "レ", "ロ", "ワ", "ン", "゛", "゜",
      "■", "●", "▲", "▼", "□", "○", "△", "▽", "家", "Ш", "戸", "鍵", "車", "Э", "Ю", "Ь",
      "♠", "♥", "♦", "♣", "人", "е", "ё", "д", "ж", "з", "и", "й", "к", "л", "м", "╂",
      "©", "剣", "宝", "瓶", "板", "壁", "を", "ぁ", "ぃ", "ぅ", "ぇ", "ぉ", "ゃ", "ゅ", "ょ", "っ",
      "…", "あ", "い", "う", "え", "お", "か", "き", "く", "け", "こ", "さ", "し", "す", "せ", "そ",
      "た", "ち", "つ", "て", "と", "な", "に", "ぬ", "ね", "の", "は", "ひ", "ふ", "へ", "ほ", "ま",
      "み", "む", "め", "も", "や", "ゆ", "よ", "ら", "り", "る", "れ", "ろ", "わ", "ん", "点", "丸",
    ],
    dakutens: [
      "ガ", "ギ", "グ", "ゲ", "ゴ", "ザ", "ジ", "ズ", "ゼ", "ゾ", "ダ", "ヂ", "ヅ", "デ", "ド", "バ", "ビ", "ブ", "ベ", "ボ",
      "が", "ぎ", "ぐ", "げ", "ご", "ざ", "じ", "ず", "ぜ", "ぞ", "だ", "ぢ", "づ", "で", "ど", "ば", "び", "ぶ", "べ", "ぼ",
      "パ", "ピ", "プ", "ペ", "ポ",
      "ぱ", "ぴ", "ぷ", "ぺ", "ぽ",
    ],
    dakutend: [
      "カ", "キ", "ク", "ケ", "コ", "サ", "シ", "ス", "セ", "ソ", "タ", "チ", "ツ", "テ", "ト", "ハ", "ヒ", "フ", "ヘ", "ホ",
      "か", "き", "く", "け", "こ", "さ", "し", "す", "せ", "そ", "た", "ち", "つ", "て", "と", "は", "ひ", "ふ", "へ", "ほ",
      "ハ", "ヒ", "フ", "ヘ", "ホ",
      "は", "ひ", "ふ", "へ", "ほ",
    ],
    find: function (c) {
      var s = this.dakutens;
      var d = this.dakutend;
      var e = this.strtable;
      var n = 0;
      var t = c.charCodeAt(0);
      if (t >= 0 && t < 128) {
        return [t, n];
      }
      var i;
      for (i = 0; i < s.length; i++) {
        if (s[i] === c) {
          c = d[i];
          n = 318;
          if (i > 40) {
            n = 319;
          }
          break;
        }
      }
      for (i = 0; i < e.length; i++) {
        if (e[i] === c) {
          return [i, n];
        }
      }
      return [0, n];
    }
  }

  function ppcolor(r, g, b) {
    if (r === undefined) r = 255;
    if (g === undefined) g = 255;
    if (b === undefined) b = 255;
    this.r = r;
    this.g = g;
    this.b = b;
  }

  //-----------------------------
  //: pppoint
  function pppoint(x, y) {
    if (x instanceof pppoint) {
      var p = x;
      x = p.x;
      y = p.y;
    } else
      if (x instanceof pprect) {
        var p = x;
        x = p.x;
        y = p.y;
      } else {
        if (typeof (x) == "object") {
          var len = x.length;
          if (len == "undefined") {
            if ("x" in x) {
              x = x.x;
            }
            if ("y" in x) {
              x = x.y;
            }
          } else {
            if (len > 1) y = x[1];
            if (len > 0) x = x[0];
          }
        }
      }
    x = x || 0;
    y = y || 0;
    this.x = x;
    this.y = y;
  }

  pppoint.prototype = {
    div: function (v) {
      var u = new pppoint(this);
      u.x /= v;
      u.y /= v;
      return u;
    },
    mul: function (v) {
      var u = new pppoint(this);
      u.x *= v;
      u.y *= v;
      return u;
    },
    sub: function (x, y) {
      var t = new pppoint(x, y);
      var u = new pppoint(this);
      u.x -= t.x;
      u.y -= t.y;
      return u;
    },
    add: function (x, y) {
      var t = new pppoint(x, y);
      var u = new pppoint(this);
      u.x += t.x;
      u.y += t.y;
      return u;
    },
    move: function (x, y) {
      var t = new pppoint(x, y);
      this.x += t.x;
      this.y += t.y;
      return this;
    },
    pos: function (x, y) {
      if (x == undefined) {
        return new pppoint(this);
      }
      var t = new pppoint(x, y);
      this.x = t.x;
      this.y = t.y;
      return this;
    },
    length: function (x, y) {
      var t = new pprect(x, y);
      var s = this;
      var dx = t.x - s.x;
      var dy = t.y - s.y;
      var l;
      l = Math.sqrt(dx * dx + dy * dy);
      return l;
    }
  }

  //-----------------------------
  function pprect(x, y, w, h) {
    if (x instanceof pppoint) {
      var p = x;
      x = p.x;
      y = p.y;
      w = 0;
      h = 0;
    } else
      if (x instanceof pprect) {
        var p = x;
        x = p.x;
        y = p.y;
        w = p.width;
        h = p.height;
      } else {
        if (typeof (x) == "object") {
          var len = x.length;
          if (len == "undefined") {
            if ("x" in x) {
              x = x.x;
            }
            if ("y" in x) {
              x = x.y;
            }
            if ("width" in x) {
              w = x.width;
            }
            if ("height" in x) {
              h = x.height;
            }
          } else {
            if (len > 1) y = x[1];
            if (len > 2) w = x[2];
            if (len > 3) h = x[3];
            if (len > 0) x = x[0];
          }
        }
      }
    x = x || 0;
    y = y || 0;
    w = w || 0;
    h = h || 0;
    this.x = x;
    this.y = y;
    this.width = w;
    this.height = h;
    this.touchstep = 0;
    this.touchinside = false;
    this.show = false;
  }
  pprect.prototype = {
    div: function (v) {
      var u = new pprect(this);
      u.x /= v;
      u.y /= v;
      return u;
    },
    mul: function (v) {
      var u = new pprect(this);
      u.x *= v;
      u.y *= v;
      return u;
    },
    sub: function (x, y, w, h) {
      var t = new pprect(x, y, w, h);
      var u = new pprect(this);
      u.x -= t.x;
      u.y -= t.y;
      return u;
    },
    add: function (x, y, w, h) {
      var t = new pprect(x, y, w, h);
      var u = new pprect(this);
      u.x += t.x;
      u.y += t.y;
      return u;
    },
    move: function (x, y) {
      var t = new pprect(x, y);
      this.x += t.x;
      this.y += t.y;
      return this;
    },
    pos: function (x, y) {
      if (x === undefined) {
        return new pppoint(this);
      }
      var t = new pppoint(x, y);
      this.x = t.x;
      this.y = t.y;
      return this;
    },
    size: function (w, h) {
      if (w === undefined) {
        var t = new pprect(this);
        t.pos(0, 0);
        return t;
      }
      var t = new pprect(0, 0, w, h);
      this.width = t.width;
      this.height = t.height;
      return this;
    },
    inset: function (dx, dy) {
      var t = new pprect(this);
      t.x += dx;
      t.y += dy;
      t.width -= dx * 2;
      t.height -= dy * 2;
      return t;
    },
    intersect: function (x, y, w, h) {
      var t = new pprect(x, y, w, h);
      var s = this;
      if (t.x + t.width >= s.x
        && t.y + t.height >= s.y
        && t.x < s.x + s.width
        && t.y < s.y + s.height) {
        return true;
      }
      return false;
    },
    contain: function (x, y) {
      var t = new pppoint(x, y);
      var s = this;
      if (t.x >= s.x && t.y >= s.y
        && t.x < s.x + s.width
        && t.y < s.y + s.height) {
        return true;
      }
      return false;
    },
    length: function (x, y) {
      var t = new pprect(x, y);
      var s = this;
      var dx = t.x - s.x;
      var dy = t.y - s.y;
      var l;
      l = Math.sqrt(dx * dx + dy * dy);
      return l;
    },
    align: function (opt, x, y, w, h) {
      var r = new pprect(x, y, w, h);
      var t = this;
      if (opt == 0) opt = 5;
      if (opt == 2
        || opt == 5
        || opt == 8) {
        r.x += (t.width - r.width) / 2;
      } else
        if (opt == 3
          || opt == 6
          || opt == 9) {
          r.x = -r.x + (t.width
            - r.width);
        }
      if (opt == 4
        || opt == 5
        || opt == 6) {
        r.y += (t.height
          - r.height) / 2;
      } else
        if (opt == 1
          || opt == 2
          || opt == 3) {
          r.y = -r.y + (t.height
            - r.height);
        }
      return r;
    },
    center: function () {
      var s = this;
      var x = s.x + s.width / 2;
      var y = s.y + s.height / 2;
      return new pppoint(x, y);
    },
    append: function (o) {
      var t = this;
      o.remove();
      o.super = t;
      o.next = t.child;
      if (o.next) {
        o.next.prev = o;
      }
      t.child = o;
      return this;
    },
    remove: function () {
      var t = this;
      if (t.super) {
        if (t.super.child == t) {
          t.super.child = t.next;
        }
      }
      if (t.next) {
        t.next.prev = t.prev;
      }
      if (t.prev) {
        t.prev.next = t.next;
      }
      delete t.super;
      delete t.next;
      delete t.prev;
      return this;
    },
    walk: function (func) {
      var t = this;
      if (t[func]) {
        if (t[func]()) {
          return this;
        }
      }
      if (t.child) {
        var o = t.child;
        while (o) {
          var n = o.next;
          o.walk(func);
          o = n;
        }
      }
      return this;
    },
    idleself: function () {
    },
    drawself: function (x, y) {
    },
    _draw: function () {
      var t = this;
      var gp = new pppoint();
      if (t.super) {
        if (t.super.gpos) {
          gp = t.super.gpos;
        }
      }
      t.gpos = new pppoint(
        t.x + gp.x, t.y + gp.y);
      if (t.show) {
        t.drawself(gp.x, gp.y);
      } else {
        return true;
      }
    },
    idle: function () {
      var t = this;
      return t.walk("idleself");
    },
    draw: function () {
      return this.walk("_draw");
    },
    childnum: function () {
      var t = this;
      var c = 0;
      if (t.child) {
        var o = t.child;
        while (o) {
          c++;
          o = o.next;
        }
      }
      return c;
    },
    button: function (touch) {
      var t = this;
      if (t.touchstep == 0) {
        t.touchinside = false;
        if (touch.length > 0) {
          t.touchstep = -1;
        }
        for (var i in touch) {
          var p = touch[i];
          if (t.contain(p)) {
            t.touchpoint = p;
            t.touchstep = 1;
            t.touchinside = true;
            break;
          }
        }
      } else
        if (t.touchstep == 1) {
          if (touch.length > 0) {
            t.touchinside = false;
            for (var i in touch) {
              var p = touch[i];
              if (t.contain(p)) {
                t.touchpoint = p;
                t.touchinside = true;
                break;
              }
            }
          } else {
            t.touchstep = 0;
            if (t.touchinside) {
              t.touchinside = false;
              return true;
            }
          }
        } else {
          t.touchinside = false;
          if (touch.length == 0) {
            t.touchstep = 0;
          }
        }
      return false;
    },
    touchth: 128,
    touch: function (touch) {
      var t = this;
      if (t.touchstep == 0) {
        t.touchinside = false;
        for (var i in touch) {
          var p = touch[i];
          if (t.contain(p)) {
            t.touchpoint = p;
            t.touchstep = 1;
            t.touchinside = true;
            return true;
            break;
          }
        }
      } else {
        t.touchinside = false;
        for (var i in touch) {
          var p = touch[i];
          if (t.contain(p)) {
            t.touchpoint = p;
            t.touchinside = true;
            break;
          }
        }
        if (!t.touchinside) {
          t.touchstep = 0;
        }
      }
      return false;
    },
    findtouch: function (ts, p) {
      var l = -1;
      var r;
      for (var i in ts) {
        if (l < 0) {
          l = ts[i].length(p);
          r = ts[i];
        } else {
          var m = ts[i].length(p);
          if (m < l) {
            l = m;
            r = ts[i];
          }
        }
      }
      return r;
    },
    vkey: function (touch, free) {
      var t = this;
      var k = 0;
      if (t.touchstep == 0) {
        t.touchinside = false;
        for (var i in touch) {
          var p = touch[i];
          if (t.contain(p)) {
            if (free) {
              t.vkeycenter = p;
            } else {
              var c = t.center();
              t.vkeycenter = c;
            }
            t.touchpoint = p;
            t.touchstep = 1;
            t.touchinside = true;
            break;
          }
        }
      } else {
        if (touch.length <= 0) {
          t.touchstep = 0;
          t.touchinside = false;
        } else {
          var ntouch = t.findtouch(
            touch,
            t.touchpoint);
          t.touchinside = true;
          var tl = t.touchpoint;
          if (tl.length(ntouch)
            > t.touchth) {
            t.touchinside = false;
            t.touchstep = 0;
          }
          t.touchpoint = ntouch;
        }
      }
      if (t.touchinside) {
        var c = t.vkeycenter;
        var p = t.touchpoint;
        var d = p.sub(c);
        var atan = Math.atan2;
        var pi = Math.PI;
        var q = atan(-d.y, d.x) * 180;
        q /= pi;
        var dv = 4;
        var dr = 360 / dv;
        q = q + dr / 2;
        if (q < 0) q += 360;
        q = Math.floor(q / dr) + 1;
        t.delta = d;
        if (t.delta.length() < 8) {
          return 0;
        }
        return q;
      }
      t.delta = new pppoint();
      return k;
    },
    drag: function (touch, b) {
      var t = this;
      if (t.touchstep == 0) {
        if (touch.length > 0) {
          t.touchpoint = touch[0];
          t.p = t.sub(touch[0]);
          var p = touch[0];
          t.pos(t.p.add(p));
          t.touchstep = 1;
        }
      } else
        if (t.touchstep == 1) {
          if (touch.length > 0) {
            var ntouch = t.findtouch(
              touch,
              t.touchpoint);
            var p = t.touchpoint;
            if (p.length(ntouch)
              > t.touchth) {
              t.touchstep = 0;
              return;
            }
            t.touchpoint = ntouch;
            t.pos(t.p.add(ntouch));

            if (b) {
              if (t.x < b.x) {
                t.x = b.x;
                t.p = t.sub(ntouch);
              }
              if (t.y < b.y) {
                t.y = b.y;
                t.p = t.sub(ntouch);
              }
              if (t.x + t.width
                >= b.x + b.width) {
                t.x = b.x
                  + b.width - t.width;
                t.p = t.sub(ntouch);
              }
              if (t.y + t.height
                >= b.y + b.height) {
                t.y = b.y
                  + b.height - t.height;
                t.p = t.sub(ntouch);
              }
            }

          } else {
            t.touchstep = 0;
          }
        }
      return this;
    }
  }

  //-----------------------------
  //: ppimage
  function ppimage(n) {
    pprect.call(this, 0, 0, 0, 0);
    this.filename = n;
  }
  ppimage.prototype = new pprect();

  //-----------------------------
  //: pptileinfo
  var pptileinfo = {
    calc: function (tex, i) {
      var r;
      r = new pprect(0, 0, 32, 32);
      var tw = tex.width;
      var th = tex.height;
      var t = this;
      var w = t.width + t.stride.x;
      var c = tw - t.offset.x;
      c += t.stride.x;
      c = Math.floor(c / w);
      r.x = (i % c) * w;
      w = t.height + t.stride.y;
      r.y = Math.floor(i / c) * w;
      r.move(this.offset);
      r.size(t.width, t.height);
      return r;
    },
    size: function (w, h) {
      var t = this;
      if (w === undefined) {
        w = t.tileinfo.width;
        h = t.tileinfo.height;
        return new pprect(w, h);
      }
      var s;
      if (w instanceof pprect) {
        s = w;
      } else {
        s = new pprect(0, 0, w, h);
      }
      t.tileinfo.width = s.width;
      t.tileinfo.height = s.height;
    }
  }

  //-----------------------------
  var g = {
    //: game
    game: function () {
      var d = document;
      var cn = "canvas";
      var elm;
      elm = d.createElement(cn);
      elm.id = 'game-canvas';

      var dc = d.documentElement;
      var w = dc.clientWidth;
      var h = dc.clientHeight;
      d.body.appendChild(elm);
      var c = this.core(elm);

      function mousedown(e) {
        e.preventDefault();
        c.touchdown = true;
        c.settouch(e);
        c.setmouse(e);
        c.touchstart(e);
        if (picopicoengine.webaudio) {
          picopicosound.start();
        }
      }
      function mousemove(e) {
        e.preventDefault();
        c.settouch(e);
        c.setmouse(e);
        c.touchmove(e);
      }
      function mouseup(e) {
        e.preventDefault();
        c.touchdown = false;
        c.settouch(e);
        c.setmouse(e);
        c.touchend(e);
      }

      elm.addEventListener(
        "mousedown", mousedown, false)
      elm.addEventListener(
        "mousemove", mousemove, false)
      elm.addEventListener(
        "mouseup", mouseup, false)

      elm.addEventListener(
        "touchstart", mousedown, false)
      elm.addEventListener(
        "touchmove", mousemove, true)
      elm.addEventListener(
        "touchend", mouseup, false)

      if (window.navigator.msPointerEnabled) {
        elm.addEventListener(
          "MSPointerDown", mousedown, false);
        elm.addEventListener(
          "MSPointerMove", mousemove, false);
        elm.addEventListener(
          "MSPointerUp", mouseup, false);
      }

      c.element.width = w;
      c.element.height = h;
      c.width = w;
      c.height = h;
      return c;
    },
    //: find
    find: function (id) {
      var d = document;
      var cn = "canvas";
      var elm;
      elm = d.findElementById(id);
      var dc = d.documentElement;
      var c = this.core(elm);
      c.width = w;
      c.height = h;
      return c;
    },
    //: offscreen
    offscreen: function (w, h) {
      var d = document;
      var cn = "canvas";
      var elm;
      elm = d.createElement(cn);
      elm.id = 'game-canvas';
      var c = this.core(elm);
      c.element.width = w;
      c.element.height = h;
      c.width = w;
      c.height = h;
      return c;
    },
    //: core
    core: function (elm) {
      var d = document;

      var c = new pprect();
      c.images = {};
      c.show = true;
      c.imagecount = 0;

      c.element = elm;

      var con = elm.getContext('2d');

      con.imageSmoothingEnabled = false;
      con.mozImageSmoothingEnabled = false;
      con.webkitImageSmoothingEnabled = false;
      con.msImageSmoothingEnabled = false;

      c.ctx = con;
      c.drawImage = function (img) {
        var args = arguments;
        var con = this.ctx;
        if ("element" in img) {
          args[0] = img.element;
        } else
          if ("_img" in img) {
            args[0] = img._img;
          }
        con.drawImage.
          apply(con, args);
        return this;
      }
      c._color = new ppcolor(0, 0, 0);
      c.color = function (r, g, b) {
        var t = this;
        if (r === undefined) {
          return this._color;
        }
        if (typeof (r) == "object") {
          if ('g' in r) {
            g = r.g;
          }
          if ('b' in r) {
            b = r.b;
          }
          if ('r' in r) {
            r = r.r;
          }
        }
        if (g === undefined) g = 255;
        if (b === undefined) b = 255;
        var con = t.ctx;
        con.fillStyle =
          "rgb(" + r + "," + g + "," + b + ")";
        con.strokeStyle =
          "rgb(" + r + "," + g + "," + b + ")";
        t._color = new ppcolor(r, g, b)
        return this;
      }
      c.alpha = function (a) {
        var con = this.ctx;
        if (a === undefined) {
          var a = con.globalAlpha;
          return a * 255;
        }
        con.globalAlpha = a / 255.0;
        return this;
      }

      var canvasapi = [
        "strokeText",
        "fillText",
        "putImageData",
        "getImageData",
        "createImageData",
        "clearRect",
        "strokeRect",
        "fillRect",
        "measureText"
      ]
      for (var v in canvasapi) {
        var k = canvasapi[v]
        c[k] = (function (k) {
          return function () {
            var args = arguments;
            var con = this.ctx
            // con.imageSmoothingEnabled=false;
            // con.mozImageSmoothingEnabled=false;
            // con.webkitImageSmoothingEnabled=false;
            // con.msImageSmoothingEnabled = false;
            con[k].apply(con, args);
          }
        })(k);
      }
      c.touchdown = false;
      c.touch = [];
      c.mouse = [];
      c.touchstart = function (e) { }
      c.touchmove = function (e) { }
      c.touchend = function (e) { }
      c.settouch = function (e) {
        var t = this;
        var r = [];
        if ("targetTouches" in e) {
          var tt = e.targetTouches;
          var l = tt.length;
          for (var i = 0; i < l; i++) {
            var t = tt[i];
            var p;
            var x = t.pageX;
            var y = t.pageY;
            p = new pppoint(x, y);
            r[r.length] = p;
          }
        } else
          if (t.touchdown) {
            var x = e.pageX;
            var y = e.pageY;
            r = [new pppoint(x, y)];
          }
        this.touch = r;
      }
      c.setmouse = function (e) {
        var x = e.pageX;
        var y = e.pageY;
        this.mouse = [new pppoint(x, y)];
      }

      c.tileinfo = {
        width: 32,
        height: 32,
        stride: new pppoint(0, 0),
        offset: new pppoint(0, 0),
        pos: pptileinfo.calc
      }

      c.fontInfo = {
        width: 15,
        height: 15,
        stride: new pppoint(1, 1),
        offset: new pppoint(0, 0),
        pos: pptileinfo.calc
      }

      c.put = function (i, x, y, w, h) {
        if (i <= 0) return;
        var t = new pppoint(x, y);
        var o = this.tileinfo.pos(
          this.image, i - 1
        )
        o.w = o.width;
        o.h = o.height;
        if (w != undefined) o.w = w;
        if (h != undefined) o.h = h;
        this.drawImage(
          this.image,
          o.x, o.y,
          o.w, o.h,
          t.x, t.y,
          o.w, o.h);
        return this;
      }

      c.loadcount = 0;

      c.load = function (name) {
        var imgs = this.images;
        for (var k in imgs) {
          var tex = this.images[k];
          var f = tex.filename;
          if (f == name) {
            return tex;
          }
        }
        this.loadcount++;
        var img = new ppimage(name);
        img.loaded = false;
        img.request = true;
        this.images[name] = img;
        var _img = new Image();
        img._img = _img;
        _img.onload = function () {
          var sw, sh;
          sw = this.width;
          sh = this.height;
          img.width = sw;
          img.height = sh;
          img.loaded = true;
        }
        _img.src = img.filename;
        return img;
      }
      c.findimage = function (name) {
        return this.images[name];
      }
      //: run
      c.run = function (func) {
        var t = this;
        var w = window;
        var req = (function () {
          var w = window;
          return w.requestAnimatinFrame
            ||
            w.webkitRequestAnimationFrame
            ||
            w.mozRequestAnimationFrame
            ||
            function (c) {
              w.setTimeout(c, 1000 / 60);
            }
        })();

        (function animeloop() {
          req(animeloop);

          if (t.loadcount > 0) {
            var imgs = t.images;
            for (var k in imgs) {
              var im = imgs[k];
              if (!im.loaded) {
                return;
              }
              if (im.request) {
                im.request = false;
                t.loadcount--;
              }
            }
          }
          if (t.loadcount > 0) return;

          func();
        })();

        return this;
      }
      c.size = function () {
        var d = document;
        var dc = d.documentElement;
        var w = dc.clientWidth;
        var h = dc.clientHeight;
        return new pprect(0, 0, w, h);
      }

      c.sprite = function (x, y) {
        var o = new ppsprite(x, y);
        o.g = this;
        return o;
      }

      c.map = function (x, y, w, h) {
        var o = new ppmap(x, y, w, h);
        o.g = this;
        return o;
      }

      c.point = function (x, y) {
        var o = new pppoint(x, y);
        return o;
      }

      c.rect = function (x, y, w, h) {
        var o = new pprect(x, y, w, h);
        return o;
      }

      c.box = function (r, cr, cg, cb) {
        var t = this;
        var oldc = t.color();
        if (cr !== undefined) {
          t.color(cr, cg, cb);
        }
        t.strokeRect(r.x, r.y,
          r.width, r.height);
        t.color(oldc);
        return this;
      }

      c.fill = function (r, cr, cg, cb) {
        var t = this;
        var oldc = t.color();
        if (cr !== undefined) {
          t.color(cr, cg, cb);
        }
        t.fillRect(r.x, r.y,
          r.width, r.height);
        t.color(oldc);
        return this;
      }

      //: print
      c.print = function (s, x, y) {
        s = "" + s;
        var flr = Math.floor;
        var u = new pppoint(x, y);
        var t = this;
        var f = t.font;
        var o;
        var i;
        var st = t.fontInfo.stride;
        var sy = st.y;
        var sx = st.x;
        for (i = 0; i < s.length; i++) {
          var c = s.charAt(i);
          c = ppfont.find(c);
          o = t.fontInfo.pos(f, c[0]);
          o.w = o.width;
          o.h = o.height;
          t.drawImage(
            t.font,
            o.x, o.y,
            o.w, o.h,
            u.x, u.y,
            o.w, o.h);
          if (c[1] > 0) {
            var tf = t.fontInfo;
            var o = tf.pos(f, c[1]);
            o.w = o.width;
            o.h = o.height;
            t.drawImage(
              t.font,
              o.x, o.y,
              o.w, o.h,
              u.x, u.y - o.h,
              o.w, o.h);
          }
          u.x += o.w + sx;
        }
        return this;
      }

      c.size = function (w, h) {
        var t = this;
        if (w === undefined) {
          var r;
          w = t.width;
          h = t.height;
          r = new pprect(0, 0, w, h);
          return r;
        }
        t.element.width = w;
        t.element.height = h;
        t.width = w;
        t.height = h;
        return this;
      }

      c.copydata = function (d) {
        var j = [];
        var x, y;
        for (y = 0; y < d.length; y++) {
          var c = [];
          j[y] = c;
          var e = d[y];
          for (x = 0; x < e.length; x++) {
            c[x] = e[x];
          }
        }
        return j;
      }

      //: loadmap
      c.loadmap = function (n) {
        var g = this;

        mapload = function (n, i) {
          var tw = 32;
          var th = 32;
          var w = 10;
          var h = 10;
          var data = [[]];
          var image;

          if ("tilewidth" in n) {
            tw = n.tilewidth;
          }
          if ("tileheight" in n) {
            th = n.tileheight;
          }
          if ("width" in n) {
            w = n.width;
          }
          if ("height" in n) {
            h = n.height;
          }
          if ("image" in n) {
            image = g.load(n.image);
          }
          if ("layer" in n) {
            data = g.copydata(
              n.layer[i]);
          }

          var o = g.map(0, 0,
            w * tw, h * th);
          o.image = image;
          o.data = data;
          return o;
        }

        var map = g.sprite();
        var o = mapload(n, 1);
        map.append(o);
        o = mapload(n, 0);
        map.append(o);
        var ch = map.child;
        map.width = ch.width;
        map.height = ch.height;
        map.layer1 = ch;
        map.layer2 = ch.next;
        return map;
      }

      c.tilesize = pptileinfo.size;

      c.offscreen =
        function (x, y, w, h) {
          var f = new pprect(x, y, w, h);
          x = f.x;
          y = f.y;
          w = f.width;
          h = f.height;
          var win = window;
          var g = "picopico";
          var wg = win[g];
          var o = wg.offscreen(w, h);
          o.drawself = function (x, y) {
            var t = this;
            t.g.drawImage(t,
              t.x + x, t.y + y);
          }
          o.pos(f);
          o.g = this;
          return o;
        }

      c.mml = [];
      for (var i = 0; i < 3; i++) {
        var p = new ppflmml(i);
        c.mml[i] = p;
      }
      c.se = [];
      for (var i = 0; i < 5; i++) {
        var p = new ppsemml(i);
        c.se[i] = p;
      }

      c.white = { r: 255, g: 255, b: 255 }
      c.red = { r: 255, g: 0, b: 0 }
      c.green = { r: 0, g: 255, b: 0 }
      c.blue = { r: 0, g: 0, b: 255 }
      c.yellow = { r: 255, g: 255, b: 0 }
      c.cyan = { r: 0, g: 255, b: 255 }
      c.magenta = { r: 255, g: 0, b: 255 }
      c.black = { r: 0, g: 0, b: 0 }

      //: virtualScreen
      c.virtualScreen = function (sz) {
        var g = this;
        var s = g.size();

        var f = [0, 0, 320, 480];
        if (g.width == 320
          && g.height > 480) {
          f = [0, 0, 320, 568];
        }
        if (sz) {
          f = sz;
        }
        var f = g.size().align(0, f);
        var sw = s.width / f.width;
        var sh = s.height / f.height;
        if (sw > sh) {
          sw = sh;
        }
        var ct = g.point(
          s.width, s.height).div(2);

        var o = g.offscreen(f);
        o.drawself = function (x, y) {
          var t = this;

          t.g.ctx.save();

          // t.g.ctx.imageSmoothingEnabled=false;
          // t.g.ctx.mozImageSmoothingEnabled=false;
          // t.g.ctx.webkitImageSmoothingEnabled=false;
          // t.g.ctx.msImageSmoothingEnabled = false;

          t.g.ctx.translate(
            ct.x, ct.y);
          t.g.ctx.scale(sw, sw);
          t.g.ctx.translate(
            -ct.x, -ct.y);
          t.g.drawImage(t,
            t.x + x, t.y + y);
          t.g.ctx.restore();
        }
        o.screenScale = sw;
        o.offset = g.point(
          -(g.width - o.width * sw) / 2,
          -(g.height - o.height * sh) / 2);
        return o;
      }

      c.touchCalc = function (v) {
        var g = this;
        var t = [];
        for (var i in g.touch) {
          var gt = g.touch[i];
          var p = g.point(gt);
          p = p.add(v.offset);
          p = p.div(v.screenScale);
          t[t.length] = p;
        }
        return t;
      }

      c.mouseCalc = function (v) {
        var g = this;
        var t = [];
        for (var i in g.mouse) {
          var gt = g.mouse[i];
          var p = g.point(gt);
          p = p.add(v.offset);
          p = p.div(v.screenScale);
          t[t.length] = p;
        }
        return t;
      }

      //: colorChange
      c.colorChange
        = function (i, r, g, b) {
          var t = this;
          var o;
          o = t.offscreen(
            0, 0, i.width, i.height);
          o.drawImage(i, 0, 0);
          var c = o.ctx.
            globalCompositeOperation;
          o.ctx.
            globalCompositeOperation
            = "source-atop";
          o.color(r, g, b);
          o.fillRect(
            0, 0, i.width, i.height);
          o.ctx.
            globalCompositeOperation
            = c;
          return o;
        }

      return c;
    }
  }

  window.picopico = g;

  //-----------------------------
  //: ppmap
  function ppmap(x, y, w, h) {
    if (w === undefined) w = 32;
    if (h === undefined) h = 32;
    x = x || 0;
    y = y || 0;
    pprect.call(this, x, y, w, h);
    this.data = [];
    this._data = [];
    var d = document;
    var e = 'canvas';
    var elm = d.createElement(e);
    elm.width = w;
    elm.height = h;
    this.elm = elm;
    this.c = elm.getContext('2d');
    this.show = true;
    this.tileinfo = {
      width: 32,
      height: 32,
      stride: new pppoint(0, 0),
      offset: new pppoint(0, 0),
      pos: pptileinfo.calc
    }
    this.alpha = 255;
  }
  ppmap.prototype = new pprect()
  ppmap.prototype.put
    = function (i, x, y) {
      var t = this;
      i--;
      if (i <= 0) {
        t.c.clearRect(
          x, y,
          t.tileinfo.width,
          t.tileinfo.height);
        return this;
      }

      var img = t.image;
      if ("_img" in img) {
        var tf = t.tileinfo;
        var o = tf.pos(img, i);
        o.w = o.width;
        o.h = o.height;

        t.c.clearRect(
          x, y,
          o.w, o.h);

        t.c.drawImage(
          img._img,
          o.x, o.y,
          o.w, o.h,
          x, y,
          o.w, o.h);
      }
      return this;
    }
  ppmap.prototype.update
    = function (d) {
      var t = this;
      if (!t.image.loaded) {
        return;
      }
      var x = t.x;
      var y = t.y;

      var dl = d.length;
      var info = t.tileinfo;
      var dw = info.width;
      var dh = info.height;
      var n = t._data;
      t.upct = 0

      for (var y = 0; y < d.length; y++) {
        var e = d[y];
        if (d.length > n.length) {
          var x;
          for (x = 0; x < e.length; x++) {
            var i = e[x];
            t.put(i, x * dw, y * dh);
            t.upct++;
          }
        } else {
          var f = n[y];
          var x;
          for (x = 0; x < e.length; x++) {
            var i = e[x];
            if (x > f.length) {
              t.put(i, x * dw, y * dh);
              t.upct++;
            } else
              if (i != f[x]) {
                t.put(i, x * dw, y * dh);
                t.upct++;
              }
          }
        }
      }
      if (t.upct > 0) {
        t._data = t.g.copydata(d);
      }
      return this;
    }
  ppmap.prototype.drawself
    = function (x, y) {
      var t = this;
      var f = Math.floor;
      t.update(t.data);
      var alpha = t.g.alpha();
      t.g.alpha(t.alpha);
      t.g.drawImage(t.elm,
        f(t.x + x), f(t.y + y));
      t.g.alpha(alpha);
      return this;
    }
  ppmap.prototype.scroll
    = function (x, y) {
      var p = new pppoint(x, y);
      var t = this;
      var d = t.data;

      var mw = 0;
      for (var y = 0; y < d.length; y++) {
        if (mw < d[y].length) {
          mw = d[y].length;
        }
      }
      for (var y = 0; y < d.length; y++) {
        var e = d[y];
        var l = e.length;
        if (mw > l) {
          for (var x = l; x < mw; x++) {
            e[x] = 0;
          }
        }
      }

      var u = t.g.copydata(d);

      for (var y = 0; y < d.length; y++) {
        var e = d[y];
        var x;
        for (x = 0; x < e.length; x++) {
          var yy = y + p.y;
          var xx = x + p.x;
          while (xx < 0) {
            xx += e.length;
          }
          while (yy < 0) {
            yy += d.length;
          }
          while (xx >= e.length) {
            xx -= e.length;
          }
          while (yy >= d.length) {
            yy -= d.length;
          }
          u[yy][xx] = d[y][x];
        }
      }

      t.data = u;

      return this;
    }
  ppmap.prototype.tilesize
    = pptileinfo.size;
  ppmap.prototype.tile
    = function (x, y) {
      var flr = Math.floor;
      var t = this;
      var tf = t.tileinfo;
      var p = new pppoint(x, y);
      p.x = flr(p.x / tf.width);
      p.y = flr(p.y / tf.height);
      if (p.y >= 0
        && p.y < t.data.length) {
        var len = t.data[p.y].length;
        if (p.x >= 0 && p.x < len) {
          return t.data[p.y][p.x];
        }
      }
      return 0;
    }
  ppmap.prototype.gettile
    = function (x, y) {
      var p = new pppoint(x, y);
      var t = this;
      var len = t.data.length;
      if (p.y >= 0 && p.y < len) {
        var men = t.data[p.y].length;
        if (p.x >= 0 && p.x < men) {
          return t.data[p.y][p.x];
        }
      }
      return t.data[p.y][p.x];
    }
  ppmap.prototype.settile
    = function (x, y, tile) {
      var p = new pppoint(x, y);
      var t = this;
      if (p.x < 0 || p.y < 0) {
        return;
      }
      var l = t.data.length;
      if (p.y >= l) {
        for (var y = l; y <= p.y; y++) {
          t.data[y] = [[]];
        }
      }
      var l = t.data[p.y].length;
      if (p.x >= l) {
        for (var x = l; x <= p.x; x++) {
          t.data[y][x] = 0;
        }
      }
      t.data[p.y][p.x] = tile;
      return this;
    }

  //-----------------------------
  //: ppsprite
  function ppsprite(x, y, w, h) {
    if (w === undefined) w = 32;
    if (h === undefined) h = 32;
    x = x || 0;
    y = y || 0;
    pprect.call(this, x, y, w, h);
    this.tile = 0;
    this.frametime = 0;
    this.show = true;
    this.tileinfo = {
      width: 32,
      height: 32,
      stride: new pppoint(0, 0),
      offset: new pppoint(0, 0),
      pos: pptileinfo.calc
    }
    this.pivot = new pppoint();
    this.rotate = 0;
    this.scale = new pppoint(1, 1);
    this.alpha = 255;
  }
  ppsprite.prototype = new pprect();
  ppsprite.prototype.calcframe
    = function (d, f) {
      var t = this;
      var l = f.length;
      var q = d / l;
      t.frametime++;
      while (t.frametime >= d * 60) {
        t.frametime -= d * 60;
      }
      var n = t.frametime / (q * 60);
      return Math.floor(n);
    }
  ppsprite.prototype.loopAnime
    = function (d, f) {
      var t = this;
      t.tile = f[t.calcframe(d, f)];
      return this;
    }
  ppsprite.prototype.playAnime
    = function (d, f) {
      var t = this;
      var l = f.length;
      if (t.tile >= l - 1) {
        t.tile = l - 1;
        return true;
      }
      t.tile = f[t.calcframe(d, f)];
      return false;
    }
  ppsprite.prototype.resetAnime
    = function (f) {
      var t = this;
      if (f !== undefined) {
        t.tile = f[0];
      }
      t.frametime = 0;
      return this;
    }
  ppsprite.prototype.drawself
    = function (x, y) {
      var t = this;
      var tl = t.tile;
      var fl = Math.floor;
      if (tl <= 0) return;
      var im = t.g.image;
      if (t.image) {
        im = t.image;
      }
      if (im) {
        var tf = t.tileinfo;
        var o = tf.pos(im, tl - 1);
        var c = new pppoint(t.x + x,
          t.y + y);
        var s = new pppoint(t.scale);
        var alpha = t.g.alpha();
        t.g.alpha(t.alpha);
        o.w = o.width;
        o.h = o.height;
        if (t.rotate == 0
          && s.x == 1 && s.y == 1) {
          t.g.drawImage(
            im,
            o.x, o.y,
            o.w, o.h,
            fl(c.x), fl(c.y),
            o.w, o.h);
        } else {
          var p = new pppoint(
            t.pivot);
          var f = c.add(p);

          t.g.ctx.save();

          // t.g.ctx.imageSmoothingEnabled=false;
          // t.g.ctx.mozImageSmoothingEnabled=false;
          // t.g.ctx.webkitImageSmoothingEnabled=false;
          // t.g.ctx.msImageSmoothingEnabled = false;

          t.g.ctx.translate(f.x,
            f.y);
          t.g.ctx.rotate(t.rotate);
          t.g.ctx.scale(s.x, s.y);
          t.g.ctx.translate(-f.x,
            -f.y);

          t.g.drawImage(
            im,
            o.x, o.y,
            o.w, o.h,
            fl(c.x), fl(c.y),
            o.w, o.h);

          t.g.ctx.restore();
        }
        t.g.alpha(alpha);
      }
      return this;
    }
  ppsprite.prototype.tilesize
    = function (w, h) {
      if (w === undefined) {
        w = this.tileinfo.width;
        h = this.tileinfo.height;
        return new pprect(0, 0, w, h);
      }
      var args = arguments;
      pptileinfo.size.
        apply(this, args);
      var tf = this.tileinfo;
      this.width = tf.width;
      this.height = tf.height;
      return this;
    }

  //-----------------------------
  //: ppnativecall

  function ppnativecall() {
    this.e = picopicoengine;
  }
  ppnativecall.prototype = {
    callnative: function (cmd) {
      if (this.e.native) {
        callnative(cmd);
      }
    }
  }

  //-----------------------------
  //: ppflmml
  function ppflmml(index) {
    if (!index) index = 0;
    ppnativecall.call(this);
    this.index = index;
  }
  ppflmml.prototype = new ppnativecall();
  ppflmml.prototype.play
    = function (mml) {
      this.e.track = this.index;
      if (mml) {
        this.e.mml = mml;
      } else {
        this.e.mml = "";
      }
      this.callnative("flmml-play");
      return this;
    }
  ppflmml.prototype.preload
    = function (mml) {
      var t = this;
      t.e.track = t.index;
      t.e.mml = mml;
      var cmd = "flmml-preload";
      t.callnative(cmd);
      return this;
    }
  ppflmml.prototype.stop
    = function () {
      this.e.track = this.index;
      var cmd = "flmml-stop";
      this.callnative(cmd);
      return this;
    }
  ppflmml.prototype.resume
    = function () {
      this.e.track = this.index;
      var cmd = "flmml-resume";
      this.callnative(cmd);
      return this;
    }
  ppflmml.prototype.pause = function () {
    this.e.track = this.index;
    var cmd = "flmml-pause";
    this.callnative(cmd);
    return this;
  }
  ppflmml.prototype.isplaying = function () {
    this.e.track = this.index;
    var cmd = "flmml-isplaying";
    this.callnative(cmd);
    return this.e.value;
  }
  ppflmml.prototype.ispaused = function () {
    this.e.track = this.index;
    var cmd = "flmml-ispaused";
    this.callnative(cmd);
    return this.e.value;
  }
  ppflmml.prototype.volume = function (v) {
    this.e.track = this.index;
    if (v == undefined) {
      var cmd = "flmml-getvolume";
      this.callnative(cmd);
      return this.e.volume;
    }
    this.e.volume = v;
    var cmd = "flmml-setvolume";
    this.callnative(cmd);
    return this;
  }

  //-----------------------------
  //: ppsemml
  function ppsemml(index) {
    if (!index) index = 0;
    ppnativecall.call(this);
    this.index = index;
  }
  ppsemml.prototype = new ppnativecall();
  ppsemml.prototype.play
    = function (mml, stop) {
      if (stop) {
        picopicoengine.stop = true;
      } else {
        picopicoengine.stop = false;
      }
      this.e.track = this.index;
      if (mml) {
        this.e.mml = mml;
      } else {
        this.e.mml = "";
      }
      var cmd = "semml-play";
      if (picopicoengine.webaudio) {
        picopicosound.call(cmd);
      } else {
        this.callnative(cmd);
      }
      return this;
    }
  ppsemml.prototype.stop
    = function () {
      this.e.track = this.index;
      var cmd = "semml-stop";
      if (picopicoengine.webaudio) {
        picopicosound.call(cmd);
      } else {
        this.callnative(cmd);
      }
      return this;
    }
  ppsemml.prototype.volume
    = function (v) {
      this.e.track = this.index;
      if (v == undefined) {
        var cmd = "semml-getvolume";
        if (picopicoengine.webaudio) {
          picopicosound.call(cmd);
        } else {
          this.callnative(cmd);
        }
        return this.e.volume;
      }
      this.e.volume = v;
      var cmd = "semml-setvolume";
      if (picopicoengine.webaudio) {
        picopicosound.call(cmd);
      } else {
        this.callnative(cmd);
      }
      return this;
    }
  ppsemml.prototype.isplaying
    = function () {
      this.e.track = this.index;
      var cmd = "semml-isplaying";
      if (picopicoengine.webaudio) {
        picopicosound.call(cmd);
      } else {
        this.callnative(cmd);
      }
      return this.e.value;
    }

}(window));
