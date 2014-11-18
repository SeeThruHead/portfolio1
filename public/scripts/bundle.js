(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
require('../../_components/jquery-sticktotop/src/jquery-sticktotop.min.js');
require('jquery-smooth-scroll');
var $skilBut = $('.skill-sel button'),
  $pageView = $('.page-view');
// Setup Sticky Nav
$('.site-nav').stickToTop();
$('a').smoothScroll();

$skilBut.click(function () {
  var shift = ($skilBut.index(this) + 1) * 20,
    $clicked = $(this),
    isClicked = $clicked.hasClass('selected'),
    i = $skilBut.length;
  $pageView.css('transform', 'translateX(-'+(isClicked ? 0 : shift) +'%)' );
  while (i--) {
    $skilBut.eq(i).removeClass('selected');
  }
  isClicked || $clicked.addClass('selected');
});
},{"../../_components/jquery-sticktotop/src/jquery-sticktotop.min.js":3,"jquery-smooth-scroll":2}],2:[function(require,module,exports){
/*!
 * jQuery Smooth Scroll - v1.5.3 - 2014-10-15
 * https://github.com/kswedberg/jquery-smooth-scroll
 * Copyright (c) 2014 Karl Swedberg
 * Licensed MIT (https://github.com/kswedberg/jquery-smooth-scroll/blob/master/LICENSE-MIT)
 */

(function (factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['jquery'], factory);
  } else {
    // Browser globals
    factory(jQuery);
  }
}(function ($) {

  var version = '1.5.3',
      optionOverrides = {},
      defaults = {
        exclude: [],
        excludeWithin:[],
        offset: 0,

        // one of 'top' or 'left'
        direction: 'top',

        // jQuery set of elements you wish to scroll (for $.smoothScroll).
        //  if null (default), $('html, body').firstScrollable() is used.
        scrollElement: null,

        // only use if you want to override default behavior
        scrollTarget: null,

        // fn(opts) function to be called before scrolling occurs.
        // `this` is the element(s) being scrolled
        beforeScroll: function() {},

        // fn(opts) function to be called after scrolling occurs.
        // `this` is the triggering element
        afterScroll: function() {},
        easing: 'swing',
        speed: 400,

        // coefficient for "auto" speed
        autoCoefficient: 2,

        // $.fn.smoothScroll only: whether to prevent the default click action
        preventDefault: true
      },

      getScrollable = function(opts) {
        var scrollable = [],
            scrolled = false,
            dir = opts.dir && opts.dir === 'left' ? 'scrollLeft' : 'scrollTop';

        this.each(function() {

          if (this === document || this === window) { return; }
          var el = $(this);
          if ( el[dir]() > 0 ) {
            scrollable.push(this);
          } else {
            // if scroll(Top|Left) === 0, nudge the element 1px and see if it moves
            el[dir](1);
            scrolled = el[dir]() > 0;
            if ( scrolled ) {
              scrollable.push(this);
            }
            // then put it back, of course
            el[dir](0);
          }
        });

        // If no scrollable elements, fall back to <body>,
        // if it's in the jQuery collection
        // (doing this because Safari sets scrollTop async,
        // so can't set it to 1 and immediately get the value.)
        if (!scrollable.length) {
          this.each(function() {
            if (this.nodeName === 'BODY') {
              scrollable = [this];
            }
          });
        }

        // Use the first scrollable element if we're calling firstScrollable()
        if ( opts.el === 'first' && scrollable.length > 1 ) {
          scrollable = [ scrollable[0] ];
        }

        return scrollable;
      };

  $.fn.extend({
    scrollable: function(dir) {
      var scrl = getScrollable.call(this, {dir: dir});
      return this.pushStack(scrl);
    },
    firstScrollable: function(dir) {
      var scrl = getScrollable.call(this, {el: 'first', dir: dir});
      return this.pushStack(scrl);
    },

    smoothScroll: function(options, extra) {
      options = options || {};

      if ( options === 'options' ) {
        if ( !extra ) {
          return this.first().data('ssOpts');
        }
        return this.each(function() {
          var $this = $(this),
              opts = $.extend($this.data('ssOpts') || {}, extra);

          $(this).data('ssOpts', opts);
        });
      }

      var opts = $.extend({}, $.fn.smoothScroll.defaults, options),
          locationPath = $.smoothScroll.filterPath(location.pathname);

      this
      .unbind('click.smoothscroll')
      .bind('click.smoothscroll', function(event) {
        var link = this,
            $link = $(this),
            thisOpts = $.extend({}, opts, $link.data('ssOpts') || {}),
            exclude = opts.exclude,
            excludeWithin = thisOpts.excludeWithin,
            elCounter = 0, ewlCounter = 0,
            include = true,
            clickOpts = {},
            hostMatch = ((location.hostname === link.hostname) || !link.hostname),
            pathMatch = thisOpts.scrollTarget || ( $.smoothScroll.filterPath(link.pathname) === locationPath ),
            thisHash = escapeSelector(link.hash);

        if ( !thisOpts.scrollTarget && (!hostMatch || !pathMatch || !thisHash) ) {
          include = false;
        } else {
          while (include && elCounter < exclude.length) {
            if ($link.is(escapeSelector(exclude[elCounter++]))) {
              include = false;
            }
          }
          while ( include && ewlCounter < excludeWithin.length ) {
            if ($link.closest(excludeWithin[ewlCounter++]).length) {
              include = false;
            }
          }
        }

        if ( include ) {

          if ( thisOpts.preventDefault ) {
            event.preventDefault();
          }

          $.extend( clickOpts, thisOpts, {
            scrollTarget: thisOpts.scrollTarget || thisHash,
            link: link
          });

          $.smoothScroll( clickOpts );
        }
      });

      return this;
    }
  });

  $.smoothScroll = function(options, px) {
    if ( options === 'options' && typeof px === 'object' ) {
      return $.extend(optionOverrides, px);
    }
    var opts, $scroller, scrollTargetOffset, speed, delta,
        scrollerOffset = 0,
        offPos = 'offset',
        scrollDir = 'scrollTop',
        aniProps = {},
        aniOpts = {};

    if (typeof options === 'number') {
      opts = $.extend({link: null}, $.fn.smoothScroll.defaults, optionOverrides);
      scrollTargetOffset = options;
    } else {
      opts = $.extend({link: null}, $.fn.smoothScroll.defaults, options || {}, optionOverrides);
      if (opts.scrollElement) {
        offPos = 'position';
        if (opts.scrollElement.css('position') === 'static') {
          opts.scrollElement.css('position', 'relative');
        }
      }
    }

    scrollDir = opts.direction === 'left' ? 'scrollLeft' : scrollDir;

    if ( opts.scrollElement ) {
      $scroller = opts.scrollElement;
      if ( !(/^(?:HTML|BODY)$/).test($scroller[0].nodeName) ) {
        scrollerOffset = $scroller[scrollDir]();
      }
    } else {
      $scroller = $('html, body').firstScrollable(opts.direction);
    }

    // beforeScroll callback function must fire before calculating offset
    opts.beforeScroll.call($scroller, opts);

    scrollTargetOffset = (typeof options === 'number') ? options :
                          px ||
                          ( $(opts.scrollTarget)[offPos]() &&
                          $(opts.scrollTarget)[offPos]()[opts.direction] ) ||
                          0;

    aniProps[scrollDir] = scrollTargetOffset + scrollerOffset + opts.offset;
    speed = opts.speed;

    // automatically calculate the speed of the scroll based on distance / coefficient
    if (speed === 'auto') {

      // $scroller.scrollTop() is position before scroll, aniProps[scrollDir] is position after
      // When delta is greater, speed will be greater.
      delta = aniProps[scrollDir] - $scroller.scrollTop();
      if(delta < 0) {
        delta *= -1;
      }

      // Divide the delta by the coefficient
      speed = delta / opts.autoCoefficient;
    }

    aniOpts = {
      duration: speed,
      easing: opts.easing,
      complete: function() {
        opts.afterScroll.call(opts.link, opts);
      }
    };

    if (opts.step) {
      aniOpts.step = opts.step;
    }

    if ($scroller.length) {
      $scroller.stop().animate(aniProps, aniOpts);
    } else {
      opts.afterScroll.call(opts.link, opts);
    }
  };

  $.smoothScroll.version = version;
  $.smoothScroll.filterPath = function(string) {
    string = string || '';
    return string
      .replace(/^\//,'')
      .replace(/(?:index|default).[a-zA-Z]{3,4}$/,'')
      .replace(/\/$/,'');
  };

  // default options
  $.fn.smoothScroll.defaults = defaults;

  function escapeSelector (str) {
    return str.replace(/(:|\.)/g,'\\$1');
  }

}));


},{}],3:[function(require,module,exports){
(function(){!function(a,b){"use strict";b.fn.stickToTop=function(c){var d,e,f;return c=b.extend({scrollParent:window,offset:{top:0,left:0},minWindowHeight:!1,minWindowWidth:!1,preserveLayout:!0,bottomBound:!1,onStick:null,onDetach:null},c,!0),f=c.scrollParent,d=0,e=b(f===window?f.document.body:f).offset(),b(this).each(function(){var g,h,i,j,k,l,m,n,o,p;n=this,h=b(n),o=!1,m=!1,p=!1,g=c.preserveLayout?h.wrap('<div class="stickToTopLayout"></div>').parent():void 0,j=function(){var b;return b={width:0,height:0},"number"==typeof window.innerWidth?(b.width=window.innerWidth,b.height=window.innerHeight):a.documentElement&&(a.documentElement.clientWidth||a.documentElement.clientHeight)&&(b.width=a.documentElement.clientWidth,b.height=a.documentElement.clientHeight),b},i=function(){var a;return a=!1,(c.minWindowWidth&&j().width>=c.minWindowWidth||!c.minWindowWidth)&&(a={offset:h.offset(),position:h.css("position"),width:h.outerWidth(!0),height:h.outerHeight(!0),marginTop:parseInt(h.css("margin-top"),10),marginLeft:parseInt(h.css("margin-left"),10)}),a},l=function(){var k,l,m,p,q,r,s,t,u,v;return o||(o=i()),u=f.scrollTop||b(a).scrollTop(),v=j(),r=f===window?v.height:f.offsetHeight,s=f===window?v.width:f.offsetWidth,p=c.bottomBound&&r-c.bottomBound-o.height,k=!!p&&u>p,l=u>=o.offset.top-c.offset.top-o.marginTop+e.top,m=!l,c.minWindowWidth&&s<c.minWindowWidth&&(m=!0,l=!1),l=l&&!k,k&&1!==d?(q=h.offset(),h.css({position:"absolute",top:p+"px",left:q.left+"px"}),d=1,void(c.onDetach&&c.onDetach.call(n))):m&&2!==d||c.minWindowHeight&&r<c.minWindowHeight?(t={position:o.position},"static"===o.position||"relative"===o.position?(h.removeAttr("style"),g&&g.removeAttr("style")):b.extend(t,{top:o.offset.top,left:o.offset.left}),d=2,void(c.onDetach&&c.onDetach.call(n))):void(l&&3!==d&&v.height>o.height+c.offset.top&&(h.css({position:"fixed",top:e.top+(c.offset.top||0),left:e.left+o.left+(c.offset.left-o.marginLeft||0),width:o.width,"z-index":1e3}),c.preserveLayout&&g.css({position:o.position,width:o.width,height:o.height,"margin-top":o.marginTop,"margin-left":o.marginLeft}),d=3,c.onStick&&c.onStick.call(n)))},k=function(){m||(m=!0,window.setTimeout(function(){c.minWindowWidth&&j().width<c.minWindowWidth||p||(h.removeAttr("style"),c.preserveLayout&&g.removeAttr("style"),o=i(),d="",l(),m=!1)},50))},b(window).on("resize",k),b(c.scrollParent).on("scroll",l),this.unstickToTop=function(){p=!0,b(c.scrollParent).off("scroll",l),b(window).off("resize",k)}})}}(window.document,window.jQuery)}).call(this);
},{}]},{},[1]);
