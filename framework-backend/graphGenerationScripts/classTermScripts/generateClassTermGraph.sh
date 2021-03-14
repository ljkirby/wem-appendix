OUTPUT_DIR=../../dependencyGraphs/semantic/classTerms
PROJECT_NAME=roller
PROJECT_PACKAGE=org.apache.roller

CLASS_WORDS=${PROJECT_NAME}Words.txt
CLASS_TFIDF=${PROJECT_NAME}Tf-idf.csv
CLASS_TFIDF_COSINE_GRAPH=${PROJECT_NAME}ClassTermsGraph.csv

# Generate PROJECT_NAME_words.txt -> a file that contains all words within each class of the project
uperl identifierParser.pl ${PROJECT_NAME}.udb ${PROJECT_PACKAGE} ${CLASS_WORDS}

# Generate tf-idf values for each class
# IMPORTANT: update the stopwords in semanticParser.py before running this command
python3 semanticParser.py  ${CLASS_WORDS} ${CLASS_TFIDF}

# Generate a class graph wherein the edge weight between class A and B = cosin of tf-idf(A) and tf-idf(B)
python3 semanticCosin.py  ${CLASS_TFIDF}  ${OUTPUT_DIR}/${CLASS_TFIDF_COSINE_GRAPH}
