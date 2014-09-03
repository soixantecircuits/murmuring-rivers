function hideHeader(){
    TweenMax.to($('header'), 0.5, {left: "-250px"});
    $('#hashtagHeader').blur();
}