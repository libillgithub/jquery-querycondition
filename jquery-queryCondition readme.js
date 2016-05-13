
/*

1、默认的初始化；--ok
2、带rules的初始化，带默认值；--ok
3、绑定事件；--ok
4、获取已有的数据 --ok
5、删除最后一个的时候需要验证；--ok
6、渲染控件 selectize --ok
7、样式--ok
8、返回结构的key可配

*/

//usage
$('#query-basic').queryCondition({
    filters : [{id : 'province', caption : '广东省'}],
    operators : [{caption : '等于', name : 'equal'}],
    filterPlugin : {
        type : 'seletize',
        config : []
    }, 
    rules : {}
});

//基本使用
$('#query-basic').queryCondition({
    filters : [{id : 'province', caption : '广东省'}, {id : 'city', caption : '城市'}],
    operators : [{caption : '等于', name : 'equal'}, {caption : '小于', name : 'little than'}, {caption : '大于', name : 'great than'}]
});


//create querycondition with rules
$('#query-basic').queryCondition({
    filters : [{id : 'province', caption : '广东省'}, {id : 'city', caption : '城市'}],
    operators : [{caption : '等于', name : 'equal'}, {caption : '小于', name : 'little than'}, {caption : '大于', name : 'great than'}],
    rules : {
        "conditions" : [
            {
                "dimension" : "city",
                "operator" : "little than",
                "value" : "112"
            }, {
                "conditions" : [
                    {
                        "dimension" : "province",
                        "operator" : "equal",
                        "value" : "123"
                    }
                ],
                "logic" : "OR"
            }, {
                "dimension" : "city",
                "operator" : "great than",
                "value" : "133"
            }
        ],
        "logic" : "OR"
    }
});


// create query-condition with complex rules
$('#query-basic').queryCondition({
    filters : [{id : 'province', caption : '广东省'}, {id : 'city', caption : '城市'}],
    operators : [{caption : '等于', name : 'equal'}, {caption : '小于', name : 'little than'}, {caption : '大于', name : 'great than'}],
    rules : {
        "conditions" : [
            {
                "dimension" : "city",
                "operator" : "little than",
                "value" : "112"
            }, {
                "conditions" : [
                    {
                        "dimension" : "province",
                        "operator" : "equal",
                        "value" : "123"
                    },
                    {
                        "dimension" : "city",
                        "operator" : "equal",
                        "value" : "123"
                    },
                    {
                        "logic" : "OR",
                        "conditions" : [
                            {
                                "dimension" : "province",
                                "operator" : "equal",
                                "value" : "123"
                            }
                        ]
                    }
                ],
                "logic" : "AND"
            }, {
                "dimension" : "city",
                "operator" : "great than",
                "value" : "133"
            }, {
                "dimension" : "province",
                "operator" : "great than",
                "value" : "144"
            }
        ],
        "logic" : "OR"
    }
});


//getRules
var crules = $('#query-basic').queryCondition('getRules');
console.log(JSON.stringify(crules));


//渲染控件
var normalizedCube = {"dimensions":{"options":[{"id":"province","caption":"省份","group":"address"},{"id":"city","caption":"城市","group":"address"},{"id":"keywords","caption":"关键词","group":"source"},{"id":"referrer_hostname","caption":"来源域名","group":"source"},{"id":"device_type","caption":"设备类型","group":"equipment"},{"id":"device_brand","caption":"设备厂商","group":"equipment"},{"id":"ad_campaign","caption":"广告系列","group":"advertising"},{"id":"ad_keywords","caption":"广告关键词","group":"advertising"},{"id":"year","caption":"年","group":"time"},{"id":"month","caption":"月","group":"time"},{"id":"day","caption":"天","group":"time"}],"optgroups":[{"id":"address","caption":"地区类"},{"id":"source","caption":"来源类"},{"id":"equipment","caption":"设备类"},{"id":"advertising","caption":"广告类"},{"id":"time","caption":"时间类"}],"map":{"province":"省份","city":"城市","keywords":"关键词","referrer_hostname":"来源域名","device_type":"设备类型","device_brand":"设备厂商","ad_campaign":"广告系列","ad_keywords":"广告关键词","year":"年","month":"月","day":"天"}},"measures":{"options":[{"id":"visits","caption":"访问量","group":"visit"},{"id":"pageview","caption":"综合访问量","group":"visit"},{"id":"pageview2","caption":"综合访问量","group":"visit"},{"id":"bounced_rate","caption":"跳出率","group":"visit"},{"id":"average_duration","caption":"平均访问时长","group":"visit"},{"id":"average_pageview","caption":"平均浏览量","group":"visit"}],"optgroups":[{"id":"visit","caption":"访问类"}],"map":{"visits":"访问量","pageview":"综合访问量","pageview2":"综合访问量","bounced_rate":"跳出率","average_duration":"平均访问时长","average_pageview":"平均浏览量"}}};
var optgroups = [].concat(normalizedCube.dimensions.optgroups, normalizedCube.measures.optgroups);
var options = [].concat(normalizedCube.dimensions.options, normalizedCube.measures.options);
$('.rule-filter-container select').selectize({
    valueField : 'id',
    labelField : 'caption',
    searchField : ['caption'], // ['id', 'caption']
    optgroupField : 'group',
    optgroupValueField : 'id',
    optgroupLabelField : 'caption',
    optgroups : optgroups,
    options : options
});


