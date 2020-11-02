SCRIPTS_DIR=/Users/<anon-author>/repos/wem/wem-server
OUTPUT_DIR=/Users/<anon-author>/repos/graphResults/

PROJECT_NAME=PartsUnlimitedMRP

STATIC=${SCRIPTS_DIR}/dependencyGraphs/static/${PROJECT_NAME}StaticGraph.csv
DYNAMIC=${SCRIPTS_DIR}/dependencyGraphs/dynamic/fosci/${PROJECT_NAME}DynamicFosciGraph.csv
CLASSTERMS=${SCRIPTS_DIR}/dependencyGraphs/semantic/classTerms/${PROJECT_NAME}ClassTermsGraph.csv
CLASSNAMES=${SCRIPTS_DIR}/dependencyGraphs/semantic/className/${PROJECT_NAME}ClassNameGraph.csv
CONTRIBUTOR=${SCRIPTS_DIR}/dependencyGraphs/evolutionary/contributors/${PROJECT_NAME}ContributorGraph.csv
COMMIT=${SCRIPTS_DIR}/dependencyGraphs/evolutionary/commits/${PROJECT_NAME}CommitGraph.csv

mkdir -p ${SCRIPTS_DIR}/weightGraphScripts/weightedGraphs
mkdir -p ${SCRIPTS_DIR}/weightGraphScripts/weightedGraphs/${PROJECT_NAME}

BUNCH_OUTPUT=${SCRIPTS_DIR}/weightGraphScripts/bunch/${PROJECT_NAME}
DEPENDENCY=$2-static-$3-dynamic-$4-classnames-$5-classterms-$6-commit-$7-contributor
MDG=$2-static-$3-dynamic-$4-classnames-$5-classterms-$6-commit-$7-contributor.mdg
GRAPH_OUTPUT=${OUTPUT_DIR}/${PROJECT_NAME}/

mkdir -p ${OUTPUT_DIR}/
mkdir -p ${SCRIPTS_DIR}/weightGraphScripts/allWeightedGraphs/${PROJECT_NAME}

mkdir -p ${SCRIPTS_DIR}/weightGraphScripts/bunch
mkdir -p ${SCRIPTS_DIR}/weightGraphScripts/bunch/${PROJECT_NAME}

python3 ${SCRIPTS_DIR}/weightGraphScripts/generateAllWeightedGraphs.py ${SCRIPTS_DIR}/weightGraphScripts/${GRAPH_OUTPUT} ${STATIC} ${DYNAMIC} ${CLASSNAMES} ${CLASSTERMS} ${COMMIT} ${CONTRIBUTOR}

#python3 ${SCRIPTS_DIR}/fileFormatConversionScripts/extractMDGfromCSV.py ${SCRIPTS_DIR}/weightGraphScripts/${GRAPH_OUTPUT}.csv #outputs .mdg file...
#
#cd ${SCRIPTS_DIR}/weightGraphScripts
#
#javac RunBunch.java
#java -cp "Bunch.jar:." RunBunch ${SCRIPTS_DIR}/weightGraphScripts/weightedGraphs/PartsUnlimitedMRP/${MDG} ${BUNCH_OUTPUT}/
#
#python3 ${SCRIPTS_DIR}/fileFormatConversionScripts/extractCRSFfromBunch.py ${BUNCH_OUTPUT}/${DEPENDENCY}.mdg.bunch
#
#echo ${DEPENDENCY}.mdg.rsf
