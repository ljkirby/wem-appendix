import sys
import csv

def extractClassNamesFromGraph(graphFileName, resultFile):
    classnames = set() 
    with open(graphFileName, 'r') as csvFile: 
        lines = csv.reader(csvFile, delimiter = ',')
        next(lines)
        for line in lines:
            print(line)
            [ callerClass, calleeClass, weight, fromentity, toentity] = line
            classnames.add(callerClass)
            classnames.add(calleeClass)
        print(classnames)

    with open(resultFile, 'w') as resultCSV:
        resultCSV = csv.writer(resultCSV)
        for name in classnames: 
            resultCSV.writerow([name])

if __name__ == "__main__":
    graphFilename = sys.argv[1]
    resultFile = sys.argv[2]
    extractClassNamesFromGraph(graphFilename, resultFile)
