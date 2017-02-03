//全てのクラスの親クラス
//どのクラスにも共通しそうな関数を設定している
class ParentClass{
    constructor(){

    }
    setValues(value){
        $.extend(true,this._data,value);
        return this;
    }
    setValue(keyName,value){
        var obj = {};
        keyName.split(".").reduce((prev,curt,index,self)=>{return prev[curt] = (index === self.length-1 ? value : {})},obj);        
        return this.setValues(obj);
    }
    getValues(){
        let ret = {};
        $.extend(true,ret,this._data);
        return ret;
    }
    getValue(keyName){
        var value = this.getValues();
        return keyName.split(".").reduce((prev,curt,index,self) => {return prev[curt]},value);
    }
    static castValue(value,type){
        switch(type){
            case "number":
                return +value;
            case "boolean":
                return !!value;
            case "string":
                return "" + value;
            case "date":
                return new Date(value);
            default:
                return value;
        }
    }
}

function inArray(array, value){
    if(!Array.isArray(array))  throw new Error("Error : The 1st argument is not array (base.js inArray)");
    return array.indexOf(value) !== -1;
}

function dateToValue(date,outputMode) {
    if (typeof date === "string") {
        date = new Date(date);
        if (date.toString() === "Invalid Date")
            return "";
    }
    if (isNaN(date.getTime())) {
        throw new Error("dateToStringの引数が不正です。");
    }
    outputMode = outputMode || "str";
    var val = {};
    [
        {key:"year",func:"getFullYear"},
        {key:"month",func:"getMonth"},
        {key:"date",func:"getDate"},
        {key:"day",func:"getDay"},
        {key:"hour",func:"getHours"},
        {key:"minute",func:"getMinutes"},
        {key:"second",func:"getSeconds"},
    ].forEach((obj) => {
        val[obj.key] = date[obj.func]();
    });
    val.month++;
    val.day_ja = ["日", "月", "火", "水", "木", "金", "土"][val.day];
    val.day_en = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][val.day];
    val.str = "" + [val.year, add_zero(val.month), add_zero(val.date)].join("/") + " " + [add_zero(val.hour), add_zero(val.minute), add_zero(val.second)].join(":");

    return val[outputMode] || ["year","month","date","day","hour","minute","second","day_ja","day_en"].reduce((prev,curt)=>{return prev.replace(new RegExp("\\$\\{" + curt + "\\}","g"),val[curt])},outputMode);

    function add_zero(num) {
        return num < 10 ? "0" + num : "" + num;
    }
}

function makeRandomStr(length, option) {
    //default 長さ16,英数字小文字大文字
    if (length == null) length = 16;
    if (option == null) option = {};
    var _length = length;

    var availableLetters = [];
    ["number", "alphaLower", "alphaUpper"].forEach(function (key, index) {
        if (option[key] == null || option[key]) {
            availableLetters = availableLetters.concat([
                "0123456789",
                "abcdefghijklmnopqrstuvwxyz",
                "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
            ][index].split(""));
        }
    });
    if (typeof option.otherLetters == "string") {
        availableLetters = availableLetters.concat(option.otherLetters.split(""));
    }

    var lettersNum = availableLetters.length;
    var result = "";
    while (length) {
        result += availableLetters[Math.floor(Math.random() * lettersNum)];
        length--;
    }
    if(option.doubleCheck){
        while(inArray(option.doubleCheck,result)){
            result = makeRandomStr(_length, option);
        }
    }
    return result;
}
