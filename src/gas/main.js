var startPageName = "index";

function doGet(request) {
  return HtmlService.createTemplateFromFile("html_" + startPageName)
      .evaluate()
      .setSandboxMode(HtmlService.SandboxMode.IFRAME)
      .setTitle("JIMシステム_forJIMs");
}

function include(filename) {
    return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

function loadfun(funName,_arguments){
    var fun = ThisApp;
    funName.split(".").forEach(function(key){
        fun = fun[key] || {}
    });
    if(_arguments === undefined){
        return JSON.stringify(fun.apply(undefined));
    }else{
        if(!Array.isArray(_arguments))  _arguments = [_arguments];
        return JSON.stringify(fun.apply(undefined,_arguments));
    }
}

function getPage(pageName){
    var htmlName = "html_" + pageName;
    return  HtmlService.createTemplateFromFile(htmlName)
        .evaluate()
        .setSandboxMode(HtmlService.SandboxMode.IFRAME)
        .getContent();
}

function updateFileToDrive(fileIdStr, content){
    DriveApp.getFileById(fileIdStr).setContent(content);
}

function loadFileFromDrive(fileIdStr,charEnc){
    if(charEnc == null)  charEnc = "UTF-8";
    return DriveApp.getFileById(fileIdStr).getBlob().getDataAsString(charEnc);
}

function loadDataFromDrive(fileIdStr, mode) {
    var result;
    if (mode == null) mode = "all";
    var raw = loadFileFromDrive(fileIdStr);
    var rawData = JSON.parse(raw);

    switch (mode) {
        case "all":
            result = rawData;
            break;
        case "raw":
            result = raw;
            break;
        case "data":
            result = rawData.data;
            break;
        case "version":
            result = rawData.version;
            break;
        case "updated":
            result = rawData.updated;
            break;
    }
    return result;
}

//TODO rewrite
function updateDatabase(fileIdStr,queues,updatedTime,prevDataInfo){
    var database = loadDataFromDrive(fileIdStr);

    queues.forEach(function(queue){
        var dpIndex;
        switch(queue.kind){
            case "add":
                database.data.push(queue.value);
                break;
            case "change":
                database.data.forEach(function(datapiece,i){
                    if(dpIndex !== undefined)  return;
                    if(datapiece._id === queue.value._id){
                        dpIndex = i;
                    }
                });
                fun = function(dp_queue,dp_data){
                    if(Array.isArray(dp_queue)){
                        if(dp_queue.length === 0){
                            return dp_queue;
                        }else{
                            dp_data = dp_queue.map(function(v,i){
                                if(v === undefined)  return;
                                if(dp_data === undefined)  dp_data = [];
                                return fun(dp_queue[i],dp_data[i]);
                            });
                        }
                        return dp_data;
                    }else if(typeof dp_queue === "object"){
                        Object.keys(dp_queue).forEach(function(key){
                            if(dp_queue[key] === undefined) return;
                            if(dp_data === undefined)  dp_data = {};
                            dp_data[key] = fun(dp_queue[key],dp_data[key]);
                        })
                        return dp_data;
                    }else{
                        if(dp_queue === undefined){
                            return dp_data;
                        }else{
                            return dp_queue;
                        }
                    }
                }
                database.data[dpIndex] = fun(queue.value,database.data[dpIndex]);
                break;
            case "remove":
                database.data.forEach(function(datapiece,i){
                    if(dpIndex !== undefined)  return;
                    if(datapiece._id === queue.value._id){
                        dpIndex = i;
                    }
                });
                database.data.splice(dpIndex,1);
                break;
        }
    });
    database.updated = new Date(updatedTime);
    database.version = (+database.version) + 1;

    updateFileToDrive(fileIdStr,JSON.stringify(database,null,4));
}

function handlePropertiesService(value,type,doKind){
    //value
    //set : {[names]:[values]}, get : [[names]], delete : [[names]]
    var properties;
    var result;
    switch(type){
        case "user":
            properties = PropertiesService.getUserProperties();
            break;
        case "script":
            properties = PropertiesService.getScriptProperties();
            break;
    }
    switch(doKind){
        case "set":
            properties.setProperties(value);
            result = true;
            break;
        case "get":
            if(value.length === 0){
                result = properties.getProperties();
            }else{
                result = {};
                value.forEach(function(v){
                    result[v] = (properties.getProperty(v) === undefined ? null : properties.getProperty(v));
                });
            }
            break;
        case "delete":
            if(value.length === 0){
                properties.deleteAllProperties();
            }else{
                value.forEach(function(v){
                    properties.deleteProperty(v);
                });
            }
            result = true;
            break;
    }
    return result;
}