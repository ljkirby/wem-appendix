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
cd src && npm start
```
App should open in `localhost:8080`
