// Compiled by ClojureScript 1.10.891 {:static-fns true, :optimize-constants true, :optimizations :advanced}
goog.provide('hangul_sound_shift.webpage');
goog.require('cljs.core');
goog.require('cljs.core.constants');
goog.require('hangul_sound_shift.core');
hangul_sound_shift.webpage.input_box = (function hangul_sound_shift$webpage$input_box(){
return document.getElementById("input");
});
hangul_sound_shift.webpage.update_page = (function hangul_sound_shift$webpage$update_page(){
cljs.core.println.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([hangul_sound_shift.core.convert(hangul_sound_shift.webpage.input_box().value)], 0));

return (document.getElementById("output").textContent = hangul_sound_shift.core.convert(hangul_sound_shift.webpage.input_box().value));
});
hangul_sound_shift.webpage.timer = null;
hangul_sound_shift.webpage.refresh = (function hangul_sound_shift$webpage$refresh(){
if(cljs.core.truth_(hangul_sound_shift.webpage.timer)){
clearTimeout(hangul_sound_shift.webpage.timer);
} else {
}

var input_length = hangul_sound_shift.webpage.input_box().value.length;
var update_time = (function (){var x__4339__auto__ = input_length;
var y__4340__auto__ = (1000);
return ((x__4339__auto__ < y__4340__auto__) ? x__4339__auto__ : y__4340__auto__);
})();
return (hangul_sound_shift.webpage.timer = setTimeout(hangul_sound_shift.webpage.update_page,update_time));
});
hangul_sound_shift.webpage.setup = (function hangul_sound_shift$webpage$setup(){
return hangul_sound_shift.webpage.input_box().addEventListener("input",hangul_sound_shift.webpage.refresh);
});
window.addEventListener("load",hangul_sound_shift.webpage.setup);
