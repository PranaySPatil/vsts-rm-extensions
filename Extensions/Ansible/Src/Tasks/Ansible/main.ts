/// <reference path="../../../../../definitions/node.d.ts" /> 
/// <reference path="../../../../../definitions/vsts-task-lib.d.ts" /> 

import path = require("path");
import tl = require("vsts-task-lib/task");
import {ansibleInterface}  from './ansibleInterface';
import {ansibleCommandLineInterface} from './ansibleCommandLineInterface';
import {ansibleTowerInterface} from './ansibleTowerInterface';
import {ansibleTaskParameters} from './ansibleTaskParameters';

try {
tl.setResourcePath(path.join(__dirname, "task.json"));
} catch (error) {
    tl.setResult(tl.TaskResult.Failed, error);
}

export class ansibleCommandLineInterfaceFactory {
    public static getCommandLineInterface(params: ansibleTaskParameters): ansibleCommandLineInterface {
        if (params.ansibleInterface == "remoteMachine") {
            return new ansibleRemoteMachineInterface(params);
        }
        if (params.ansibleInterface == 'agentMachine') {
            return new ansibleAgentMachineInterface(params);
        }
    }
}
export class ansibleInterfaceFactory {
    public static GetAnsibleInterface(params: ansibleTaskParameters): ansibleInterface {
        if (params.ansibleInterface != 'ansibleTower') {
            return ansibleCommandLineInterfaceFactory.getCommandLineInterface(params);
        } else {
            return new ansibleTowerInterface();
        }
    }
}

function run() {
    try {
        var params:ansibleTaskParameters = ansibleTaskParameters.getInstance();
        var ansibleInterface: ansibleInterface = ansibleInterfaceFactory.GetAnsibleInterface(params);
        if (ansibleInterface) {
            ansibleInterface.execute();
        } else {
            tl.setResult(tl.TaskResult.Failed, "");
        }
    } catch (error) {
        tl.setResult(tl.TaskResult.Failed, error);
    }
}


run();