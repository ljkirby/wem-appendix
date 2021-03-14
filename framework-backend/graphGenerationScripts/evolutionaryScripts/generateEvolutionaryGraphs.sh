PROJECT_NAME=roller
PROJECT_DIR=~/repos/benchmarks/${PROJECT_NAME}
PACKAGE=org.apache.roller
JAVA_FILES=app/src/main/java/org/apache/roller
HOME_DIR=~

COMMIT_OUTPUT=${HOME_DIR}/repos/research/impl/dependencyGraphs/evolutionary/commits/${PROJECT_NAME}CommitGraph.csv
CONTRIBUTOR_OUTPUT=${HOME_DIR}/repos/research/impl/dependencyGraphs/evolutionary/contributors/${PROJECT_NAME}ContributorGraph.csv

DATA_GENERATION_SCRIPT=gitcontributions_Mac.py
DATA_FILTER_SCRIPT=clearEmpties.py
DATA_FORMAT_SCRIPT=generateEvolutionaryGraphsFromData.py

cp ${DATA_GENERATION_SCRIPT} ${DATA_FILTER_SCRIPT} ${DATA_FORMAT_SCRIPT} ${PROJECT_DIR}

cd ${PROJECT_DIR}

python3 ${DATA_GENERATION_SCRIPT}
python3 ${DATA_FILTER_SCRIPT}
python3 ${DATA_FORMAT_SCRIPT} ${JAVA_FILES} ${COMMIT_OUTPUT} ${CONTRIBUTOR_OUTPUT} ${PACKAGE}

cd -
