/*******************************************************************************
 jquery.mb.components
 Copyright (c) 2001-2010. Matteo Bicocchi (Pupunzi); Open lab srl, Firenze - Italy
 email: mbicocchi@open-lab.com
 site: http://pupunzi.com

 Licences: MIT, GPL
 http://www.opensource.org/licenses/mit-license.php
 http://www.gnu.org/licenses/gpl.html
 ******************************************************************************/

/*
 * Name:jquery.mb.containerPlus
 * Version: 1.0
*/


(function($){

  $.mbTEF={
    version:"1.0",
    typewriter: function(options){
      return this.each (function ()
      {
        var opt={
          timer:[10,150], // or int
          cursor:" ",
          cursorClass:"cursor"
        };
        $.extend(opt,options);
        var el = $(this);
        var txt = el.text();
        var cursor= "<span class='"+opt.cursorClass+"'>"+opt.cursor+"</span>";
        var charN = 0;
        el.html('');
        var timer= opt.timer.length>1?randomBetwin(opt.timer[0],opt.timer[1]):opt.timer;
        var t = setInterval(function() {
          el.html(txt.substring(0, charN++) + (charN & charN<txt.length ? cursor : ''));
          if (charN >= txt.length) clearInterval(t);
        }, timer);
      });
    },
    wave:function(){
      return this.each (function (options)
      {
      });
    },
    mbTransform:function(options){
      return this.each (function ()
      {
        var opt={                           //default options
          timer:[10,30], // or [20,100]
          startStyle:{color:"random", opacity:0},
          endStyle:{opacity:1},
          fadeTime: 1000,
          split:" "
        };
        $.extend(opt,options);
        var el = $(this);
        var txt=$.trim(el.text()).split(opt.split);

        el.html(jQuery.map(txt, function(letter,i){
          var text="<span id='s_"+i+"'>" + letter +opt.split+"</span>";
          if(i== txt.length-1) {
            text="<span id='s_"+i+"'>" + letter +"</span>";
          }
          return text;
        }).join(""));

        el.find("span").each(function(i){
          this.opt={};
          $.extend(this.opt,opt.startStyle);
          var span=$(this);

          var rndColStart=opt.startStyle.color=="random";
          var rndOpStart=opt.startStyle.opacity=="random";
          if (rndColStart){
            var c={color:randomColor()};
            $.extend(this.opt,c);
          }
          if (rndOpStart){
            var o={opacity:.2+Math.random()*.8};
            $.extend(this.opt,o);
          }
          span.css(this.opt);

          var timer= opt.timer.length>1?randomBetwin(opt.timer[0],opt.timer[1]):opt.timer;
          var rndColEnd=opt.endStyle.color=="random";
          var rndOpEnd=opt.endStyle.opacity=="random";

          setTimeout(function(){
            if (rndColEnd){
              var c={color:randomColor()};
              $.extend(opt.endStyle,c);
            }
            if (rndOpEnd){
              var o={opacity:.2+Math.random()*.8};
              $.extend(opt.endStyle,o);
            }
            var ft=(opt.fadeTime=="random")?Math.floor(Math.random()*1000):opt.fadeTime;
            span.animate(opt.endStyle,ft,function(){if (opt.endStyle.color) $(this).css(c);});
          }, i*timer);
        });
      });
    }
  };
  $.fn.mbTEF_transform=$.mbTEF.mbTransform;
  $.fn.mbTEF_typewriter=$.mbTEF.typewriter;
  $.fn.mbTEF_wave=$.mbTEF.wave;

  function randomBetwin(a,b){
    return a+ Math.floor(Math.random()*b);
  }

  function randomColor(){
    // random values between 0 and 255, these are the 3 colour values
    var r = Math.floor(Math.random()*256);
    var g = Math.floor(Math.random()*256);
    var b = Math.floor(Math.random()*256);
    // intToHex()
    function intToHex(n){
      n = n.toString(16);
      // eg: #0099ff. without this check, it would output #099ff
      if( n.length < 2)
        n = "0"+n;
      return n;
    }

    return '#'+intToHex(r)+intToHex(g)+intToHex(b);

  }

  // We override the animation for all of these color styles
  jQuery.each(['backgroundColor', 'borderBottomColor', 'borderLeftColor', 'borderRightColor', 'borderTopColor', 'color', 'outlineColor'], function(i,attr){
    jQuery.fx.step[attr] = function(fx){
      if ( fx.state == 0 ) {
        fx.start = getColor( fx.elem, attr );
        fx.end = getRGB( fx.end );
      }

      fx.elem.style[attr] = "rgb(" + [
        Math.max(Math.min( parseInt((fx.pos * (fx.end[0] - fx.start[0])) + fx.start[0]), 255), 0),
        Math.max(Math.min( parseInt((fx.pos * (fx.end[1] - fx.start[1])) + fx.start[1]), 255), 0),
        Math.max(Math.min( parseInt((fx.pos * (fx.end[2] - fx.start[2])) + fx.start[2]), 255), 0)
      ].join(",") + ")";
    };
  });

  // Color Conversion functions from highlightFade
  // By Blair Mitchelmore
  // http://jquery.offput.ca/highlightFade/

  // Parse strings looking for color tuples [255,255,255]
  function getRGB(color) {
    var result;

    // Check if we're already dealing with an array of colors
    if ( color && color.constructor == Array && color.length == 3 )
      return color;

    // Look for rgb(num,num,num)
    if (result = /rgb\(\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*\)/.exec(color))
      return [parseInt(result[1]), parseInt(result[2]), parseInt(result[3])];

    // Look for rgb(num%,num%,num%)
    if (result = /rgb\(\s*([0-9]+(?:\.[0-9]+)?)\%\s*,\s*([0-9]+(?:\.[0-9]+)?)\%\s*,\s*([0-9]+(?:\.[0-9]+)?)\%\s*\)/.exec(color))
      return [parseFloat(result[1])*2.55, parseFloat(result[2])*2.55, parseFloat(result[3])*2.55];

    // Look for #a0b1c2
    if (result = /#([a-fA-F0-9]{2})([a-fA-F0-9]{2})([a-fA-F0-9]{2})/.exec(color))
      return [parseInt(result[1],16), parseInt(result[2],16), parseInt(result[3],16)];

    // Look for #fff
    if (result = /#([a-fA-F0-9])([a-fA-F0-9])([a-fA-F0-9])/.exec(color))
      return [parseInt(result[1]+result[1],16), parseInt(result[2]+result[2],16), parseInt(result[3]+result[3],16)];

    // Otherwise, we're most likely dealing with a named color
    return colors[jQuery.trim(color).toLowerCase()];
  }

  function getColor(elem, attr) {
    var color;

    do {
      color = jQuery.curCSS(elem, attr);

      // Keep going until we find an element that has color, or we hit the body
      if ( color != '' && color != 'transparent' || jQuery.nodeName(elem, "body") )
        break;

      attr = "backgroundColor";
    } while ( elem = elem.parentNode );

    return getRGB(color);
  };

  // Some named colors to work with
  // From Interface by Stefan Petre
  // http://interface.eyecon.ro/

  var colors = {
    aqua:[0,255,255],
    azure:[240,255,255],
    beige:[245,245,220],
    black:[0,0,0],
    blue:[0,0,255],
    brown:[165,42,42],
    cyan:[0,255,255],
    darkblue:[0,0,139],
    darkcyan:[0,139,139],
    darkgrey:[169,169,169],
    darkgreen:[0,100,0],
    darkkhaki:[189,183,107],
    darkmagenta:[139,0,139],
    darkolivegreen:[85,107,47],
    darkorange:[255,140,0],
    darkorchid:[153,50,204],
    darkred:[139,0,0],
    darksalmon:[233,150,122],
    darkviolet:[148,0,211],
    fuchsia:[255,0,255],
    gold:[255,215,0],
    green:[0,128,0],
    indigo:[75,0,130],
    khaki:[240,230,140],
    lightblue:[173,216,230],
    lightcyan:[224,255,255],
    lightgreen:[144,238,144],
    lightgrey:[211,211,211],
    lightpink:[255,182,193],
    lightyellow:[255,255,224],
    lime:[0,255,0],
    magenta:[255,0,255],
    maroon:[128,0,0],
    navy:[0,0,128],
    olive:[128,128,0],
    orange:[255,165,0],
    pink:[255,192,203],
    purple:[128,0,128],
    violet:[128,0,128],
    red:[255,0,0],
    silver:[192,192,192],
    white:[255,255,255],
    yellow:[255,255,0]
  };


})(jQuery);