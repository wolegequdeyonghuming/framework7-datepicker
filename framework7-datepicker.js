/**
 * Framework7 date-picker
 * @charset UTF-8
 * @author xiaoys@sucsoft.com
 * @version 1.0.0
 * @require Framework7@1.6.5
 * */


/**
 * @param f7Instance  your framework7 instance. eg: myApp
 * @param selector  dom selector
 * @param dateFormat  yy-MM-dd, HH:mm:ss  (don't change case! and yy=2018!)
 * @param opt  options(max, min, maxYear, minYear, def)
 * @return mPicker instance, api see framework7.org
 * **/
window.datePicker = function (f7Instance, selector, dateFormat="yy-MM-dd", opt={}) {
    /*gen opt*/
    if(!opt.max)
        opt.max = opt.maxYear ? new Date(opt.maxYear + "-12-31,23:59:59") : new Date("2020-12-31,23:59:59");

    if(!opt.min)
        opt.min = opt.minYear ? new Date(opt.minYear + "-12-31") : new Date("1998-01-01");

    if(!opt.maxYear)
        opt.maxYear = opt.max.getFullYear();

    if(!opt.minYear)
        opt.minYear = opt.min.getFullYear();

    if(!opt.def)
        opt.def = new Date();


    /*default cols object*/
    const cols = {
        M: {
            values: [1,2,3,4,5,6,7,8,9,10,11,12],
            displayValues: ('01 02 03 04 05 06 07 08 09 10 11 12').split(' '),
        },
        d: {
            values: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31],
            displayValues: ('01,02,03,04,05,06,07,08,09,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31').split(','),
        },
        y: {
            values: (function () {
                var arr = [];
                for (var i = opt.minYear; i <= opt.maxYear; i++) { arr.push(i); }
                return arr;
            })(),
        },
        H: {
            values: [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23],
            displayValues: ('00,01,02,03,04,05,06,07,08,09,10,11,12,13,14,15,16,17,18,19,20,21,22,23').split(','),
        },
        m: {
            displayValues: (function () {
                var arr = [];
                for (var i = 0; i <= 59; i++) { arr.push(i < 10 ? '0' + i : i); }
                return arr;
            })(),
            values: (function () {
                var arr = [];
                for (var i = 0; i <= 59; i++) { arr.push(i); }
                return arr;
            })(),
        },
        /*some possible dividers*/
        " ": { divider: true, content: ' '},
        ":":{ divider: true, content: ':' },
        "-": { divider: true, content: '-' },
        ",": { divider: true, content: ',' },
        "/": { divider: true, content: '/' },
    };

    /*gen cols*/
    let colItems = dateFormat.replace(/(.)(\1)+/g, function($1,$2,$3){
        return $2;
    }).split("");

    /*used for generate col items by type and order*/
    let colItemsWithoutSymbol = [];

    /*picker option*/
    let colsData = [];

    for(let i in colItems){

        colsData.push(cols[colItems[i]]);

        if(new RegExp(/\w/).test(colItems[i])){
            colItemsWithoutSymbol.push(colItems[i]);
        }
    }

    /*temp date format by single letters*/
    let tempFormat = dateFormat.replace(/(M|d|H|s)(\1)+/g, function($1,$2,$3){
        return $2;
    });

    /*init picker*/
    let mPicker = f7Instance.picker({

        input: selector,

        /*close text in chinese*/
        toolbarCloseText: '确定',

        rotateEffect: true,

        /*default value*/
        value: formatter(tempFormat, opt.def).split(/\D/g),

        onChange: function (picker, values, displayValues) {

            let year = new Date().getFullYear(),
                month = new Date().getMonth() + 1,
                date = new Date().getDate(),
                hour = new Date().getHours(),
                min = new Date().getMinutes();

            /*set temporary value*/
            if(colItemsWithoutSymbol.indexOf("y") !== -1)
                year = values[colItemsWithoutSymbol.indexOf("y")];

            if(colItemsWithoutSymbol.indexOf("M") !== -1)
                month = Number(values[colItemsWithoutSymbol.indexOf("M")]);

            if(colItemsWithoutSymbol.indexOf("d") !== -1)
                date = values[colItemsWithoutSymbol.indexOf("d")];

            if(colItemsWithoutSymbol.indexOf("H") !== -1)
                hour = values[colItemsWithoutSymbol.indexOf("H")];

            if(colItemsWithoutSymbol.indexOf("m") !== -1)
                min = values[colItemsWithoutSymbol.indexOf("m")];

            /*when date outranges month*/
            const daysInMonth = new Date(year, month, 0).getDate();

            const index = colItems.indexOf("d");

            if (date > daysInMonth) {
                picker.cols[index].setValue(daysInMonth);
            }

            /*when outranges max*/
            const tempDate = new Date(year, month-1, date, hour, min);

            if(tempDate.getTime() > opt.max.getTime()){
                if(colItems.indexOf("y")!==-1)
                    picker.cols[colItems.indexOf("y")].setValue(opt.max.getFullYear());

                if(colItems.indexOf("M")!==-1)
                // picker.cols[colItems.indexOf("M")].setValue((opt.max.getMonth()+1)<10?("0"+(opt.max.getMonth()+1)):(opt.max.getMonth()+1));
                    picker.cols[colItems.indexOf("M")].setValue(opt.max.getMonth()+1);

                if(colItems.indexOf("d")!==-1)
                    picker.cols[colItems.indexOf("d")].setValue(opt.max.getDate());

                if(colItems.indexOf("H")!==-1)
                    picker.cols[colItems.indexOf("H")].setValue(opt.max.getHours());

                if(colItems.indexOf("m")!==-1)
                    picker.cols[colItems.indexOf("m")].setValue(opt.max.getMinutes());
            }
            /*when outranges min*/
            if(tempDate.getTime() < opt.min.getTime()){

                if(colItems.indexOf("y")!==-1)
                    picker.cols[colItems.indexOf("y")].setValue(opt.min.getFullYear());

                if(colItems.indexOf("M")!==-1)
                    picker.cols[colItems.indexOf("M")].setValue(opt.min.getMonth()+1);

                if(colItems.indexOf("d")!==-1)
                    picker.cols[colItems.indexOf("d")].setValue(opt.min.getDate());

                if(colItems.indexOf("H")!==-1)
                    picker.cols[colItems.indexOf("H")].setValue(opt.min.getHours());

                if(colItems.indexOf("m")!==-1)
                    picker.cols[colItems.indexOf("m")].setValue(opt.min.getMinutes());
            }
        },

        /*return the final value displayed on input*/
        formatValue: function (p, values, displayValues) {

            let tempDate = new Date();

            if(colItemsWithoutSymbol.indexOf("y") !== -1)
                tempDate.setFullYear(values[colItemsWithoutSymbol.indexOf("y")]);

            if(colItemsWithoutSymbol.indexOf("M") !== -1)
                tempDate.setMonth(Number(values[colItemsWithoutSymbol.indexOf("M")])-1);

            if(colItemsWithoutSymbol.indexOf("d") !== -1)
                tempDate.setDate(values[colItemsWithoutSymbol.indexOf("d")]);

            if(colItemsWithoutSymbol.indexOf("H") !== -1)
                tempDate.setHours(values[colItemsWithoutSymbol.indexOf("H")]);

            if(colItemsWithoutSymbol.indexOf("m") !== -1)
                tempDate.setMinutes(values[colItemsWithoutSymbol.indexOf("m")]);

            return formatter(dateFormat, tempDate);
        },

        cols: colsData
    });

    return mPicker;

    /*date format util*/
    function formatter(fmt, d) {
        if(!d) d = new Date();
        var o = {
            "M+" : d.getMonth()+1,
            "d+" : d.getDate(),
            "h+" : d.getHours()%12 == 0 ? 12 : d.getHours()%12,
            "H+" : d.getHours(),
            "m+" : d.getMinutes(),
            "s+" : d.getSeconds(),
            "q+" : Math.floor((d.getMonth()+3)/3),
            "S" : d.getMilliseconds()
        };
        var week = {"0" : "日", "1" : "一", "2" : "二", "3" : "三", "4" : "四", "5" : "五", "6" : "六"};
        if(/(y+)/.test(fmt)){
            fmt=fmt.replace(RegExp.$1, (d.getFullYear()+"").substr(2 - RegExp.$1.length));
        }
        if(/(E+)/.test(fmt)){
            fmt=fmt.replace(RegExp.$1, ((RegExp.$1.length>1) ? (RegExp.$1.length>2 ? "星期" : "周") : "")+week[d.getDay()+""]);
        }
        for(var k in o){
            if(new RegExp("("+ k +")").test(fmt)){
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
            }
        }
        return fmt;
    }
}
