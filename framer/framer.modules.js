require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"framer_gsap":[function(require,module,exports){
(function (global){
/*!
 * VERSION: 1.2.0
 * DATE: 2016-07-14
 * UPDATES AND DOCS AT: http://greensock.com
 * 
 * This file is to be used as a simple template for writing your own plugin. See the 
 * TweenPlugin docs for more details.
 *
 * You can start by doing a search for "yourCustomProperty" and replace it with whatever the name
 * of your property is. This way of defining a plugin was introduced in version 1.9.0 - previous versions
 * of TweenLite won't work with this.
 *
 * @license Copyright (c) 2008-2016, GreenSock. All rights reserved.
 * This work is subject to the terms at http://greensock.com/standard-license or for
 * Club GreenSock members, the software agreement that was issued with your membership.
 * 
 * @author: Jack Doyle, jack@greensock.com
 **/
var _gsScope = (typeof(module) !== "undefined" && module.exports && typeof(global) !== "undefined") ? global : this || window; //helps ensure compatibility with AMD/RequireJS and CommonJS/Node
(_gsScope._gsQueue || (_gsScope._gsQueue = [])).push( function() {
  //ignore the line above this and at the very end - those are for ensuring things load in the proper order
  "use strict";

  _gsScope._gsDefine.plugin({
    propName: "yourCustomProperty", //the name of the property that will get intercepted and handled by this plugin 
    // (obviously change it to whatever you want, typically it is camelCase starting with lowercase).
    priority: 0, //the priority in the rendering pipeline (0 by default). 
    // A priority of -1 would mean this plugin will run after all those with 0 or greater. 
    // A priority of 1 would get run before 0, etc. This only matters when a plugin relies on other plugins 
    // finishing their work before it runs (or visa-versa)
    API: 2, //the API should stay 2 - it just gives us a way to know the method/property structure 
    // so that if in the future we change to a different TweenPlugin architecture, we can identify this plugin's structure.
    version: "1.0.0", //your plugin's version number
    overwriteProps: ["yourCustomProperty"], //an array of property names whose tweens should be overwritten by this plugin. 
    // For example, if you create a "scale" plugin that handles both "scaleX" and "scaleY", the overwriteProps 
    // would be ["scaleX","scaleY"] so that if there's a scaleX or scaleY tween in-progress when a new "scale" tween starts 
    // (using this plugin), it would overwrite the scaleX or scaleY tween.

    /*
     * The init function is called when the tween renders for the first time. This is where initial values should be recorded 
     * and any setup routines should run. It receives 3 parameters:
     *   1) target [object] - the target of the tween. In cases where the tween's original target is an array 
     * (or jQuery object), this target will be the individual object inside that array (a new plugin instance is created for 
     * each target in the array). For example, TweenLite.to([obj1, obj2, obj3], 1, {x:100}) the target will 
     * be obj1 or obj2 or obj3 rather than the array containing them.
     *   2) value [*] - whatever value is passed as the special property value. For example, TweenLite.to(element, 1, 
     * {yourCustomProperty:3}) the value would be 3. Or for 
     * TweenLite.to(element, 1, {yourCustomProperty:{subProp1:3, subProp2:"whatever"}});, value would be 
     * {subProp1:3, subProp2:"whatever"}.
     *   3) tween [TweenLite] - the TweenLite (or TweenMax) instance that is managing this plugin instance. 
     * This can be useful if you need to check certain state-related properties on the tween (maybe in the set method) 
     * like its duration or time. Most of the time, however, you don't need to do anything with the tween. 
     * It is provided just in case you want to reference it.
     *   4) index [integer] - the index number of the target in the tween. For example, if an array is passed in as 
     * the target (or selector text), this would be 0 for the first one, 1 for the second, 2 for the third, etc. 
     * This was introduced in GSAP 1.19.0
     *
     * This function should return true unless you want to have TweenLite/Max skip the plugin altogether and instead 
     * treat the property/value like a normal tween (as if the plugin wasn't activated). This is rarely useful, 
     * so you should almost always return true.
     */
    init: function(target, value, tween, index) {
      this._target = target; //we record the target so that we can refer to it in the set method when doing updates.

      /* Next, we create a property tween for "scaleX" and "scaleY" properties of our target
       * (we're just using them as a examples of how to set up a property tween with a name, start, and end value).
       * the _addTween() method accepts the following parameters:
       *   1) target [object] - target object whose property this tween will control.
       *   2) property [string] - the name of the property, like "scaleX" or "scaleY"
       *   3) start [number] - The starting value of the property. For example, if you're tweening from 0 to 100, 
       * start would be 0.
       *   4) end [number] - the ending value of the property. For example, if you're tweening from 0 to 100, end would be 100.
       *   5) overwriteProperty [string] - the name that gets registered as the overwrite property so that if 
       * another concurrent tween of the same target gets created and it is tweening a property with this name, 
       * this one will be overwritten. Typically this is the same as "property".
       *   6) round [boolean] - if true, the updated value on each update will be rounded to the nearest integer. 
       * [false by default]
       * You do NOT need to use _addTween() at all. It is merely a convenience. You can record your own values 
       * internally or whatever you want.
       */
      this._addTween(target, "scaleX", target.scaleX, value, "scaleX", false);
      this._addTween(target, "scaleY", target.scaleY, value, "scaleY", false);

      //now, just for kicks, we'll record the starting "alpha" value and amount of change so that we can manage 
      //this manually rather than _addTween() (again, totally fictitious, just for an example)
      this._alphaStart = target.alpha;
      this._alphaChange = value.alpha - target.alpha;

      //always return true unless we want to scrap the plugin and have the value treated as a normal property tween 
      //(very uncommon)
      return true;
    },

    //[optional] - called each time the values should be updated, and the ratio gets passed as the only parameter 
    //(typically it's a value between 0 and 1, but it can exceed those when using an ease like Elastic.easeOut 
    //or Back.easeOut, etc.). If you're using this._super._addTween() for all your tweens and you don't need to 
    //do anything special on each frame besides updating those values, you can omit this "set" function altogether.
    set: function(ratio) {
      //since we used _addTween() inside init function, it created some property tweens that we'll update by calling 
      //the parent prototype's setRatio() (otherwise, the property tweens wouldn't get their values updated). 
      //this._super refers to the TweenPlugin prototype from which the plugin inherits (not that you need to worry about that).
      this._super.setRatio.call(this, ratio);

      //now manually set the alpha
      this._target.alpha = this._alphaStart + this._alphaChange * ratio;
    }

  });

}); if (_gsScope._gsDefine) { _gsScope._gsQueue.pop()(); }
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}]},{},[])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZnJhbWVyLm1vZHVsZXMuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL1VzZXJzL29uZHJlanJvaG9uL0RvY3VtZW50cy93ZWJkZXNpZ24vZnJhbWVyR1NBUC5mcmFtZXIvbW9kdWxlcy9mcmFtZXJfZ3NhcC5qcyIsIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiXSwic291cmNlc0NvbnRlbnQiOlsiLyohXG4gKiBWRVJTSU9OOiAxLjIuMFxuICogREFURTogMjAxNi0wNy0xNFxuICogVVBEQVRFUyBBTkQgRE9DUyBBVDogaHR0cDovL2dyZWVuc29jay5jb21cbiAqIFxuICogVGhpcyBmaWxlIGlzIHRvIGJlIHVzZWQgYXMgYSBzaW1wbGUgdGVtcGxhdGUgZm9yIHdyaXRpbmcgeW91ciBvd24gcGx1Z2luLiBTZWUgdGhlIFxuICogVHdlZW5QbHVnaW4gZG9jcyBmb3IgbW9yZSBkZXRhaWxzLlxuICpcbiAqIFlvdSBjYW4gc3RhcnQgYnkgZG9pbmcgYSBzZWFyY2ggZm9yIFwieW91ckN1c3RvbVByb3BlcnR5XCIgYW5kIHJlcGxhY2UgaXQgd2l0aCB3aGF0ZXZlciB0aGUgbmFtZVxuICogb2YgeW91ciBwcm9wZXJ0eSBpcy4gVGhpcyB3YXkgb2YgZGVmaW5pbmcgYSBwbHVnaW4gd2FzIGludHJvZHVjZWQgaW4gdmVyc2lvbiAxLjkuMCAtIHByZXZpb3VzIHZlcnNpb25zXG4gKiBvZiBUd2VlbkxpdGUgd29uJ3Qgd29yayB3aXRoIHRoaXMuXG4gKlxuICogQGxpY2Vuc2UgQ29weXJpZ2h0IChjKSAyMDA4LTIwMTYsIEdyZWVuU29jay4gQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqIFRoaXMgd29yayBpcyBzdWJqZWN0IHRvIHRoZSB0ZXJtcyBhdCBodHRwOi8vZ3JlZW5zb2NrLmNvbS9zdGFuZGFyZC1saWNlbnNlIG9yIGZvclxuICogQ2x1YiBHcmVlblNvY2sgbWVtYmVycywgdGhlIHNvZnR3YXJlIGFncmVlbWVudCB0aGF0IHdhcyBpc3N1ZWQgd2l0aCB5b3VyIG1lbWJlcnNoaXAuXG4gKiBcbiAqIEBhdXRob3I6IEphY2sgRG95bGUsIGphY2tAZ3JlZW5zb2NrLmNvbVxuICoqL1xudmFyIF9nc1Njb3BlID0gKHR5cGVvZihtb2R1bGUpICE9PSBcInVuZGVmaW5lZFwiICYmIG1vZHVsZS5leHBvcnRzICYmIHR5cGVvZihnbG9iYWwpICE9PSBcInVuZGVmaW5lZFwiKSA/IGdsb2JhbCA6IHRoaXMgfHwgd2luZG93OyAvL2hlbHBzIGVuc3VyZSBjb21wYXRpYmlsaXR5IHdpdGggQU1EL1JlcXVpcmVKUyBhbmQgQ29tbW9uSlMvTm9kZVxuKF9nc1Njb3BlLl9nc1F1ZXVlIHx8IChfZ3NTY29wZS5fZ3NRdWV1ZSA9IFtdKSkucHVzaCggZnVuY3Rpb24oKSB7XG4gIC8vaWdub3JlIHRoZSBsaW5lIGFib3ZlIHRoaXMgYW5kIGF0IHRoZSB2ZXJ5IGVuZCAtIHRob3NlIGFyZSBmb3IgZW5zdXJpbmcgdGhpbmdzIGxvYWQgaW4gdGhlIHByb3BlciBvcmRlclxuICBcInVzZSBzdHJpY3RcIjtcblxuICBfZ3NTY29wZS5fZ3NEZWZpbmUucGx1Z2luKHtcbiAgICBwcm9wTmFtZTogXCJ5b3VyQ3VzdG9tUHJvcGVydHlcIiwgLy90aGUgbmFtZSBvZiB0aGUgcHJvcGVydHkgdGhhdCB3aWxsIGdldCBpbnRlcmNlcHRlZCBhbmQgaGFuZGxlZCBieSB0aGlzIHBsdWdpbiBcbiAgICAvLyAob2J2aW91c2x5IGNoYW5nZSBpdCB0byB3aGF0ZXZlciB5b3Ugd2FudCwgdHlwaWNhbGx5IGl0IGlzIGNhbWVsQ2FzZSBzdGFydGluZyB3aXRoIGxvd2VyY2FzZSkuXG4gICAgcHJpb3JpdHk6IDAsIC8vdGhlIHByaW9yaXR5IGluIHRoZSByZW5kZXJpbmcgcGlwZWxpbmUgKDAgYnkgZGVmYXVsdCkuIFxuICAgIC8vIEEgcHJpb3JpdHkgb2YgLTEgd291bGQgbWVhbiB0aGlzIHBsdWdpbiB3aWxsIHJ1biBhZnRlciBhbGwgdGhvc2Ugd2l0aCAwIG9yIGdyZWF0ZXIuIFxuICAgIC8vIEEgcHJpb3JpdHkgb2YgMSB3b3VsZCBnZXQgcnVuIGJlZm9yZSAwLCBldGMuIFRoaXMgb25seSBtYXR0ZXJzIHdoZW4gYSBwbHVnaW4gcmVsaWVzIG9uIG90aGVyIHBsdWdpbnMgXG4gICAgLy8gZmluaXNoaW5nIHRoZWlyIHdvcmsgYmVmb3JlIGl0IHJ1bnMgKG9yIHZpc2EtdmVyc2EpXG4gICAgQVBJOiAyLCAvL3RoZSBBUEkgc2hvdWxkIHN0YXkgMiAtIGl0IGp1c3QgZ2l2ZXMgdXMgYSB3YXkgdG8ga25vdyB0aGUgbWV0aG9kL3Byb3BlcnR5IHN0cnVjdHVyZSBcbiAgICAvLyBzbyB0aGF0IGlmIGluIHRoZSBmdXR1cmUgd2UgY2hhbmdlIHRvIGEgZGlmZmVyZW50IFR3ZWVuUGx1Z2luIGFyY2hpdGVjdHVyZSwgd2UgY2FuIGlkZW50aWZ5IHRoaXMgcGx1Z2luJ3Mgc3RydWN0dXJlLlxuICAgIHZlcnNpb246IFwiMS4wLjBcIiwgLy95b3VyIHBsdWdpbidzIHZlcnNpb24gbnVtYmVyXG4gICAgb3ZlcndyaXRlUHJvcHM6IFtcInlvdXJDdXN0b21Qcm9wZXJ0eVwiXSwgLy9hbiBhcnJheSBvZiBwcm9wZXJ0eSBuYW1lcyB3aG9zZSB0d2VlbnMgc2hvdWxkIGJlIG92ZXJ3cml0dGVuIGJ5IHRoaXMgcGx1Z2luLiBcbiAgICAvLyBGb3IgZXhhbXBsZSwgaWYgeW91IGNyZWF0ZSBhIFwic2NhbGVcIiBwbHVnaW4gdGhhdCBoYW5kbGVzIGJvdGggXCJzY2FsZVhcIiBhbmQgXCJzY2FsZVlcIiwgdGhlIG92ZXJ3cml0ZVByb3BzIFxuICAgIC8vIHdvdWxkIGJlIFtcInNjYWxlWFwiLFwic2NhbGVZXCJdIHNvIHRoYXQgaWYgdGhlcmUncyBhIHNjYWxlWCBvciBzY2FsZVkgdHdlZW4gaW4tcHJvZ3Jlc3Mgd2hlbiBhIG5ldyBcInNjYWxlXCIgdHdlZW4gc3RhcnRzIFxuICAgIC8vICh1c2luZyB0aGlzIHBsdWdpbiksIGl0IHdvdWxkIG92ZXJ3cml0ZSB0aGUgc2NhbGVYIG9yIHNjYWxlWSB0d2Vlbi5cblxuICAgIC8qXG4gICAgICogVGhlIGluaXQgZnVuY3Rpb24gaXMgY2FsbGVkIHdoZW4gdGhlIHR3ZWVuIHJlbmRlcnMgZm9yIHRoZSBmaXJzdCB0aW1lLiBUaGlzIGlzIHdoZXJlIGluaXRpYWwgdmFsdWVzIHNob3VsZCBiZSByZWNvcmRlZCBcbiAgICAgKiBhbmQgYW55IHNldHVwIHJvdXRpbmVzIHNob3VsZCBydW4uIEl0IHJlY2VpdmVzIDMgcGFyYW1ldGVyczpcbiAgICAgKiAgIDEpIHRhcmdldCBbb2JqZWN0XSAtIHRoZSB0YXJnZXQgb2YgdGhlIHR3ZWVuLiBJbiBjYXNlcyB3aGVyZSB0aGUgdHdlZW4ncyBvcmlnaW5hbCB0YXJnZXQgaXMgYW4gYXJyYXkgXG4gICAgICogKG9yIGpRdWVyeSBvYmplY3QpLCB0aGlzIHRhcmdldCB3aWxsIGJlIHRoZSBpbmRpdmlkdWFsIG9iamVjdCBpbnNpZGUgdGhhdCBhcnJheSAoYSBuZXcgcGx1Z2luIGluc3RhbmNlIGlzIGNyZWF0ZWQgZm9yIFxuICAgICAqIGVhY2ggdGFyZ2V0IGluIHRoZSBhcnJheSkuIEZvciBleGFtcGxlLCBUd2VlbkxpdGUudG8oW29iajEsIG9iajIsIG9iajNdLCAxLCB7eDoxMDB9KSB0aGUgdGFyZ2V0IHdpbGwgXG4gICAgICogYmUgb2JqMSBvciBvYmoyIG9yIG9iajMgcmF0aGVyIHRoYW4gdGhlIGFycmF5IGNvbnRhaW5pbmcgdGhlbS5cbiAgICAgKiAgIDIpIHZhbHVlIFsqXSAtIHdoYXRldmVyIHZhbHVlIGlzIHBhc3NlZCBhcyB0aGUgc3BlY2lhbCBwcm9wZXJ0eSB2YWx1ZS4gRm9yIGV4YW1wbGUsIFR3ZWVuTGl0ZS50byhlbGVtZW50LCAxLCBcbiAgICAgKiB7eW91ckN1c3RvbVByb3BlcnR5OjN9KSB0aGUgdmFsdWUgd291bGQgYmUgMy4gT3IgZm9yIFxuICAgICAqIFR3ZWVuTGl0ZS50byhlbGVtZW50LCAxLCB7eW91ckN1c3RvbVByb3BlcnR5OntzdWJQcm9wMTozLCBzdWJQcm9wMjpcIndoYXRldmVyXCJ9fSk7LCB2YWx1ZSB3b3VsZCBiZSBcbiAgICAgKiB7c3ViUHJvcDE6Mywgc3ViUHJvcDI6XCJ3aGF0ZXZlclwifS5cbiAgICAgKiAgIDMpIHR3ZWVuIFtUd2VlbkxpdGVdIC0gdGhlIFR3ZWVuTGl0ZSAob3IgVHdlZW5NYXgpIGluc3RhbmNlIHRoYXQgaXMgbWFuYWdpbmcgdGhpcyBwbHVnaW4gaW5zdGFuY2UuIFxuICAgICAqIFRoaXMgY2FuIGJlIHVzZWZ1bCBpZiB5b3UgbmVlZCB0byBjaGVjayBjZXJ0YWluIHN0YXRlLXJlbGF0ZWQgcHJvcGVydGllcyBvbiB0aGUgdHdlZW4gKG1heWJlIGluIHRoZSBzZXQgbWV0aG9kKSBcbiAgICAgKiBsaWtlIGl0cyBkdXJhdGlvbiBvciB0aW1lLiBNb3N0IG9mIHRoZSB0aW1lLCBob3dldmVyLCB5b3UgZG9uJ3QgbmVlZCB0byBkbyBhbnl0aGluZyB3aXRoIHRoZSB0d2Vlbi4gXG4gICAgICogSXQgaXMgcHJvdmlkZWQganVzdCBpbiBjYXNlIHlvdSB3YW50IHRvIHJlZmVyZW5jZSBpdC5cbiAgICAgKiAgIDQpIGluZGV4IFtpbnRlZ2VyXSAtIHRoZSBpbmRleCBudW1iZXIgb2YgdGhlIHRhcmdldCBpbiB0aGUgdHdlZW4uIEZvciBleGFtcGxlLCBpZiBhbiBhcnJheSBpcyBwYXNzZWQgaW4gYXMgXG4gICAgICogdGhlIHRhcmdldCAob3Igc2VsZWN0b3IgdGV4dCksIHRoaXMgd291bGQgYmUgMCBmb3IgdGhlIGZpcnN0IG9uZSwgMSBmb3IgdGhlIHNlY29uZCwgMiBmb3IgdGhlIHRoaXJkLCBldGMuIFxuICAgICAqIFRoaXMgd2FzIGludHJvZHVjZWQgaW4gR1NBUCAxLjE5LjBcbiAgICAgKlxuICAgICAqIFRoaXMgZnVuY3Rpb24gc2hvdWxkIHJldHVybiB0cnVlIHVubGVzcyB5b3Ugd2FudCB0byBoYXZlIFR3ZWVuTGl0ZS9NYXggc2tpcCB0aGUgcGx1Z2luIGFsdG9nZXRoZXIgYW5kIGluc3RlYWQgXG4gICAgICogdHJlYXQgdGhlIHByb3BlcnR5L3ZhbHVlIGxpa2UgYSBub3JtYWwgdHdlZW4gKGFzIGlmIHRoZSBwbHVnaW4gd2Fzbid0IGFjdGl2YXRlZCkuIFRoaXMgaXMgcmFyZWx5IHVzZWZ1bCwgXG4gICAgICogc28geW91IHNob3VsZCBhbG1vc3QgYWx3YXlzIHJldHVybiB0cnVlLlxuICAgICAqL1xuICAgIGluaXQ6IGZ1bmN0aW9uKHRhcmdldCwgdmFsdWUsIHR3ZWVuLCBpbmRleCkge1xuICAgICAgdGhpcy5fdGFyZ2V0ID0gdGFyZ2V0OyAvL3dlIHJlY29yZCB0aGUgdGFyZ2V0IHNvIHRoYXQgd2UgY2FuIHJlZmVyIHRvIGl0IGluIHRoZSBzZXQgbWV0aG9kIHdoZW4gZG9pbmcgdXBkYXRlcy5cblxuICAgICAgLyogTmV4dCwgd2UgY3JlYXRlIGEgcHJvcGVydHkgdHdlZW4gZm9yIFwic2NhbGVYXCIgYW5kIFwic2NhbGVZXCIgcHJvcGVydGllcyBvZiBvdXIgdGFyZ2V0XG4gICAgICAgKiAod2UncmUganVzdCB1c2luZyB0aGVtIGFzIGEgZXhhbXBsZXMgb2YgaG93IHRvIHNldCB1cCBhIHByb3BlcnR5IHR3ZWVuIHdpdGggYSBuYW1lLCBzdGFydCwgYW5kIGVuZCB2YWx1ZSkuXG4gICAgICAgKiB0aGUgX2FkZFR3ZWVuKCkgbWV0aG9kIGFjY2VwdHMgdGhlIGZvbGxvd2luZyBwYXJhbWV0ZXJzOlxuICAgICAgICogICAxKSB0YXJnZXQgW29iamVjdF0gLSB0YXJnZXQgb2JqZWN0IHdob3NlIHByb3BlcnR5IHRoaXMgdHdlZW4gd2lsbCBjb250cm9sLlxuICAgICAgICogICAyKSBwcm9wZXJ0eSBbc3RyaW5nXSAtIHRoZSBuYW1lIG9mIHRoZSBwcm9wZXJ0eSwgbGlrZSBcInNjYWxlWFwiIG9yIFwic2NhbGVZXCJcbiAgICAgICAqICAgMykgc3RhcnQgW251bWJlcl0gLSBUaGUgc3RhcnRpbmcgdmFsdWUgb2YgdGhlIHByb3BlcnR5LiBGb3IgZXhhbXBsZSwgaWYgeW91J3JlIHR3ZWVuaW5nIGZyb20gMCB0byAxMDAsIFxuICAgICAgICogc3RhcnQgd291bGQgYmUgMC5cbiAgICAgICAqICAgNCkgZW5kIFtudW1iZXJdIC0gdGhlIGVuZGluZyB2YWx1ZSBvZiB0aGUgcHJvcGVydHkuIEZvciBleGFtcGxlLCBpZiB5b3UncmUgdHdlZW5pbmcgZnJvbSAwIHRvIDEwMCwgZW5kIHdvdWxkIGJlIDEwMC5cbiAgICAgICAqICAgNSkgb3ZlcndyaXRlUHJvcGVydHkgW3N0cmluZ10gLSB0aGUgbmFtZSB0aGF0IGdldHMgcmVnaXN0ZXJlZCBhcyB0aGUgb3ZlcndyaXRlIHByb3BlcnR5IHNvIHRoYXQgaWYgXG4gICAgICAgKiBhbm90aGVyIGNvbmN1cnJlbnQgdHdlZW4gb2YgdGhlIHNhbWUgdGFyZ2V0IGdldHMgY3JlYXRlZCBhbmQgaXQgaXMgdHdlZW5pbmcgYSBwcm9wZXJ0eSB3aXRoIHRoaXMgbmFtZSwgXG4gICAgICAgKiB0aGlzIG9uZSB3aWxsIGJlIG92ZXJ3cml0dGVuLiBUeXBpY2FsbHkgdGhpcyBpcyB0aGUgc2FtZSBhcyBcInByb3BlcnR5XCIuXG4gICAgICAgKiAgIDYpIHJvdW5kIFtib29sZWFuXSAtIGlmIHRydWUsIHRoZSB1cGRhdGVkIHZhbHVlIG9uIGVhY2ggdXBkYXRlIHdpbGwgYmUgcm91bmRlZCB0byB0aGUgbmVhcmVzdCBpbnRlZ2VyLiBcbiAgICAgICAqIFtmYWxzZSBieSBkZWZhdWx0XVxuICAgICAgICogWW91IGRvIE5PVCBuZWVkIHRvIHVzZSBfYWRkVHdlZW4oKSBhdCBhbGwuIEl0IGlzIG1lcmVseSBhIGNvbnZlbmllbmNlLiBZb3UgY2FuIHJlY29yZCB5b3VyIG93biB2YWx1ZXMgXG4gICAgICAgKiBpbnRlcm5hbGx5IG9yIHdoYXRldmVyIHlvdSB3YW50LlxuICAgICAgICovXG4gICAgICB0aGlzLl9hZGRUd2Vlbih0YXJnZXQsIFwic2NhbGVYXCIsIHRhcmdldC5zY2FsZVgsIHZhbHVlLCBcInNjYWxlWFwiLCBmYWxzZSk7XG4gICAgICB0aGlzLl9hZGRUd2Vlbih0YXJnZXQsIFwic2NhbGVZXCIsIHRhcmdldC5zY2FsZVksIHZhbHVlLCBcInNjYWxlWVwiLCBmYWxzZSk7XG5cbiAgICAgIC8vbm93LCBqdXN0IGZvciBraWNrcywgd2UnbGwgcmVjb3JkIHRoZSBzdGFydGluZyBcImFscGhhXCIgdmFsdWUgYW5kIGFtb3VudCBvZiBjaGFuZ2Ugc28gdGhhdCB3ZSBjYW4gbWFuYWdlIFxuICAgICAgLy90aGlzIG1hbnVhbGx5IHJhdGhlciB0aGFuIF9hZGRUd2VlbigpIChhZ2FpbiwgdG90YWxseSBmaWN0aXRpb3VzLCBqdXN0IGZvciBhbiBleGFtcGxlKVxuICAgICAgdGhpcy5fYWxwaGFTdGFydCA9IHRhcmdldC5hbHBoYTtcbiAgICAgIHRoaXMuX2FscGhhQ2hhbmdlID0gdmFsdWUuYWxwaGEgLSB0YXJnZXQuYWxwaGE7XG5cbiAgICAgIC8vYWx3YXlzIHJldHVybiB0cnVlIHVubGVzcyB3ZSB3YW50IHRvIHNjcmFwIHRoZSBwbHVnaW4gYW5kIGhhdmUgdGhlIHZhbHVlIHRyZWF0ZWQgYXMgYSBub3JtYWwgcHJvcGVydHkgdHdlZW4gXG4gICAgICAvLyh2ZXJ5IHVuY29tbW9uKVxuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSxcblxuICAgIC8vW29wdGlvbmFsXSAtIGNhbGxlZCBlYWNoIHRpbWUgdGhlIHZhbHVlcyBzaG91bGQgYmUgdXBkYXRlZCwgYW5kIHRoZSByYXRpbyBnZXRzIHBhc3NlZCBhcyB0aGUgb25seSBwYXJhbWV0ZXIgXG4gICAgLy8odHlwaWNhbGx5IGl0J3MgYSB2YWx1ZSBiZXR3ZWVuIDAgYW5kIDEsIGJ1dCBpdCBjYW4gZXhjZWVkIHRob3NlIHdoZW4gdXNpbmcgYW4gZWFzZSBsaWtlIEVsYXN0aWMuZWFzZU91dCBcbiAgICAvL29yIEJhY2suZWFzZU91dCwgZXRjLikuIElmIHlvdSdyZSB1c2luZyB0aGlzLl9zdXBlci5fYWRkVHdlZW4oKSBmb3IgYWxsIHlvdXIgdHdlZW5zIGFuZCB5b3UgZG9uJ3QgbmVlZCB0byBcbiAgICAvL2RvIGFueXRoaW5nIHNwZWNpYWwgb24gZWFjaCBmcmFtZSBiZXNpZGVzIHVwZGF0aW5nIHRob3NlIHZhbHVlcywgeW91IGNhbiBvbWl0IHRoaXMgXCJzZXRcIiBmdW5jdGlvbiBhbHRvZ2V0aGVyLlxuICAgIHNldDogZnVuY3Rpb24ocmF0aW8pIHtcbiAgICAgIC8vc2luY2Ugd2UgdXNlZCBfYWRkVHdlZW4oKSBpbnNpZGUgaW5pdCBmdW5jdGlvbiwgaXQgY3JlYXRlZCBzb21lIHByb3BlcnR5IHR3ZWVucyB0aGF0IHdlJ2xsIHVwZGF0ZSBieSBjYWxsaW5nIFxuICAgICAgLy90aGUgcGFyZW50IHByb3RvdHlwZSdzIHNldFJhdGlvKCkgKG90aGVyd2lzZSwgdGhlIHByb3BlcnR5IHR3ZWVucyB3b3VsZG4ndCBnZXQgdGhlaXIgdmFsdWVzIHVwZGF0ZWQpLiBcbiAgICAgIC8vdGhpcy5fc3VwZXIgcmVmZXJzIHRvIHRoZSBUd2VlblBsdWdpbiBwcm90b3R5cGUgZnJvbSB3aGljaCB0aGUgcGx1Z2luIGluaGVyaXRzIChub3QgdGhhdCB5b3UgbmVlZCB0byB3b3JyeSBhYm91dCB0aGF0KS5cbiAgICAgIHRoaXMuX3N1cGVyLnNldFJhdGlvLmNhbGwodGhpcywgcmF0aW8pO1xuXG4gICAgICAvL25vdyBtYW51YWxseSBzZXQgdGhlIGFscGhhXG4gICAgICB0aGlzLl90YXJnZXQuYWxwaGEgPSB0aGlzLl9hbHBoYVN0YXJ0ICsgdGhpcy5fYWxwaGFDaGFuZ2UgKiByYXRpbztcbiAgICB9XG5cbiAgfSk7XG5cbn0pOyBpZiAoX2dzU2NvcGUuX2dzRGVmaW5lKSB7IF9nc1Njb3BlLl9nc1F1ZXVlLnBvcCgpKCk7IH0iLCIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUNBQTs7QURBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIn0=
