import sys
import csv

def classShouldBeFiltered(className):
    filterList = [
            'Mock',
            'PingController', 
            'OrderingInitializer', 
            'OrderingConfiguration', 
            'PropertyHelper', 
            'OrderingServiceProperties', 
            'MongoDBProperties', 
            'TestPath', 
            'AppInsightsFilter', 
            'ConflictingRequestException', 
            'Catalog', 
            'Postgres', 
            'CORS'
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

def getMaxEdgeWeight(depList):
    maxEdgeWeight = 0
    for row in depList[1:]:
        class1 = row[0]
        class2 = row[1]
        skip = False
        if classShouldBeFiltered(class1) or classShouldBeFiltered(class2):
            skip = True
        dep = float(row[2])
        if dep > maxEdgeWeight and skip == False: 
            maxEdgeWeight = dep
    return maxEdgeWeight

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

def getDict(edgeWeightList, relationshipTypeWeight, decreaseWeight, weightDecrease):
    classDepDict = dict()
    maxEdgeWeight = getMaxEdgeWeight(edgeWeightList)

    for row in edgeWeightList[1:]:
        [class1, class2, edgeWeight] = row[0:3]
        if classShouldBeFiltered(class1) or classShouldBeFiltered(class2):
            continue

        #UNCOMMENT TO NORMALIZE DATA
        edgeWeight = float(edgeWeight)/maxEdgeWeight * relationshipTypeWeight * 100
        edgeWeight = round(edgeWeight)
        #edgeWeight = round(float(edgeWeight) * 100)

        if decreaseWeight == True: 
            edgeWeight = edgeWeight - round(edgeWeight * weightDecrease)

        if class1 not in classDepDict: 
            classDepDict[class1] = dict()
        if class1 != class2: 
            classDepDict[class1][class2] = edgeWeight

    return classDepDict

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

    graphDicts = getWeightedGraphDict(graphFiles, weights)
    writeCSV(graphDicts, outputFileName)
