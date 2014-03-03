function layMeAPath(e, t) {
    navigator.geolocation.getCurrentPosition(function (n) {
        map.spin(true);
        userX = n.coords.latitude;
        userY = n.coords.longitude;
        url = "transport.php?url=http://www.yournavigation.org/api/1.0/gosmore.php&format=geojson" + "&flat=" + userX + "&flon=" + userY + "&tlat=" + e + "&tlon=" + t + "&v=motorcar&fast=1&layer=mapnik";
        $.getJSON(url, function (e) {
            geojson = L.geoJson(e, {
                onEachFeature: function (e, t) {
                    var n = "<div>Attālums: " + Math.round(e.properties.distance) + "km, Laiks: " + Math.round(e.properties.traveltime / 60) + "min";
                    t.bindPopup(n, {
                        maxWidth: 320
                    })
                }
            });
            if (typeof lastObj != "undefined") map.removeLayer(lastObj);
            geojson.addTo(map);
            map.spin(false);
            lastObj = geojson
        })
    }, function () {
        map.spin(false);
        alert("Navigācija darbojas tikai, ja tavai ierīcei ir GPS vai ieslēgts WiFi")
    })
}(function (e) {
    if ("function" == typeof bootstrap) bootstrap("csv2geojson", e);
    else if ("object" == typeof exports) module.exports = e();
    else if ("function" == typeof define && define.amd) define(e);
    else if ("undefined" != typeof ses) {
        if (!ses.ok()) return;
        ses.makeCsv2geojson = e
    } else "undefined" != typeof window ? window.csv2geojson = e() : global.csv2geojson = e()
})(function () {
    var e, t, n, r, i;
    return function (e, t, n) {
        function r(n, i) {
            if (!t[n]) {
                if (!e[n]) {
                    var s = typeof require == "function" && require;
                    if (!i && s) return s(n, !0);
                    throw new Error("Cannot find module '" + n + "'")
                }
                var o = t[n] = {
                    exports: {}
                };
                e[n][0](function (t) {
                    var i = e[n][1][t];
                    return r(i ? i : t)
                }, o, o.exports)
            }
            return t[n].exports
        }
        for (var i = 0; i < n.length; i++) r(n[i]);
        return r
    }({
        1: [
            function (e, t, n) {
                function r(e) {
                    function n(e, t) {
                        function f() {
                            if (s.lastIndex >= e.length) return r;
                            if (a) {
                                a = false;
                                return n
                            }
                            var t = s.lastIndex;
                            if (e.charCodeAt(t) === 34) {
                                var i = t;
                                while (i++ < e.length) {
                                    if (e.charCodeAt(i) === 34) {
                                        if (e.charCodeAt(i + 1) !== 34) break;
                                        i++
                                    }
                                }
                                s.lastIndex = i + 2;
                                var o = e.charCodeAt(i + 1);
                                if (o === 13) {
                                    a = true;
                                    if (e.charCodeAt(i + 2) === 10) s.lastIndex++
                                } else if (o === 10) {
                                    a = true
                                }
                                return e.substring(t + 1, i).replace(/""/g, '"')
                            }
                            var u = s.exec(e);
                            if (u) {
                                a = u[0].charCodeAt(0) !== 44;
                                return e.substring(t, u.index)
                            }
                            s.lastIndex = e.length;
                            return e.substring(t)
                        }
                        var n = {}, r = {}, i = [],
                            s = /\r\n|[,\r\n]/g,
                            o = 0,
                            u, a;
                        s.lastIndex = 0;
                        while ((u = f()) !== r) {
                            var l = [];
                            while (u !== n && u !== r) {
                                l.push(u);
                                u = f()
                            }
                            if (t && !(l = t(l, o++))) continue;
                            i.push(l)
                        }
                        return i
                    }
                    var t;
                    return n(e, function (e, n) {
                        if (n) {
                            var r = {}, i = -1,
                                s = t.length;
                            while (++i < s) r[t[i]] = e[i];
                            return r
                        } else {
                            t = e;
                            return null
                        }
                    })
                }

                function i(e, t, n) {
                    var i = [],
                        s = {
                            type: "FeatureCollection",
                            features: i
                        };
                    var o = r(e);
                    if (!o.length) return s;
                    n = n || "";
                    t = t || "";
                    for (var u in o[0]) {
                        if (!n && u.match(/^Lat/i)) n = u;
                        if (!t && u.match(/^Lon/i)) t = u
                    }
                    if (!n || !t) {
                        var a = [];
                        for (var f in o[0]) a.push(f);
                        return a
                    }
                    for (var l = 0; l < o.length; l++) {
                        if (o[l][t] !== undefined && o[l][t] !== undefined) {
                            i.push({
                                type: "Feature",
                                properties: o[l],
                                geometry: {
                                    type: "Point",
                                    coordinates: [parseFloat(o[l][t]), parseFloat(o[l][n])]
                                }
                            })
                        }
                    }
                    return s
                }

                function s(e) {
                    var t = e.features;
                    var n = {
                        type: "Feature",
                        geometry: {
                            type: "LineString",
                            coordinates: []
                        }
                    };
                    for (var r = 0; r < t.length; r++) {
                        n.geometry.coordinates.push(t[r].geometry.coordinates)
                    }
                    n.properties = t[0].properties;
                    return {
                        type: "FeatureSet",
                        features: [n]
                    }
                }

                function o(e) {
                    var t = e.features;
                    var n = {
                        type: "Feature",
                        geometry: {
                            type: "Polygon",
                            coordinates: [
                                []
                            ]
                        }
                    };
                    for (var r = 0; r < t.length; r++) {
                        n.geometry.coordinates[0].push(t[r].geometry.coordinates)
                    }
                    n.properties = t[0].properties;
                    return {
                        type: "FeatureSet",
                        features: [n]
                    }
                }
                t.exports = {
                    csv: r,
                    toline: s,
                    topolygon: o,
                    csv2geojson: i
                }
            }, {}
        ]
    }, {}, [1])(1)
});
L.SpinMapMixin = {
    spin: function (e, t) {
        if ( !! e) {
            if (!this._spinner) {
                this._spinner = (new Spinner(t)).spin(this._container);
                this._spinning = 0
            }
            this._spinning++
        } else {
            this._spinning--;
            if (this._spinning <= 0) {
                if (this._spinner) {
                    this._spinner.stop();
                    this._spinner = null
                }
            }
        }
    }
};
L.Map.include(L.SpinMapMixin);
var lastObj;
L.GeoSearch = {};
L.GeoSearch.Provider = {};
L.GeoSearch.Result = function (e, t, n) {
    this.X = e;
    this.Y = t;
    this.Label = n
};
L.Control.GeoSearch = L.Control.extend({
    options: {
        position: "topcenter",
        showMarker: true
    },
    _config: {
        country: "",
        searchLabel: "meklēt pilsētu ...",
        notFoundMessage: "diemžēl nevarēju atrast.",
        messageHideDelay: 3e3,
        zoomLevel: 15
    },
    initialize: function (e) {
        L.Util.extend(this.options, e);
        L.Util.extend(this._config, e)
    },
    onAdd: function (e) {
        var t = e._controlContainer,
            n = t.childNodes,
            r = false;
        for (var i = 0, s = n.length; i < s; i++) {
            var o = n[i].className;
            if (/leaflet-top/.test(o) && /leaflet-center/.test(o)) {
                r = true;
                break
            }
        }
        if (!r) {
            var u = document.createElement("div");
            u.className += "leaflet-top leaflet-center";
            t.appendChild(u);
            e._controlCorners.topcenter = u
        }
        this._map = e;
        this._container = L.DomUtil.create("div", "leaflet-control-geosearch");
        var a = document.createElement("input");
        a.id = "leaflet-control-geosearch-qry";
        a.type = "text";
        a.placeholder = this._config.searchLabel;
        this._searchbox = a;
        var f = document.createElement("div");
        f.id = "leaflet-control-geosearch-msg";
        f.className = "leaflet-control-geosearch-msg";
        this._msgbox = f;
        var l = document.createElement("ul");
        l.id = "leaflet-control-geosearch-results";
        this._resultslist = l;
        this._msgbox.appendChild(this._resultslist);
        this._container.appendChild(this._searchbox);
        this._container.appendChild(this._msgbox);
        L.DomEvent.addListener(this._container, "click", L.DomEvent.stop).addListener(this._searchbox, "keypress", this._onKeyUp, this);
        L.DomEvent.disableClickPropagation(this._container);
        return this._container
    },
    geosearch: function (e) {
        try {
            var t = this._config.provider;
            if (typeof t.GetLocations == "function") {
                var n = t.GetLocations(e, function (e) {
                    this._processResults(e)
                }.bind(this))
            } else {
                var r = t.GetServiceUrl(e);
                this.sendRequest(t, r)
            }
        } catch (i) {
            this._printError(i)
        }
    },
    sendRequest: function (e, t) {
        function r(e) {
            e = e + "&callback=parseLocation";
            var t = document.createElement("script");
            t.id = "getJsonP";
            t.src = e;
            t.async = true;
            document.body.appendChild(t)
        }
        var n = this;
        window.parseLocation = function (t) {
            var r = e.ParseJSON(t);
            n._processResults(r);
            document.body.removeChild(document.getElementById("getJsonP"));
            delete window.parseLocation
        };
        if (XMLHttpRequest) {
            var i = new XMLHttpRequest;
            if ("withCredentials" in i) {
                var i = new XMLHttpRequest;
                i.onreadystatechange = function () {
                    if (i.readyState == 4) {
                        if (i.status == 200) {
                            var s = JSON.parse(i.responseText),
                                o = e.ParseJSON(s);
                            n._processResults(o)
                        } else if (i.status == 0 || i.status == 400) {
                            r(t)
                        } else {
                            n._printError(i.responseText)
                        }
                    }
                };
                i.open("GET", t, true);
                i.send()
            } else if (XDomainRequest) {
                var s = new XDomainRequest;
                s.onerror = function (e) {
                    n._printError(e)
                };
                s.onload = function () {
                    var t = JSON.parse(s.responseText),
                        r = e.ParseJSON(t);
                    n._processResults(r)
                };
                s.open("GET", t);
                s.send()
            } else {
                r(t)
            }
        }
    },
    _processResults: function (e) {
        if (e.length > 0) {
            this._map.fireEvent("geosearch_foundlocations", {
                Locations: e
            });
            this._showLocation(e[0])
        } else {
            this._printError(this._config.notFoundMessage)
        }
    },
    _showLocation: function (e) {
        if (this.options.showMarker == true) {
            if (typeof this._positionMarker === "undefined") this._positionMarker = L.marker([e.Y, e.X]).addTo(this._map);
            else this._positionMarker.setLatLng([e.Y, e.X])
        }
        this._map.setView([e.Y, e.X], this._config.zoomLevel, false);
        this._map.fireEvent("geosearch_showlocation", {
            Location: e
        })
    },
    _printError: function (e) {
        var t = this._resultslist;
        t.innerHTML = "<li>" + e + "</li>";
        t.style.display = "block";
        setTimeout(function () {
            t.style.display = "none"
        }, 3e3)
    },
    _onKeyUp: function (e) {
        var t = 27,
            n = 13,
            r = document.getElementById("leaflet-control-geosearch-qry");
        if (e.keyCode === t) {
            r.value = "";
            this._map._container.focus()
        } else if (e.keyCode === n) {
            this.geosearch(r.value)
        }
    }
});
L.GeoSearch.Provider.OpenStreetMap = L.Class.extend({
    options: {},
    initialize: function (e) {
        e = L.Util.setOptions(this, e)
    },
    GetServiceUrl: function (e) {
        var t = L.Util.extend({
            q: e,
            format: "json"
        }, this.options);
        return "http://nominatim.openstreetmap.org/search" + L.Util.getParamString(t)
    },
    ParseJSON: function (e) {
        if (e.length == 0) return [];
        var t = [];
        for (var n = 0; n < e.length; n++) t.push(new L.GeoSearch.Result(e[n].lon, e[n].lat, e[n].display_name));
        return t
    }
});

