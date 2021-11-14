(ns hangul-sound-shift.core-test
    (:require [hangul-sound-shift.core :refer [convert]]
              [clojure.test :refer :all]))

(deftest asdf
    (is (= (convert "같이") "가치")))
