require('../../_components/jquery-sticktotop/src/jquery-sticktotop.min.js');
require('jquery-smooth-scroll');
// Setup Sticky Nav
$('.site-nav').stickToTop();
$('a').smoothScroll();

$slides = $('.slide');
function findTallest() {
  var tallestHeight = 0;
  $slides.each(function () {
    var theHeight = $(this).height();

    if (tallestHeight <  theHeight) {
      tallestHeight = theHeight;
    }
  });
  return tallestHeight;
};
// tallest = 900
var tallest = 0;
$(window).resize(function() {
  tallest = findTallest();
  $slides.eq(0).height(tallest);
  console.log($slides.eq(0).height());
}).resize();
$('.skillgrid').on('mouseleave', function() {
  $slides.stop();
  $slides.not(':eq(0)').animate({height: 0, opacity: 0});
  $slides.eq(0).animate({height: tallest, opacity: 1});
});
$triggers = $('.category').mouseover(function() {
  var index = $triggers.index($(this)) + 1;
  $slides.stop();
  $slides.not(':eq(' + index + ')').animate({height: 0, opacity: 0});
  $slides.eq(index).animate({height: tallest, opacity: 1});
});
