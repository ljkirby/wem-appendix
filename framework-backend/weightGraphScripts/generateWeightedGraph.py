import sys
import csv
import numpy as np

def classShouldBeFiltered(className):
    filterList = [
        'Mock',
        'PingController', 
        #'OrderingInitializer', 
        #'OrderingConfiguration', 
        'PropertyHelper', 
        #'OrderingServiceProperties', 
        #'MongoDBProperties', 
        'TestPath', 
        'AppInsightsFilter', 
        #'ConflictingRequestException', 
        #'Catalog', 
        'Postgres', 
        #'CORS',
        #'Dealer'
    ]
    for filterTerm in filterList: 
        if className in filterTerm or filterTerm in className: 
            return True 
    return False

def getWeightedGraphDict(graphFileDict, graphWeightDict): 
    graphDict = {}
    for relationshipType in graphFileDict.keys(): 
        fileName = graphFileDict[relationshipType]
        graphCSV = readCSV(fileName)
        if relationshipType == 'commits' or relationshipType == 'contributors': 
            graphEdgeDict = getDict(graphCSV, float(graphWeightDict[relationshipType]), True, 0.5)
        elif relationshipType == 'classnames': 
            graphEdgeDict = getDict(graphCSV, float(graphWeightDict[relationshipType]), True, 0.2)
        else: 
            graphEdgeDict = getDict(graphCSV, float(graphWeightDict[relationshipType]), False, 0)

        graphDict[relationshipType] = graphEdgeDict

    edgesDict = {}
    for relationshipType in graphDict.keys(): 
        for caller in graphDict[relationshipType].keys(): 
            for callee in graphDict[relationshipType][caller].keys():
                if caller not in edgesDict: 
                    edgesDict[caller] = {}
                edgeWeight = graphDict[relationshipType][caller][callee] 
                if callee not in edgesDict[caller] and edgeWeight > 0: 
                    edgesDict[caller][callee] = edgeWeight
                elif edgeWeight > 0:
                    edgesDict[caller][callee] += edgeWeight
    return edgesDict

def getNormalizedWeightedGraph(graphFileDict, graphWeightDict): 
    graphDict = {}
    '''
    1. filter out classes
    2. Cap the edge weights to interquartile range
    3. normalize the edge weights (divide by third quartile)
    4. *NEW*: Find relationship type w/ largest IQR, and shift all sets to share the median of the set w/ the largest IQR
    4. multiple edges by priority
    5. Add edges together
    '''
    for relationshipType in graphFileDict.keys(): 
        fileName = graphFileDict[relationshipType]
        graphCSV = readCSV(fileName)

        filteredGraphCSV = filterOutClasses(graphCSV)
        #cappedAndNormalizedCSV = capOutliers(filteredGraphCSV)
        cappedAndNormalizedCSV = capAndTrimToIQR(filteredGraphCSV)

        graphEdgeDict = getDict(cappedAndNormalizedCSV, float(graphWeightDict[relationshipType]))
        graphDict[relationshipType] = graphEdgeDict

    # add weighted edges of different graphs together
    edgesDict = {}
    for relationshipType in graphDict.keys(): 
        for caller in graphDict[relationshipType].keys(): 
            for callee in graphDict[relationshipType][caller].keys():
                if caller not in edgesDict: 
                    edgesDict[caller] = {}
                edgeWeight = graphDict[relationshipType][caller][callee] 
                if callee not in edgesDict[caller] and edgeWeight > 0: 
                    edgesDict[caller][callee] = edgeWeight
                elif edgeWeight > 0:
                    edgesDict[caller][callee] += edgeWeight
    return edgesDict

def filterOutClasses(depList):
    retList = []
    for index, row in enumerate(depList):
        class1 = row[0]
        class2 = row[1]
        dep = float(row[2])
        if classShouldBeFiltered(class1) or classShouldBeFiltered(class2):
            continue
        elif dep == 0.0: 
            continue
        else: 
            retList.append([class1, class2, dep])
    return retList

def getMaxEdgeWeight(depList):
    maxEdgeWeight = 0
    for row in depList:
        class1 = row[0]
        class2 = row[1]
        skip = False
        if classShouldBeFiltered(class1) or classShouldBeFiltered(class2):
            skip = True
        dep = float(row[2])
        if dep > maxEdgeWeight and skip == False: 
            maxEdgeWeight = dep
    return maxEdgeWeight

def getCol(arr, col):
    npArr = np.array(arr)
    npArr = npArr[:,col]
    retVal = []

    for i in range(len(npArr)):
        try: 
            numVal = float(npArr[i])
            retVal.append(numVal)
        except ValueError: 
            print(i)
            print(npArr[i])
    return retVal

