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