(ns hangul-sound-shift.core
  (:require [hangul-utils.core :as han]
            [clojure.string :as str]))

(def consonants #{\ㅅ\ㅆ\ㅈ\ㅉ\ㅊ\ㄷ\ㄱ\ㄲ\ㅋ\ㅁ\ㄴ\ㄹ\ㅎ})
(def tensing-prefix ; consonants that cause next consonant to tense
  #{\ㅈ\ㄷ\ㄱ\ㅅ\ㅃ\ㅉ\ㄸ\ㄲ\ㅆ\ㅋ\ㅌ\ㅊ\ㅍ})
(def t-badchims #{\ㅅ\ㅆ\ㅈ\ㅊ\ㄷ\ㅌ})
(def voiceless {\ㄱ\ㅋ,\ㄷ\ㅌ,\ㅂ\ㅍ,\ㅈ\ㅊ})
(def plain-to-tense {\ㅅ\ㅆ,\ㄱ\ㄲ,\ㄷ\ㄸ,\ㅈ\ㅉ,\ㅂ\ㅃ})
(def double-badchims
  {\ㄳ[\ㄱ\ㅅ]
   \ㄵ[\ㄴ\ㅈ]
   \ㄶ[\ㄴ\ㅎ]
   \ㄾ[\ㄹ\ㅌ]
   \ㅀ[\ㄹ\ㅎ]
   \ㅄ[\ㅂ\ㅅ]
   \ㄽ[\ㄹ\ㅅ]
   \ㄻ[\ㄹ\ㅁ]
   \ㄿ[\ㄹ\ㅁ]
   \ㄺ[\ㄹ\ㄱ]
   \ㄼ[\ㄱ\ㅂ]})
(def ssang-bad-first ; for brevity
  (into #{} (map first (vals double-badchims))))
(def ssang-bad-second ; filter out consonant with nasal shift
  (into #{} (filter (comp not #{\ㄱ})
                    (map second (vals double-badchims)))))
(def ssang-bad-pre-tense ; second badchim that is also tensing-prefix
  (into #{} (filter tensing-prefix ssang-bad-second)))

; :break represends the character boundary between hangul characters
(def sound-shift-rules
  "A list of rules where each rule is the form [pattern result].
  The rules are listed in descending order of presidence, so
  it will only apply if no rule before it applies.

  A pattern is a vector where each element is either a character
  or a function from char to bool. A character is treated as
  #(= char %). A pattern is matched if a sequence of consecutive
  letters return true by the functions in the pattern.

  A result is either a vector or a function from sequence of char
  to sequence of char. A vector is treated as a function returning
  that vector, with any number replaced by (nth input number).

  Every time a pattern matches the unprocessed letter sequence,
  the result function applied to the unprocessed sequence is
  concated to the end of the processed sequence, and the length
  of the pattern is removed from the unprocessed sequence."
  [
   ; double badchim
   [[#{\ㄹ\ㄴ} \ㅎ :break \ㅇ] [:break 0]]
   [[ssang-bad-first ssang-bad-second :break \ㅇ]
    (fn [[c1 c2 b]] [(get t-badchims c1 c1) b c2])]
   [[\ㄹ \ㅁ :break #(not= \ㅇ %)] [\ㅁ :break 3]]
   [[\ㄹ \ㅍ :break #(not= \ㅇ %)] [\ㅍ :break 3]]
   [[\ㅂ ssang-bad-second :break #{\ㅁ\ㄴ}] [\ㅁ :break 3]]
   [[ssang-bad-first \ㅎ :break voiceless]
    (fn [[c1 _ b c3]]
      [(get t-badchims c1 c1) b (voiceless c3)])]
   [[ssang-bad-first \ㅎ :break \ㅅ]
    (fn [[c1 _ b]]
      [(get t-badchims c1 c1) b \ㅆ])]
   [[ssang-bad-first ssang-bad-pre-tense :break plain-to-tense]
    (fn [[c1 _ b c3]]
      [(get t-badchims c1 c1) b (plain-to-tense c3)])]
   [[ssang-bad-first ssang-bad-second :break #(not= \ㅇ %)]
    (fn [[c1 _ b c3]]
      [(get t-badchims c1 c1) b c3])]
   [[ssang-bad-first \ㄱ :break #(not (#{\ㅁ\ㄴ\ㄹ} %))]
    (fn [[c1 _ b c3]]
      [(get t-badchims c1 c1) b (get plain-to-tense c3 c3)])]
   ; badchim sound shift
   [[\ㅌ :break \ㅇ #{\ㅣ\ㅕ}] [:break \ㅊ 3]]
   [[\ㄷ :break \ㅎ #{\ㅣ\ㅕ}] [:break \ㅊ 3]]
   [[\ㄷ :break \ㅇ #{\ㅣ\ㅕ}] [:break \ㅈ 3]]
   [[\ㅂ :break plain-to-tense]
    (fn [[_ b c]] [\ㅍ b (get plain-to-tense c c)])]
   [[\ㅂ :break (comp not #{\ㄹ\ㅇ\ㅁ\ㄴ\ㅎ})] [\ㅍ 1 2]]
   [[t-badchims :break (comp not #{\ㅇ\ㄴ\ㅁ\ㅎ})]
    (fn [[_ b c]] [\ㅌ b (get plain-to-tense c c)])]
   ; re-syllabification
   [[consonants :break \ㅇ] [:break 0]]
   [[#{\ㅁ\ㄴ\ㄹ} :break \ㅎ] [:break 0]]
   ; begining of word devoicing
   [[\space :break voiceless]
    (fn [[s b c]] [s b (voiceless c)])]
   ; consecutive consonant tensing
   [[\ㄹ :break \ㅂ] [\ㄹ :break \ㅂ]] ; don't apply exception
   [[tensing-prefix :break plain-to-tense]
    (fn [[c1 b c2]] [c1 b (get plain-to-tense c2 c2)])]
   ; aspirated consonants
   [[voiceless :break \ㅎ] (fn [[c b]] [b (voiceless c)])]
   [[\ㅎ :break voiceless] (fn [[_ b c]] [b (voiceless c)])]
   [[t-badchims :break \ㅎ] [:break \ㅌ]]
   [[\ㅎ :break \ㅅ] [:break \ㅆ]]
   ; nasal sound shifts
   [[ssang-bad-first \ㄱ :break #{\ㅁ\ㄴ}] [\ㅇ :break 3]]
   [[ssang-bad-first \ㄱ :break \ㄹ] [\ㅇ :break \ㄴ]]
   [[#{\ㄱ\ㄲ\ㅋ} :break #{\ㅁ\ㄴ}] [\ㅇ :break 2]]
   [[#{\ㄱ\ㄲ\ㅋ} :break \ㄹ] [\ㅇ :break \ㄴ]]
   [[\ㅂ :break \ㄹ] [\ㅁ :break \ㄴ]]
   [[\ㅂ :break #{\ㅁ\ㄴ}] [\ㅁ :break 2]]
   [[\ㄴ :break \ㄹ] [\ㄹ :break \ㄹ]]
   [[#{\ㅁ\ㅇ} :break \ㄹ] [0 :break \ㄴ]]
   [[t-badchims :break #{\ㅁ\ㄴ}] [\ㄴ :break 2]]
   ])

(defn form-result [[_ result-pattern] input]
  (if (vector? result-pattern)
    (mapv (fn [token]
            (if (integer? token)
              (nth input token)
              token))
          result-pattern)
    (result-pattern input)))

;; sequence manipulation helper functions

(defn dbg [x] (println x) x)

(defn join-seqs [delim]
  (comp
    (interpose [delim])
    (mapcat identity)))

(defn split-seq [delim text]
  (->> text
       (partition-by #(= delim %))
       (filter #(not= delim (first %)))))


(defn break-double-badchim []
  (mapcat #(get double-badchims % [%])))

;; apply rules to text

(defn match-token? [pattern token]
  (if (or (char? pattern) (keyword? pattern))
    (= pattern token)
    (pattern token)) )

(defn match-rule? [text text-len [pattern _]]
  (and (<= (count pattern) text-len)
       (every? identity (map match-token? pattern text))))

(defn match-rules [input input-len]
  (->> sound-shift-rules
       (filter #(match-rule? input input-len %))
       first))

(defn tokenize [text]
  (loop [results (transient [])
         text-remain text
         text-len (count text)]
    (if-let [matching-rule (match-rules text-remain text-len)]
      (recur (reduce conj! results (form-result matching-rule text-remain))
             (drop (count (first matching-rule)) text-remain)
             (- text-len (count (first matching-rule))))
      (if (zero? text-len)
        (split-seq :break (persistent! results))
        (recur (conj! results (first text-remain))
               (drop 1 text-remain)
               (- text-len 1))))))

(defn convert [written-hangul]
  (let [code-points (han/deconstruct-str
                      (str " " written-hangul " "))
        jamo (into [] (comp
                        (join-seqs :break)
                        (break-double-badchim))
                   code-points)
        converted-jamo (tokenize jamo)]
    (->> converted-jamo
         han/construct-str
         str/trim)))
