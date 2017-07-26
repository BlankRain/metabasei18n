(println "hello world")
;(.isFile x)
;
(defn copyjsx []
(doseq [x (file-seq (java.io.File. "metabase-master/frontend/src/metabase"))
		:when (and (.isFile x) (.endsWith  (.getAbsolutePath x) ".jsx")
		)]
	 (let [xx (.replace (.getAbsolutePath x) "\\src\\metabase\\" "\\src\\metabase-zh\\")
		    _ (println xx)
			]
		(clojure.java.io/copy x (java.io.File. xx))
		)
	)
	)
	
 (println (count (filter #(.isFile %) (file-seq (java.io.File. "metabase-master/frontend/src/metabase-zh")))))