// Label 

/*
	Leaflet.label, a plugin that adds labels to markers and vectors for Leaflet powered maps.
	(c) 2012-2013, Jacob Toye, Smartrak

	https://github.com/Leaflet/Leaflet.label
	http://leafletjs.com
	https://github.com/jacobtoye
*/

(function(){L.labelVersion="0.2.2-dev",L.Label=L.Class.extend({includes:L.Mixin.Events,options:{className:"",clickable:!1,direction:"right",noHide:!1,offset:[12,-15],opacity:1,zoomAnimation:!0},initialize:function(t,e){L.setOptions(this,t),this._source=e,this._animated=L.Browser.any3d&&this.options.zoomAnimation,this._isOpen=!1},onAdd:function(t){this._map=t,this._pane=this._source instanceof L.Marker?t._panes.markerPane:t._panes.popupPane,this._container||this._initLayout(),this._pane.appendChild(this._container),this._initInteraction(),this._update(),this.setOpacity(this.options.opacity),t.on("moveend",this._onMoveEnd,this).on("viewreset",this._onViewReset,this),this._animated&&t.on("zoomanim",this._zoomAnimation,this),L.Browser.touch&&!this.options.noHide&&L.DomEvent.on(this._container,"click",this.close,this)},onRemove:function(t){this._pane.removeChild(this._container),t.off({zoomanim:this._zoomAnimation,moveend:this._onMoveEnd,viewreset:this._onViewReset},this),this._removeInteraction(),this._map=null},setLatLng:function(t){return this._latlng=L.latLng(t),this._map&&this._updatePosition(),this},setContent:function(t){return this._previousContent=this._content,this._content=t,this._updateContent(),this},close:function(){var t=this._map;t&&(L.Browser.touch&&!this.options.noHide&&L.DomEvent.off(this._container,"click",this.close),t.removeLayer(this))},updateZIndex:function(t){this._zIndex=t,this._container&&this._zIndex&&(this._container.style.zIndex=t)},setOpacity:function(t){this.options.opacity=t,this._container&&L.DomUtil.setOpacity(this._container,t)},_initLayout:function(){this._container=L.DomUtil.create("div","leaflet-label "+this.options.className+" leaflet-zoom-animated"),this.updateZIndex(this._zIndex)},_update:function(){this._map&&(this._container.style.visibility="hidden",this._updateContent(),this._updatePosition(),this._container.style.visibility="")},_updateContent:function(){this._content&&this._map&&this._prevContent!==this._content&&"string"==typeof this._content&&(this._container.innerHTML=this._content,this._prevContent=this._content,this._labelWidth=this._container.offsetWidth)},_updatePosition:function(){var t=this._map.latLngToLayerPoint(this._latlng);this._setPosition(t)},_setPosition:function(t){var e=this._map,i=this._container,n=e.latLngToContainerPoint(e.getCenter()),o=e.layerPointToContainerPoint(t),s=this.options.direction,a=this._labelWidth,l=L.point(this.options.offset);"right"===s||"auto"===s&&o.x<n.x?(L.DomUtil.addClass(i,"leaflet-label-right"),L.DomUtil.removeClass(i,"leaflet-label-left"),t=t.add(l)):(L.DomUtil.addClass(i,"leaflet-label-left"),L.DomUtil.removeClass(i,"leaflet-label-right"),t=t.add(L.point(-l.x-a,l.y))),L.DomUtil.setPosition(i,t)},_zoomAnimation:function(t){var e=this._map._latLngToNewLayerPoint(this._latlng,t.zoom,t.center).round();this._setPosition(e)},_onMoveEnd:function(){this._animated&&"auto"!==this.options.direction||this._updatePosition()},_onViewReset:function(t){t&&t.hard&&this._update()},_initInteraction:function(){if(this.options.clickable){var t=this._container,e=["dblclick","mousedown","mouseover","mouseout","contextmenu"];L.DomUtil.addClass(t,"leaflet-clickable"),L.DomEvent.on(t,"click",this._onMouseClick,this);for(var i=0;e.length>i;i++)L.DomEvent.on(t,e[i],this._fireMouseEvent,this)}},_removeInteraction:function(){if(this.options.clickable){var t=this._container,e=["dblclick","mousedown","mouseover","mouseout","contextmenu"];L.DomUtil.removeClass(t,"leaflet-clickable"),L.DomEvent.off(t,"click",this._onMouseClick,this);for(var i=0;e.length>i;i++)L.DomEvent.off(t,e[i],this._fireMouseEvent,this)}},_onMouseClick:function(t){this.hasEventListeners(t.type)&&L.DomEvent.stopPropagation(t),this.fire(t.type,{originalEvent:t})},_fireMouseEvent:function(t){this.fire(t.type,{originalEvent:t}),"contextmenu"===t.type&&this.hasEventListeners(t.type)&&L.DomEvent.preventDefault(t),"mousedown"!==t.type?L.DomEvent.stopPropagation(t):L.DomEvent.preventDefault(t)}}),L.BaseMarkerMethods={showLabel:function(){return this.label&&this._map&&(this.label.setLatLng(this._latlng),this._map.showLabel(this.label)),this},hideLabel:function(){return this.label&&this.label.close(),this},setLabelNoHide:function(t){this._labelNoHide!==t&&(this._labelNoHide=t,t?(this._removeLabelRevealHandlers(),this.showLabel()):(this._addLabelRevealHandlers(),this.hideLabel()))},bindLabel:function(t,e){var i=this.options.icon?this.options.icon.options.labelAnchor:this.options.labelAnchor,n=L.point(i)||L.point(0,0);return n=n.add(L.Label.prototype.options.offset),e&&e.offset&&(n=n.add(e.offset)),e=L.Util.extend({offset:n},e),this._labelNoHide=e.noHide,this.label||(this._labelNoHide||this._addLabelRevealHandlers(),this.on("remove",this.hideLabel,this).on("move",this._moveLabel,this).on("add",this._onMarkerAdd,this),this._hasLabelHandlers=!0),this.label=new L.Label(e,this).setContent(t),this},unbindLabel:function(){return this.label&&(this.hideLabel(),this.label=null,this._hasLabelHandlers&&(this._labelNoHide||this._removeLabelRevealHandlers(),this.off("remove",this.hideLabel,this).off("move",this._moveLabel,this).off("add",this._onMarkerAdd,this)),this._hasLabelHandlers=!1),this},updateLabelContent:function(t){this.label&&this.label.setContent(t)},getLabel:function(){return this.label},_onMarkerAdd:function(){this._labelNoHide&&this.showLabel()},_addLabelRevealHandlers:function(){this.on("mouseover",this.showLabel,this).on("mouseout",this.hideLabel,this),L.Browser.touch&&this.on("click",this.showLabel,this)},_removeLabelRevealHandlers:function(){this.off("mouseover",this.showLabel,this).off("mouseout",this.hideLabel,this),L.Browser.touch&&this.off("click",this.showLabel,this)},_moveLabel:function(t){this.label.setLatLng(t.latlng)}},L.Icon.Default.mergeOptions({labelAnchor:new L.Point(9,-20)}),L.Marker.mergeOptions({icon:new L.Icon.Default}),L.Marker.include(L.BaseMarkerMethods),L.Marker.include({_originalUpdateZIndex:L.Marker.prototype._updateZIndex,_updateZIndex:function(t){var e=this._zIndex+t;this._originalUpdateZIndex(t),this.label&&this.label.updateZIndex(e)},_originalSetOpacity:L.Marker.prototype.setOpacity,setOpacity:function(t,e){this.options.labelHasSemiTransparency=e,this._originalSetOpacity(t)},_originalUpdateOpacity:L.Marker.prototype._updateOpacity,_updateOpacity:function(){var t=0===this.options.opacity?0:1;this._originalUpdateOpacity(),this.label&&this.label.setOpacity(this.options.labelHasSemiTransparency?this.options.opacity:t)},_originalSetLatLng:L.Marker.prototype.setLatLng,setLatLng:function(t){return this.label&&!this._labelNoHide&&this.hideLabel(),this._originalSetLatLng(t)}}),L.CircleMarker.mergeOptions({labelAnchor:new L.Point(0,0)}),L.CircleMarker.include(L.BaseMarkerMethods),L.Path.include({bindLabel:function(t,e){return this.label&&this.label.options===e||(this.label=new L.Label(e,this)),this.label.setContent(t),this._showLabelAdded||(this.on("mouseover",this._showLabel,this).on("mousemove",this._moveLabel,this).on("mouseout remove",this._hideLabel,this),L.Browser.touch&&this.on("click",this._showLabel,this),this._showLabelAdded=!0),this},unbindLabel:function(){return this.label&&(this._hideLabel(),this.label=null,this._showLabelAdded=!1,this.off("mouseover",this._showLabel,this).off("mousemove",this._moveLabel,this).off("mouseout remove",this._hideLabel,this)),this},updateLabelContent:function(t){this.label&&this.label.setContent(t)},_showLabel:function(t){this.label.setLatLng(t.latlng),this._map.showLabel(this.label)},_moveLabel:function(t){this.label.setLatLng(t.latlng)},_hideLabel:function(){this.label.close()}}),L.Map.include({showLabel:function(t){return this.addLayer(t)}}),L.FeatureGroup.include({clearLayers:function(){return this.unbindLabel(),this.eachLayer(this.removeLayer,this),this},bindLabel:function(t,e){return this.invoke("bindLabel",t,e)},unbindLabel:function(){return this.invoke("unbindLabel")},updateLabelContent:function(t){this.invoke("updateLabelContent",t)}})})(this,document);

