// Compiled by ClojureScript 1.10.891 {:static-fns true, :optimize-constants true, :optimizations :advanced}
goog.provide('hangul_utils.core');
goog.require('cljs.core');
goog.require('cljs.core.constants');
goog.require('clojure.string');
goog.require('clojure.set');
goog.require('cljs.spec.alpha');
hangul_utils.core.code_point = (function hangul_utils$core$code_point(p1__3266_SHARP_){
return p1__3266_SHARP_.codePointAt((0));
});
/**
 * Checks whether a given char lies within the Unicode codepoint range for
 *   Korean.
 */
hangul_utils.core.korean_syllable_QMARK_ = (function hangul_utils$core$korean_syllable_QMARK_(c){
return ((((44032) <= hangul_utils.core.code_point(c))) && ((hangul_utils.core.code_point(c) <= (55203))));
});
/**
 * The jaeums (consonants) which begin Korean characters in modern usage.
 */
hangul_utils.core.initial_jaeums = new cljs.core.PersistentVector(null, 19, 5, cljs.core.PersistentVector.EMPTY_NODE, ["\u3131","\u3132","\u3134","\u3137","\u3138","\u3139","\u3141","\u3142","\u3143","\u3145","\u3146","\u3147","\u3148","\u3149","\u314A","\u314B","\u314C","\u314D","\u314E"], null);
/**
 * The moeums (vowels) which begin Korean characters in modern usage.
 */
hangul_utils.core.medial_moeums = new cljs.core.PersistentVector(null, 21, 5, cljs.core.PersistentVector.EMPTY_NODE, ["\u314F","\u3150","\u3151","\u3152","\u3153","\u3154","\u3155","\u3156","\u3157","\u3158","\u3159","\u315A","\u315B","\u315C","\u315D","\u315E","\u315F","\u3160","\u3161","\u3162","\u3163"], null);
/**
 * The jaeums (consonants) which end Korean characters in modern usage. `nil`
 * is included for the characters only made up of two jamo.
 */
hangul_utils.core.final_jaeums = new cljs.core.PersistentVector(null, 28, 5, cljs.core.PersistentVector.EMPTY_NODE, [null,"\u3131","\u3132","\u3133","\u3134","\u3135","\u3136","\u3137","\u3139","\u313A","\u313B","\u313C","\u313D","\u313E","\u313F","\u3140","\u3141","\u3142","\u3144","\u3145","\u3146","\u3147","\u3148","\u314A","\u314B","\u314C","\u314D","\u314E"], null);
hangul_utils.core.initial_QMARK_ = cljs.core.set(hangul_utils.core.initial_jaeums);
hangul_utils.core.medial_QMARK_ = cljs.core.set(hangul_utils.core.medial_moeums);
hangul_utils.core.final_QMARK_ = cljs.core.set(hangul_utils.core.final_jaeums);
/**
 * Takes a single Korean syllable char and deconstructs it into its
 * constituent jamo char: 강 => [ㄱ ㅏ ㅇ]
 */
hangul_utils.core.deconstruct = (function hangul_utils$core$deconstruct(c){
var codepoint = hangul_utils.core.code_point(c);
var diff = (codepoint - (44032));
var i = cljs.core.quot(diff,(588));
var m = cljs.core.quot(cljs.core.rem(diff,(588)),(28));
var f = cljs.core.rem(diff,(28));
if((diff < (0))){
return new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [cljs.core.char$(codepoint)], null);
} else {
return cljs.core.vec(cljs.core.remove.cljs$core$IFn$_invoke$arity$2(cljs.core.nil_QMARK_,cljs.core.map.cljs$core$IFn$_invoke$arity$3(cljs.core.partial.cljs$core$IFn$_invoke$arity$1(cljs.core.get),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [hangul_utils.core.initial_jaeums,hangul_utils.core.medial_moeums,hangul_utils.core.final_jaeums], null),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [i,m,f], null))));
}
});
/**
 * Takes a vector of valid jamo chars and constructs a syllable char.
 */
hangul_utils.core.construct = (function hangul_utils$core$construct(p__3267){
var vec__3268 = p__3267;
var i = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__3268,(0),null);
var m = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__3268,(1),null);
var f = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__3268,(2),null);
if(((cljs.core.not(m)) && (cljs.core.not(f)))){
return i;
} else {
return cljs.core.char$(((((44032) + (((28) * (21)) * hangul_utils.core.initial_jaeums.indexOf(i))) + ((28) * hangul_utils.core.medial_moeums.indexOf(m))) + hangul_utils.core.final_jaeums.indexOf(f)));
}
});
/**
 * Splits a string of Korean syllables into a sequence of Korean jamo
 */
hangul_utils.core.deconstruct_str = (function hangul_utils$core$deconstruct_str(s){
return cljs.core.reduce.cljs$core$IFn$_invoke$arity$3((function (coll,c){
if(hangul_utils.core.korean_syllable_QMARK_(c)){
return cljs.core.conj.cljs$core$IFn$_invoke$arity$2(coll,hangul_utils.core.deconstruct(c));
} else {
return cljs.core.conj.cljs$core$IFn$_invoke$arity$2(coll,new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [c], null));
}
}),cljs.core.PersistentVector.EMPTY,s);
});
/**
 * Takes a collection of vectors of jamo and joins them into a string of
 * syllables. [[ㄱ ㅏ ㅇ] [ㅅ ㅏ ㄴ]] => "강산"
 */
