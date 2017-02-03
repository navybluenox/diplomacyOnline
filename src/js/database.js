const val_database = _val.database;
const val_tableList_fileId = _val.tableList_fileId;

var Database = () => {
    if(valDatabase !== undefined)  return _val.database;
    var cache = {};
    return class Database{
        constructor(){
            
        }
        loadDatabase(dbName,option){
            option = option || {};
            var databaseId = (option.init === true ? val_tableList_fileId : this.getFileId(dbName));
            if(cache[dbName] !== undefined && option.discardCache === false){
                return Promise.resolve().then(() => {return cache[dbName]});
            }else{
                runServerFun("loadDatabase",)
            }
        }
        getFileId(dbName){
            return cache.tableList.find(val => {return val.name === dbName}).fileId;
        }
        static handleFusionTable(dbId,methodName,option = {}){
            //e.g. methodName = "table.get"
            var httpMethod = "";
            var param = option.param;
            var url = "https://www.googleapis.com/fusiontables/v2/" + urlOption();
            
            return new Promise((resolve,reject) => {
                var sendObj = {
                    type:httpMethod,
                    url:url
                };
                if(param !== undefined)  sendObj.data = param;
                $.ajax(sendObj)
                    .done((data,status,jqXHR) => {resolve(data,status,jqXHR)})
                    .fail((jqXHR,status,error) => {reject(error,status,jqXHR)});
            });

            function urlOption(){
                var config = {
                    table:{
                        get:{requireTableId:true,httpMethod:"get"}
                    },sql:{
                        sql:{type:"sql",httpMethod:"post"}
                    }
                };
                var method = methodName.split(".");
                var target = config[method[0]][method[1]];
                httpMethod = target.httpMethod;
                return [
                    target.type ? target.type : "tables",
                    target.requireTableId ? dbId : undefined,
                    target.name,
                    target.requireOptId ? option.optionalId : undefined
                ].filter(val => {return val !== undefined}).join("/");
            }
        }
    }
}