(function(){var a="sproutcore/standard_theme";if(!SC.BUNDLE_INFO){throw"SC.BUNDLE_INFO is not defined!"
}if(SC.BUNDLE_INFO[a]){return}SC.BUNDLE_INFO[a]={requires:["sproutcore/empty_theme"],styles:["/static/sproutcore/standard_theme/en/8b65428a7dcfa2226586b487bde1bf11560de2aa/stylesheet-packed.css","/static/sproutcore/standard_theme/en/8b65428a7dcfa2226586b487bde1bf11560de2aa/stylesheet.css"],scripts:["/static/sproutcore/standard_theme/en/8b65428a7dcfa2226586b487bde1bf11560de2aa/javascript-packed.js"]}
})();Dashboard=SC.Application.create({NAMESPACE:"Dashboard",VERSION:"0.1.0",updatedAt:null,viewDates:0,viewDatesDidChange:function(){this.invokeLater(function(){Dashboard.statechart.sendAction("changeSource")
},0)}.observes("viewDates"),local:SC.UserDefaults.create({appDomain:"shifts"}),statechart:Ki.Statechart.create({trace:true,rootState:Ki.State.design({initialSubstate:"ZOOMEDOUT",enterState:function(){Dashboard.mainPage.get("mainPane").append();
Dashboard.setFontSize(Dashboard.local.get("fontSize"));Dashboard.sources.set("content",[SC.Object.create({name:"CSS NSW/ACT/VIC",sources:["EDHEAL","EDHEALACT","EDHEALVIC"]}),SC.Object.create({name:"CSS QLD",sources:["EDHEALQLD"]}),SC.Object.create({name:"CSS SA/NT",sources:["EDHEALSA","EDHEALNT"]}),SC.Object.create({name:"ALL",sources:[]})]);
Dashboard._timer=SC.Timer.schedule({target:Dashboard,action:"requestShifts",interval:30000,repeats:true});
Dashboard.requestShifts();Dashboard.scroll()},updatedClient:function(a){alert("updatedClient called")
},response:function(d){var c=d.get("response"),i=c.entries,b=c.totals,h={},g,f,e,a=[];
b.forEach(function(j){h[j.company]=j});Dashboard.sources.set("weeklyShifts",h);for(g=0,f=i.length;
g<f;++g){e=i[g];a.push(Dashboard.Shift.create(e))}Dashboard.set("updatedAt",SC.DateTime.create()._ms);
Dashboard._shifts=a;a=Dashboard.computeFilteredShifts(a);Dashboard.shifts.set("content",a);
Dashboard.resetScroll()},changeSource:function(b){var c=Dashboard.sources.get("names"),a;
Dashboard.set("names",c);a=Dashboard.computeFilteredShifts(Dashboard._shifts);Dashboard.shifts.set("content",a);
Dashboard.resetScroll()},bigger:function(){},ZOOMEDOUT:Ki.State.design({enterState:function(){var b=Dashboard.mainPage.get("mainPane"),a;
b.get("sources").set("isVisible",true);a=b.getPath("shiftsHeader.layout");a.left=150;
b.get("shiftsHeader").propertyDidChange("layout");a=b.getPath("shifts.layout");a.left=150;
b.get("shifts").propertyDidChange("layout")},zoomView:function(a){this.gotoState("ZOOMEDIN")
}}),ZOOMEDIN:Ki.State.design({enterState:function(){var b=Dashboard.mainPage.get("mainPane"),a;
b.get("sources").set("isVisible",false);a=b.getPath("shiftsHeader.layout");a.left=10;
b.get("shiftsHeader").propertyDidChange("layout");a=b.getPath("shifts.layout");a.left=10;
b.get("shifts").propertyDidChange("layout")},zoomView:function(a){this.gotoState("ZOOMEDOUT")
}})})}),_shifts:[],computeFilteredShifts:function(g){var h=this.get("names"),d=this.get("viewDates"),b,e,j=false,k,i,f,c,a=[];
if(d){b=SC.DateTime.create({hour:0})._ms;e=SC.DateTime.create({hour:0}).advance({day:d})._ms
}if(h.length===0){j=true}for(i=0,f=g.length;i<f;++i){c=g[i];k=c.get("shiftAt");if((j||h.indexOf(c.get("source"))!==-1)&&(!d||(k>=b&&k<=e))){a.push(c)
}}return a},names:[],requestShifts:function(){console.log("requesting shifts");SC.Request.getUrl("/api/v2").notify(200,this,function(a){Dashboard.statechart.invokeStateMethod("response",a)
}).set("isJSON",true).send()},lastMouse:0,scrollTime:8000,scrollDistance:1000,delay:3000,scroll:function(){var e=performance.now(),f=e-Dashboard.lastMouse;
delay=Dashboard.delay;if(f>delay){var d=Dashboard.mainPage.getPath("mainPane.shifts").get("layer"),a=d.offsetHeight,b=d.scrollHeight,g=d.scrollTop,h=f-delay,c=h/Dashboard.scrollTime;
d.scrollTop=Dashboard.scrollDistance*c;if(d.scrollTop<b-a){requestAnimationFrame(Dashboard.scroll)
}else{console.log("Reached the bottom");setTimeout(Dashboard.resetScroll,1500);setTimeout(Dashboard.scroll,500)
}}else{setTimeout(Dashboard.scroll,500)}},resetScroll:function(){var a=Dashboard.mainPage.getPath("mainPane.shifts").get("layer");
Dashboard.lastMouse=performance.now();a.scrollTop=0},_currentFontSize:100,setFontSize:function(a){if(!a){a="100"
}a=parseInt(a,10);this._currentFontSize=a;Dashboard.local.set("fontSize",a)}});Dashboard.sources=SC.ArrayController.create({orderBy:"name",allowsEmptySelection:false,allowsMultipleSelection:false,names:function(){var b=Dashboard.sources.get("selection"),a=b?b.firstObject():null,c=a?a.get("sources"):[];
return c}.property("selection").cacheable(),weeklyShifts:null,weeklyShiftsString:function(){var e="Weekly Bookings: %@",h=this.get("names"),g=this.get("weeklyShifts"),c=null,f="",b=false;
function a(i){return Math.round(parseInt(i,10)/100)/100}if(g===null){}else{if(h.length===0){for(var d in g){if(g.hasOwnProperty(d)){c=g[d];
f+=c.user_2+": <span class='number'>"+a(c.user_1)+"</span> "}}}else{h.forEach(function(i){c=g[i];
f+=c.user_2+": <span class='number'>"+a(c.user_1)+"</span> "})}}return e.fmt(f)}.property("weeklyShifts","names").cacheable()});
sc_require("controllers/sources");Dashboard.shifts=SC.ArrayController.create({orderBy:["roster_date","start_time"]});
var THIRTY_MINUTES=30*60*1000;var TIMEZONE_OFFSET=-(new Date().getTimezoneOffset()/60);
if(TIMEZONE_OFFSET>0){if(String(TIMEZONE_OFFSET).length===1){TIMEZONE_OFFSET="+0"+TIMEZONE_OFFSET+":00"
}else{TIMEZONE_OFFSET="+"+TIMEZONE_OFFSET+":00"}}else{if(String(TIMEZONE_OFFSET).length===2){TIMEZONE_OFFSET="-0"+(-TIMEZONE_OFFSET)+":00"
}else{TIMEZONE_OFFSET=TIMEZONE_OFFSET+":00"}}console.log(TIMEZONE_OFFSET);Dashboard.Shift=SC.Object.extend({status:function(){var a=Dashboard.get("updatedAt"),b=this.get("updatedAt");
if(b&&((a-b)>THIRTY_MINUTES)){return 2}else{return 0}}.property("updatedAt").cacheable(),shiftAt:function(){var a=this.roster_date+" "+this.start_time.slice(0,-8)+TIMEZONE_OFFSET;
return SC.DateTime.parse(a,"%Y-%m-%d %H:%M:%S%Z")._ms}.property(),updatedAt:function(){if(!this.call_taken_date||!this.call_taken_time){return 0
}else{return this.get("callTaken")}}.property(),date:function(b,c){var a=this.call_taken_date.split("-");
return[a[2],a[1],a[0].slice(2)].join("/")}.property().cacheable(),callTaken:function(a,c){var b=this.call_taken_date+" "+this.call_taken_time.slice(0,-8)+TIMEZONE_OFFSET;
return SC.DateTime.parse(b,"%Y-%m-%d %H:%M:%S%Z")._ms}.property().cacheable(),timeEntered:function(){return SC.DateTime.create(this.get("callTaken")).adjust({timezone:new Date().getTimezoneOffset()}).toFormattedString("%H:%M")
}.property("callTaken").cacheable(),dateAndTimeEntered:function(){return this.getEach("date","timeEntered").join(" - ")
}.property("date","timeEntered").cacheable(),clientName:function(a,b){return this.client_name
}.property().cacheable(),siteName:function(a,b){return this.client_name}.property().cacheable(),due:function(a,b){return this.start_time
}.property().cacheable(),employeeName:function(a,b){return this.employee_name}.property().cacheable(),finish:function(a,b){return this.finish_time
}.property().cacheable(),shiftDate:function(b,c){var a=this.roster_date.split("-");
return[a[2],a[1],a[0].slice(2)].join("/")}.property().cacheable(),shiftTime:function(a,b){return this.start_time.slice(0,-11)+"-"+this.finish_time.slice(0,-11)
}.property().cacheable()});Dashboard.CollectionView=SC.CollectionView.extend({useStaticLayout:YES});
Dashboard.RowView=SC.View.extend(SC.ContentDisplay,{tagName:"div",classNames:"dashboard-row",useStaticLayout:true,contentDisplayProperties:"dateAndTimeEntered siteName shiftDate shiftTime employeeName update".w(),render:function(d,g){var f=this.get("content"),e=this.get("contentDisplayProperties"),b,a,c;
d.push('<span class="dashboard-cell idx">',this.get("contentIndex")+1,"</span>");
for(b=0,a=e.length;b<a;++b){c=e[b];d.push('<span class="dashboard-cell ',c,'">',this.transform(c,f.get(c)),"</span>")
}d.addClass(this._statusClasses[f.get("status")])},_statusClasses:["white","green","red"],transform:function(a,b){switch(a){case"due":return b.slice(0,-11);
default:return b}}});Dashboard.ScrollView=SC.View.extend({classNames:["scrollbars"],childViews:["contentView"]});
Dashboard.SourceView=SC.View.extend(SC.ContentDisplay,{tagName:"li",useStaticLayout:true,classNames:"source",displayProperties:"isSelected",render:function(a,c){var b=this.get("content");
a.push(b.get("name"));if(this.get("isSelected")){a.addClass("sel")}}});Dashboard.mainPage=SC.Page.design({shifts:SC.outlet("mainPane.shifts.contentView"),mainPane:SC.MainPane.design({defaultResponder:"Dashboard.statechart",childViews:"appTitle weekly sources shifts shiftsHeader updated dates refresh zoom currentSource speed speedDisplay".w(),appTitle:SC.LabelView.design({layout:{top:5,left:160,height:30},tagName:"div",layerId:"title",value:"Shifts Dashboard"}),weekly:SC.LabelView.design({layout:{top:8,left:420,right:5,height:30},valueBinding:"Dashboard.sources.weeklyShiftsString",layerId:"weekly-shifts",textAlign:SC.ALIGN_CENTER,escapeHTML:false}),sources:Dashboard.ScrollView.design({layout:{top:35,width:130,left:10,bottom:30},contentView:Dashboard.CollectionView.design({tagName:"ul",layerId:"sources",contentBinding:"Dashboard.sources.arrangedObjects",selectionBinding:"Dashboard.sources.selection",useToggleSelection:true,mouseUp:function(a){this.invokeLater(function(){Dashboard.statechart.invokeStateMethod("changeSource")
},0);return arguments.callee.base.apply(this,arguments)},exampleView:Dashboard.SourceView})}),currentSource:SC.LabelView.design({layout:{left:10,bottom:5,height:20,width:120},valueBinding:"Dashboard.sources*selection.firstObject.name"}),shiftsHeader:Dashboard.ScrollView.design({layout:{top:35,left:150,right:10,height:25},layerId:"no-scroll",classNames:"borders",contentView:Dashboard.CollectionView.design({classNames:"dashboard-table",contentBinding:"Dashboard.shifts.arrangedObjects",exampleView:Dashboard.RowView,render:function(d,f){if(f){var e=Dashboard.RowView.prototype.contentDisplayProperties.copy(),b,a,c;
e.unshift("#");d.push('<div class="dashboard-header-group">','<div class="dashboard-row">');
for(b=0,a=e.length;b<a;++b){c=e[b];if(c==="dateAndTimeEntered"){c="Date/Time Actioned"
}d.push('<span class="dashboard-cell">',c.replace(SC.STRING_DECAMELIZE_REGEXP,"$1 $2").capitalize(),"</span>")
}d.push("</div></div>");arguments.callee.base.apply(this,arguments)}else{arguments.callee.base.apply(this,arguments)
}}})}),shifts:Dashboard.ScrollView.design({layout:{top:35,left:150,right:10,bottom:30},classNames:"borders",mouseMoved:function(){Dashboard.lastMouse=performance.now()
},contentView:Dashboard.CollectionView.design({classNames:"dashboard-table",contentBinding:"Dashboard.shifts.arrangedObjects",exampleView:Dashboard.RowView,render:function(d,f){if(f){var e=Dashboard.RowView.prototype.contentDisplayProperties.copy(),b,a,c;
e.unshift("#");d.push('<div class="dashboard-header-group" style="visibility: hidden">','<div class="dashboard-row">');
for(b=0,a=e.length;b<a;++b){c=e[b];if(c==="dateAndTimeEntered"){c="Date/Time Actioned"
}d.push('<span class="dashboard-cell">',c.replace(SC.STRING_DECAMELIZE_REGEXP,"$1 $2").capitalize(),"</span>")
}d.push("</div></div>");arguments.callee.base.apply(this,arguments)}else{arguments.callee.base.apply(this,arguments)
}}})}),updated:SC.LabelView.design({layout:{left:160,bottom:5,height:20,width:200},valueBinding:SC.Binding.transform(function(a,b){return(a)?"Grid updated at: "+SC.DateTime.create(a).toFormattedString("%d/%m/%y %H:%M:%S"):"Fetching data for grid..."
}).from("Dashboard.updatedAt")}),dates:SC.SegmentedView.extend({layout:{width:300,height:24,right:520,bottom:5},itemTitleKey:"title",itemValueKey:"value",items:[{title:"All",value:0},{title:"Today",value:1},{title:"2 Days",value:2},{title:"4 Days",value:4},{title:"7 Days",value:7}],valueBinding:"Dashboard.viewDates"}),refresh:SC.ButtonView.design({layout:{width:80,bottom:5,height:23,right:10},title:"Refresh",action:"requestShifts",target:Dashboard}),zoom:SC.ButtonView.design({layout:{width:80,bottom:5,height:23,right:100},title:"Zoom",action:"zoomView"}),speed:SC.SliderView.extend({layout:{width:250,height:18,bottom:5,right:250},displayValue:"Speed",valueBinding:"Dashboard.scrollTime",minimum:5000,maximum:40000,step:1000}),speedDisplay:SC.LabelView.design({layout:{width:40,height:18,bottom:5,right:200},valueBinding:SC.Binding.oneWay("Dashboard.scrollTime").transform(function(a){return a/1000
})}),bigger:SC.ButtonView.design({layout:{width:80,bottom:5,height:23,right:300},title:"+",action:"bigger"}),smaller:SC.ButtonView.design({layout:{width:80,bottom:5,height:23,right:200},title:"-",action:"smaller"})})});
function main(){(function(){var b=0;var c=["ms","moz","webkit","o"];for(var a=0;a<c.length&&!window.requestAnimationFrame;
++a){window.requestAnimationFrame=window[c[a]+"RequestAnimationFrame"];window.cancelAnimationFrame=window[c[a]+"CancelAnimationFrame"]||window[c[a]+"CancelRequestAnimationFrame"]
}if(!window.requestAnimationFrame){window.requestAnimationFrame=function(h,e){var d=new Date().getTime();
var f=Math.max(0,16-(d-b));var g=window.setTimeout(function(){h(d+f)},f);b=d+f;return g
}}if(!window.cancelAnimationFrame){window.cancelAnimationFrame=function(d){clearTimeout(d)
}}window.performance=window.performance||{};performance.now=(function(){return performance.now||performance.mozNow||performance.msNow||performance.oNow||performance.webkitNow||function(){return Date.now()
}})()}());document.title="Shifts Dashboard";Dashboard.statechart.initStatechart()
};