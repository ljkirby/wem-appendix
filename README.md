## Weighing the Evidence: On Relationship Types in Microservice Extraction
[![DOI](https://zenodo.org/badge/308556769.svg)](https://zenodo.org/badge/latestdoi/308556769)

## Index
1. [About](#about)
2. [Interview Protocol](#interview-protocol)
3. [Implementation](#implementation)
4. [Case Study Application](#case-study-application)

## Graphical User Interface
[https://wem-web.herokuapp.com/](https://wem-web.herokuapp.com/)

## About

The microservice-based architecture -- a SOA-inspired principle of dividing systems into components that communicate with each other using language-agnostic APIs -- has gained increased popularity in industry. Yet, migrating a monolithic application to microservices is a challenging task. 
A number of automated microservice extraction techniques have been proposed to help developers with the migration complexity. These techniques, at large, construct a graph-based representation of an application and cluster its elements into service candidates. The techniques vary by their decomposition goals and, subsequently,
types of relationships between application elements that they consider -- structural, semantic term similarity, and evolutionary -- with each technique utilizing a fixed subset and weighting of these relationship types.

In this paper, we perform a multi-method exploratory study with industrial practitioners to
investigate (1) the applicability and usefulness of different relationships types during the 
microservice extraction process and (2) expectations practitioners have for tools utilizing such relationships. 
Our results show that practitioners often need a ``what-if'' analysis tool that simultaneously considers 
multiple relationship types during the extraction process and 
that there is no fixed way to weight these relationships. 
Our study also identifies organization- and application-specific considerations that lead practitioners to prefer 
certain relationship types over others, e.g., the age of the codebase and languages spoken in the organization. 
It outlines possible strategies to help developers during the extraction process, 
e.g., the ability to iteratively filter and customize relationships.    

This repository houses the data and results we collected whilst running our experiments. It also includes the code we used for extracting microservice candidates, alongside instructions for configuring, running, and modifying the code.

A frontend for this code is deployed to [https://wem-web.herokuapp.com/](https://wem-web.herokuapp.com/). You can use the frontend to view PartsUnlimitedMRP (with the exclusion of the Catalog classes) and try out different relationship type prioritizations through this UI!  

## Interview Protocol
Please refer to [this path](interviewData/) for more information on our interview protocol.


## Framework Implementation

Source code for the implementation of the framework we used for the paper can be found [here](framework-backend/).
For demonstration purposes, we've implemented a graphical user interface that you can use to view PartsUnlimitedMRP. Code for the frontend can be found [here](framework-frontend/)

**Using our approach:** 
1. Extract a class graph that represents your monolithic application, and weight the edges based on the relationship type of your choosing (e.g. # static inter-class method calls, # dynamic inter-class method calls, evolutionary similarity, etc). Class graph must be written in Module Dependency Graph format and must be stored as a .CSV file.
2. Feed the files generated in steps 1 to the clustering algorithm of your choosing. Additional configuration of the clustering algorithm may be required. This repository contains an implementation of the Bunch clustering algorithm that you may use to produce microservice candidates. Detailed instructions for running this algorithm are included [here](framework-backend).

## Case Study Application

#### PartsUnlimitedMRP

- [Monolithic Version](https://github.com/microsoft/PartsUnlimitedMRP) 
- [Microservice-based Version](https://github.com/microsoft/PartsUnlimitedMRPmicro)
