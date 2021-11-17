#!/usr/bin/env -S clojure -M
(require '[hangul-sound-shift.core :refer [convert]])
(doseq [arg *command-line-args*]
        (println (convert arg)))
(when (.ready *in*)
    (println (convert (slurp *in*))))