//render with filter plugins
var normalizedCube = {"dimensions":{"options":[{"id":"province","caption":"省份","group":"address"},{"id":"city","caption":"城市","group":"address"},{"id":"keywords","caption":"关键词","group":"source"},{"id":"referrer_hostname","caption":"来源域名","group":"source"},{"id":"device_type","caption":"设备类型","group":"equipment"},{"id":"device_brand","caption":"设备厂商","group":"equipment"},{"id":"ad_campaign","caption":"广告系列","group":"advertising"},{"id":"ad_keywords","caption":"广告关键词","group":"advertising"},{"id":"year","caption":"年","group":"time"},{"id":"month","caption":"月","group":"time"},{"id":"day","caption":"天","group":"time"}],"optgroups":[{"id":"address","caption":"地区类"},{"id":"source","caption":"来源类"},{"id":"equipment","caption":"设备类"},{"id":"advertising","caption":"广告类"},{"id":"time","caption":"时间类"}],"map":{"province":"省份","city":"城市","keywords":"关键词","referrer_hostname":"来源域名","device_type":"设备类型","device_brand":"设备厂商","ad_campaign":"广告系列","ad_keywords":"广告关键词","year":"年","month":"月","day":"天"}},"measures":{"options":[{"id":"visits","caption":"访问量","group":"visit"},{"id":"pageview","caption":"综合访问量","group":"visit"},{"id":"pageview2","caption":"综合访问量","group":"visit"},{"id":"bounced_rate","caption":"跳出率","group":"visit"},{"id":"average_duration","caption":"平均访问时长","group":"visit"},{"id":"average_pageview","caption":"平均浏览量","group":"visit"}],"optgroups":[{"id":"visit","caption":"访问类"}],"map":{"visits":"访问量","pageview":"综合访问量","pageview2":"综合访问量","bounced_rate":"跳出率","average_duration":"平均访问时长","average_pageview":"平均浏览量"}}};
var optgroups = [].concat(normalizedCube.dimensions.optgroups, normalizedCube.measures.optgroups);
var options = [].concat(normalizedCube.dimensions.options, normalizedCube.measures.options);
$('#query-basic').queryCondition({
    filters : [{id : 'province', caption : '广东省'}, {id : 'city', caption : '城市'}],
    operators : [{caption : '等于', name : 'equal'}, {caption : '小于', name : 'little than'}, {caption : '大于', name : 'great than'}],
    rules : {
        "conditions" : [
            {
                "dimension" : "city",
                "operator" : "little than",
                "value" : "112"
            }, {
                "conditions" : [
                    {
                        "dimension" : "province",
                        "operator" : "equal",
                        "value" : "123"
                    }
                ],
                "logic" : "OR"
            }, {
                "dimension" : "city",
                "operator" : "great than",
                "value" : "133"
            }
        ],
        "logic" : "OR"
    },
    filterPlugin : {
        type : 'selectize',
        config: {
            valueField : 'id',
            labelField : 'caption',
            searchField : ['caption'], // ['id', 'caption']
            optgroupField : 'group',
            optgroupValueField : 'id',
            optgroupLabelField : 'caption',
            optgroups : optgroups,
            options : options 
        }
    }
});

//check
$('.rule-container').each(function () {
    var filterValue = $('.rule-filter-container select', this).val();
    var actualValue = $('.rule-value-container input', this).val();
    if (!$.trim(filterValue) || !$.trim(actualValue)) {
        $(this).addClass('has-error');
        $('.error-container', this).attr('title', '存在空值');
    } else {
        $(this).removeClass('has-error');
        $('.error-container', this).removeAttr('title');
    }
});