// spinner
//fgnass.github.com/spin.js#v1.3.3

!function(a,b){"object"==typeof exports?module.exports=b():"function"==typeof define&&define.amd?define(b):a.Spinner=b()}(this,function(){"use strict";function a(a,b){var c,d=document.createElement(a||"div");for(c in b)d[c]=b[c];return d}function b(a){for(var b=1,c=arguments.length;c>b;b++)a.appendChild(arguments[b]);return a}function c(a,b,c,d){var e=["opacity",b,~~(100*a),c,d].join("-"),f=.01+c/d*100,g=Math.max(1-(1-a)/b*(100-f),a),h=k.substring(0,k.indexOf("Animation")).toLowerCase(),i=h&&"-"+h+"-"||"";return m[e]||(n.insertRule("@"+i+"keyframes "+e+"{0%{opacity:"+g+"}"+f+"%{opacity:"+a+"}"+(f+.01)+"%{opacity:1}"+(f+b)%100+"%{opacity:"+a+"}100%{opacity:"+g+"}}",n.cssRules.length),m[e]=1),e}function d(a,b){var c,d,e=a.style;for(b=b.charAt(0).toUpperCase()+b.slice(1),d=0;d<l.length;d++)if(c=l[d]+b,void 0!==e[c])return c;return void 0!==e[b]?b:void 0}function e(a,b){for(var c in b)a.style[d(a,c)||c]=b[c];return a}function f(a){for(var b=1;b<arguments.length;b++){var c=arguments[b];for(var d in c)void 0===a[d]&&(a[d]=c[d])}return a}function g(a){for(var b={x:a.offsetLeft,y:a.offsetTop};a=a.offsetParent;)b.x+=a.offsetLeft,b.y+=a.offsetTop;return b}function h(a,b){return"string"==typeof a?a:a[b%a.length]}function i(a){return"undefined"==typeof this?new i(a):(this.opts=f(a||{},i.defaults,o),void 0)}function j(){function c(b,c){return a("<"+b+' xmlns="urn:schemas-microsoft.com:vml" class="spin-vml">',c)}n.addRule(".spin-vml","behavior:url(#default#VML)"),i.prototype.lines=function(a,d){function f(){return e(c("group",{coordsize:k+" "+k,coordorigin:-j+" "+-j}),{width:k,height:k})}function g(a,g,i){b(m,b(e(f(),{rotation:360/d.lines*a+"deg",left:~~g}),b(e(c("roundrect",{arcsize:d.corners}),{width:j,height:d.width,left:d.radius,top:-d.width>>1,filter:i}),c("fill",{color:h(d.color,a),opacity:d.opacity}),c("stroke",{opacity:0}))))}var i,j=d.length+d.width,k=2*j,l=2*-(d.width+d.length)+"px",m=e(f(),{position:"absolute",top:l,left:l});if(d.shadow)for(i=1;i<=d.lines;i++)g(i,-2,"progid:DXImageTransform.Microsoft.Blur(pixelradius=2,makeshadow=1,shadowopacity=.3)");for(i=1;i<=d.lines;i++)g(i);return b(a,m)},i.prototype.opacity=function(a,b,c,d){var e=a.firstChild;d=d.shadow&&d.lines||0,e&&b+d<e.childNodes.length&&(e=e.childNodes[b+d],e=e&&e.firstChild,e=e&&e.firstChild,e&&(e.opacity=c))}}var k,l=["webkit","Moz","ms","O"],m={},n=function(){var c=a("style",{type:"text/css"});return b(document.getElementsByTagName("head")[0],c),c.sheet||c.styleSheet}(),o={lines:12,length:7,width:5,radius:10,rotate:0,corners:1,color:"#000",direction:1,speed:1,trail:100,opacity:.25,fps:20,zIndex:2e9,className:"spinner",top:"auto",left:"auto",position:"relative"};i.defaults={},f(i.prototype,{spin:function(b){this.stop();var c,d,f=this,h=f.opts,i=f.el=e(a(0,{className:h.className}),{position:h.position,width:0,zIndex:h.zIndex}),j=h.radius+h.length+h.width;if(b&&(b.insertBefore(i,b.firstChild||null),d=g(b),c=g(i),e(i,{left:("auto"==h.left?d.x-c.x+(b.offsetWidth>>1):parseInt(h.left,10)+j)+"px",top:("auto"==h.top?d.y-c.y+(b.offsetHeight>>1):parseInt(h.top,10)+j)+"px"})),i.setAttribute("role","progressbar"),f.lines(i,f.opts),!k){var l,m=0,n=(h.lines-1)*(1-h.direction)/2,o=h.fps,p=o/h.speed,q=(1-h.opacity)/(p*h.trail/100),r=p/h.lines;!function s(){m++;for(var a=0;a<h.lines;a++)l=Math.max(1-(m+(h.lines-a)*r)%p*q,h.opacity),f.opacity(i,a*h.direction+n,l,h);f.timeout=f.el&&setTimeout(s,~~(1e3/o))}()}return f},stop:function(){var a=this.el;return a&&(clearTimeout(this.timeout),a.parentNode&&a.parentNode.removeChild(a),this.el=void 0),this},lines:function(d,f){function g(b,c){return e(a(),{position:"absolute",width:f.length+f.width+"px",height:f.width+"px",background:b,boxShadow:c,transformOrigin:"left",transform:"rotate("+~~(360/f.lines*j+f.rotate)+"deg) translate("+f.radius+"px,0)",borderRadius:(f.corners*f.width>>1)+"px"})}for(var i,j=0,l=(f.lines-1)*(1-f.direction)/2;j<f.lines;j++)i=e(a(),{position:"absolute",top:1+~(f.width/2)+"px",transform:f.hwaccel?"translate3d(0,0,0)":"",opacity:f.opacity,animation:k&&c(f.opacity,f.trail,l+j*f.direction,f.lines)+" "+1/f.speed+"s linear infinite"}),f.shadow&&b(i,e(g("#000","0 0 4px #000"),{top:"2px"})),b(d,b(i,g(h(f.color,j),"0 0 1px rgba(0,0,0,.1)")));return d},opacity:function(a,b,c){b<a.childNodes.length&&(a.childNodes[b].style.opacity=c)}});var p=e(a("group"),{behavior:"url(#default#VML)"});return!d(p,"transform")&&p.adj?j():k=d(p,"animation"),i});