//-- SPACE ATTACK --

scrollspeed = 1;
duration = 30;
objduration = 8;
T = true;

var game = picopico.game();
var ti = tileinfo;
var LS = localStorage;
var KEY = "space-attack-hiscore";
var floor = Math.floor;

var hiscore = LS.getItem(KEY);
if (!hiscore) {
  hiscore = 10;
}

var view = game.virtualScreen();

var rand = function (a, b) {
  var r = Math.random();
  return floor(a + r * (b - a));
}

//-----------------------------
var mainimg = game.load("main.png");
var white = game.load(
  "picopico-font.png");
var redfont;
var magentafont;
var blackfont;
var bluefont;
var cyanfont;
var smokeimg;
function fontinit() {
  if (!redfont) {
    redfont = game.colorChange(
      white, 255, 0, 0);
  }
  if (!magentafont) {
    magentafont = game.colorChange(
      white, 255, 0, 255);
  }
  if (!blackfont) {
    blackfont = game.colorChange(
      white, 0, 0, 0);
  }
  if (!bluefont) {
    bluefont = game.colorChange(
      white, 0, 0, 255);
  }
  if (!cyanfont) {
    cyanfont = game.colorChange(
      white, 0, 255, 255);
  }
  if (!smokeimg) {
    smokeimg = game.colorChange(
      mainimg, 255, 128, 0);
  }
}

score = 0;

var i = "t300o7v9@1l16q16";
se = {
  hit: i + "@15-1o8l16v9cgabgdc",
  shot: i + "@15-1o4l16v9cd",
  bang: i + "@7o1v15l8dcdcv7cv5cv3cv1c",
  start: i + "@15-1o6v15g4<crcrc",
  dam: i + "@1o7v9cg"
}

sp = view.sprite(0, 0);
sp.image = game.load("main.png");
sp.pivot = [16, 16];

ttlmap = view.loadmap(ti.map.map1);
map = view.loadmap(ti.map.map2);
map.render = function () {
  var t = this;
  t.g.color(game.black);
  t.g.fillRect(
    0, 0, t.g.width, t.g.height);
  t.y = t.posy;
  t.draw();
  t.y = t.posy - t.height;
  t.draw();
  t.y = t.posy + t.height;
  t.draw();
}
map.idleself = function () {
  var t = this;
  t.posy += scrollspeed;
  if (t.posy > t.height) {
    t.posy -= t.height;
  }
}
map.tile = function (p) {
  var t = this;
  var p = view.point(p);
  p.y -= t.posy;
  if (p.y < 0) {
    p.y += t.height;
  }
  var r = t.child.next.tile(p);
  return r;
}

function dispscore(score) {
  view.alpha(128);
  view.color(0, 0, 0);
  view.fillRect(0, 0, view.width, 16);
  view.alpha(255);

  var s;
  if (hiscore <= score) {
    s = "HI-SCORE " + score;
  } else {
    s = "SCORE " + score;
  }
  var l = s.length;
  var p = (view.width - l * 16) / 2;
  view.print(s, p, 0);
}

//-----------------------------
function title() {

  game.element.style.cursor = "auto";

  ttlmap.pos(
    view.size().align(2,
      ttlmap.size()));

  map.posy = 0;
  sp.pos(view.size().align(
    0, sp.size()));
  sp.move(0, 128);
  sp.scale = [1, 1];

  var b = view.rect(0, 0, 100, 48);
  b.show = true;
  b.drawself = function (x, y) {
    var t = this;
    view.fill(t, 255, 255, 0);
    view.fill(t.inset(4, 4), 0, 0, 0);
    if (t.touchinside) {
      view.font = redfont;
    }
    view.print("START",
      t.x + x + 11, t.y + y + 16);
    view.font = white;
  }
  b.pos(view.size().align(
    2, b.size()));
  b.move(0, -128 + 48);

  return function () {
    var t = game.touchCalc(view);
    fontinit();
    game.color(game.black);
    game.fillRect(
      0, 0, game.width, game.height);
    view.color(game.black);
    view.fillRect(
      0, 0, view.width, view.height);
    ttlmap.draw();
    view.ctx.save();
    var p = (320 - 12 * 16 * 1.5);
    var ct = view.point(p / 2, 150);
    view.ctx.translate(
      ct.x, ct.y);
    view.ctx.scale(1.5, 5);
    view.ctx.mozImageSmoothingEnabled = false;
    view.ctx.webkitImageSmoothingEnabled = false;
    view.ctx.msImageSmoothingEnabled = false;
    view.ctx.imageSmoothingEnabled = false;
    view.font = bluefont;
    view.print("SPACE ATTACK", 2, 2);
    view.font = cyanfont;
    view.print("SPACE ATTACK", 0, 0);
    view.font = white;
    view.ctx.restore();
    if (b.button(t)) {
      game.idle = gameloop();
    }
    b.draw();
    dispscore(hiscore);

    view.draw();
  }

}

