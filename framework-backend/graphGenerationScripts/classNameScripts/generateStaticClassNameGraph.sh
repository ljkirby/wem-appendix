# Generates a class graph w/ edges weighted by intersection over union of classname terms

set -x

PROJECT_NAME=example
CLASSNAMES=../../dependencyGraphs/semantic/className/${PROJECT_NAME}ClassNames.csv

CLASS_DEPS=../../dependencyGraphs/static/${PROJECT_NAME}StaticGraph.csv
CLASSNAME_GRAPH=../../dependencyGraphs/semantic/className/${PROJECT_NAME}ClassNameGraph.csv

# Generate classfilename file and featureVector file
python3 extractClassNamesFromGraph.py ${CLASS_DEPS} ${CLASSNAMES}

# Generate a file that holds all the concern dependencies, based on the extracted execution traces
python3 generateClassNameGraph.py ${CLASSNAMES} ${CLASSNAME_GRAPH}
