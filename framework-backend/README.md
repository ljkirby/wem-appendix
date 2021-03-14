# wem-backend

#### Prerequisites: 
Please have the following tools/libraries installed:
- node v12 
- npm (node package manager)
- python3 (+ pip)
- java 8

#### Getting up and running: 
1. Add `weightGraphScripts/Bunch.jar` to your java classpath
2. In `src/controllers/ClusterController.js`, please set the `CURRENT_WORKING_DIRECTORY` variable to your own path to the `/controllers` directory (e.g. `/Users/<username>/repos/wem-appendix/framework-backed/src/controllers`)
3. In `weightGraphScripts/generateWeightedGraphWithArguments.sh`, set the `SCRIPTS_DIR` variable to your path to the `framework-backend` folder (e.g. `/Users/<username>/repos/wem-appendix/framework-backend`)
4. Start the server: 
```
cd src && npm install && npm start
```
App should open in `localhost:8080`

#### Using the API
- Hit the server API (`localhost:8080/<application-name>/<static>/<dynamic>/<classname>/<classterm>/<commit>/<contributor>`) with the name of the application you wish to decompose + the prioritizations of each relationship type 
  - e.g. if I would like to decompose application "PartsUnlimitedMRP" w/ 80% prioritization on static, 20% prioritization on dynamic, then I would hit the following api: 
    - `localhost:8080/PartsUnlimitedMRP/80/20/0/0/0/0`
    - result should be returned in the form of a file in Rigi Standard Format
