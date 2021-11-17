(ns hangul-sound-shift.webpage
  (:require [hangul-sound-shift.core :refer [convert]]))

(defn input-box [] (.getElementById js/document "input"))
(defn update-page []
  (set! (.-textContent (.getElementById js/document "output"))
        (convert (.-value (input-box)))))

(def timer nil)
(defn refresh []
  (when timer (js/clearTimeout timer))
  (let [input-length (.. (input-box) -value -length)
        update-time (min (* input-length 10) 1000)]
    (set! timer (js/setTimeout update-page update-time))))

(defn setup []
  (.addEventListener (input-box) "input" refresh))

(.addEventListener js/window "load" setup)
