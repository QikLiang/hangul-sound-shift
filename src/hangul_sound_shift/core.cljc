(ns hangul-sound-shift.core
  (:gen-class)
  (:require [hangul-utils.core :as han]))

(def sound-shift-rules
  [
   [[\ㅌ :break \ㅇ \ㅣ] [:break \ㅊ \ㅣ]]
   ])

;; sequence manipulation helper functions

(defn start-with [string start]
  (and (<= (count start) (count string))
       (every? identity (map = start string))))

(defn join-seqs [delim seqs]
  (apply concat (interpose [delim] seqs)))

(defn split-seq [delim string]
  (filter #(not= delim (first %)) (partition-by #{delim} string)))

;; apply rules to text

(defn match-rule? [text rule]
  (start-with text (rule 0)))

(defn apply-rules [input]
  (if (empty? input) :end
    (if-let [matching-rule (->> sound-shift-rules
                                (filter #(match-rule? input %))
                                first)]
      [(second matching-rule)
       (drop (count (first matching-rule)) input)]
      [[(first input)] (drop 1 input)])))

(defn tokenize [text]
  (->> [[] text]
       (iterate (comp apply-rules second))
       (take-while #(not= :end %))
       (mapcat first)))

(defn convert [written-hangul]
  (->> written-hangul
       han/deconstruct-str
       (join-seqs :break)
       tokenize
       (split-seq :break)
       han/construct-str))

(print (convert "같이"))
