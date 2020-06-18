/**
 * picopicosound.js v0.0.0.0.1
 *
 * develop by H.Yamaguchi
 * http://yamagame.secret.jp/
 * Released under the MIT license.
 */


(function(window) {


var getBufferSize = function() {
  if (/(Win(dows )?NT 6\.2)/.test(navigator.userAgent)) {
      return 1024;  // Windows 8
  } else if (/(Win(dows )?NT 6\.1)/.test(navigator.userAgent)) {
      return 1024;  // Windows 7
  } else if (/(Win(dows )?NT 6\.0)/.test(navigator.userAgent)) {
      return 2048;  // Windows Vista
  } else if (/Win(dows )?(NT 5\.1|XP)/.test(navigator.userAgent)) {
      return 4096;  // Windows XP
  } else if (/Mac|PPC/.test(navigator.userAgent)) {
      return 1024;  // Mac OS X
  } else if (/Linux/.test(navigator.userAgent)) {
      return 8192;  // Linux
  } else if (/iPhone|iPad|iPod/.test(navigator.userAgent)) {
      return 2048;  // iOS
  } else {
      return 16384;  // Otherwise
  }
};

var S_PI=Math.PI;
var samplerate=44100,
    channel=1,
    stream_length=getBufferSize();

var TABLE_LEN=1<<16;
var PHASE_SFT=14;
var PHASE_LEN=TABLE_LEN<<PHASE_SFT;
var PHASE_HLF=TABLE_LEN<<(PHASE_SFT-1);
var PHASE_MSK=PHASE_LEN-1;

var PITCH_RESOLUTION=100;
var FREQUENCY_LEN=128*PITCH_RESOLUTION;

var s_frequencyMap=[];

var i;
for (i=0;i<FREQUENCY_LEN;i++){
  s_frequencyMap[i]=440.0*Math.pow(2.0,(i-69*PITCH_RESOLUTION)/(12.0*PITCH_RESOLUTION));
}

var noise_lut=[];
var NOISE_LONG=0x4000;

function create_noise(bits,size)
{
  var m = 0x0011;
  var xor_val, i;
  for (i = 0; i < size; i++) {
    xor_val = m & 1;
    m >>= 1;
    xor_val ^= (m & 1);
    m |= xor_val << (bits - 1);
    noise_lut[i] = m & 0xff;
  }
}
create_noise(13,NOISE_LONG);

var PicoWaveOscilator = function () {
  this.w=0;
  this.subform=0;
  this.m_frequency=0;
  this.m_velocity=1;
}

PicoWaveOscilator.prototype.setNoteNo=function(note) {
}

PicoWaveOscilator.prototype.next=function() {
  var t=this;
 
  var s = 0;

  var v = t.m_velocity;
  var f = t.m_frequency;

  if (f == 0) {
    t.w = 0;
    if (t.lastlevel > 0) {
      t.lastlevel --;
    } else
    if (t.lastlevel < 0) {
      t.lastlevel ++;
    }
    return t.lastlevel;
  }

  if (t.subform == 5) {
    t.noise = (2.0*S_PI/(1000+Math.pow(((10000-f)/10000),10)*2000000));
  }

  switch (t.subform) {
  case 5:
    //t.w += (2.0*S_PI/(1000));//(2.0*S_PI*f/44100.0)/powf(10,f/100);
    //t.w += (2.0*S_PI/(2000000));//(2.0*S_PI*f/44100.0)/powf(10,f/100);
    t.w += t.noise;//(2.0*S_PI/(1000+powf(((10000-f)/10000),10)*2000000));//(2.0*S_PI*f/44100.0)/powf(10,f/100);
    while (t.w >= 2*S_PI) t.w -= 2*S_PI;
    while (t.w < 0) t.w += 2*S_PI;
    break;
  default:
    t.w += 2.0*S_PI*f/samplerate;
    while (t.w >= 2*S_PI) t.w -= 2*S_PI;
    while (t.w < 0) t.w += 2*S_PI;
    break;
  }
  var w = t.w;
  switch (t.subform) {
  case 0:
    s += (v*0.5*(w>S_PI?1:-1));      //矩形波(PSG的)
    break;
  case 1:
    s += (v*0.5*(w<2*S_PI/12?1:-1));   //矩形波(ファミコン的)
    break;
  case 2:
    s += (v*0.5*Math.sin((w+S_PI)));     //サイン波形
    break;
  case 3:
    s += (v*0.5*(w-S_PI)/S_PI);      //三角波
    break;
  case 4:
    s += (v*0.5*(((w>S_PI?(2*S_PI-w):w)/*-S_PI/2*/)/(S_PI/2))*4);    //三角波(ファミコン的)
    break;
  case 5:
    //s += (signed short)(v*((w>S_PI?1:-1)*(((((float)noise_lut[(int)(w/(2*S_PI)*NOISE_LONG)])/256.0)-1)*1.0)));     //矩形波(PSG的)
    s += (
            v*1.0*(
                (
                  noise_lut[
                    Math.floor((w*NOISE_LONG/(2*S_PI)))
                  ]/128.0
                )-1
            )
         ); //ノイズ
//      s += (v*1.5*(((((float)noise_lut[(int)(w/(2*S_PI)*(NOISE_LONG))])/128.0)-1))); //ノイズ
    break;
  default:
    s=0;
    break;
  }

  return s/128.0;
}

var FC_NOISE_PHASE_SFT=10;
var FC_NOISE_PHASE_SEC=(1789773<<FC_NOISE_PHASE_SFT);
var FC_NOISE_PHASE_DLT=FC_NOISE_PHASE_SEC/samplerate;

function FCNoiseGetValue(t) {
  t.m_fcr>>=1;
  t.m_fcr|=((t.m_fcr^(t.m_fcr>>t.m_snz))&1)<<15;
  return (t.m_fcr&1)?1.0:-1.0;
}

MOscFcNoise_s_interval=[0x004,0x008,0x010,0x020,0x040,0x060,0x080,0x0a0,
  0x0ca,0x0fe,0x17c,0x1fc,0x2fa,0x3f8,0x7f2,0xfe4];

function setNoiseFreq(t,no) {
  if (no<0)no=0;
  if (no>15)no=15;
  t.m_freqShift=MOscFcNoise_s_interval[no]<<FC_NOISE_PHASE_SFT; // as interval
}

var FCNoiseOscilator = function () {
  this.w=0;
  this.type=0;
  this.m_frequency=0;
  this.m_velocity=0;
  this.m_snz=1;
  this.m_fcr=0x8000;
  this.m_phase=0;
  this.m_val=FCNoiseGetValue(this);
  this.m_freqShift=0;
  setNoiseFreq(this,0);
}

FCNoiseOscilator.prototype.setNoteNo=function(note) {
  setNoiseFreq(this,note);
}

FCNoiseOscilator.prototype.next=function() {
  var t=this;

  var val=t.m_val;
  var sum=0;
  var cnt=0;
  var delta=FC_NOISE_PHASE_DLT;
  while(delta>=t.m_freqShift){
    delta-=t.m_freqShift;
    t.m_phase=0;
    sum+=FCNoiseGetValue(t);
    cnt+=1.0;
  }
  if (cnt>0){
    t.m_val=sum/cnt;
  }
  t.m_phase+=delta;
  if (t.m_phase>=t.m_freqShift){
    t.m_phase-=t.m_freqShift;
    t.m_val=FCNoiseGetValue(t);
  }
  return val*t.m_velocity/128.0;
}

var Channel = function() {
  this.noise=0;
  this.lastlevel=0;
  this.v=0;
  this.fv=0;

  this.m_form=0;

  this.m_freqShift=0;
  this.m_phase=0;
  this.subform=0;
  this.m_frequency=0;
  this.m_velocity=0;

  this.m_noteOn=false;

  this.m_osc=[]
  this.m_osc[0]=new PicoWaveOscilator();
  this.m_osc[1]=new PicoWaveOscilator();
  this.m_osc[2]=new PicoWaveOscilator();
  this.m_osc[3]=new PicoWaveOscilator();
  this.m_osc[4]=new PicoWaveOscilator();
  this.m_osc[5]=new PicoWaveOscilator();
  this.m_osc[6]=new PicoWaveOscilator();
  this.m_osc[7]=new FCNoiseOscilator();
  this.m_osc[8]=new PicoWaveOscilator();
  this.m_osc[9]=new PicoWaveOscilator();
  this.m_osc[10]=new PicoWaveOscilator();
  this.m_osc[11]=new PicoWaveOscilator();
  this.m_osc[12]=new PicoWaveOscilator();
  this.m_osc[13]=new PicoWaveOscilator();
  this.m_osc[14]=new PicoWaveOscilator();
  this.m_osc[15]=new PicoWaveOscilator();
}

Channel.prototype.resetPhase=function() {
  var t=this;
  t.m_phase=0;
}

Channel.prototype.addPhase=function(time) {
  var t=this;
  t.m_phase=(t.m_phase+t.m_freqShift*time)&PHASE_MSK;
}

Channel.prototype.setFrequency=function(frequency) {
  var t=this;
  t.m_frequency=frequency;
  t.m_freqShift=frequency*(PHASE_LEN/samplerate);
  t.m_osc[t.m_form].m_frequency=t.m_frequency;
}

Channel.prototype.setForm=function(form,subform) {
  var t=this;
  t.m_form=form;
  t.subform=subform;
  t.m_osc[t.m_form].subform=subform;
}

Channel.prototype.next = function() {
    var t=this;
    if (!t.m_noteOn) return t.lastlevel;
    t.lastlevel = t.m_osc[t.m_form].next();
    return t.lastlevel;
}

Channel.prototype.noteOn = function(noteNo,velocity) {

  var t=this;
  t.resetPhase();
  t.m_noteNo=noteNo;
  t.m_freqNo=t.m_noteNo*PITCH_RESOLUTION;
  var freqNo=(t.m_freqNo<0)?0:(t.m_freqNo>=FREQUENCY_LEN)?FREQUENCY_LEN-1:t.m_freqNo;
  t.setFrequency(s_frequencyMap[t.m_freqNo]);
  t.m_osc[t.m_form].m_velocity=velocity;
  t.m_osc[t.m_form].setNoteNo(noteNo);
  t.m_noteOn=true;

}
Channel.prototype.noteOff = function() {
  var t=this;
  t.m_noteOn=false;
}

var Track = function() {
 this.mml="";
 this.p=0;

 this.phase=0;
 this.freq=440;

  this.notect  = 0;
  this.noteoff = 0;
  
  this.m_velocity = 127;
  this.m_noteShift = 0;
  this.m_polyVoice = 0;
  this.m_maxPipe = 0;
  this.m_maxSyncSource = 0;
  this.m_gate = 15.0;
  this.m_maxGate = 16.0;
  this.m_gate2 = 0;
  this.m_spt=0;
  this.m_relativeDir=true;
  this.m_velDir=true;
  this.m_velDetail=true;
  this.m_octave = 5;
  this.m_portamento = 0;
  this.volume=1;
  
  this.nlen = 16;
  this.tempo = 300;

  this.m_spt = samplerate/(this.tempo*96.0/60.0);

  this.channel = new Channel();
}

Track.prototype.next = function() {
  var t=this;
 	if (t.notect<=0) {

  function nextPtr(d) {
    t.p+=d;
  }
  function getChar() {
    return t.mml.charAt(t.p);
  }

  function getNum(def)
  {
    var a;
    var retval = 0;
    if (t.p>=t.mml.length) {
      return def;
    }
    a = t.mml.charCodeAt(t.p);
    if (!(a >= '0'.charCodeAt(0)
       && a <= '9'.charCodeAt(0))) {
      return def;
    }
    while (true) {
      if (t.p>=t.mml.length) {
        break;
      }
      a = t.mml.charCodeAt(t.p);
      if (a >= '0'.charCodeAt(0)
       && a <= '9'.charCodeAt(0)) {
        nextPtr(1);
        retval *= 10;
        retval += a - '0'.charCodeAt(0);
        continue;
      }
      break;
    }
    return retval;
  }

function getKeySig()
{
  var k=0;
  var f=1;
  while(f){
    var c=getChar();
    switch(c){
      case '+':case '#':k++;nextPtr(1);break;
      case '-':k--;nextPtr(1);break;
      default :f=0;break;
    }
  }
  return k;
}

function atmark()
{
  nextPtr(1);
  var letter = getChar();
  var letterCode = letter.charCodeAt(0);
  switch (letter) {
  case '@':
    //t.channel->reset();
    //reset_track(track);
    break;
  case 'v': // Volume
    t.m_velDetail=true;
    t.m_velocity = getNum(t.m_velocity);
    if (t.m_velocity>127) t.m_velocity=127;
    break;
  case 'x': // Expression
    {
      nextPtr(1);
      var o=getNum(127);
      if (o>127)o=127;
      //t.channel->setExpression(o);
    }
    break;
  case 'e': // Envelope
    {
      var array = [];
      nextPtr(1);
      var type = getNum();
      if (getChar() == ',') {
        nextPtr(1);
      }
      var attack = getNum();
      var count=0;
      while(true) {
        if (getChar() == ',') {
          nextPtr(1);
        } else {
          break;
        }
        var value = getNum();
        array[count] = value;
        count ++;
      }

      if (count > 0) {
        if (type == 1) {
          // t.channel->setEnvelope1Atk(attack);
          var i=0;
          for (i=0;i<(count-1)/2;i++) {
            // t.channel->setEnvelope1Point(array[i*2+0],array[i*2+1]);
          }
          // t.channel->setEnvelope1Rel(array[i*2]);
        }
        if (type == 2) {
          // t.channel->setEnvelope2Atk(attack);
          var i=0;
          for (i=0;i<(count-1)/2;i++) {
            // t.channel->setEnvelope2Point(array[i*2+0],array[i*2+1]);
          }
          // t.channel->setEnvelope2Rel(array[i*2]);
        }
      }

      free(array);
    }
    break;
  case 'm':
    nextPtr(1);
    if (getChar()=='h'){
      var w=0;var f=0;var pmd=0;var amd=0;var pms=0;var ams=0;var s=1;
      do{
        w=getNum(w);
        if (getChar()!=',')break;
        nextPtr(1);
        f=getNum(f);
        if (getChar()!=',')break;
        nextPtr(1);
        pmd=getNum(pmd);
        if (getChar()!=',')break;
        nextPtr(1);
        amd=getNum(amd);
        if (getChar()!=',')break;
        nextPtr(1);
        pms=getNum(pms);
        if (getChar()!=',')break;
        nextPtr(1);
        ams=getNum(ams);
        if (getChar()!=',')break;
        nextPtr(1);
        s=getNum(s);
      }
      while(false);
    }
    break;
  case 'n':
    nextPtr(1);
    if (getChar()=='s'){
      // Note Shift
      nextPtr(1);
      t.m_noteShift+=getNum();
    }
    else {
      // Noise frequency
      var o=getNum();
      if (o<0||o>127)o=0;
      // t.channel->setNoiseFreq(o);
    }
    break;
  case 'w': // pulse Width modulation
    {
      nextPtr(1);
      var o=getNum();
      if (o<0){
        if (o>-1)o=-1;
        if (o<-99)o=-99;
      }
      else {
        if (o<1)o=1;
        if (o>99)o=99;
      }
      // t.channel->setPWM(o);
    }
    break;
  case 'p': // Pan
    {
      nextPtr(1);
      if (getChar()=='l'){
        nextPtr(1);
        var o=getNum(t.m_polyVoice);
        // o=FlMML::Math::max(0,FlMML::Math::min(t.m_polyVoice,o));
        // t.channel->setVoiceLimit(o);
      }
      else {
        var o=getNum(64);
        if (o<1)o=1;
        if (o>127)o=127;
        // t.channel->setPan(o);
      }
    }
    break;
  case '\'':  // formant filter
    {
      nextPtr(1);
      var letter = getChar();
      nextPtr(1);
      var vowel=0;
      // switch(letter){
      //   case 'a':vowel=FlMML::MFormant::VOWEL_A;break;
      //   case 'e':vowel=FlMML::MFormant::VOWEL_E;break;
      //   case 'i':vowel=FlMML::MFormant::VOWEL_I;break;
      //   case 'o':vowel=FlMML::MFormant::VOWEL_O;break;
      //   case 'u':vowel=FlMML::MFormant::VOWEL_U;break;
      //   default :vowel=-1;break;
      // }
      // t.channel->setFormant(vowel);
      if (letter != '\'') {
        nextPtr(1);
      }
    }
    break;
  case 'd': // Detune
    {
      nextPtr(1);
      var o=getNum(0);
      // t.channel->setDetune(o);
    }
    break;
  case 'l': // Low frequency oscillator (LFO)
    {
      var dp=0;var wd=0;var fm=1;var sf=0;var rv=1;var dl=0;var tm=0;var sw=0;
      nextPtr(1);
      dp=getNum(dp);
      if (getChar()==',')nextPtr(1);
      wd=getNum(wd);
      if (getChar()==','){
        nextPtr(1);
        if (getChar()=='-'){rv=-1;nextPtr(1);}
        fm=(getNum(fm)+1)*rv;
        if (getChar()=='-'){
          nextPtr(1);
          sf=getNum(0);
        }
        if (getChar()==','){
          nextPtr(1);
          dl=getNum(dl);
          if (getChar()==','){
            nextPtr(1);
            tm=getNum(tm);
            if (getChar()==','){
              nextPtr(1);
              sw=getNum(sw);
            }
          }
        }
      }
      // t.channel->setLFOFMSF(fm,sf);
      // t.channel->setLFODPWD(dp,wd);
      // t.channel->setLFODLTM(dl,tm);
      // t.channel->setLFOTarget(sw);
    }
    break;
  case 'f': // Filter
    {
      var swt=0;var amt=0;var frq=0;var res=0;
      nextPtr(1);
      swt=getNum(swt);
      if (getChar()==','){
        nextPtr(1);
        amt=getNum(amt);
        if (getChar()==','){
          nextPtr(1);
          frq=getNum(frq);
          if (getChar()==','){
            nextPtr(1);
            res=getNum(res);
          }
        }
      }
      // t.channel->setLpfSwtAmt(swt,amt);
      // t.channel->setLpfFrqRes(frq,res);
    }
    break;
  case 'q': // gate time 2
    nextPtr(1);
    t.m_gate2 = getNum(2);
    break;
  case 'i': // Input
    {
      var a=0;
      var sens=0;
      nextPtr(1);
      sens=getNum(sens);
      if (getChar()==','){
        nextPtr(1);
        a=getNum(a);
        if (a>t.m_maxPipe)a=t.m_maxPipe;
      }
      // t.channel->setInput(sens,a);
    }
    break;
  case 'o': // Output
    {
      var a=0;
      var mode=0;
      nextPtr(1);
      mode=getNum(mode);
      if (getChar()==','){
        nextPtr(1);
        a=getNum(a);
        if (a>t.m_maxPipe){
          t.m_maxPipe=a;
          // if (t.m_maxPipe>=FlMML::MML::MAX_PIPE)t.m_maxPipe=a=FlMML::MML::MAX_PIPE;
        }
      }
      // t.channel->setOutput(mode,a);
    }
    break;
  case 'r': // Ring
    {
      var a=0;
      var sens=0;
      nextPtr(1);
      sens=getNum(sens);
      if (getChar()==','){
        nextPtr(1);
        a=getNum(a);
        if (a>t.m_maxPipe)a=t.m_maxPipe;
      }
      // t.channel->setRing(sens,a);
    }
    break;
  case 's': // Sync
    {
      var a=0;
      var mode=0;
      nextPtr(1);
      mode=getNum(mode);
      if (getChar()==','){
        nextPtr(1);
        a=getNum(a);
        if (mode==1){
          // Sync out
          if (a>t.m_maxSyncSource){
            t.m_maxSyncSource=a;
            // if (t.m_maxSyncSource>=FlMML::MML::MAX_SYNCSOURCE)t.m_maxSyncSource=a=FlMML::MML::MAX_SYNCSOURCE;
          }
        }else if (mode==2){
          // Sync in
          if (a>t.m_maxSyncSource)a=t.m_maxSyncSource;
        }
      }
      // t.channel->setSync(mode,a);
    }
    break;
  case 'u': // midi風なポルタメント
    {
      nextPtr(1);
      var rate;
      var mode=getNum(0);
      switch(mode){
        case 0:
        case 1:
          // t.channel->setMidiPort(mode);
          break;
        case 2:
          rate=0;
          if (getChar()==','){
            nextPtr(1);
            rate=getNum(0);
            if (rate<0)rate=0;
            if (rate>127)rate=127;
          }
          // t.channel->setMidiPortRate((8-(rate*7.99/128))/rate);
          break;
        case 3:
          if (getChar()==','){
            nextPtr(1);
            var oct;
            var baseNote=-1;
            if (getChar()!='o'){
              oct=t.m_octave;
            }
            else {
              nextPtr(1);
              oct=getNum(0);
            }
            var c=getChar();
            switch(c){
              case 'c':baseNote=0;break;
              case 'd':baseNote=2;break;
              case 'e':baseNote=4;break;
              case 'f':baseNote=5;break;
              case 'g':baseNote=7;break;
              case 'a':baseNote=9;break;
              case 'b':baseNote=11;break;
            }
            if (baseNote>=0){
              nextPtr(1);
              baseNote+=t.m_noteShift+getKeySig();
              baseNote+=oct*12;
            }
            else {
              baseNote=getNum(60);
            }
            if (baseNote<0)baseNote=0;
            if (baseNote>127)baseNote=127;
            // t.channel->setPortBase(baseNote);
          }
          break;
      }
    }
    break;
  default:
    if (letterCode >= '0'.charCodeAt(0)
     && letterCode <= '9'.charCodeAt(0)) 
    {
      var type = getNum();
      var sub = 0;
      if (getChar()=='-'){
        nextPtr(1);
        sub = getNum();
      }
      t.channel.setForm(type,sub);
    }
    break;
  }
}

	while (true) {
    if (t.p>=t.mml.length) {
    	break;
    }
    nextPtr(0);
		var letter=getChar();
    var letterCode=letter.charCodeAt(0);

    switch (letter) {
    case '!':   //ループマーク
      nextPtr(1);
      continue;
    case '<':   //オクターブ+//
      if (t.m_relativeDir)t.m_octave++;else t.m_octave--;
      if (t.m_octave<-2)t.m_octave=-2;
      if (t.m_octave> 8)t.m_octave= 8;
      nextPtr(1);
      continue;
    case '>':   //オクターブ-//
      if (t.m_relativeDir)t.m_octave--;else t.m_octave++;
      if (t.m_octave<-2)t.m_octave=-2;
      if (t.m_octave> 8)t.m_octave= 8;
      nextPtr(1);
      continue;
    case '(': // vol up/down
    case ')':
      if ((letter=='('&&t.m_velDir)||
        (letter==')'&&!t.m_velDir)){
        t.m_velocity+=(t.m_velDetail)?1:8;
        if (t.m_velocity>127)t.m_velocity=127;
      }
      else { // down
        t.m_velocity-=(t.m_velDetail)?1:8;
        if (t.m_velocity<0)t.m_velocity=0;
      }
      nextPtr(1);
      continue;
    case '+':   //ボリューム+//
      t.m_velocity += 1;
      if (t.m_velocity > 127) t.m_velocity = 127;
      nextPtr(1);
      continue;
    case '-':   //ボリューム-//
      t.m_velocity -= 1;
      if (t.m_velocity < 0) t.m_velocity = 0;
      nextPtr(1);
      continue;
    case 'n':
      if (getChar() == 's') {
        var sign = 1;
        nextPtr(1);
        if (getChar() == '-') {
          nextPtr(1);
          sign = -1;
        }
        t.m_noteShift=getNum(t.m_noteShift)*sign;
      }
      continue;
    case 'o':   //オクターブ//
      {
        nextPtr(1);
        var a = t.mml.charCodeAt(t.p);
        if (a >= '0'.charCodeAt(0)
         && a <= '9'.charCodeAt(0)) {
          t.m_octave = getNum(0);
          if (t.m_octave > 8) {
            t.m_octave = 8;
          }
        }
      }
      continue;
    case '@':   //音色//
      atmark();
      continue;
    case 'q':   //ゲートタイム
      nextPtr(1);
      t.m_gate = getNum(t.m_gate);
      continue;
    case 'v':   //ボリューム//
      t.m_velDetail=false;
      {
        nextPtr(1);
        var a = t.mml.charCodeAt(t.p);
        if (a >= '0'.charCodeAt(0)
         && a <= '9'.charCodeAt(0)) {
          var v = getNum((t.m_velocity-7)/8)*8+7;
          if (v < 0) v = 0;
          if (v > 127) v = 127;
          t.m_velocity = v;
        }
      }
      continue;
    case 'l':   //音長//
      {
        nextPtr(1);
        var a = t.mml.charCodeAt(t.p);
        if (a >= '0'.charCodeAt(0)
         && a <= '9'.charCodeAt(0)) {
          t.nlen = getNum();
        }
      }
      continue;
    case 't':
      {
        nextPtr(1);
        var a = t.mml.charCodeAt(t.p);
        if (a >= '0'.charCodeAt(0)
         && a <= '9'.charCodeAt(0)) {
          t.tempo = getNum(t.tempo);
//            t.m_bpm = t.tempo;
          t.m_spt = samplerate/(t.tempo*96.0/60.0);
        }
      }
      continue;
    default:
      if ((letterCode >= 'a'.charCodeAt(0) && letterCode <= 'g'.charCodeAt(0))
        || letterCode == 'r'.charCodeAt(0) || letterCode == 'p'.charCodeAt(0)) {
        var note = 0;
        var nlen = 0;
        var noteFlag = 1;
        switch (letter) {
        case 'c':
          note = 0;
          break;
        case 'd':
          note = 2;
          break;
        case 'e':
          note = 4;
          break;
        case 'f':
          note = 5;
          break;
        case 'g':
          note = 7;
          break;
        case 'a':
          note = 9;
          break;
        case 'b':
          note = 11;
          break;
        case 'r':
        case 'p':
          noteFlag = 0;
          break;
        }
        nextPtr(1);
        //シャープ//
        if (noteFlag) {
          if (t.mml.charAt(t.p) == '#'
           || t.mml.charAt(t.p) == '+') {
            nextPtr(1);
            note ++;
          }
        }
        //音長//
        {
          if (t.mml.charAt(t.p) == '%') {
            nextPtr(1);
            nlen = getNum(384/4);
            t.notect = nlen*t.m_spt;
          } else {
            var a = t.mml.charCodeAt(t.p);
            if (a >= '0'.charCodeAt(0)
             && a <= '9'.charCodeAt(0)) {
              nlen = getNum();
            } else {
              nlen = t.nlen;
            }
            if (nlen <= 0) nlen = 4;
            t.notect = (384/nlen)*t.m_spt;
          }
          {
            var zenonpu = 384*t.m_spt;
            t.noteoff = t.notect-((t.notect*t.m_gate/t.m_maxGate)-t.m_gate2*zenonpu/192);
          }
        }
        //ポルタメント//
        {
          if (t.mml.charAt(t.p) == '*') {
            nextPtr(1);
            t.m_beforeNote=t.m_octave*12+note+t.m_noteShift;
            t.m_portamento=1;
            continue;
          }
        }
        //発音//
        if (noteFlag) {
            t._note = t.m_octave*12+note+t.m_noteShift;
            t.channel.noteOn(t._note,t.m_velocity*t.volume);
        } else {
            t.channel.noteOff(t._note,t.m_velocity*t.volume);
        }
        break;
      } else {
        nextPtr(1);
        continue;
      }
    }

		break;
	}
	
	}

  if (t.notect>0) {
    t.notect --;
    if (t.notect <= t.noteoff) {
      if (t._note >= 0) {
        t.channel.noteOff(t._note);
        t._note = -1;
      }
    }
  }

  return t.channel.next();
}

Track.prototype.play = function(mml,stopflag) {
  if (stopflag) {
    this.mml=mml.toLowerCase();
    this.p=0;
    this.notect=0;
  } else {
    this.mml+=mml.toLowerCase();
    if (this.mml.length>1024) {
      this.mml=this.mml.substring(1024);
      this.p-=1024;
    }
  }
}

Track.prototype.stop = function() {
  this.mml="";
  this.p=0;
  this.notect=0;
}

var PicoPicoGenerator = function() {
    this.track = new Track();
};

PicoPicoGenerator.prototype.next = function(stream,len) {
    var i, imax;
    var g = this.track;
    if (g.p>=g.mml.length && g.notect==0) {
      return stream;
    }
    for (i = 0, imax = len; i < imax; i++) {
        stream[i] += g.next()*picopicosound.volume;
    }
    return stream;
};

  picopicosound={
    initialize:false,
    volume:0.1
  }

/*
  if (typeof new Audio().mozSetup === 'function') {
    stream_length=4410;
    picopicosound.start=function() {
      var t=this;
      if (!t.initialize) {
        t.audio = new Audio();
        t.audio.mozSetup(channel,samplerate);
        t.timerId = null;

        t.initialize=true;
        t.generator=[];
        t.generator[0]=new PicoPicoGenerator();
        t.generator[1]=new PicoPicoGenerator();
        t.generator[2]=new PicoPicoGenerator();
        t.generator[3]=new PicoPicoGenerator();
        t.generator[4]=new PicoPicoGenerator();
        t.isPlaying = false;
      }
      if (t.initialize && !t.isPlaying) {
        var generator = t.generator;
        if (t.timerId===null) {
            t.timerId=setInterval(function() {
                var data=[];
                var i = stream_length;
                while (i--) {
                   data[i] = 0;
                }
                for (var vi in generator) {
                  generator[vi].next(data,stream_length);
                }
                var s=new Float32Array(data);
                t.audio.mozWriteAudio(s);
            },stream_length*1000/samplerate);
        }
        t.isPlaying=true;
      }
    }
    picopicosound.stop = function() {
      if (this.timerId !== null) {
        clearInterval(this.timerId);
      }
      this.isPlaying = false;
    }
  } else
*/
  if (typeof(window.AudioContext)!="undefined" || typeof(window.webkitAudioContext)!="undefined") {
 
  	var audioCtx = (window.AudioContext || window.webkitAudioContext);
 
    picopicosound.start=function() {
      var t=this;
      if (!t.initialize) {
          t.ctx=new audioCtx();
          t.ctx.sampleRate=samplerate;
          t.node=t.ctx.createScriptProcessor(stream_length,1,channel);
          t.src = t.ctx.createBufferSource();

          t.initialize=true;
          t.generator=[];
          t.generator[0]=new PicoPicoGenerator();
          t.generator[1]=new PicoPicoGenerator();
          t.generator[2]=new PicoPicoGenerator();
          t.generator[3]=new PicoPicoGenerator();
          t.generator[4]=new PicoPicoGenerator();
          t.isPlaying=false;
      }
      if (t.initialize && !t.isPlaying) {
        var generator = t.generator;
      	t.node.onaudioprocess=function(event) {
      		picopicosound.ready=true;
      		var data = event.outputBuffer.getChannelData(0);
          var i = data.length;
          while (i--) {
             data[i] = 0;
          }
          for (var vi in generator) {
        		generator[vi].next(data,data.length);
          }
      	};
      	t.src.start(0);
      	t.src.connect(t.node);
      	t.node.connect(t.ctx.destination);
        t.isPlaying=true;
      }
    }

  picopicosound.stop = function() {
    var t=this;
    if (t.initialize) {
  	  t.ready=false;
      t.node.disconnect();
      t.isPlaying = false;
    }
  }
} else {
	picopicosound.start=function() {
	}
	picopicosound.stop=function() {
	}
}

picopicosound.call=function(cmd) {
  var t=this;
  if (t.initialize) {
    if (cmd=="semml-play") {
      var mml=picopicoengine.mml;
      var track=picopicoengine.track;
      if (picopicoengine.stop) {
        t.generator[track].track.play(mml,true);
      } else {
        t.generator[track].track.play(mml,false);
      }
    } else
    if (cmd=="semml-stop") {
      var track=picopicoengine.track;
      t.generator[track].track.stop();
    }
  }
}

}(window));
