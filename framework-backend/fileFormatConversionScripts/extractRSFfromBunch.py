
"""

Converts a bunch file to rigi standard format (.RSF). 
The .bunch file is generated using B. Mitchell's Bunch Clustering technique (github.com/ArchitectingSoftware/Bunch).
The output .RSF file can then be used as an input to the MoJo executable (http://www.cse.yorku.ca/~bil/downloads/), which functions as a metric for the % similarity of two different software architectures.

"""

import sys

def bunchToRSF(filename): 
    entityRelations = list()
    with open(filename, 'r') as bunchFile:
        lines = bunchFile.readlines()
        for line in lines:
            clusterNameSeparatedFromEntities = line.split(' = ')
            [ clusterName, entities ] = clusterNameSeparatedFromEntities

            clusterName = clusterName.replace('SS(', '')
            clusterName = clusterName.replace(')', '')

            entities = entities.split(', ')
            for entity in entities:
                entity = entity.replace('\n','')
                entity = entity.split('.')[-1]
                entityRelations.append('contain ' + clusterName + ' ' + entity)

    rsfFilename = filename.replace('.bunch', '') + '.rsf'
    # write the cluster relationships into the rsf file
    with open(rsfFilename, 'w') as rsfFile:
        rsfFile.write(("\n").join(entityRelations))

if __name__ == "__main__":
    filename = sys.argv[1]
    bunchToRSF(filename)
    
    



    
