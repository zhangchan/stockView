(function($) {
	var v = dxlHttp.v;
	var frameSet = [
		{name: "iCheck",  js: "kiss/js/icheck.js",css:"kiss/css/iCheck.css"},
		{name: "iSwitch", js: "kiss/js/bootstrap-switch.min.js",css:"kiss/css/switch.css"},
		{name: "iUpload", js: "kiss/js/jquery.dxlH5Uploader.js"},
		{name: "typehead", js: "kiss/js/bootstrap3-typeahead.min.js"},
		{name: "iColor", js: "kiss/js/spectrum.js", css: "kiss/css/spectrum.css"},
		{name: "placeholder", js: "kiss/js/jquery.placeholder.min.js"},
		{name: "iRating", js: "kiss/js/star-rating.min.js", css: "kiss/css/star-rating.min.css"},
		{name: "iTable", js: "kiss/js/bootstrap-table.js", css: "kiss/css/bootstrap-table.css"},
		{name: "datetimepicker", js: "kiss/js/bootstrap-datetimepicker.min.js", css: "kiss/css/bootstrap-datetimepicker.min.css"},
		{name: "iDatetimePicker", js: "kiss/js/bootstrap-datetimepicker.new.min.js", css: "kiss/css/bootstrap-datetimepicker.new.min.css"}
	];
	$.extend({
		"logout": function() {
			$.get("/index/logout", function(result){
				window.parent.location.href = windowHttp + '//sys2.' + dxlCom + '/public/index/home';
			});
		},
		"cmsInit": function(){
			var mid = $("ul.nav-sidebar li:not(.active)>a[href='"+location.pathname+"']").parents("ul.nav-sidebar").index();
			if (mid == -1) {
				mid = $.cookie("mid") || 0;
			}
			//$("ul.nav-sidebar:eq('"+mid+"')").siblings("ul.nav-sidebar").find("li:not(.active)").slideUp();
			$("ul.nav-sidebar:eq('"+mid+"')").find("li").show();
			//$("ul.nav-sidebar:eq('"+mid+"')").find("li").slideDown().end().siblings("ul.nav-sidebar").find("li:not(.active)").slideUp();
			//
			var lastIndex = mid;
			$("ul.nav-sidebar li").on("click",function(evt){
				evt.preventDefault();
				evt.stopPropagation();
				var index = $(this).parent().index();
				if (!$(this).hasClass("active")) {
					$.cookie("mid", index, {expires: 365 , domain: "daoxila." + s4Com, path: "/"});
				}
				if (index != lastIndex) {
					lastIndex = index;
					$(this).siblings().slideDown();
					$(this).parent().siblings("ul.nav-sidebar").find("li:not(.active)").slideUp();
				}
				if (!$(this).hasClass("active")) {
					location.href = $(this).find("a").attr("href");
				}
			});
			// tabs
			$("ul.nav-tabs>li>a:not([data-toggle])").click(function(){
				var href = $(this).attr("href");
				if (!href || href == "#" || href.indexOf("javascript") != -1) {
					return false;
				} else {
					$.cmsShowProgress();
				}
			});
			// fix maxlength
			var isIE = navigator.userAgent.toLowerCase().indexOf("msie") != -1;
			if (isIE) {
				$.cmsFixMaxLength();
			}
			// Globle Ajax Settings
			$.ajaxSetup({
				cache: false/*,
				error: function(xhr, textStatus, errorThrown) {
					$.cmsHideProgress();
					alert(textStatus + ": " + errorThrown);
				}*/
			});
			//
			if (!Date.hasOwnProperty("format")) {
				Date.prototype.format = function(pattern) {
					/*初始化返回值字符串*/
					var returnValue = pattern;
					/*正则式pattern类型对象定义*/
					var format = {
						"y+": this.getFullYear(),
						"M+": this.getMonth()+1,
						"d+": this.getDate(),
						"H+": this.getHours(),
						"m+": this.getMinutes(),
						"s+": this.getSeconds(),
						"S": this.getMilliseconds(),
						"h+": (this.getHours()%12),
						"a": (this.getHours()/12) <= 1? "AM":"PM"
					};
					/*遍历正则式pattern类型对象构建returnValue对象*/
					for(var key in format) {
						var regExp = new RegExp("("+key+")");
						if(regExp.test(returnValue)) {
							var zero = "";
							for(var i = 0; i < RegExp.$1.length; i++) { zero += "0"; }
							var replacement = RegExp.$1.length == 1? format[key]:(zero+format[key]).substring(((""+format[key]).length));
							returnValue = returnValue.replace(RegExp.$1, replacement);
						}
					}
					return returnValue;
				};
			}
			// fix "placeholder"
			var supported = "placeholder" in document.createElement("input");
			if (!supported) {
				$.cmsJsLoad({frame:["placeholder"]}, function(){
					$("input, textarea").placeholder();
				});
			}
		},
		"cmsShowProgress": function(z){
			$.dxlBackgroundShow();
			var html = '<div id="cmsZzcLoading140214" class="progress">'+
							'<div class="progress-bar progress-bar-striped active"  role="progressbar" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100" style="width: 100%">'+
								'<span class="sr-only">Please Waitting...</span>'+
							'</div>'+
						'</div>';
			$("body").append(html);
			$("#cmsZzcLoading140214").dxlLayerFixedShow();
			if(z) $("#dxlBackgroundDiv").css("z-index","1100");
		},
		"cmsHideProgress": function(){
			$.dxlBackgroundHide();
			$("#cmsZzcLoading140214").remove();
		},
		"cmsAlert": function(settings){
			var title = "信息提示", message = "", btnText = "关闭", onClose = null;
			// init config
			if (settings && $.isPlainObject(settings)) {
				settings.title && (title = settings.title);
				settings.message && (message = settings.message);
				settings.btnText && (btnText = settings.btnText);
				settings.onClose && (onClose = settings.onClose);
			} else if (typeof settings == "string") {
				message = settings;
			}
			// set html
			var html = '<div aria-hidden="true" role="dialog" tabindex="-1" id="tips_popup" class="modal fade confirm-modal">'+
				'<div class="modal-dialog" style="width: 540px;">'+
					'<div class="modal-content">'+
						'<div class="modal-header">'+
							'<button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>'+
							'<h4 class="modal-title">'+ title +'</h4>'+
						'</div>'+
						'<div class="modal-body">'+
							'<h3>'+ message +'</h3>'+
						'</div>'+
						'<div class="modal-footer">'+
							'<button type="button" class="btn btn-default" data-dismiss="modal">'+ btnText +'</button>'+
						'</div>'+
					'</div>'+
				'</div>'+
			'</div>';
			var $this = $(html).appendTo('body');
			// init event
			$this.find("button").click(function(evt){
				closeDialog($this);
				$.isFunction(onClose) && onClose();
			});
			// show
			$this.modal({"show": true, "backdrop": "static"});
			// close
			function closeDialog (dialog) {
				dialog.modal("hide");
				setTimeout(function(){
					dialog.remove();
				}, 750);
				//$("div.modal-backdrop").remove();
			}
		},
		"cmsConfirm": function(settings){
			var title = "信息提示", message = "是否继续？", sureCallback, cancelCallback, sureText = "确定", cancelText = "取消";
			// init config
			if (settings && $.isPlainObject(settings)) {
				// Basic options
				settings.title && (title = settings.title);
				settings.message && (message = settings.message);
				settings.sureCallback && $.isFunction(settings.sureCallback) && (sureCallback = settings.sureCallback);
				settings.cancelCallback && $.isFunction(settings.cancelCallback) && (cancelCallback = settings.cancelCallback);
				settings.sureText && (sureText = settings.sureText);
				settings.cancelText && (cancelText = settings.cancelText);
				// Advanced options
			}
			// set html
			var html = '<div aria-hidden="true" role="dialog" tabindex="-1" id="tips_popup" class="modal fade confirm-modal">'+
				'<div class="modal-dialog" style="width: 540px;">'+
					'<div class="modal-content">'+
						'<div class="modal-header">'+
							'<button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>'+
							'<h4 class="modal-title">'+ title +'</h4>'+
						'</div>'+
						'<div class="modal-body">'+
							'<h3>'+ message +'</h3>'+
						'</div>'+
						'<div class="modal-footer">'+
							'<button type="button" class="btn btn-default" data-dismiss="modal">'+ cancelText +'</button>'+
							'<button type="button" class="btn btn-primary">'+ sureText +'</button>'+
						'</div>'+
					'</div>'+
				'</div>'+
			'</div>';
			var $this = $(html).appendTo('body');
			// init event
			$this.find("button").click(function(evt){
				if ($(this).hasClass("btn-primary")) {
					$.isFunction(sureCallback) && sureCallback();
				} else {
					$.isFunction(cancelCallback) && cancelCallback();
				}
				closeDialog($this);
			});
			// show
			$this.modal({"show": true, "backdrop": "static"});
			// close
			function closeDialog (dialog) {
				dialog.modal("hide");
				setTimeout(function(){
					dialog.remove();
				}, 750);
				//$("div.modal-backdrop").remove();
			}
			// events
			$this.on('show.bs.modal', function (e) {
				$.isFunction(settings.beforeShow) && settings.beforeShow()
			});
			$this.on('shown.bs.modal', function (e) {
				$.isFunction(settings.afterShow) && settings.afterShow()
			});
			$this.on('hide.bs.modal', function (e) {
				$.isFunction(settings.beforeHide) && settings.beforeHide()
			});
			$this.on('hidden.bs.modal', function (e) {
				$.isFunction(settings.afterHide) && settings.afterHide()
			});
		},
		"cmsStringify": function(O) {
			if (O) { // && ($.isPlainObject(O) || $.isArray(O))
				if (window.JSON && JSON.stringify) {
					return JSON.stringify(O);
				}
				var S = [];
				var J = "";
				if (Object.prototype.toString.apply(O) === '[object Array]') {
					for (var i = 0; i < O.length; i++)
						S.push($.cmsStringify(O[i]));
					J = '[' + S.join(',') + ']';
				} else if (Object.prototype.toString.apply(O) === '[object Date]') {
					J = "new Date(" + O.getTime() + ")";
				} else if (Object.prototype.toString.apply(O) === '[object RegExp]' || Object.prototype.toString.apply(O) === '[object Function]') {
					J = O.toString();
				} else if (Object.prototype.toString.apply(O) === '[object Object]') {
					for (var i in O) {
						O[i] = typeof (O[i]) == 'string' ? '"' + O[i] + '"' : (typeof (O[i]) === 'object' ? $.cmsStringify(O[i]) : O[i]);
						S.push(i + ':' + O[i]);
					}
					J = '{' + S.join(',') + '}';
				}
				return J;
			} else {
				return "";
			}
		},
		'cmsJsLoad': function(date,execute) {
			var _data = date.frame;
			var _dataLength = _data.length;
			var _dataLengthNum = 0;
			var head = $("head");
			var ajax = function (){
				$(frameSet).each(function(index, fs) {
					if(_data[_dataLengthNum] == fs.name && !fs.loading){
						!fs.css == "" ? head.append('<link href="'+ dxlHttp.s4 + fs.css + "?v=" + v + '" rel="stylesheet">') : "";
						$.getScript(dxlHttp.s4 + fs.js + "?v=" + v,function(){
							fs.loading = true;
							ajaxRct();
						});
					}else if(_data[_dataLengthNum] == fs.name){
						ajaxRct();
					}
				});
			}
			var ajaxRct = function(){
				_dataLengthNum++;
				if(_dataLengthNum < _dataLength) ajax(); else $.isFunction(execute) ? execute() : "";
			}
			ajax();
		},
		'cmsFixMaxLength': function(selector, length){
			selector = selector || "textarea[maxlength]";
			function getLength(el) {
				var parts = el.value;
				return parts.length;
			}
			return $(selector).each(function (index, item) {
				var field = this, $field = $(field), limit = length && !isNaN(length) ? parseInt(length) : $field.attr('maxlength');
				function limitCheck(event) {
					var len = getLength(this), exceeded = len >= limit, code = event.keyCode;
					if ( !exceeded ) return;
					switch (code) {
						case 8:  // allow delete
						case 9:
						case 17:
						case 36: // and cursor keys
						case 35:
						case 37: 
						case 38:
						case 39:
						case 40:
						case 46:
						case 65:
							return;
						default:
							return code != 32 && code != 13 && len == limit;
					}
				}
				var updateCount = function () {
					var len = getLength(field),
						diff = limit - len;
					// truncation code
					if (diff < 0) {
						field.value = field.value.substr(0, limit);
						updateCount();
					}
				};
				$field.keyup(updateCount).change(updateCount).keydown(limitCheck);
				updateCount();
			});
		},
		'cmsGetEditorContent': function(editorContent){
			return editorContent ? editorContent.replace(/<em>/g, "<i>").replace(/<\/em>/g, "<\/i>").replace(/https:\/\/iqs/ig, "http://iq") : "";
		},
		'cmsSetEditorContent': function(editor, content) {
			if (editor && content && $.isFunction(editor.setContent)) {
				if (location.protocol == "https:") {
					editor.setContent($.cmsFixAlign(content.replace(/http:\/\/iq/ig, "https://iqs")));
				} else {
					editor.setContent($.cmsFixAlign(content));
				}
			}
		},
		'cmsFixAlign': function(html) {
			if (!html) return "";
			var agent = navigator.userAgent, isFirefox = /firefox/ig.test(agent), isChrome = (/chrome/ig.test(agent) && !!window.chrome), isIE = /msie/ig.test(agent);
			var hasAlignStyle = /align|text-align/ig.test(html), onlyAlign = /<\w+\s+align="\w+"\s*>/ig.test(html), onlyTextAlign = /<\w+\s+style="\s*text-align\s*:\s*\w+\s*;?\s*"\s*>/ig.test(html);
			// 对齐方式显示的兼容处理
			if (isFirefox && onlyTextAlign) { // 将Chrome保存的数据转换成Firefox
				html = html.replace(/<\w+\s+style="\s*text-align\s*:\s*\w+\s*;?\s*"\s*>/ig, function(matchedString){
					matched = matchedString.match(/<(\w+)\s+style="\s*text-align\s*:\s*(\w+)\s*;?\s*"\s*>/i);
					return matched ? ('<' + matched[1] + ' align="'+ matched[2] +'">') : matchedString;
				});
			} else if (isChrome && onlyAlign) {// 将Firefox保存的数据转换成Chrome
				html = html.replace(/<\w+\s+align="\w+"\s*>/ig, function(matchedString){
					matched = matchedString.match(/<(\w+)\s+align="(\w+)"\s*>/i);
					return matched ? ('<' + matched[1] + ' style="text-align:'+ matched[2] +';">') : matchedString;
				});
			} else {
				//console.debug("Browser: " + agent + ", HTML: " + html);
			}
			return html;
		},
		"cmsHQRequest": function(args, success, failure, rootURL) {
			// 参数不存在或参数不是JSON格式则不处理
			if (!args) return false;
			$.ajax({
				url     : (rootURL || "/hunqing/v1/json"),
				data    : args,
				dataType:"json",
				type    :"post",
				success : function(data, textStatus, xhr) {
					if ($.isFunction(success)) {
						success(data);
					}
				},
				error: function(xhr, textStatus, errorThrown){
					if ($.isFunction(failure)) {
						xhr.url = rootURL;
						xhr.arg = args;
						failure(xhr, textStatus, errorThrown);
					}
				}
			});
		},
		"cmsJSONFilter": function(json){
			if (!json || !$.isPlainObject(json)) return {};
			for (var field in json) {
				// 注意:
				// false == "" / "" == 0 / false == 0 ==> true
				// null == undefined ==> true | null === undefined ==> false
				if (json[field] === "" || json[field] == null || json[field] == undefined) {
					delete json[field];
				}
			}
			return json;
		},
		"cmsGetOffset": function(currPage, pageSize) {
			pageSize = pageSize || 15;
			if (isNaN(currPage) || currPage < 1) return 0;
			return (currPage - 1) * pageSize;
		},
		"cmsValueOf": function(payload, page, pageSize) {
			pageSize = pageSize || 15;
			return {
				data: payload.entities,
				page: page,
				offset: $.cmsGetOffset(page, pageSize),
				total: Math.ceil(payload.total / pageSize)
			};
		},
		"cmsMsgHandler": function(errorMap, fieldMap, asHtml) {
			var ret = "";
			if ($.isPlainObject(errorMap)) {
				for (var field in errorMap) {
					ret += (fieldMap[field] || field) + ": " + errorMap[field] + (asHtml ? "<br>" : "\n");
				}
			}
			return ret;
		},
		"isColor": function(str) {
			// http://www.cnblogs.com/bdstjk/archive/2011/12/30/2519865.html
			return /^(rgb\((\d|(?!0)[0-9]{2}|[12][0-5][0-5])\s*,\s*(\d|(?!0)[0-9]{2}|[12][0-5][0-5])\s*,\s*(\d|(?!0)[0-9]{2}|[12][0-5][0-5])\)|#[0-9a-zA-Z]{3}|#[0-9a-zA-Z]{6})$/i.test(str);
		},
		"cmsDateFormat": function(date, pattern){
			if (Object.prototype.toString.call(date) != "[object Date]") {
				return date;
			}
			pattern = pattern || "yyyy-MM-dd";
			/*初始化返回值字符串*/
			var returnValue = pattern;
			/*正则式pattern类型对象定义*/
			var format = {
				"y+": date.getFullYear(),
				"M+": date.getMonth()+1,
				"d+": date.getDate(),
				"H+": date.getHours(),
				"m+": date.getMinutes(),
				"s+": date.getSeconds(),
				"S" : date.getMilliseconds(),
				"h+": (date.getHours()%12),
				"a" : (date.getHours()/12) <= 1? "AM":"PM"
			};
			/*遍历正则式pattern类型对象构建returnValue对象*/
			for(var key in format) {
				var regExp = new RegExp("("+key+")");
				if(regExp.test(returnValue)) {
					var zero = "";
					for(var i = 0; i < RegExp.$1.length; i++) { zero += "0"; }
					var replacement = RegExp.$1.length == 1? format[key]:(zero+format[key]).substring(((""+format[key]).length));
					returnValue = returnValue.replace(RegExp.$1, replacement);
				}
			}
			return returnValue;
		},
		"cmsPreformat": function(htmlStr){
			return (htmlStr||"").replace(/\&/g,"&amp;").replace(/\</g, "&lt;").replace(/\>/g, "&gt;");
		},
		"cmsHtmlTag": function(htmlStr) {
			var scriptReg = new RegExp('<script[^>]*?>[\\s\\S]*?<\\/script>', 'g');
			var styleReg = new RegExp('<style[^>]*?>[\\s\\S]*?<\\/style>', 'g');
			return (htmlStr||"").replace(/<[^>]+>/g, "");
		},
		"cmsGenerateKey": function(file, module) {
			var suffix = /\.[^\.]+$/.exec(file.name)[0].toLowerCase(), now = new Date();
			return module + "/" + $.cmsDateFormat(now, "yyyy") + "/" + $.cmsDateFormat(now, "MMdd") + "/" + $.cmsDateFormat(now, "yyyyMMddHHmmssS") + suffix;
		},
		'cmsErrorHandler': function(xhr, textStatus, errorThrown) {
			if (!xhr || !xhr.readyState) return null;
			var errorMsg = "";
			if (xhr.responseJSON) {
				errorMsg = $.cmsStringify(xhr.responseJSON);
			} else if (xhr.responseText) {
				errorMsg = xhr.responseText;
			}
			return "请求路径： " + xhr.url + (xhr.arg ? "\n请求参数：" + xhr.arg : "") + "\n错误代码：" + xhr.status + " - " + errorThrown + "\n响应消息：" + errorMsg;
		}
	});
	$.fn.extend({
		"cmsHtmlList": function(callback){
			if ($.isFunction(callback)) {
				$.cmsShowProgress();
				var html = "";
				callback($(this), html);
			}
		},
		"cmsShowList": function(html){
			var tagName = $(this).get(0).tagName.toLowerCase();
			if (tagName == "table") {
				var size = $(this).find("th").size();
				var listNone = '<tr><td colspan="'+size+'" style="padding: 0px;"><div id="no_content" class="alert alert-info" style="text-align: center; margin: 0px;">该搜索条件下暂无内容！</div></td></tr>';
				if (html == "") {
					$(this).find("tbody").html(listNone).hide().fadeIn();
				} else {
					$(this).html(html).hide().fadeIn();
				}
			} else {
				var listNone = '<div id="no_content" class="alert alert-info" style="text-align: center;">该搜索条件下暂无内容！</div>';
				$(this).html(html == "" ? listNone : html).hide().fadeIn();
			}
			$.cmsHideProgress();
		},
		"cmsPageNavigator": function(data, callback){
			if (data.total < 2) return $(this).html(""), false;
			var html = "", size = 5, currPage = data.page, totalPage = data.total, rowCount = data.rowCount, items = [];
			if (totalPage <= size) {
				for (var i = 1; i <= totalPage; i++) {
					items.push(i)
				}
			} else {
				if (currPage == totalPage) {
					if (currPage >= size) {
						for (var i = currPage; i > currPage - size; i--) {
							items.push(i);
						}
					} else {
						for (var i = 1; i <= currPage; i++) {
							items.push(i);
						}
					}
				} else {
					if (currPage + size - 1 <= totalPage) {
						for (var i = 0; i < size; i++) {
							items.push(currPage + i);
						}
					} else {
						for (var i = 0; i <= totalPage - currPage; i++) {
							items.push(currPage + i);
						}
						for (var i = size - (totalPage - currPage + 1); i > 0; i--) {
							items.push(currPage - i);
						}
					}
				}
			}
			items.sort(function(a, b){
				if (a > b) {
					return 1;
				} else if (a < b) {
					return -1;
				} else {
					return 0;
				}
			});
			html += '<li'+(currPage == 1 ? ' class="disabled"' : '')+'><a href="javascript:;"'+(currPage != 1 ? ('data-index="'+ 1 +'"') : '')+'>首页</a></li>';
			html += '<li'+(currPage == 1 ? ' class="disabled"' : '')+'><a href="javascript:;"'+(currPage != 1 ? ('data-index="'+ (currPage - 1) +'"') : '')+'>上一页</a></li>';
			for (var i = 0; i < items.length; i++) {
				if (items[i] == currPage) {
					html += '<li class="active"><a href="javascript:;" data-index="'+items[i]+'">'+ items[i] +'</a></li>';
				} else {
					html += '<li><a href="javascript:;" data-index="'+items[i]+'">'+ items[i] +'</a></li>';
				}
			}
			html += '<li'+(currPage == totalPage ? ' class="disabled"' : '')+'><a href="javascript:;"'+(currPage != totalPage ? ('data-index="'+ (currPage + 1) +'"') : '')+'>下一页</a></li>';
			html += '<li'+(currPage == totalPage ? ' class="disabled"' : '')+'><a href="javascript:;"'+(currPage != totalPage ? ('data-index="'+ totalPage +'"') : '')+'>末页</a></li>';
			if (rowCount && !isNaN(rowCount)) {
				html += '<li class="disabled"><a href="javascript:">共' + rowCount + "条 / " + totalPage + '页</a></li>';
			} else {
				html += '<li class="disabled"><a href="javascript:">共' + totalPage + '页</a></li>';
			}
			$(this).html(html).find("li:not(.disabled)>a").one("click", function(evt){
				$.isFunction(callback) && callback($(this).data("index"));
				return false;
			});
		},
		// 下拉框
		"cmsSelectHtml": function(data, defaultText, defaultValue, firstText, firstValue, textField, valueField){
			firstText    = firstText    || "请选择";
			firstValue   = firstValue   || "";
			defaultText  = defaultText  || firstText;
			defaultValue = defaultValue || firstValue;
			textField    = textField    || "name";
			valueField   = valueField   || "id";
			$(this).cmsSetSelectValue(defaultText, defaultValue);
			if ($.isArray(data)) {
				var html = '<li class="empty-item" val="'+firstValue+'"><a href="#">'+firstText+'</a></li>';
				html += data.length ? '<li class="divider"></li>' : '';
				for (var i = 0; i < data.length; i++) {
					html += '<li val="'+data[i][valueField]+'"><a href="#">'+data[i][textField]+'</a></li>';
				}
				$(this).find("ul").html(html);
			} else if (typeof data == "string") {
				$(this).find("ul").html(data);
			}
			return this;
		},
		"cmsSelect": function(callback){
			$(this).each(function(index, item){
				var $this = $(item);
				$this.find("ul>li>a").click(function(evt){
					evt.preventDefault();
					if ($this.attr("dom-state")) {
						return false;
					}
					$this.find("li").removeClass("active");
					if (!$(this).parent().hasClass("empty-item") && !$(this).parent().hasClass("divider")) {
						$(this).parent().addClass("active");
					}
					$this.find("button").html($(this).text()+" <span class='caret'></span>").attr("val", $(this).parent().attr("val") || "");
					$.isFunction(callback) && callback.call($this, $(this));
				});
			});
			return this;
		},
		"cmsGetSelectValue": function(valueAttrName) {
			valueAttrName = valueAttrName || "val";
			if (valueAttrName == "text") {
				var txt = $.trim($(this).find("button").text());
				// 此处有Bug：下拉框无数据时亦无li.divider元素
				var index = $(this).find("ul>li.divider").index();
				return index == 1 && txt == $.trim($(this).find("ul>li:eq(0)").text()) ? "" : $.trim(txt);
			} else {
				return $(this).find("button").attr(valueAttrName) || "";
			}
		},
		"cmsSetSelectValue": function(text, value, valueAttrName){
			valueAttrName = valueAttrName || "val";
			if (value == undefined) {
				text = String(text).split(",")[0];
				if ($(this).find("li[val='"+text+"']").size() == 1) {
					var item = $(this).find("li[val="+text+"]");
					item.addClass("active").siblings("li").removeClass("active");
					text  = item.text();
					value = item.attr("val");
				} else if ($(this).find("li>a:contains('"+text+"')").size() > 0) {
					var item = $(this).find("li>a:contains('"+text+"')").map(function(){if ($(this).text() == text) {return this;}});
					item.parent().addClass("active").siblings("li").removeClass("active");
					text  = item.text();
					value = item.parent().attr("val");
				} else {
					text  = $(this).find("li:eq(0)").text();
					value = $(this).find("li:eq(0)").attr("val");
				}
			}
			$(this).find("button").html(text+"<span class='caret'></span>").attr("val", value);
			return this;
		},
		"cmsSetSelectState": function(state){
			if (state == true || ($.isPlainObject(state) && (state.disabled || state.readonly))) {
				$(this).attr("dom-state", true);
			} else {
				$(this).attr("dom-state", null);
			}
			return this;
		},
		"cmsSetSelectDisabled": function(status){
			if (status) {
				this.cmsDisabledSelect();
			} else {
				this.cmsEnableSelect();
			}
			return this;
		},
		"cmsDisabledSelect": function(){
			$(this).each(function(index, item){
				$(item).find("button.dropdown-toggle").attr("disabled", true);
			});
			return this;
		},
		"cmsEnableSelect": function(){
			$(this).each(function(index, item){
				$(item).find("button.dropdown-toggle").attr("disabled", false);
			});
			return this;
		},
		//多选，下拉
		'cmsMultiSelectHtml': function(data, textField, valueField, firstText, firstValue, canCheckAll) {
			textField    = textField    || "name";
			valueField   = valueField   || "id";
			firstText    = firstText    || "请选择";
			firstValue   = firstValue   || "";
			if ($.isArray(data)) {
				var html = '<li '+(canCheckAll ? 'class="all"' : '')+' val="'+firstValue+'">'+firstText+'</li>';
				//html += data.length ? '<li class="divider"></li>' : '';
				var arrValue = valueField.split("-");
				if (arrValue.length > 1) {
					for (var i = 0; i < data.length; i++) {
						html += '<li><a><label><input type="checkbox" value="'+ data[i][arrValue[0]] + "-" + data[i][arrValue[1]] + "-" + data[i][arrValue[2]] +'">'+data[i][textField]+'</label></a></li>';
					}
				} else {
					for (var i = 0; i < data.length; i++) {
						html += '<li><a><label><input type="checkbox" value="'+data[i][valueField]+'">'+data[i][textField]+'</label></a></li>';
					}
				}
				$(this).find("ul").html(html);
			} else if (typeof data == "string") {
				$(this).find("ul").html(data);
			}
			return this;
		},
		"cmsMultiSelect":function(callback){
			$(this).each(function(index, element){
				var $this = $(element);
				$this.find("input[type=checkbox]").on("click", function(evt){
					evt.stopPropagation();
					var $li = $(this).parents("li").eq(0);
					var isChecked = $(this).prop("checked");
					if (isChecked) {
						$li.addClass("cur");
					} else {
						$li.removeClass("cur");
					}
					var labels = [], values = [];
					$this.find(".cur").each(function(index, item){
						labels.push($(item).find("label").text());
						values.push($(item).find("input").val());
					});
					$this.find("button .g_default").text(labels.join(",")||"请选择");
					$this.find("button.dropdown-toggle").attr("val",values.join(","));
					$.isFunction(callback) ? callback.call($this, $(this)) : "";
				});
				$this.find("li").on("click",function(evt){
					var isCheckAll = $(this).hasClass("all");
					// 处理选中项Dom
					if (isCheckAll) {
						var isChecked = $(this).hasClass("checked");
						$(this).toggleClass("checked");
						$this.find("input[type=checkbox]").prop("checked", !isChecked);
						if (isChecked) {

							$this.find("li:not(.all,.divider)").removeClass("cur");
							$this.find("li.all").text("全选");
						} else {
							$this.find("li:not(.all,.divider)").addClass("cur");
							$this.find("li.all").text("取消全选");
						}
					} else {
						if ($(this).find("a").size() === 0) {
							return true;
						}
						var isChecked = $(this).find("input[type=checkbox]").prop("checked");
						$(this).find("input[type=checkbox]").prop("checked", !isChecked);
						if (isChecked) {
							$(this).removeClass("cur");
						} else {
							$(this).addClass("cur");
						}
						
					}
					// 处理选中项的数据
					var labels = [], values = [];
					$this.find(".cur").each(function(index, item){
						labels.push($(item).find("label").text());
						values.push($(item).find("input").val());
					});
					$this.find("button .g_default").text(labels.join(",")||"请选择");
					$this.find("button.dropdown-toggle").attr("val",values.join(","));
					$.isFunction(callback) ? callback.call($this, $(this)) : "";
					return false;
				});
			});
		},
		'cmsGetMultiSelectValue': function(attr, asArray){
			attr = attr || "val";
			//return $(this).cmsGetSelectValue(attr);
			var labels = [], values = [];
			$(this).find(".cur").each(function(index, item){
				labels.push($(item).find("label").text());
				values.push($(item).find("input").val());
			});
			return attr == "val" ? (asArray ? values : values.join(",")) : (asArray ? labels : labels.join(","));
		},
		'cmsSetMultiSelectValue': function(args, attr){
			attr = attr || "val";
			var $this = $(this);
			$this.find("li").removeClass("cur");
			$this.find("input[type=checkbox]").removeAttr("checked");
			if (!args) {
				$this.find("button .g_default").text("请选择");
				$this.find("button.dropdown-toggle").attr(attr, "");
				return this;
			}
			if (typeof args == "string") {
				args = args.split(",");
			}
			if ($.isArray(args)) {
				var labels = [], values = [], arg, $li;
				$.each(args, function(index, item){
					if (typeof item == "string" || typeof item == "number") {
						if ($this.find("input[value='"+item+"']").size() == 1) {
							$li = $this.find("input[value="+item+"]").parents("li").eq(0);
							labels.push($li.find("label").text());
							values.push(item);
						} else if ($this.find("li:contains('"+item+"')").size() == 1) {
							$li = $this.find("li:contains('"+item+"')");
							labels.push(item);
							values.push($li.find("input[type=checkbox]").val());
						} else {
							// 找不到匹配的元素
							throw new Error("no match!");
						}
					} else if ($.isPlainObject(item)) {
						labels.push(item.text||item.name);
						values.push(item.id||item.value);
						// 与上面的处理大体一致，关键在于item的两个key不确定
					}
					$li && $li.addClass("cur").find("input[type=checkbox]").prop("checked", true);
				});
				$(this).find("button .g_default").text(labels.join(",")||"请选择");
				$(this).find("button.dropdown-toggle").attr("val",values.join(","));
			}
		},
		// 复选框
		"cmsCheckboxHtml": function(data, textField, valueField){
			textField = textField || "name";
			valueField = valueField || "id";
			if ($.isArray(data)) {
				var html = "";
				for (var i = 0; i < data.length; i++) {
					html += '<label class="div-label"><input type="checkbox" value="'+data[i][valueField]+'"><span>'+data[i][textField]+'</span></label>';
				}
				$(this).html(html);
			} else if (typeof data == "string") {
				$(this).html(data);
			}
			return this;
		},
		"cmsCheckbox": function(cfg, callback){
			if ($.isFunction($(this).iCheck)) {
				$(this).iCheck({
					checkboxClass: 'icheckbox_flat-blue',
					increaseArea: '20%'
				});
				if (cfg && cfg.isChecked) {
					$(this).iCheck(!!cfg.isChecked ? "check" : "uncheck");
				}
				if (cfg && cfg.isDisabled) {
					$(this).iCheck(!!cfg.isDisabled ? "disable" : "enable");
				}
			}
			$.isFunction(callback) && callback();
			return this;
		},
		"cmsGetCheckboxValue": function(asArray){
			var ret = [];
			$(this).find("input[type=checkbox]").each(function(index, item){
				if ($(item).is(":checked")) {
					ret.push($(item).val());
				}
			});
			return asArray ? ret : ret.toString();
		},
		"cmsSetCheckboxValue": function(values){
			var iCheckLoaded = $.isFunction($(this).iCheck);
			if (!$.isArray(values)) {
				values = String(values).split(",");
			} else {
				values = values.join(",").split(",")
			}
			$(this).find("input[type=checkbox]").each(function(index, item){
				if ($.inArray($(item).val(), values) != -1) {
					iCheckLoaded ? $(item).iCheck('check') : $(item).attr("checked", true);
				} else {
					iCheckLoaded ? $(item).iCheck('uncheck') : $(item).attr("checked", false);
				}
			});
			return this;
		},
		// 单选框
		"cmsRadioHtml": function(data, textField, valueField, name){
			textField = textField || "name";
			valueField = valueField || "id";
			name       = name || "radio-" + (+new Date);
			if ($.isArray(data)) {
				var html = "";
				for (var i = 0; i < data.length; i++) {
					html += '<label class="div-label"><input type="radio" name="'+name+'" value="'+data[i][valueField]+'"><span>'+data[i][textField]+'</span></label>';
				}
				$(this).html(html);
			} else if (typeof data == "string") {
				$(this).html(data);
			}
			return this;
		},
		"cmsRadio": function(cfg, callback){
			if ($.isFunction($(this).iCheck)) {
				$(this).iCheck({
					radioClass: 'iradio_flat-blue',
					increaseArea: '20%'
				});
				if (cfg && cfg.isDisabled) {
					$(this).iCheck(!!cfg.isDisabled ? "disable" : "enable");
				}
			}
			$.isFunction(callback) && callback();
			return this;
		},
		"cmsGetRadioValue": function(){
			return $(this).find("input[type=radio]:checked").val();
		},
		"cmsSetRadioValue": function(value){
			var iCheckLoaded = $.isFunction($(this).iCheck);
			$(this).find("input[type=radio]").each(function(index, item){
				if ($(item).val() == value) {
					iCheckLoaded ? $(item).iCheck('check') : $(item).attr("checked", true);
				} else {
					iCheckLoaded ? $(item).iCheck('uncheck') : $(item).attr("checked", false);
				}
			});
			return this;
		},
		"cmsEnter": function(callback) {
			if ($.isFunction(callback)) {
				$(this).keydown(function(evt){
					if (evt.keyCode == 13) {
						callback.call(this, evt);
					}
				});
			}
		}
	});
})(jQuery);

$(document).ready(function(){
	$.cmsInit();
	window.logout = $.logout;
});