//-----------------------------
function gameloop() {

  game.element.style.cursor = 'none';

  var sin = Math.sin;

  function createobj() {
    var x = rand(0, view.width - 32);
    var c = view.sprite(x, -32);
    c.d = view.point();
    c.image = game.load("main.png");
    c.ct = 0;
    c.life = 1;
    c.idleself = function () {
      var t = this;
      t.loopAnime(0.5, t.ch);
      t.move(t.d);
      if (t.y > view.height) {
        t.remove();
      }
    }
    c.dead = function () {
      var t = this;
      var i;
      for (i = 0; i < 15; i++) {
        setsmoke(t, 10, 1);
      }
      game.se[1].play(se.hit);
      score += 10;
    }
    c.deadrock = function () {
      var t = this;
      var i;
      for (i = 0; i < 15; i++) {
        setsmoke(t, 10, 1);
      }
      game.se[1].play(se.bang);
      score += 100;
      var t;
      setshot(t, 64);
      setshot(t, -64);
      setshot(t);
    }
    c.check = function () {
      var t = this;
      if (!t.show) return;
      var r = sp.inset(6, 6);
      if (t.intersect(r)) {
        sp.bang = true;
      }
      var o = tama.child;
      var hit = false;
      while (o) {
        var n = o.next;
        if (t.intersect(o)) {
          o.remove();
          hit = true;
        }
        o = n;
      }
      if (hit) {
        t.life--;
        if (t.life <= 0) {
          t.dead();
          t.remove();
        } else {
          game.se[1].play(se.dam, T);
        }
      }
    }
    return c;
  }

  var redalien = function () {
    var t = this;
    t.loopAnime(0.5, t.ch);
    t.m.move(t.d);
    t.q += 0.1;
    var p = view.point(sin(t.q) * 32, 0);
    t.pos(t.m.add(p));
    if (t.y > view.height) {
      t.remove();
    }
    t.ct++;
    if (t.ct > 20) {
      t.ct = 0;
      setshot(t);
    }
  }

  var bluealien = function () {
    var t = this;
    t.loopAnime(0.5, t.ch);
    t.m.move(t.d);
    t.q += 0.05;
    var p = view.point(sin(t.q) * 96, 0);
    t.pos(t.m.add(p));
    if (t.y > view.height) {
      t.remove();
    }
    t.ct++;
    if (t.ct > 20) {
      t.ct = 0;
      setshot(t);
    }
  }

  var e = view.sprite();
  e.ct = 0;
  e.can = 0;
  e.setidle = function () {
    return rand(1, 4);
  }
  e.idleself = function () {
    var t = this;
    if (t.ct <= 0) {
      var c = createobj();
      switch (t.setidle()) {
        case 0:
          break;
        case 1:
          c.d.x = 0;
          c.d.y = 2; //rand(40,50)/5;
          c.ch = ti.tile[3];
          c.life = 3;
          c.dead = c.deadrock;
          break;
        case 2:
          c.d.x = 0;
          c.d.y = rand(10, 40) / 5;
          c.ch = ti.tile[4];
          c.m = c.pos();
          c.q = 0;
          c.idleself = redalien;
          break;
        case 3:
        default:
          c.d.x = 0;
          c.d.y = rand(10, 40) / 5;
          c.ch = ti.tile[5];
          c.m = c.pos();
          c.q = 0;
          c.idleself = bluealien;
          break;
      }
      t.append(c);
      t.ct = duration;
    }
    t.ct--;
  }

  var tama = view.sprite(0, 0);
  tama.ct = 0;
  tama.idleself = function () {
    var t = this;
    t.ct++;
    if (t.ct > 4) {
      game.se[0].play(se.shot, true);
      var s = view.sprite(sp.x, sp.y);
      s.image = game.load("main.png");
      s.ch = ti.tile[2];
      s.idleself = function () {
        var t = this;
        t.loopAnime(0.5, t.ch);
        t.move(0, -16);
        if (t.y < -32) {
          t.remove();
        }
      }
      t.ct = 0;
      t.append(s);
    }
  }

  var shot = view.sprite();
  function setshot(o, dx) {
    if (!dx) dx = 0;
    var s = view.sprite(o);
    s.image = game.load("main.png");
    s.ch = ti.tile[7];
    var d = view.point(sp);
    d.x += dx;
    d = d.sub(s);
    d = d.div(d.length()).mul(6);
    s.d = d;
    s.pivot = [16, 16];
    s.idleself = function () {
      var t = this;
      t.loopAnime(0.5, t.ch);
      t.move(t.d);
      t.rotate += 0.2;
      if (view.size().intersect(t)) {
      } else {
        t.remove();
      }
    }
    s.check = function () {
      var t = this;
      if (!t.show) return;
      var r = sp.inset(6, 6);
      var u = t.inset(12, 12);
      if (u.intersect(r)) {
        sp.bang = true;
      }
    }
    shot.append(s);
    return s;
  }

  var smoke = view.sprite();
  function setsmoke(o, a, sp) {
    var s = view.sprite(o);
    s.image = smokeimg;
    s.ch = ti.tile[6];
    var PI = Math.PI;
    var q = rand(0, 360) * PI / 180;
    var t = rand(a, 40) * sp / 30;
    var x = Math.sin(q) * t;
    var y = Math.cos(q) * t;
    s.d = view.point(x, y);
    s.alpha = 255;
    s.ct = 30;
    s.idleself = function () {
      var t = this;
      t.loopAnime(0.5, t.ch);
      t.move(t.d);
      t.alpha -= 255 / 30;
      if (t.alpha < 0) {
        t.alpha = 0;
      }
      t.ct--;
      if (t.ct < 0) {
        t.remove();
      }
    }
    smoke.append(s);
  }

  map.posy = 0;
  map.t = 0;
  sp.loopAnime(1, ti.tile[1]);
  sp.bang = false;
  sp.show = true;

  var wait = 0;
  score = 0;
  e.ct = 0;

  game.se[0].play(se.start);

  function ready() {
    var t = game.mouseCalc(view);
    game.color(game.black);
    game.fillRect(
      0, 0, game.width, game.height);
    map.idle().render();
    sp.drag(t, view.size());
    sp.draw();
    view.font = redfont;
    view.print("READY!",
      (320 - 6 * 16) / 2, view.height / 2);
    view.font = white;
    dispscore(score);
    view.draw();
    wait++;
    if (!game.se[0].isplaying()
      && wait > 120) {
      idle = main;
    }
  }

  function main() {
    var t = game.mouseCalc(view);
    //  if (t.length==0){
    //    view.draw();
    //    return;
    //  }
    map.idle().render();
    e.walk("check").idle()
      .draw();
    sp.loopAnime(1, ti.tile[1]);
    tama.idle().draw();
    smoke.idle().draw();
    shot.walk("check").idle()
      .draw();
    sp.draw();
    sp.drag(t, view.size());
    dispscore(score);
    view.draw();
    var ctr = sp.center();
    if (map.tile(ctr) != 0) {
      sp.bang = true;
    }
    if (sp.bang) {
      game.se[0].play(se.bang, true);
      wait = 0
      idle = bang;
      var i;
      for (i = 0; i < 60; i++) {
        setsmoke(sp, 30, 4);
      }
      for (i = 0; i < 30; i++) {
        setsmoke(sp, 10, 2);
      }
      sp.show = false;
      sp.bang = false;
    }
  }

  function bang() {
    game.element.style.cursor = null;
    sp.touchstep = 0;
    map.idle().render();
    e.idle().draw();
    shot.idle().draw();
    smoke.idle().draw();
    sp.loopAnime(0.5, ti.tile[7]);
    sp.draw();
    view.font = redfont;
    view.print("GAME OVER",
      (320 - 9 * 16) / 2, view.height / 2);
    view.font = white;
    dispscore(score);
    view.draw();
    wait++;
    if (!game.se[0].isplaying()
      && wait > 120) {
      if (hiscore < score) {
        hiscore = score;
        LS.setItem(KEY, hiscore);
      }
      game.idle = title();
    }
  }

  var idle = ready;
  return function () {
    idle();
  }

}

//-----------------------------
game.idle = title();
game.run(function () {
  game.idle();
});
