var pageFunc = (pageName,funcName,_arguments) => {
    //引数が1つor2つなら、2nd arugは_argumentsとして解釈（i.e.pageNameは省略可）
    if(_arguments === undefined){
        _arguments = pageName;
        pageName = _val.curtPage;
    }
    var funcs = {
        "menu":{

        }
    };
    return funcs[pageName][funcName].apply(undefined,_arguments);
}