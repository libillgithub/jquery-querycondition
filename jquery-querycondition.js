/*!
 * jQuery queryCondition
 *
 * Written by zhangbiaoguang - zhangbiaoguang <zhangbg914@126.com>
 * Licensed under the MIT license
 * Version 1.0.1
 *
 */
(function ($) {
    $.fn.queryCondition = function (options, params) {
        var toString = Object.prototype.toString;
        var defaultOptions = {
            filters : [],
            filterLabelField : 'caption',
            filterValueField : 'id',
            filterPlugin : {},
            operators : [],
            operatorLabelField : 'caption',
            operatorValueField : 'name',
            operatorPlugin : {},
            rules : null,
            logicOperators: ['AND', 'OR'],
            default_logicOperator: 'AND',
            status : {
                groupId: 0,
                ruleId: 0,
                id : this.attr('id') || 'queryCondition'
            }
        };
        
        function createRuleContainer(options, item) {
            var ruleId = options.status.id + '_rule_' + options.status.ruleId++;
            var filtersTpl = options.filtersTpl, operatorsTpl = options.operatorsTpl, valueTpl = '';
            if (item) {
                filtersTpl = filtersTpl.replace('="' + item.expression + '"', '="' + item.expression + '"' + ' selected="selected"');
                operatorsTpl = operatorsTpl.replace('="' + item.operator + '"', '="' + item.operator + '"' + ' selected="selected"');
                valueTpl = item.value[0];
            } 
            var tpl = [
                '<li id="' + ruleId + '" class="rule-container">',
                    '<div class="rule-header">',
                        '<div class="btn-group pull-right rule-actions">',
                            '<button type="button" class="btn btn-xs btn-primary handle deleteRule" data-delete="rule"><span class="glyphicon glyphicon-remove"></span> 删除</button>',
                        '</div>',
                    '</div>',
                    '<div class="error-container"> <i class="glyphicon glyphicon-warning-sign"/></div>',
                    '<div class="rule-filter-container">',
                        '<select class="form-control" name="' + ruleId + '_filter">' + filtersTpl + '</select>',
                    '</div>',
                    '<div class="rule-operator-container">',
                        '<select class="form-control" name="' + ruleId + '_operator">' + operatorsTpl + '</select>',
                    '</div>',
                    '<div class="rule-value-container">',
                        '<input class="form-control" type="text" name="' + ruleId + '_value" value="' + valueTpl + '"/>',
                    '</div>',
                '</li>'
            ].join('');
            return tpl;
        };
        
        function createRuleGroupContainer(options, settings) {
            settings = settings || {};
            var initTpl = settings.initTpl || '<rule-group-detail/>', andCls = 'active', orCls = '',
                btnTpl = settings.isRoot ? '' : '<button type="button" class="btn btn-xs btn-primary handle deleteGroup" data-delete="group"><span class="glyphicon glyphicon-remove"></span> 删除</button>';
            var groupId = options.status.id + '_group_' + options.status.groupId++;
            
            if (settings.logicOperator === 'OR') {
                andCls = ''; 
                orCls = 'active';
            }
            
            var tpl = [
                '<dl id="' + groupId + '" class="rules-group-container">',
                    '<dt class="rules-group-header">',
                        '<div class="btn-group pull-right group-actions">',
                            '<button type="button" class="btn btn-xs btn-primary handle addRule" data-add="rule"><span class="glyphicon glyphicon-plus"></span> 添加</button>',
                            '<button type="button" class="btn btn-xs btn-primary handle addGroup" data-add="group"><span class="glyphicon glyphicon-plus-sign"></span> 添加组</button>',
                            btnTpl,
                        '</div>',
                        '<div class="btn-group group-conditions">',
                            '<label class="btn btn-xs btn-default ' + andCls + '"><input type="radio" name="' + groupId + '_cond" value="AND">AND</label>',
                            '<label class="btn btn-xs btn-default ' + orCls + '"><input type="radio" name="' + groupId + '_cond" value="OR">OR</label>',
                        '</div>',
                        '<div class="error-container"> <i class="glyphicon glyphicon-warning-sign"></i></div>',
                    '</dt>',
                    '<dd class="rules-group-body">',
                        '<ul class="rules-list">' + initTpl + '</ul>',
                    '</dd>',
                '</dl>'
            ].join('');
            return tpl;
        };
        
        function recursionInitContainer(predicates, options) {
            var i = 0, length = predicates.length, predicate = null, result = [], temp = null;
            for (; i < length; i++) {
                predicate = predicates[i];
                if (predicate.predicates && predicate.predicates.length > 0) {
                    temp = recursionInitContainer(predicate.predicates, options);
                    if (temp) {
                        result.push(createRuleGroupContainer(options, {'initTpl': temp, 'logicOperator' : predicate.operator}));
                    }
                } else {
                    result.push(createRuleContainer(options, predicate));
                }
            }
            return result.join('');
        }
        
        function initOptionsTpl(options) {
            var operatorsTpl = [], operators = options.operators || [], 
                labelKey = options.operatorLabelField, valueKey = options.operatorValueField;
            for (var i = 0, length = operators.length, item = null; i < length; i++) {
                item = operators[i];
                operatorsTpl.push('<option value="' + item[valueKey] + '">' + item[labelKey] + '</option>');
            }
            options.operatorsTpl = operatorsTpl.join('');
            
            var filtersTpl = [], filters = options.filters || [], 
                labelKey = options.filterLabelField, valueKey = options.filterValueField;
            for (var i = 0, length = filters.length, item = null; i < length; i++) {
                item = filters[i];
                filtersTpl.push('<option value="' + item[valueKey] + '">' + item[labelKey] + '</option>');
            }
            options.filtersTpl = filtersTpl.join('');
        }
        
        function generateContent(options) {
            initOptionsTpl(options);
            var groupTpl = '', ruleTpl = '', filterPlugin = options.filterPlugin || {}, selectors = null,
                data = options.rules || {'operator' : 'AND', 'inverse' : false, 'predicates' : []};
            if (data.predicates.length > 0) {
                ruleTpl = recursionInitContainer(data.predicates, options);
            } else {
                ruleTpl = createRuleContainer(options);
            }
            groupTpl = createRuleGroupContainer(options, {'isRoot': true, 'initTpl': ruleTpl, 'logicOperator' : data.operator});
            this.empty().off('click.queryCondition').addClass('query-condition form-inline').html(groupTpl);
            
            if (filterPlugin.type && filterPlugin.config) {
                selectors = $('.rule-filter-container select', this);
                selectors[filterPlugin.type] && selectors[filterPlugin.type](filterPlugin.config);
            }
        };
        
        function bindEvent(options) {
            this.on('click.queryCondition', '.group-conditions .btn', function (e) {
                var $this = $(this), $parent = $this.parent();
                if (!$this.hasClass('active')) {
                    $('.active', $parent).removeClass('active');
                    $this.addClass('active');
                }
            });
            
            this.on('click.queryCondition', '.handle', function (e) {
                var $this = $(this), ruleTpl = '', groupTpl = '', idReg = /id="(\S*)" class="rule-container"/, matchResult = [],
                    filterPlugin = options.filterPlugin || {}, selector = null,
                    $groupContainer = $this.closest('.rules-group-container');
                if ($this.hasClass('deleteRule')) {
                    $this.closest('.rule-container').remove();
                } else if ($this.hasClass('addRule')) {
                    ruleTpl = createRuleContainer(options);
                    matchResult = ruleTpl.match(idReg) || [];
                    $('> .rules-group-body > .rules-list', $groupContainer).append(ruleTpl);
                    
                    if (filterPlugin.type && filterPlugin.config) {
                        selector = $('#' + matchResult[1] + ' .rule-filter-container select');
                        selector[filterPlugin.type] && selector[filterPlugin.type](filterPlugin.config);
                    }
                } else if ($this.hasClass('addGroup')) {
                    ruleTpl = createRuleContainer(options);
                    matchResult = ruleTpl.match(idReg) || [];
                    groupTpl = createRuleGroupContainer(options, {'initTpl': ruleTpl});
                    $('> .rules-group-body > .rules-list', $groupContainer).append(groupTpl);
                    
                    if (filterPlugin.type && filterPlugin.config) {
                        selector = $('#' + matchResult[1] + ' .rule-filter-container select');
                        selector[filterPlugin.type] && selector[filterPlugin.type](filterPlugin.config);
                    }
                } else if ($this.hasClass('deleteGroup')) {
                    $groupContainer.remove();
                }
            });
            
        };
        
        function init(options) {
            options = $.extend({}, defaultOptions, options);
            this.data('options', options);
            generateContent.call(this, options);
            bindEvent.call(this, options);
        };
       
        function recursionGetRule(root) {
            var result = {'predicates' : []}, i = 0, $child = null, tempResult = null,
                children = $('> .rules-group-body > .rules-list', root).children(), length = children.length;
            if (length > 0) {
                result.operator = $('> .rules-group-header .active input', root).val();
                result.inverse = false;
                for (; i < length; i++) {
                    $child = $(children[i]);
                    if ($child.hasClass('rule-container')) {
                        result.predicates.push({
                            'expression' : $('[name$="_filter"]', $child).val(),
                            'operator' : $('[name$="_operator"]', $child).val(),
                            'value' : [$('[name$="_value"]', $child).val()]
                        });
                    } else {
                        tempResult = recursionGetRule($child);
                        if (tempResult.predicates.length > 0) {
                            result.predicates.push(tempResult);
                        }
                    }
                }
            }
            
            return result;
        }
       
        this.getRules = function () {
            var root = $('> .rules-group-container', this), status = true, result = {'predicates' : []};
            
            $('.rule-container', root).each(function () {
                var filterValue = $('.rule-filter-container select', this).val();
                var actualValue = $('.rule-value-container input', this).val();
                if (!$.trim(filterValue) || !$.trim(actualValue)) {
                    $(this).addClass('has-error');
                    $('.error-container', this).attr('title', '存在空值');
                    status = false;
                } else {
                    $(this).removeClass('has-error');
                    $('.error-container', this).removeAttr('title');
                }
            });
            
            if (status) {
                result = recursionGetRule(root);
            }
            
            return result;
        };
        
        this.setRules = function (rules) {
            var options = this.data('options');
            options.status = {
                groupId: 0,
                ruleId: 0,
                id : this.attr('id') || 'queryCondition'
            };
            options.rules = rules;
            init.call(this, options);
            return this;
        };
        
        this.reset = function () {
            var options = this.data('options');
            options.status = {
                groupId: 0,
                ruleId: 0,
                id : this.attr('id') || 'queryCondition'
            };
            options.rules = null;
            init.call(this, options);
            return this;
        };
        
        this.__constructor = function (options, params) {
            if (toString.call(options) === '[object Object]') {
                init.call(this, options);
                return this;
            } else if (toString.call(options) === '[object String]') {
                if (params) {
                    return this[options] && this[options].call(this, params);
                } else {
                    return this[options] && this[options].call(this);
                }
            }
        };
        
        return this.__constructor(options, params);
    };
})(jQuery);