def capOutliers(depList):
    depColIndex = 2
    depCol = getCol(depList, depColIndex)

    [firstQ, thirdQ] = np.quantile(depCol, [0.25, 0.75])

    iqr = thirdQ - firstQ
    lowerBound = firstQ - iqr*1.5
    upperBound = thirdQ + iqr*1.5

    for index, row in enumerate(depList):
        dep = float(row[2])
        if(dep > upperBound): 
            dep = upperBound
        elif(dep < lowerBound and lowerBound != 1): 
            dep = lowerBound
        normalizedDep = dep/upperBound
        depList[index][2] = normalizedDep

    return depList

def capAndTrimToIQR(depList):
    depColIndex = 2
    depCol = getCol(depList, depColIndex)

    [firstQ, thirdQ] = np.quantile(depCol, [0.25, 0.75])

    iqr = thirdQ - firstQ
    lowerBound = firstQ
    upperBound = thirdQ

    for index, row in enumerate(depList):
        dep = float(row[2])
        if(dep > upperBound): 
            dep = upperBound
        elif(dep < lowerBound and lowerBound != 1): 
            dep = lowerBound

        normalizedDep = dep/upperBound
        depList[index][2] = normalizedDep

    return depList


def readCSV(filename):
    listList = list()
    with open(filename, "r") as fp:
        reader = csv.reader(fp)
        for each in reader:
            listList.append(each)
    return listList

def writeCSV(edgesDict, filename):
    with open(filename, 'w') as fp:
        writer = csv.writer(fp)
        for caller in edgesDict.keys(): 
            for callee in edgesDict[caller].keys():
                writer.writerow([caller,callee,edgesDict[caller][callee]])

def getDict(edgeWeightList, relationshipTypeWeight):
    classDepDict = dict()
    for row in edgeWeightList[1:]:
        [class1, class2, edgeWeight] = row[0:3]
        edgeWeight = float(edgeWeight) * relationshipTypeWeight
        edgeWeight = round(edgeWeight)

        if class1 not in classDepDict: 
            classDepDict[class1] = dict()
        if class1 != class2: 
            classDepDict[class1][class2] = edgeWeight
    return classDepDict

#def getDict(edgeWeightList, relationshipTypeWeight, decreaseWeight, weightDecrease):
#    classDepDict = dict()
#    maxEdgeWeight = getMaxEdgeWeight(edgeWeightList)
#
#    for row in edgeWeightList[1:]:
#        [class1, class2, edgeWeight] = row[0:3]
#        if classShouldBeFiltered(class1) or classShouldBeFiltered(class2):
#            continue
#
#        #UNCOMMENT TO NORMALIZE DATA
#        edgeWeight = float(edgeWeight)/maxEdgeWeight * relationshipTypeWeight * 100
#        edgeWeight = round(edgeWeight)
#        #edgeWeight = round(float(edgeWeight) * 100)
#
#        if decreaseWeight == True: 
#            edgeWeight = edgeWeight - round(edgeWeight * weightDecrease)
#
#        if class1 not in classDepDict: 
#            classDepDict[class1] = dict()
#        if class1 != class2: 
#            classDepDict[class1][class2] = edgeWeight
#
#    return classDepDict

if __name__ == "__main__":
    outputFileName = sys.argv[1]
    static = sys.argv[2]
    dynamic = sys.argv[3]
    classNames = sys.argv[4]
    classTerms = sys.argv[5]
    commits = sys.argv[6]
    contributors = sys.argv[7]
    staticWeight = sys.argv[8]
    dynamicWeight = sys.argv[9]
    classNamesWeight = sys.argv[10]
    classTermsWeight = sys.argv[11]
    commitsWeight = sys.argv[12]
    contributorsWeight = sys.argv[13]
    
    weights = {
        "static": staticWeight, 
        "dynamic": dynamicWeight, 
        "classNames": classNamesWeight, 
        "classTerms": classTermsWeight, 
        "commits": commitsWeight, 
        "contributors": contributorsWeight
    }

    graphFiles = {
        "static": static, 
        "dynamic": dynamic, 
        "classNames": classNames, 
        "classTerms": classTerms, 
        "commits": commits, 
        "contributors": contributors
    }

    #graphDicts = getWeightedGraphDict(graphFiles, weights)
    graphDicts = getNormalizedWeightedGraph(graphFiles, weights)
    writeCSV(graphDicts, outputFileName)

#filterList = [
#    'Mock',
#    'PingController', 
#    'OrderingInitializer', 
#    'OrderingConfiguration', 
#    'PropertyHelper', 
#    'OrderingServiceProperties', 
#    'MongoDBProperties', 
#    'TestPath', 
#    'AppInsightsFilter', 
#    'ConflictingRequestException', 
#    'Catalog', 
#    'Postgres', 
#    'CORS'
#]
