window.Ki=window.Ki||SC.Object.create();window.KI=window.KI||window.Ki;Ki.State=SC.Object.extend({name:null,parentState:null,historyState:null,initialSubstate:null,substatesAreConcurrent:NO,substates:null,statechart:null,stateIsInitialized:NO,currentSubstates:null,trace:function(){var a=this.getPath("statechart.statechartTraceKey");
return this.getPath("statechart.%@".fmt(a))}.property().cacheable(),owner:function(){var c=this.get("statechart"),b=c?c.get("statechartOwnerKey"):null,a=c?c.get(b):null;
return a?a:c}.property().cacheable(),init:function(){arguments.callee.base.apply(this,arguments);
this._registeredEventHandlers={};this._registeredStringEventHandlers={};this._registeredRegExpEventHandlers=[];
var b=this.get("statechart"),c=b?b.get("statechartOwnerKey"):null,a=b?b.get("statechartTraceKey"):null;
if(b){b.addObserver(c,this,"_statechartOwnerDidChange");b.addObserver(a,this,"_statechartTraceDidChange")
}},destroy:function(){var c=this.get("statechart"),d=c?c.get("statechartOwnerKey"):null,a=c?c.get("statechartTraceKey"):null;
if(c){c.removeObserver(d,this,"_statechartOwnerDidChange");c.removeObserver(a,this,"_statechartTraceDidChange")
}var b=this.get("substates");if(b){b.forEach(function(e){e.destroy()})}this.set("substates",null);
this.set("currentSubstates",null);this.set("parentState",null);this.set("historyState",null);
this.set("initialSubstate",null);this.set("statechart",null);this.notifyPropertyChange("trace");
this.notifyPropertyChange("owner");arguments.callee.base.apply(this,arguments)},initState:function(){if(this.get("stateIsInitialized")){return
}this._registerWithParentStates();var l=null,k=null,b=null,m=[],j=NO,h=this.get("initialSubstate"),f=this.get("substatesAreConcurrent"),d=this.get("statechart"),c=0,g=0,e=NO,a=null;
if(SC.kindOf(h,Ki.HistoryState)&&h.isClass){a=this.createHistoryState(h,{parentState:this,statechart:d});
this.set("initialSubstate",a);if(SC.none(a.get("defaultState"))){this.stateLogError("Initial substate is invalid. History state requires the name of a default state to be set");
this.set("initialSubstate",null);a=null}}for(l in this){k=this[l];e=SC.typeOf(k)===SC.T_FUNCTION;
if(e&&k.isEventHandler){this._registerEventHandler(l,k);continue}if(e&&k.statePlugin){k=k.apply(this)
}if(SC.kindOf(k,Ki.State)&&k.isClass&&this[l]!==this.constructor){b=this.createSubstate(k,{name:l,parentState:this,statechart:d});
m.push(b);this[l]=b;b.initState();if(l===h){this.set("initialSubstate",b);j=YES}else{if(a&&a.get("defaultState")===l){a.set("defaultState",b);
j=YES}}}}if(!SC.none(h)&&!j){this.stateLogError("Unable to set initial substate %@ since it did not match any of state's %@ substates".fmt(h,this))
}if(m.length===0){if(!SC.none(h)){this.stateLogWarning("Unable to make %@ an initial substate since state %@ has no substates".fmt(h,this))
}}else{if(m.length>0){if(SC.none(h)&&!f){b=this.createEmptyState({parentState:this,statechart:d});
this.set("initialSubstate",b);m.push(b);this[b.get("name")]=b;b.initState();this.stateLogWarning("state %@ has no initial substate defined. Will default to using an empty state as initial substate".fmt(this))
}else{if(!SC.none(h)&&f){this.set("initialSubstate",null);this.stateLogWarning("Can not use %@ as initial substate since substates are all concurrent for state %@".fmt(h,this))
}}}}this.set("substates",m);this.set("currentSubstates",[]);this.set("stateIsInitialized",YES)
},createSubstate:function(b,a){return b.create(a)},createHistoryState:function(b,a){return b.create(a)
},createEmptyState:function(a){return Ki.EmptyState.create(a)},_registerEventHandler:function(b,e){var d=e.events,f=null,a=d.length,c=0;
this._registeredEventHandlers[b]=e;for(;c<a;c+=1){f=d[c];if(SC.typeOf(f)===SC.T_STRING){this._registeredStringEventHandlers[f]={name:b,handler:e};
continue}if(f instanceof RegExp){this._registeredRegExpEventHandlers.push({name:b,handler:e,regexp:f});
continue}this.stateLogError("Invalid event %@ for event handler %@ in state %@".fmt(f,b,this))
}},_registerWithParentStates:function(){this._registerSubstate(this);var a=this.get("parentState");
while(!SC.none(a)){a._registerSubstate(this);a=a.get("parentState")}},_registerSubstate:function(b){var c=b.pathRelativeTo(this);
if(SC.none(c)){return}if(SC.none(this._registeredSubstatePaths)){this._registeredSubstatePaths={};
this._registeredSubstates=[]}this._registeredSubstates.push(b);var a=this._registeredSubstatePaths;
if(a[b.get("name")]===undefined){a[b.get("name")]={__ki_paths__:[]}}var d=a[b.get("name")];
d[c]=b;d.__ki_paths__.push(c)},pathRelativeTo:function(b){var c=this.get("name"),a=this.get("parentState");
while(!SC.none(a)&&a!==b){c="%@.%@".fmt(a.get("name"),c);a=a.get("parentState")}if(a!==b&&b!==this){this.stateLogError("Can not generate relative path from %@ since it not a parent state of %@".fmt(b,this));
return null}return c},getSubstate:function(c){var f=SC.typeOf(c);if(f===SC.T_OBJECT){return this._registeredSubstates.indexOf(c)>-1?c:null
}if(f!==SC.T_STRING){this.stateLogError("Can not find matching subtype. value must be an object or string: %@".fmt(c));
return null}var b=c.match(/(^|\.)(\w+)$/);if(!b){return null}var e=this._registeredSubstatePaths[b[2]];
if(SC.none(e)){return null}var a=e[c];if(!SC.none(a)){return a}if(b[1]===""){if(e.__ki_paths__.length===1){return e[e.__ki_paths__[0]]
}if(e.__ki_paths__.length>1){var d="Can not find substate matching %@ in state %@. Ambiguous with the following: %@";
this.stateLogError(d.fmt(c,this,e.__ki_paths__))}}return null},gotoState:function(b,a){var c=null;
if(this.get("isCurrentState")){c=this}else{if(this.get("hasCurrentSubstates")){c=this.get("currentSubstates")[0]
}}this.get("statechart").gotoState(b,c,a)},gotoHistoryState:function(c,a,b){var d=null;
if(this.get("isCurrentState")){d=this}else{if(this.get("hasCurrentSubstates")){d=this.get("currentSubstates")[0]
}}this.get("statechart").gotoHistoryState(c,d,a,b)},resumeGotoState:function(){this.get("statechart").resumeGotoState()
},stateIsCurrentSubstate:function(a){if(SC.typeOf(a)===SC.T_STRING){a=this.get("statechart").getState(a)
}return this.get("currentSubstates").indexOf(a)>=0},isRootState:function(){return this.getPath("statechart.rootState")===this
}.property(),isCurrentState:function(){return this.stateIsCurrentSubstate(this)}.property().cacheable(),isConcurrentState:function(){return this.getPath("parentState.substatesAreConcurrent")
}.property(),hasSubstates:function(){return this.getPath("substates.length")>0}.property("substates"),hasCurrentSubstates:function(){var a=this.get("currentSubstates");
return !SC.none(a)&&a.get("length")>0}.property("currentSubstates"),reenter:function(){var a=this.get("statechart");
if(this.get("isCurrentState")){a.gotoState(this)}else{SC.Logger.error("Can not re-enter state %@ since it is not a current state in the statechart".fmt(this))
}},tryToHandleEvent:function(f,c,b){var g=this.get("trace");if(this._registeredEventHandlers[f]){this.stateLogWarning("state %@ can not handle event %@ since it is a registered event handler".fmt(this,f));
return NO}if(SC.typeOf(this[f])===SC.T_FUNCTION){if(g){this.stateLogTrace("will handle event %@".fmt(f))
}return(this[f](c,b)!==NO)}var e=this._registeredStringEventHandlers[f];if(e){if(g){this.stateLogTrace("%@ will handle event %@".fmt(e.name,f))
}return(e.handler.call(this,f,c,b)!==NO)}var a=this._registeredRegExpEventHandlers.length,d=0;
for(;d<a;d+=1){e=this._registeredRegExpEventHandlers[d];if(f.match(e.regexp)){if(g){this.stateLogTrace("%@ will handle event %@".fmt(e.name,f))
}return(e.handler.call(this,f,c,b)!==NO)}}if(SC.typeOf(this["unknownEvent"])===SC.T_FUNCTION){if(g){this.stateLogTrace("unknownEvent will handle event %@".fmt(f))
}return(this.unknownEvent(f,c,b)!==NO)}return NO},enterState:function(a){},exitState:function(a){},performAsync:function(c,b,a){return Ki.Async.perform(c,b,a)
},respondsToEvent:function(d){if(this._registeredEventHandlers[d]){return false}if(SC.typeOf(this[d])===SC.T_FUNCTION){return true
}if(this._registeredStringEventHandlers[d]){return true}var a=this._registeredRegExpEventHandlers.length,b=0,c;
for(;b<a;b+=1){c=this._registeredRegExpEventHandlers[b];if(d.match(c.regexp)){return true
}}return SC.typeOf(this["unknownEvent"])===SC.T_FUNCTION},fullPath:function(){var a=this.getPath("statechart.rootState");
if(!a){return this.get("name")}return this.pathRelativeTo(a)}.property("name","parentState").cacheable(),toString:function(){var a=SC._object_className(this.constructor);
return"%@<%@, %@>".fmt(a,this.get("fullPath"),SC.guidFor(this))},_statechartTraceDidChange:function(){this.notifyPropertyChange("trace")
},_statechartOwnerDidChange:function(){this.notifyPropertyChange("owner")},stateLogTrace:function(b){var a=this.get("statechart");
a.statechartLogTrace("%@: %@".fmt(this,b))},stateLogWarning:function(b){var a=this.get("statechart");
a.statechartLogWarning(b)},stateLogError:function(b){var a=this.get("statechart");
a.statechartLogError(b)}});Ki.State.plugin=function(c){var a=SC.A(arguments);a.shift();
var b=function(){var d=SC.objectForPropertyPath(c);return d.extend.apply(d,a)};b.statePlugin=YES;
return b};Ki.State.design=Ki.State.extend;Function.prototype.handleEvents=function(){this.isEventHandler=YES;
this.events=arguments;return this};Ki.HistoryState=SC.Object.extend({isRecursive:NO,defaultState:null,statechart:null,parentState:null,state:function(){var b=this.get("defaultState"),a=this.getPath("parentState.historyState");
return !!a?a:b}.property().cacheable(),parentHistoryStateDidChange:function(){this.notifyPropertyChange("state")
}.observes("*parentState.historyState")});Ki.EMPTY_STATE_NAME="__EMPTY_STATE__";Ki.EmptyState=Ki.State.extend({name:Ki.EMPTY_STATE_NAME,enterState:function(){this.stateLogWarning("No initial substate was defined for state %@. Entering default empty state".fmt(this.get("parentState")))
}});sc_require("system/state");Ki.StatechartManager={isResponderContext:YES,isStatechart:YES,statechartIsInitialized:NO,rootState:null,rootStateExample:Ki.State,initialState:null,statesAreConcurrent:NO,monitorIsActive:NO,monitor:null,statechartTraceKey:"trace",trace:NO,statechartOwnerKey:"owner",owner:null,autoInitStatechart:YES,suppressStatechartWarnings:NO,initMixin:function(){if(this.get("autoInitStatechart")){this.initStatechart()
}},destroyMixin:function(){var b=this.get("rootState"),a=this.get("statechartTraceKey");
this.removeObserver(a,this,"_statechartTraceDidChange");b.destroy();this.set("rootState",null)
},initStatechart:function(){if(this.get("statechartIsInitialized")){return}this._gotoStateLocked=NO;
this._sendEventLocked=NO;this._pendingStateTransitions=[];this._pendingSentEvents=[];
this.sendAction=this.sendEvent;if(this.get("monitorIsActive")){this.set("monitor",Ki.StatechartMonitor.create())
}var a=this.get("statechartTraceKey");this.addObserver(a,this,"_statechartTraceDidChange");
this._statechartTraceDidChange();var d=this.get("allowTracing"),c=this.get("rootState"),e;
if(d){this.statechartLogTrace("BEGIN initialize statechart")}if(!c){c=this._constructRootStateClass()
}else{if(SC.typeOf(c)===SC.T_FUNCTION&&c.statePlugin){c=c.apply(this)}}if(!(SC.kindOf(c,Ki.State)&&c.isClass)){e="Unable to initialize statechart. Root state must be a state class";
this.statechartLogError(e);throw e}c=this.createRootState(c,{statechart:this,name:Ki.ROOT_STATE_NAME});
this.set("rootState",c);c.initState();if(SC.kindOf(c.get("initialSubstate"),Ki.EmptyState)){e="Unable to initialize statechart. Root state must have an initial substate explicilty defined";
this.statechartLogError(e);throw e}if(!SC.empty(this.get("initialState"))){var b="initialState";
this.set(b,c.get(this.get(b)))}this.set("statechartIsInitialized",YES);this.gotoState(c);
if(d){this.statechartLogTrace("END initialize statechart")}},createRootState:function(b,a){if(!a){a={}
}b=b.create(a);return b},currentStates:function(){return this.getPath("rootState.currentSubstates")
}.property().cacheable(),firstCurrentState:function(){var a=this.get("currentStates");
return a?a.objectAt(0):null}.property("currentStates").cacheable(),currentStateCount:function(){return this.getPath("currentStates.length")
}.property("currentStates").cacheable(),stateIsCurrentState:function(a){return this.get("rootState").stateIsCurrentSubstate(a)
},doesContainState:function(a){return !SC.none(this.getState(a))},getState:function(a){return this.get("rootState").getSubstate(a)
},gotoState:function(b,k,l,c){if(!this.get("statechartIsInitialized")){this.statechartLogError("can not go to state %@. statechart has not yet been initialized".fmt(b));
return}if(this.get("isDestroyed")){this.statechartLogError("can not go to state %@. statechart is destroyed".fmt(this));
return}var i=this._processGotoStateArgs(arguments);b=i.state;k=i.fromCurrentState;
l=i.useHistory;c=i.context;var n=null,j=[],m=[],f=this.get("allowTracing"),a=this.get("rootState"),h=b,e=k;
b=a.getSubstate(b);if(SC.none(b)){this.statechartLogError("Can not to goto state %@. Not a recognized state in statechart".fmt(h));
return}if(this._gotoStateLocked){this._pendingStateTransitions.push({state:b,fromCurrentState:k,useHistory:l,context:c});
return}this._gotoStateLocked=YES;if(!SC.none(k)){k=a.getSubstate(k);if(SC.none(k)||!k.get("isCurrentState")){var d="Can not to goto state %@. %@ is not a recognized current state in statechart";
this.statechartLogError(d.fmt(h,e));this._gotoStateLocked=NO;return}}else{if(this.getPath("currentStates.length")>0){k=this.get("currentStates")[0]
}}if(f){this.statechartLogTrace("BEGIN gotoState: %@".fmt(b));this.statechartLogTrace("starting from current state: %@".fmt(k));
this.statechartLogTrace("current states before: %@".fmt(this.get("currentStates")))
}if(!SC.none(k)){j=this._createStateChain(k)}m=this._createStateChain(b);n=this._findPivotState(j,m);
if(n){if(f){this.statechartLogTrace("pivot state = %@".fmt(n))}if(n.get("substatesAreConcurrent")){this.statechartLogError("Can not go to state %@ from %@. Pivot state %@ has concurrent substates.".fmt(b,k,n));
this._gotoStateLocked=NO;return}}var g=[];this._traverseStatesToExit(j.shift(),j,n,g);
if(n!==b){this._traverseStatesToEnter(m.pop(),m,n,l,g)}else{this._traverseStatesToExit(n,[],null,g);
this._traverseStatesToEnter(n,null,null,l,g)}this._executeGotoStateActions(b,g,null,c)
},gotoStateActive:function(){return this._gotoStateLocked}.property(),gotoStateSuspended:function(){return this._gotoStateLocked&&!!this._gotoStateSuspendedPoint
}.property(),resumeGotoState:function(){if(!this.get("gotoStateSuspended")){this.statechartLogError("Can not resume goto state since it has not been suspended");
return}var a=this._gotoStateSuspendedPoint;this._executeGotoStateActions(a.gotoState,a.actions,a.marker,a.context)
},_executeGotoStateActions:function(g,f,b,c){var e=null,a=f.length,d=null;b=SC.none(b)?0:b;
for(;b<a;b+=1){e=f[b];switch(e.action){case Ki.EXIT_STATE:d=this._exitState(e.state,c);
break;case Ki.ENTER_STATE:d=this._enterState(e.state,e.currentState,c);break}if(SC.kindOf(d,Ki.Async)){this._gotoStateSuspendedPoint={gotoState:g,actions:f,marker:b+1,context:c};
d.tryToPerform(e.state);return}}this.notifyPropertyChange("currentStates");if(this.get("allowTracing")){this.statechartLogTrace("current states after: %@".fmt(this.get("currentStates")));
this.statechartLogTrace("END gotoState: %@".fmt(g))}this._gotoStateSuspendedPoint=null;
this._gotoStateLocked=NO;this._flushPendingStateTransition()},_exitState:function(d,b){if(d.get("currentSubstates").indexOf(d)>=0){var c=d.get("parentState");
while(c){c.get("currentSubstates").removeObject(d);c=c.get("parentState")}}if(this.get("allowTracing")){this.statechartLogTrace("exiting state: %@".fmt(d))
}d.set("currentSubstates",[]);d.notifyPropertyChange("isCurrentState");var a=this.exitState(d,b);
if(this.get("monitorIsActive")){this.get("monitor").pushExitedState(d)}d._traverseStatesToExit_skipState=NO;
return a},exitState:function(b,a){return b.exitState(a)},_enterState:function(d,e,b){var c=d.get("parentState");
if(c&&!d.get("isConcurrentState")){c.set("historyState",d)}if(e){c=d;while(c){c.get("currentSubstates").push(d);
c=c.get("parentState")}}if(this.get("allowTracing")){this.statechartLogTrace("entering state: %@".fmt(d))
}d.notifyPropertyChange("isCurrentState");var a=this.enterState(d,b);if(this.get("monitorIsActive")){this.get("monitor").pushEnteredState(d)
}return a},enterState:function(b,a){return b.enterState(a)},gotoHistoryState:function(f,e,c,d){if(!this.get("statechartIsInitialized")){this.statechartLogError("can not go to state %@'s history state. Statechart has not yet been initialized".fmt(f));
return}var b=this._processGotoStateArgs(arguments);f=b.state;e=b.fromCurrentState;
c=b.useHistory;d=b.context;f=this.getState(f);if(!f){this.statechartLogError("Can not to goto state %@'s history state. Not a recognized state in statechart".fmt(f));
return}var a=f.get("historyState");if(!c){if(a){this.gotoState(a,e,d)}else{this.gotoState(f,e,d)
}}else{this.gotoState(f,e,YES,d)}},sendEvent:function(b,g,f){if(this.get("isDestroyed")){this.statechartLogError("can send event %@. statechart is destroyed".fmt(b));
return}var c=NO,k=NO,h=this.get("currentStates").slice(),j=0,e=0,a=null,d=this.get("allowTracing");
if(this._sendEventLocked||this._goStateLocked){this._pendingSentEvents.push({event:b,arg1:g,arg2:f});
return}this._sendEventLocked=YES;if(d){this.statechartLogTrace("BEGIN sendEvent: event<%@>".fmt(b))
}j=h.get("length");for(;e<j;e+=1){k=NO;a=h[e];if(!a.get("isCurrentState")){continue
}while(!k&&a){k=a.tryToHandleEvent(b,g,f);if(!k){a=a.get("parentState")}else{c=YES
}}}this._sendEventLocked=NO;if(d){if(!c){this.statechartLogTrace("No state was able handle event %@".fmt(b))
}this.statechartLogTrace("END sendEvent: event<%@>".fmt(b))}var l=this._flushPendingSentEvents();
return c?this:(l?this:null)},_createStateChain:function(b){var a=[];while(b){a.push(b);
b=b.get("parentState")}return a},_findPivotState:function(c,b){if(c.length===0||b.length===0){return null
}var a=c.find(function(e,d){if(b.indexOf(e)>=0){return YES}});return a},_traverseStatesToExit:function(b,k,d,h){if(!b||b===d){return
}var e=this.get("allowTracing");if(b.get("substatesAreConcurrent")){var f=0,g=b.get("currentSubstates"),j=g.length,c=null;
for(;f<j;f+=1){c=g[f];if(c._traverseStatesToExit_skipState===YES){continue}var a=this._createStateChain(c);
this._traverseStatesToExit(a.shift(),a,b,h)}}h.push({action:Ki.EXIT_STATE,state:b});
if(b.get("isCurrentState")){b._traverseStatesToExit_skipState=YES}this._traverseStatesToExit(k.shift(),k,d,h)
},_traverseStatesToEnter:function(b,e,i,g,d){if(!b){return}var c=this.get("allowTracing");
if(i){if(b!==i){this._traverseStatesToEnter(e.pop(),e,i,g,d)}else{this._traverseStatesToEnter(e.pop(),e,null,g,d)
}}else{if(!e||e.length===0){var h={action:Ki.ENTER_STATE,state:b,currentState:NO};
d.push(h);var f=b.get("initialSubstate"),a=b.get("historyState");if(b.get("substatesAreConcurrent")){this._traverseConcurrentStatesToEnter(b.get("substates"),null,g,d)
}else{if(b.get("hasSubstates")&&a&&g){this._traverseStatesToEnter(a,null,null,g,d)
}else{if(f){if(SC.kindOf(f,Ki.HistoryState)){if(!g){g=f.get("isRecursive")}f=f.get("state")
}this._traverseStatesToEnter(f,null,null,g,d)}else{h.currentState=YES}}}}else{if(e.length>0){d.push({action:Ki.ENTER_STATE,state:b});
var j=e.pop();this._traverseStatesToEnter(j,e,null,g,d);if(b.get("substatesAreConcurrent")){this._traverseConcurrentStatesToEnter(b.get("substates"),j,g,d)
}}}}},respondsTo:function(d){var b=this.get("currentStates"),a=b.get("length"),c=0,e=null;
for(;c<a;c+=1){e=b.objectAt(c);while(e){if(e.respondsToEvent(d)){return true}e=e.get("parentState")
}}return SC.typeOf(this[d])===SC.T_FUNCTION},tryToPerform:function(c,b,a){if(this.respondsTo(c)){if(SC.typeOf(this[c])===SC.T_FUNCTION){return(this[c](b,a)!==NO)
}else{return !!this.sendEvent(c,b,a)}}return NO},invokeStateMethod:function(k,j,c){if(k==="unknownEvent"){this.statechartLogError("can not invoke method unkownEvent");
return}j=SC.A(arguments);j.shift();var f=j.length,m=f>0?j[f-1]:null,l=SC.typeOf(m)===SC.T_FUNCTION?j.pop():null,e=this.get("currentStates"),d=0,b=null,h={},a,n=undefined,g=0;
f=e.get("length");for(;d<f;d+=1){b=e.objectAt(d);while(b){if(h[b.get("fullPath")]){break
}h[b.get("fullPath")]=YES;a=b[k];if(SC.typeOf(a)===SC.T_FUNCTION&&!a.isEventHandler){n=a.apply(b,j);
if(l){l.call(this,b,n)}g+=1;break}b=b.get("parentState")}}return g===1?n:undefined
},_traverseConcurrentStatesToEnter:function(d,c,f,b){var e=0,a=d.length,g=null;for(;
e<a;e+=1){g=d[e];if(g!==c){this._traverseStatesToEnter(g,null,null,f,b)}}},_flushPendingStateTransition:function(){if(!this._pendingStateTransitions){this.statechartLogError("Unable to flush pending state transition. _pendingStateTransitions is invalid");
return}var a=this._pendingStateTransitions.shift();if(!a){return}this.gotoState(a.state,a.fromCurrentState,a.useHistory,a.context)
},_flushPendingSentEvents:function(){var a=this._pendingSentEvents.shift();if(!a){return null
}return this.sendEvent(a.event,a.arg1,a.arg2)},_monitorIsActiveDidChange:function(){if(this.get("monitorIsActive")&&SC.none(this.get("monitor"))){this.set("monitor",Ki.StatechartMonitor.create())
}}.observes("monitorIsActive"),_processGotoStateArgs:function(b){var d={state:null,fromCurrentState:null,useHistory:false,context:null},a=null,c=null;
b=SC.$A(b);b=b.filter(function(e){return !(e===undefined)});a=b.length;if(a<1){return d
}d.state=b[0];if(a===2){c=b[1];switch(SC.typeOf(c)){case SC.T_BOOL:d.useHistory=c;
break;case SC.T_HASH:d.context=c;break;default:d.fromCurrentState=c}}else{if(a===3){c=b[1];
if(SC.typeOf(c)===SC.T_BOOL){d.useHistory=c;d.context=b[2]}else{d.fromCurrentState=c;
c=b[2];if(SC.typeOf(c)===SC.T_BOOL){d.useHistory=c}else{d.context=c}}}else{d.fromCurrentState=b[1];
d.useHistory=b[2];d.context=b[3]}}return d},_constructRootStateClass:function(){var d="rootStateExample",e=this.get(d),b=this.get("initialState"),c=this.get("statesAreConcurrent"),a=0,i,g,f,h={};
if(SC.typeOf(e)===SC.T_FUNCTION&&e.statePlugin){e=e.apply(this)}if(!(SC.kindOf(e,Ki.State)&&e.isClass)){this._logStatechartCreationError("Invalid root state example");
return null}if(c&&!SC.empty(b)){this._logStatechartCreationError("Can not assign an initial state when states are concurrent")
}else{if(c){h.substatesAreConcurrent=YES}else{if(SC.typeOf(b)===SC.T_STRING){h.initialSubstate=b
}else{this._logStatechartCreationError("Must either define initial state or assign states as concurrent");
return null}}}for(i in this){if(i===d){continue}g=this[i];f=SC.typeOf(g)===SC.T_FUNCTION;
if(f&&g.statePlugin){g=g.apply(this)}if(SC.kindOf(g,Ki.State)&&g.isClass&&this[i]!==this.constructor){h[i]=g;
a+=1}}if(a===0){this._logStatechartCreationError("Must define one or more states");
return null}return e.extend(h)},_logStatechartCreationError:function(a){SC.Logger.error("Unable to create statechart for %@: %@.".fmt(this,a))
},statechartLogTrace:function(a){SC.Logger.info("%@: %@".fmt(this.get("statechartLogPrefix"),a))
},statechartLogError:function(a){SC.Logger.error("ERROR %@: %@".fmt(this.get("statechartLogPrefix"),a))
},statechartLogWarning:function(a){if(this.get("suppressStatechartWarnings")){return
}SC.Logger.warn("WARN %@: %@".fmt(this.get("statechartLogPrefix"),a))},statechartLogPrefix:function(){var b=SC._object_className(this.constructor),a=this.get("name"),c;
if(SC.empty(a)){c="%@<%@>".fmt(b,SC.guidFor(this))}else{c="%@<%@, %@>".fmt(b,a,SC.guidFor(this))
}return c}.property().cacheable(),allowTracing:function(){var a=this.get("statechartTraceKey");
return this.get(a)}.property().cacheable(),_statechartTraceDidChange:function(){this.notifyPropertyChange("allowTracing")
}};Ki.ROOT_STATE_NAME="__ROOT_STATE__";Ki.EXIT_STATE=0;Ki.ENTER_STATE=1;Ki.Statechart=SC.Object.extend(Ki.StatechartManager,{autoInitStatechart:NO});
Ki.Statechart.design=Ki.Statechart.extend;Ki.Async=SC.Object.extend({func:null,arg1:null,arg2:null,tryToPerform:function(d){var c=this.get("func"),b=this.get("arg1"),a=this.get("arg2"),e=SC.typeOf(c);
if(e===SC.T_STRING){d.tryToPerform(c,b,a)}else{if(e===SC.T_FUNCTION){c.apply(d,[b,a])
}}}});Ki.Async.mixin({perform:function(c,b,a){return Ki.Async.create({func:c,arg1:b,arg2:a})
}});if((typeof SC!=="undefined")&&SC&&SC.bundleDidLoad){SC.bundleDidLoad("ki/foundation");
/* @license
==========================================================================
Ki -- A Statechart Framework for Sproutcore
copyright 2010, 2011 Michael Cohen, and contributors. All rights reserved.

Some portions of the Ki framework were derived from the statechart 
framework in SproutCore whose original authors consist of Michael Ball, 
Evin Grano and Michael Cohen. 

Permission is hereby granted, free of charge, to any person obtaining a 
copy of this software and associated documentation files (the "Software"), 
to deal in the Software without restriction, including without limitation 
the rights to use, copy, modify, merge, publish, distribute, sublicense, 
and/or sell copies of the Software, and to permit persons to whom the 
Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in 
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR 
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, 
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE 
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER 
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING 
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER 
DEALINGS IN THE SOFTWARE.

For more information about SproutCore, visit http://github.com/FrozenCanuck/Ki

==========================================================================
@license */
}if((typeof SC!=="undefined")&&SC&&SC.bundleDidLoad){SC.bundleDidLoad("ki")
};