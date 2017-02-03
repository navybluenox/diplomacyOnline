function runServerFun(funName,_arguments,userObj){
    return new Promise((resolve,reject) => {
        google.script.run
        .withSuccessHandler((v,o) => {
            try{
                resolve(JSON.parse(v),o);
            }catch(e){
                resolve(v,o);
            }
        })
        .withFailureHandler((e,o) => {
            reject(e,o);
        })
        .withUserObject(userObj)
        .loadfun(funName,_arguments);
    });
}

var LoadingAlert = (() => {
    var img = $('<img src="https://jimsystem-a5629.firebaseapp.com/resource/gif-load.gif" alt="now updating...">');
    var las = [];
    return class LoadingAlert{
        constructor(){
            var that = this;
            this._div = $("<div></div>").appendTo($("#modalWindow"));
            this._div.append(img);
            this._div.css("display","none")
            setStyle();
            setPosition();
            this._div.fadeIn("slow");
            var dr = new DelayRun(() => {
                setPosition();
                setStyle();
            });
            var timer;
            $(window).on("resize.loadingAlert",() => {
                dr.runLater();
            })
            las.push(this);
            function setPosition(){
                var margin = 20;
                that._div.css({
                    "right":"" + margin + "px",
                    "top":"" + ($(window).height() - that._div.outerWidth() - margin) + "px"
                })
            }
            function setStyle(){
                that._div.css({
                    "z-index":2,
                    "position":"fixed",
                    "border":"2px solid #FFFFFF",
                    "border-radius":"10px",
                    "margin":"0",
                    "padding":"2px",
                    "background":"#FFFFFF"
                })
            }
        }
        static removeAll(){
            las.forEach(la => {
                la.remove();
            });
            las.length = 0;
        }
        remove(){
            var that = this;
            this._div.fadeOut("normal",() => {
                that._div.remove();
            });
        }
    }
})();

class DelayRun{
    constructor(callback,timeout){
        this._fun = callback;
        this._timeout = (timeout === undefined ? 50 : timeout);
    }
    runNow(argu){
        this._fun(argu);
    }
    runLater(argu){
        var that = this;
        if(this._to === undefined || this._to === null){
            clearTimeout(this._to);
        }
        this._to = setTimeout(() => {
            that.runNow(argu);
        },this._timeout);
    }
}