// Compiled by ClojureScript 1.10.891 {:static-fns true, :optimize-constants true, :optimizations :advanced}
goog.provide('hangul_sound_shift.core');
goog.require('cljs.core');
goog.require('cljs.core.constants');
goog.require('hangul_utils.core');
goog.require('clojure.string');
hangul_sound_shift.core.consonants = new cljs.core.PersistentHashSet(null, new cljs.core.PersistentArrayMap(null, 13, ["\u3141",null,"\u3145",null,"\u3146",null,"\u3148",null,"\u3149",null,"\u314A",null,"\u314B",null,"\u314E",null,"\u3131",null,"\u3132",null,"\u3134",null,"\u3137",null,"\u3139",null], null), null);
hangul_sound_shift.core.tensing_prefix = new cljs.core.PersistentHashSet(null, new cljs.core.PersistentArrayMap(null, 13, ["\u3143",null,"\u3145",null,"\u3146",null,"\u3148",null,"\u3149",null,"\u314A",null,"\u314B",null,"\u314C",null,"\u314D",null,"\u3131",null,"\u3132",null,"\u3137",null,"\u3138",null], null), null);
hangul_sound_shift.core.t_badchims = new cljs.core.PersistentHashSet(null, new cljs.core.PersistentArrayMap(null, 6, ["\u3145",null,"\u3146",null,"\u3148",null,"\u314A",null,"\u314C",null,"\u3137",null], null), null);
hangul_sound_shift.core.voiceless = new cljs.core.PersistentArrayMap(null, 4, ["\u3131","\u314B","\u3137","\u314C","\u3142","\u314D","\u3148","\u314A"], null);
hangul_sound_shift.core.plain_to_tense = new cljs.core.PersistentArrayMap(null, 5, ["\u3145","\u3146","\u3131","\u3132","\u3137","\u3138","\u3148","\u3149","\u3142","\u3143"], null);
hangul_sound_shift.core.double_badchims = cljs.core.PersistentHashMap.fromArrays(["\u3140","\u3144","\u3133","\u3135","\u3136","\u313A","\u313B","\u313C","\u313D","\u313E","\u313F"],[new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, ["\u3139","\u314E"], null),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, ["\u3142","\u3145"], null),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, ["\u3131","\u3145"], null),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, ["\u3134","\u3148"], null),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, ["\u3134","\u314E"], null),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, ["\u3139","\u3131"], null),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, ["\u3139","\u3141"], null),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, ["\u3131","\u3142"], null),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, ["\u3139","\u3145"], null),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, ["\u3139","\u314C"], null),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, ["\u3139","\u3141"], null)]);
hangul_sound_shift.core.ssang_bad_first = cljs.core.into.cljs$core$IFn$_invoke$arity$2(cljs.core.PersistentHashSet.EMPTY,cljs.core.map.cljs$core$IFn$_invoke$arity$2(cljs.core.first,cljs.core.vals(hangul_sound_shift.core.double_badchims)));
hangul_sound_shift.core.ssang_bad_second = cljs.core.into.cljs$core$IFn$_invoke$arity$2(cljs.core.PersistentHashSet.EMPTY,cljs.core.filter.cljs$core$IFn$_invoke$arity$2(cljs.core.comp.cljs$core$IFn$_invoke$arity$2(cljs.core.not,new cljs.core.PersistentHashSet(null, new cljs.core.PersistentArrayMap(null, 1, ["\u3131",null], null), null)),cljs.core.map.cljs$core$IFn$_invoke$arity$2(cljs.core.second,cljs.core.vals(hangul_sound_shift.core.double_badchims))));
hangul_sound_shift.core.ssang_bad_pre_tense = cljs.core.into.cljs$core$IFn$_invoke$arity$2(cljs.core.PersistentHashSet.EMPTY,cljs.core.filter.cljs$core$IFn$_invoke$arity$2(hangul_sound_shift.core.tensing_prefix,hangul_sound_shift.core.ssang_bad_second));
/**
 * A list of rules where each rule is the form [pattern result].
 *   The rules are listed in descending order of presidence, so
 *   it will only apply if no rule before it applies.
 * 
 *   A pattern is a vector where each element is either a character
 *   or a function from char to bool. A character is treated as
 *   #(= char %). A pattern is matched if a sequence of consecutive
 *   letters return true by the functions in the pattern.
 * 
 *   A result is either a vector or a function from sequence of char
 *   to sequence of char. A vector is treated as a function returning
 *   that vector, with any number replaced by (nth input number).
 * 
 *   Every time a pattern matches the unprocessed letter sequence,
 *   the result function applied to the unprocessed sequence is
 *   concated to the end of the processed sequence, and the length
 *   of the pattern is removed from the unprocessed sequence.
 */
