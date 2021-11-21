(ns hangul-sound-shift.core-test
    (:require [hangul-sound-shift.core :refer [convert]]
              [clojure.test :refer :all]))

(deftest soft-consonate-strengthening
    (is (= (convert "두다") "투다"))
    (is (= (convert "곧") "콭"))
    (is (= (convert "받침") "팥침"))
    (is (= (convert "바보") "파보"))
    (is (= (convert "밥") "팦"))
    (is (= (convert "몹시") "뫂씨"))
    (is (= (convert "가다") "카다")))

(deftest t-batchim
    (is (= (convert "옷") "옽"))
    (is (= (convert "있다") "잍따")))

(deftest consonant-i-shift
    (is (= (convert "굳이") "쿠지"))
    (is (= (convert "같이") "카치"))
    (is (= (convert "붙여") "푸쳐"))
    (is (= (convert "갇혀") "카쳐")))

(deftest resyllabification
    (is (= (convert "같이") "카치"))
    (is (= (convert "음악") "으막"))
    (is (= (convert "있어요") "이써요"))
    (is (= (convert "좋아요") "초하요"))
    (is (= (convert "일하다") "이라다"))
    (is (= (convert "월요일") "워료일")))

(deftest double-badchim
    (is (= (convert "앉다") "안따"))
    (is (= (convert "앉아요") "안자요"))
    (is (= (convert "없다") "업따"))
    (is (= (convert "없어요") "업서요"))
    (is (= (convert "삶") "삼"))
    (is (= (convert "삶이") "살미"))
    (is (= (convert "앉아요") "안자요"))
    (is (= (convert "많아") "마나")))

(deftest double-consonant-tensing
    (is (= (convert "몫공간") "목꽁간"))
    (is (= (convert "식당") "식땅"))
    (is (= (convert "국비") "쿡삐"))
    (is (= (convert "목숨") "목쑴")))

(deftest aspirated-consonants
    (is (= (convert "옳게") "올케"))
    (is (= (convert "않다") "안타"))
    (is (= (convert "좋다") "초타"))
    (is (= (convert "쌓자") "싸차"))
    (is (= (convert "학회") "하쾨"))
    (is (= (convert "입학") "이팍"))
    (is (= (convert "못하다") "모타다"))
    (is (= (convert "좋습니다") "초씀니다")))

(deftest nasalization
    (is (= (convert "읽는") "잉는"))
    (is (= (convert "닦는") "탕는"))
    (is (= (convert "부엌문") "푸엉문"))
    (is (= (convert "석뉴") "성뉴"))
    (is (= (convert "백리") "팽니"))
    (is (= (convert "합리") "함니"))
    (is (= (convert "신랑") "실랑"))
    (is (= (convert "받는") "판는"))
    (is (= (convert "있는") "인는"))
    (is (= (convert "끝나다") "끈나다"))
    (is (= (convert "몇명") "면명"))
    (is (= (convert "음료수") "음뇨수"))
    (is (= (convert "등록") "틍녹"))
    (is (= (convert "감사합니다") "캄사함니다"))
    (is (= (convert "집마다") "침마다"))
    (is (= (convert "없는") "엄는"))
    (is (= (convert "입력") "임녁")))
