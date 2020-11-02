SCRIPTS_DIR=/Users/<anon-author>/repos/wem/wem-server

PROJECT_NAME=$1

#STATIC=${SCRIPTS_DIR}/dependencyGraphs/${PROJECT_NAME}/static.csv
#DYNAMIC=${SCRIPTS_DIR}/dependencyGraphs/${PROJECT_NAME}/dynamic.csv
#CLASSTERMS=${SCRIPTS_DIR}/dependencyGraphs/${PROJECT_NAME}/classterms.csv
#CLASSNAMES=${SCRIPTS_DIR}/dependencyGraphs/${PROJECT_NAME}/classnames.csv
#CONTRIBUTOR=${SCRIPTS_DIR}/dependencyGraphs/${PROJECT_NAME}/contributor.csv
#COMMIT=${SCRIPTS_DIR}/dependencyGraphs/${PROJECT_NAME}/commit.csv

STATIC=${SCRIPTS_DIR}/dependencyGraphs/static/${PROJECT_NAME}StaticGraph.csv
DYNAMIC=${SCRIPTS_DIR}/dependencyGraphs/dynamic/fosci/${PROJECT_NAME}DynamicFosciGraph.csv
CLASSTERMS=${SCRIPTS_DIR}/dependencyGraphs/semantic/classTerms/${PROJECT_NAME}ClassTermsGraph.csv
CLASSNAMES=${SCRIPTS_DIR}/dependencyGraphs/semantic/className/${PROJECT_NAME}ClassNameGraph.csv
CONTRIBUTOR=${SCRIPTS_DIR}/dependencyGraphs/evolutionary/contributors/${PROJECT_NAME}ContributorGraph.csv
COMMIT=${SCRIPTS_DIR}/dependencyGraphs/evolutionary/commits/${PROJECT_NAME}CommitGraph.csv

IS_DIRECTED=1
MIN_EDGE_WEIGHT=1
mkdir -p ${SCRIPTS_DIR}/weightGraphScripts/weightedGraphs
mkdir -p ${SCRIPTS_DIR}/weightGraphScripts/weightedGraphs/${PROJECT_NAME}


STATIC_WEIGHT=$2
DYNAMIC_WEIGHT=$3
CLASSNAMES_WEIGHT=$4
CLASSTERMS_WEIGHT=$5
COMMIT_WEIGHT=$6
CONTRIBUTOR_WEIGHT=$7
BUNCH_OUTPUT=${SCRIPTS_DIR}/weightGraphScripts/bunch/${PROJECT_NAME}
DEPENDENCY=$2-static-$3-dynamic-$4-classnames-$5-classterms-$6-commit-$7-contributor
MDG=$2-static-$3-dynamic-$4-classnames-$5-classterms-$6-commit-$7-contributor.mdg
GRAPH_OUTPUT=weightedGraphs/${PROJECT_NAME}/${DEPENDENCY}

mkdir -p ${SCRIPTS_DIR}/weightGraphScripts/bunch
mkdir -p ${SCRIPTS_DIR}/weightGraphScripts/bunch/${PROJECT_NAME}

python3 ${SCRIPTS_DIR}/weightGraphScripts/generateWeightedGraph.py ${SCRIPTS_DIR}/weightGraphScripts/${GRAPH_OUTPUT}.csv ${STATIC} ${DYNAMIC} ${CLASSNAMES} ${CLASSTERMS} ${COMMIT} ${CONTRIBUTOR} ${STATIC_WEIGHT} ${DYNAMIC_WEIGHT} ${CLASSNAMES_WEIGHT} ${CLASSTERMS_WEIGHT} ${COMMIT_WEIGHT} ${CONTRIBUTOR_WEIGHT} 

python3 ${SCRIPTS_DIR}/fileFormatConversionScripts/extractMDGfromCSV.py ${SCRIPTS_DIR}/weightGraphScripts/${GRAPH_OUTPUT}.csv #outputs .mdg file...

cd ${SCRIPTS_DIR}/weightGraphScripts

javac RunBunch.java
java -cp "Bunch.jar:." RunBunch ${SCRIPTS_DIR}/weightGraphScripts/weightedGraphs/PartsUnlimitedMRP/${MDG} ${BUNCH_OUTPUT}/

python3 ${SCRIPTS_DIR}/fileFormatConversionScripts/extractCRSFfromBunch.py ${BUNCH_OUTPUT}/${DEPENDENCY}.mdg.bunch

echo ${DEPENDENCY}.mdg.rsf