hangul_sound_shift.core.sound_shift_rules = cljs.core.PersistentVector.fromArray([new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.PersistentVector(null, 4, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.PersistentHashSet(null, new cljs.core.PersistentArrayMap(null, 2, ["\u3134",null,"\u3139",null], null), null),"\u314E",cljs.core.cst$kw$break,"\u3147"], null),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [cljs.core.cst$kw$break,(0)], null)], null),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.PersistentVector(null, 4, 5, cljs.core.PersistentVector.EMPTY_NODE, [hangul_sound_shift.core.ssang_bad_first,hangul_sound_shift.core.ssang_bad_second,cljs.core.cst$kw$break,"\u3147"], null),(function (p__3284){
var vec__3285 = p__3284;
var c1 = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__3285,(0),null);
var c2 = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__3285,(1),null);
var b = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__3285,(2),null);
return new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [cljs.core.get.cljs$core$IFn$_invoke$arity$3(hangul_sound_shift.core.t_badchims,c1,c1),b,c2], null);
})], null),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.PersistentVector(null, 4, 5, cljs.core.PersistentVector.EMPTY_NODE, ["\u3139","\u3141",cljs.core.cst$kw$break,(function (p1__3280_SHARP_){
return cljs.core.not_EQ_.cljs$core$IFn$_invoke$arity$2("\u3147",p1__3280_SHARP_);
})], null),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, ["\u3141",cljs.core.cst$kw$break,(3)], null)], null),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.PersistentVector(null, 4, 5, cljs.core.PersistentVector.EMPTY_NODE, ["\u3139","\u314D",cljs.core.cst$kw$break,(function (p1__3281_SHARP_){
return cljs.core.not_EQ_.cljs$core$IFn$_invoke$arity$2("\u3147",p1__3281_SHARP_);
})], null),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, ["\u314D",cljs.core.cst$kw$break,(3)], null)], null),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.PersistentVector(null, 4, 5, cljs.core.PersistentVector.EMPTY_NODE, ["\u3142",hangul_sound_shift.core.ssang_bad_second,cljs.core.cst$kw$break,new cljs.core.PersistentHashSet(null, new cljs.core.PersistentArrayMap(null, 2, ["\u3141",null,"\u3134",null], null), null)], null),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, ["\u3141",cljs.core.cst$kw$break,(3)], null)], null),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.PersistentVector(null, 4, 5, cljs.core.PersistentVector.EMPTY_NODE, [hangul_sound_shift.core.ssang_bad_first,"\u314E",cljs.core.cst$kw$break,hangul_sound_shift.core.voiceless], null),(function (p__3288){
var vec__3289 = p__3288;
var c1 = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__3289,(0),null);
var _ = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__3289,(1),null);
var b = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__3289,(2),null);
var c3 = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__3289,(3),null);
return new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [cljs.core.get.cljs$core$IFn$_invoke$arity$3(hangul_sound_shift.core.t_badchims,c1,c1),b,(hangul_sound_shift.core.voiceless.cljs$core$IFn$_invoke$arity$1 ? hangul_sound_shift.core.voiceless.cljs$core$IFn$_invoke$arity$1(c3) : hangul_sound_shift.core.voiceless.call(null,c3))], null);
})], null),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.PersistentVector(null, 4, 5, cljs.core.PersistentVector.EMPTY_NODE, [hangul_sound_shift.core.ssang_bad_first,"\u314E",cljs.core.cst$kw$break,"\u3145"], null),(function (p__3292){
var vec__3293 = p__3292;
var c1 = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__3293,(0),null);
var _ = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__3293,(1),null);
var b = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__3293,(2),null);
return new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [cljs.core.get.cljs$core$IFn$_invoke$arity$3(hangul_sound_shift.core.t_badchims,c1,c1),b,"\u3146"], null);
})], null),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.PersistentVector(null, 4, 5, cljs.core.PersistentVector.EMPTY_NODE, [hangul_sound_shift.core.ssang_bad_first,hangul_sound_shift.core.ssang_bad_pre_tense,cljs.core.cst$kw$break,hangul_sound_shift.core.plain_to_tense], null),(function (p__3296){
var vec__3297 = p__3296;
var c1 = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__3297,(0),null);
var _ = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__3297,(1),null);
var b = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__3297,(2),null);
var c3 = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__3297,(3),null);
return new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [cljs.core.get.cljs$core$IFn$_invoke$arity$3(hangul_sound_shift.core.t_badchims,c1,c1),b,(hangul_sound_shift.core.plain_to_tense.cljs$core$IFn$_invoke$arity$1 ? hangul_sound_shift.core.plain_to_tense.cljs$core$IFn$_invoke$arity$1(c3) : hangul_sound_shift.core.plain_to_tense.call(null,c3))], null);
})], null),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.PersistentVector(null, 4, 5, cljs.core.PersistentVector.EMPTY_NODE, [hangul_sound_shift.core.ssang_bad_first,hangul_sound_shift.core.ssang_bad_second,cljs.core.cst$kw$break,(function (p1__3282_SHARP_){
return cljs.core.not_EQ_.cljs$core$IFn$_invoke$arity$2("\u3147",p1__3282_SHARP_);
})], null),(function (p__3300){
var vec__3301 = p__3300;
var c1 = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__3301,(0),null);
var _ = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__3301,(1),null);
var b = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__3301,(2),null);
var c3 = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__3301,(3),null);
return new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [cljs.core.get.cljs$core$IFn$_invoke$arity$3(hangul_sound_shift.core.t_badchims,c1,c1),b,c3], null);
})], null),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.PersistentVector(null, 4, 5, cljs.core.PersistentVector.EMPTY_NODE, [hangul_sound_shift.core.ssang_bad_first,"\u3131",cljs.core.cst$kw$break,(function (p1__3283_SHARP_){
return cljs.core.not((function (){var fexpr__3304 = new cljs.core.PersistentHashSet(null, new cljs.core.PersistentArrayMap(null, 3, ["\u3141",null,"\u3134",null,"\u3139",null], null), null);
return (fexpr__3304.cljs$core$IFn$_invoke$arity$1 ? fexpr__3304.cljs$core$IFn$_invoke$arity$1(p1__3283_SHARP_) : fexpr__3304.call(null,p1__3283_SHARP_));
})());
})], null),(function (p__3305){
var vec__3306 = p__3305;
var c1 = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__3306,(0),null);
var _ = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__3306,(1),null);
var b = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__3306,(2),null);
var c3 = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__3306,(3),null);
return new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [cljs.core.get.cljs$core$IFn$_invoke$arity$3(hangul_sound_shift.core.t_badchims,c1,c1),b,cljs.core.get.cljs$core$IFn$_invoke$arity$3(hangul_sound_shift.core.plain_to_tense,c3,c3)], null);
})], null),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.PersistentVector(null, 4, 5, cljs.core.PersistentVector.EMPTY_NODE, ["\u314C",cljs.core.cst$kw$break,"\u3147",new cljs.core.PersistentHashSet(null, new cljs.core.PersistentArrayMap(null, 2, ["\u3163",null,"\u3155",null], null), null)], null),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [cljs.core.cst$kw$break,"\u314A",(3)], null)], null),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.PersistentVector(null, 4, 5, cljs.core.PersistentVector.EMPTY_NODE, ["\u3137",cljs.core.cst$kw$break,"\u314E",new cljs.core.PersistentHashSet(null, new cljs.core.PersistentArrayMap(null, 2, ["\u3163",null,"\u3155",null], null), null)], null),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [cljs.core.cst$kw$break,"\u314A",(3)], null)], null),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.PersistentVector(null, 4, 5, cljs.core.PersistentVector.EMPTY_NODE, ["\u3137",cljs.core.cst$kw$break,"\u3147",new cljs.core.PersistentHashSet(null, new cljs.core.PersistentArrayMap(null, 2, ["\u3163",null,"\u3155",null], null), null)], null),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [cljs.core.cst$kw$break,"\u3148",(3)], null)], null),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, ["\u3142",cljs.core.cst$kw$break,hangul_sound_shift.core.plain_to_tense], null),(function (p__3309){
var vec__3310 = p__3309;
var _ = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__3310,(0),null);
var b = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__3310,(1),null);
var c = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__3310,(2),null);
return new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, ["\u314D",b,cljs.core.get.cljs$core$IFn$_invoke$arity$3(hangul_sound_shift.core.plain_to_tense,c,c)], null);
})], null),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, ["\u3142",cljs.core.cst$kw$break,cljs.core.comp.cljs$core$IFn$_invoke$arity$2(cljs.core.not,new cljs.core.PersistentHashSet(null, new cljs.core.PersistentArrayMap(null, 5, ["\u3141",null,"\u3147",null,"\u314E",null,"\u3134",null,"\u3139",null], null), null))], null),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, ["\u314D",(1),(2)], null)], null),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [hangul_sound_shift.core.t_badchims,cljs.core.cst$kw$break,cljs.core.comp.cljs$core$IFn$_invoke$arity$2(cljs.core.not,new cljs.core.PersistentHashSet(null, new cljs.core.PersistentArrayMap(null, 4, ["\u3141",null,"\u3147",null,"\u314E",null,"\u3134",null], null), null))], null),(function (p__3313){
var vec__3314 = p__3313;
var _ = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__3314,(0),null);
var b = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__3314,(1),null);
var c = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__3314,(2),null);
return new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, ["\u314C",b,cljs.core.get.cljs$core$IFn$_invoke$arity$3(hangul_sound_shift.core.plain_to_tense,c,c)], null);
})], null),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [hangul_sound_shift.core.consonants,cljs.core.cst$kw$break,"\u3147"], null),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [cljs.core.cst$kw$break,(0)], null)], null),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.PersistentHashSet(null, new cljs.core.PersistentArrayMap(null, 3, ["\u3141",null,"\u3134",null,"\u3139",null], null), null),cljs.core.cst$kw$break,"\u314E"], null),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [cljs.core.cst$kw$break,(0)], null)], null),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [" ",cljs.core.cst$kw$break,hangul_sound_shift.core.voiceless], null),(function (p__3317){
var vec__3318 = p__3317;
var s = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__3318,(0),null);
var b = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__3318,(1),null);
var c = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__3318,(2),null);
return new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [s,b,(hangul_sound_shift.core.voiceless.cljs$core$IFn$_invoke$arity$1 ? hangul_sound_shift.core.voiceless.cljs$core$IFn$_invoke$arity$1(c) : hangul_sound_shift.core.voiceless.call(null,c))], null);
})], null),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, ["\u3139",cljs.core.cst$kw$break,"\u3142"], null),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, ["\u3139",cljs.core.cst$kw$break,"\u3142"], null)], null),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [hangul_sound_shift.core.tensing_prefix,cljs.core.cst$kw$break,hangul_sound_shift.core.plain_to_tense], null),(function (p__3321){
var vec__3322 = p__3321;
var c1 = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__3322,(0),null);
var b = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__3322,(1),null);
var c2 = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__3322,(2),null);
return new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [c1,b,cljs.core.get.cljs$core$IFn$_invoke$arity$3(hangul_sound_shift.core.plain_to_tense,c2,c2)], null);
})], null),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [hangul_sound_shift.core.voiceless,cljs.core.cst$kw$break,"\u314E"], null),(function (p__3325){
var vec__3326 = p__3325;
var c = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__3326,(0),null);
var b = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__3326,(1),null);
return new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [b,(hangul_sound_shift.core.voiceless.cljs$core$IFn$_invoke$arity$1 ? hangul_sound_shift.core.voiceless.cljs$core$IFn$_invoke$arity$1(c) : hangul_sound_shift.core.voiceless.call(null,c))], null);
})], null),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, ["\u314E",cljs.core.cst$kw$break,hangul_sound_shift.core.voiceless], null),(function (p__3329){
var vec__3330 = p__3329;
var _ = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__3330,(0),null);
var b = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__3330,(1),null);
var c = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__3330,(2),null);
return new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [b,(hangul_sound_shift.core.voiceless.cljs$core$IFn$_invoke$arity$1 ? hangul_sound_shift.core.voiceless.cljs$core$IFn$_invoke$arity$1(c) : hangul_sound_shift.core.voiceless.call(null,c))], null);
})], null),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [hangul_sound_shift.core.t_badchims,cljs.core.cst$kw$break,"\u314E"], null),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [cljs.core.cst$kw$break,"\u314C"], null)], null),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, ["\u314E",cljs.core.cst$kw$break,"\u3145"], null),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [cljs.core.cst$kw$break,"\u3146"], null)], null),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.PersistentVector(null, 4, 5, cljs.core.PersistentVector.EMPTY_NODE, [hangul_sound_shift.core.ssang_bad_first,"\u3131",cljs.core.cst$kw$break,new cljs.core.PersistentHashSet(null, new cljs.core.PersistentArrayMap(null, 2, ["\u3141",null,"\u3134",null], null), null)], null),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, ["\u3147",cljs.core.cst$kw$break,(3)], null)], null),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.PersistentVector(null, 4, 5, cljs.core.PersistentVector.EMPTY_NODE, [hangul_sound_shift.core.ssang_bad_first,"\u3131",cljs.core.cst$kw$break,"\u3139"], null),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, ["\u3147",cljs.core.cst$kw$break,"\u3134"], null)], null),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.PersistentHashSet(null, new cljs.core.PersistentArrayMap(null, 3, ["\u314B",null,"\u3131",null,"\u3132",null], null), null),cljs.core.cst$kw$break,new cljs.core.PersistentHashSet(null, new cljs.core.PersistentArrayMap(null, 2, ["\u3141",null,"\u3134",null], null), null)], null),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, ["\u3147",cljs.core.cst$kw$break,(2)], null)], null),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.PersistentHashSet(null, new cljs.core.PersistentArrayMap(null, 3, ["\u314B",null,"\u3131",null,"\u3132",null], null), null),cljs.core.cst$kw$break,"\u3139"], null),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, ["\u3147",cljs.core.cst$kw$break,"\u3134"], null)], null),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, ["\u3142",cljs.core.cst$kw$break,"\u3139"], null),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, ["\u3141",cljs.core.cst$kw$break,"\u3134"], null)], null),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, ["\u3142",cljs.core.cst$kw$break,new cljs.core.PersistentHashSet(null, new cljs.core.PersistentArrayMap(null, 2, ["\u3141",null,"\u3134",null], null), null)], null),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, ["\u3141",cljs.core.cst$kw$break,(2)], null)], null),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, ["\u3134",cljs.core.cst$kw$break,"\u3139"], null),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, ["\u3139",cljs.core.cst$kw$break,"\u3139"], null)], null),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.PersistentHashSet(null, new cljs.core.PersistentArrayMap(null, 2, ["\u3141",null,"\u3147",null], null), null),cljs.core.cst$kw$break,"\u3139"], null),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [(0),cljs.core.cst$kw$break,"\u3134"], null)], null),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [hangul_sound_shift.core.t_badchims,cljs.core.cst$kw$break,new cljs.core.PersistentHashSet(null, new cljs.core.PersistentArrayMap(null, 2, ["\u3141",null,"\u3134",null], null), null)], null),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, ["\u3134",cljs.core.cst$kw$break,(2)], null)], null)], true);
hangul_sound_shift.core.form_result = (function hangul_sound_shift$core$form_result(p__3333,input){
var vec__3334 = p__3333;
var _ = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__3334,(0),null);
var result_pattern = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__3334,(1),null);
if(cljs.core.vector_QMARK_(result_pattern)){
return cljs.core.mapv.cljs$core$IFn$_invoke$arity$2((function (token){
if(cljs.core.integer_QMARK_(token)){
return cljs.core.nth.cljs$core$IFn$_invoke$arity$2(input,token);
} else {
return token;
}
}),result_pattern);
} else {
return (result_pattern.cljs$core$IFn$_invoke$arity$1 ? result_pattern.cljs$core$IFn$_invoke$arity$1(input) : result_pattern.call(null,input));
}
});
hangul_sound_shift.core.dbg = (function hangul_sound_shift$core$dbg(x){
cljs.core.println.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([x], 0));

return x;
});
hangul_sound_shift.core.join_seqs = (function hangul_sound_shift$core$join_seqs(delim){
return cljs.core.comp.cljs$core$IFn$_invoke$arity$2(cljs.core.interpose.cljs$core$IFn$_invoke$arity$1(new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [delim], null)),cljs.core.mapcat.cljs$core$IFn$_invoke$arity$1(cljs.core.identity));
});
hangul_sound_shift.core.split_seq = (function hangul_sound_shift$core$split_seq(delim,text){
return cljs.core.filter.cljs$core$IFn$_invoke$arity$2((function (p1__3338_SHARP_){
return cljs.core.not_EQ_.cljs$core$IFn$_invoke$arity$2(delim,cljs.core.first(p1__3338_SHARP_));
}),cljs.core.partition_by.cljs$core$IFn$_invoke$arity$2((function (p1__3337_SHARP_){
return cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(delim,p1__3337_SHARP_);
}),text));
});
hangul_sound_shift.core.break_double_badchim = (function hangul_sound_shift$core$break_double_badchim(){
return cljs.core.mapcat.cljs$core$IFn$_invoke$arity$1((function (p1__3339_SHARP_){
return cljs.core.get.cljs$core$IFn$_invoke$arity$3(hangul_sound_shift.core.double_badchims,p1__3339_SHARP_,new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [p1__3339_SHARP_], null));
}));
});
hangul_sound_shift.core.match_token_QMARK_ = (function hangul_sound_shift$core$match_token_QMARK_(pattern,token){
if(((cljs.core.char_QMARK_(pattern)) || ((pattern instanceof cljs.core.Keyword)))){
return cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(pattern,token);
} else {
return (pattern.cljs$core$IFn$_invoke$arity$1 ? pattern.cljs$core$IFn$_invoke$arity$1(token) : pattern.call(null,token));
}
});
hangul_sound_shift.core.match_rule_QMARK_ = (function hangul_sound_shift$core$match_rule_QMARK_(text,text_len,p__3340){
var vec__3341 = p__3340;
var pattern = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__3341,(0),null);
var _ = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__3341,(1),null);
return (((cljs.core.count(pattern) <= text_len)) && (cljs.core.every_QMARK_(cljs.core.identity,cljs.core.map.cljs$core$IFn$_invoke$arity$3(hangul_sound_shift.core.match_token_QMARK_,pattern,text))));
});
hangul_sound_shift.core.match_rules = (function hangul_sound_shift$core$match_rules(input,input_len){
return cljs.core.first(cljs.core.filter.cljs$core$IFn$_invoke$arity$2((function (p1__3344_SHARP_){
return hangul_sound_shift.core.match_rule_QMARK_(input,input_len,p1__3344_SHARP_);
}),hangul_sound_shift.core.sound_shift_rules));
});
hangul_sound_shift.core.tokenize = (function hangul_sound_shift$core$tokenize(text){
var results = cljs.core.transient$(cljs.core.PersistentVector.EMPTY);
var text_remain = text;
var text_len = cljs.core.count(text);
while(true){
var temp__5751__auto__ = hangul_sound_shift.core.match_rules(text_remain,text_len);
if(cljs.core.truth_(temp__5751__auto__)){
var matching_rule = temp__5751__auto__;
var G__3345 = cljs.core.reduce.cljs$core$IFn$_invoke$arity$3(cljs.core.conj_BANG_,results,hangul_sound_shift.core.form_result(matching_rule,text_remain));
var G__3346 = cljs.core.drop.cljs$core$IFn$_invoke$arity$2(cljs.core.count(cljs.core.first(matching_rule)),text_remain);
var G__3347 = (text_len - cljs.core.count(cljs.core.first(matching_rule)));
results = G__3345;
text_remain = G__3346;
text_len = G__3347;
continue;
} else {
if((text_len === (0))){
return hangul_sound_shift.core.split_seq(cljs.core.cst$kw$break,cljs.core.persistent_BANG_(results));
} else {
var G__3348 = cljs.core.conj_BANG_.cljs$core$IFn$_invoke$arity$2(results,cljs.core.first(text_remain));
var G__3349 = cljs.core.drop.cljs$core$IFn$_invoke$arity$2((1),text_remain);
var G__3350 = (text_len - (1));
results = G__3348;
text_remain = G__3349;
text_len = G__3350;
continue;
}
}
break;
}
});
hangul_sound_shift.core.convert = (function hangul_sound_shift$core$convert(written_hangul){
var code_points = hangul_utils.core.deconstruct_str([" ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(written_hangul)," "].join(''));
var jamo = cljs.core.into.cljs$core$IFn$_invoke$arity$3(cljs.core.PersistentVector.EMPTY,cljs.core.comp.cljs$core$IFn$_invoke$arity$2(hangul_sound_shift.core.join_seqs(cljs.core.cst$kw$break),hangul_sound_shift.core.break_double_badchim()),code_points);
var converted_jamo = hangul_sound_shift.core.tokenize(jamo);
return clojure.string.trim(hangul_utils.core.construct_str(converted_jamo));
});