hangul_utils.core.construct_str = (function hangul_utils$core$construct_str(c){
return cljs.core.apply.cljs$core$IFn$_invoke$arity$2(cljs.core.str,cljs.core.map.cljs$core$IFn$_invoke$arity$2(hangul_utils.core.construct,c));
});
/**
 * Takes a Korean text string and returns a string of the deconstructed
 * alphabet. Ignores (passes along) non-valid Korean characters.
 */
hangul_utils.core.alphabetize = (function hangul_utils$core$alphabetize(s){
return cljs.core.apply.cljs$core$IFn$_invoke$arity$2(cljs.core.str,cljs.core.flatten(hangul_utils.core.deconstruct_str(s)));
});
/**
 * Takes a string of Korean alphabets, and reconstructs Korean text. The
 * initial value for the reduce fn is a vector containing the accumulated
 * result, the current syllable under consideration, and the most recent
 * consonant in limbo (to be classified as initial or final).
 * 
 * Each new char read in from the input string is either added to the current
 * syllable vector or sent into limbo, and can trigger the syllable to be
 * conj'd onto the accumulator once it's fully constructed.
 * 
 * The cond branches could use more cleanup.
 */
hangul_utils.core.syllabize = (function hangul_utils$core$syllabize(s){
var vec__3271 = cljs.core.reduce.cljs$core$IFn$_invoke$arity$3((function (p__3274,c){
var vec__3275 = p__3274;
var acc = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__3275,(0),null);
var syl = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__3275,(1),null);
var limbo = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__3275,(2),null);
if(cljs.core.truth_((function (){var and__4251__auto__ = cljs.core.empty_QMARK_(syl);
if(and__4251__auto__){
return (hangul_utils.core.initial_QMARK_.cljs$core$IFn$_invoke$arity$1 ? hangul_utils.core.initial_QMARK_.cljs$core$IFn$_invoke$arity$1(c) : hangul_utils.core.initial_QMARK_.call(null,c));
} else {
return and__4251__auto__;
}
})())){
return new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [acc,new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [c], null),null], null);
} else {
if(((cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2((1),cljs.core.count(syl))) && (cljs.core.not(limbo)))){
if(cljs.core.truth_((hangul_utils.core.medial_QMARK_.cljs$core$IFn$_invoke$arity$1 ? hangul_utils.core.medial_QMARK_.cljs$core$IFn$_invoke$arity$1(c) : hangul_utils.core.medial_QMARK_.call(null,c)))){
return new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [acc,cljs.core.conj.cljs$core$IFn$_invoke$arity$2(syl,c),null], null);
} else {
return new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [cljs.core.conj.cljs$core$IFn$_invoke$arity$2(acc,syl),new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [c], null),null], null);
}
} else {
if(cljs.core.truth_((function (){var and__4251__auto__ = cljs.core.not(limbo);
if(and__4251__auto__){
return (hangul_utils.core.final_QMARK_.cljs$core$IFn$_invoke$arity$1 ? hangul_utils.core.final_QMARK_.cljs$core$IFn$_invoke$arity$1(c) : hangul_utils.core.final_QMARK_.call(null,c));
} else {
return and__4251__auto__;
}
})())){
return new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [acc,syl,c], null);
} else {
if(cljs.core.truth_((function (){var and__4251__auto__ = limbo;
if(cljs.core.truth_(and__4251__auto__)){
return (hangul_utils.core.initial_QMARK_.cljs$core$IFn$_invoke$arity$1 ? hangul_utils.core.initial_QMARK_.cljs$core$IFn$_invoke$arity$1(c) : hangul_utils.core.initial_QMARK_.call(null,c));
} else {
return and__4251__auto__;
}
})())){
return new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [cljs.core.conj.cljs$core$IFn$_invoke$arity$2(acc,cljs.core.conj.cljs$core$IFn$_invoke$arity$2(syl,limbo)),new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [c], null),null], null);
} else {
if(cljs.core.truth_((function (){var and__4251__auto__ = limbo;
if(cljs.core.truth_(and__4251__auto__)){
return (hangul_utils.core.medial_QMARK_.cljs$core$IFn$_invoke$arity$1 ? hangul_utils.core.medial_QMARK_.cljs$core$IFn$_invoke$arity$1(c) : hangul_utils.core.medial_QMARK_.call(null,c));
} else {
return and__4251__auto__;
}
})())){
return new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [cljs.core.conj.cljs$core$IFn$_invoke$arity$2(acc,syl),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [limbo,c], null),null], null);
} else {
return new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [cljs.core.conj.cljs$core$IFn$_invoke$arity$variadic(acc,cljs.core.conj.cljs$core$IFn$_invoke$arity$2(syl,limbo),cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [c], null)], 0)),cljs.core.PersistentVector.EMPTY,null], null);

}
}
}
}
}
}),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [cljs.core.PersistentVector.EMPTY,cljs.core.PersistentVector.EMPTY,null], null),s);
var acc = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__3271,(0),null);
var syl = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__3271,(1),null);
var limbo = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__3271,(2),null);
return hangul_utils.core.construct_str(cljs.core.conj.cljs$core$IFn$_invoke$arity$2(acc,cljs.core.conj.cljs$core$IFn$_invoke$arity$2(syl,limbo)));
});
