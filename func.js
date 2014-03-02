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
(function (e) {
    var t = function () {
        var t = e.documentMode;
        return "onhashchange" in e && (t === undefined || t > 7)
    }();
    L.Hash = function (e) {
        this.onHashChange = L.Util.bind(this.onHashChange, this);
        if (e) {
            this.init(e)
        }
    };
    L.Hash.parseHash = function (e) {
        if (e.indexOf("#") === 0) {
            e = e.substr(1)
        }
        var t = e.split("/");
        if (t.length == 3) {
            var n = parseInt(t[0], 10),
                r = parseFloat(t[1]),
                i = parseFloat(t[2]);
            if (isNaN(n) || isNaN(r) || isNaN(i)) {
                return false
            } else {
                return {
                    center: new L.LatLng(r, i),
                    zoom: n
                }
            }
        } else {
            return false
        }
    };
    L.Hash.formatHash = function (e) {
        var t = e.getCenter(),
            n = e.getZoom(),
            r = Math.max(0, Math.ceil(Math.log(n) / Math.LN2));
        return "#" + [n, t.lat.toFixed(r), t.lng.toFixed(r)].join("/")
    }, L.Hash.prototype = {
        map: null,
        lastHash: null,
        parseHash: L.Hash.parseHash,
        formatHash: L.Hash.formatHash,
        init: function (e) {
            this.map = e;
            this.lastHash = null;
            this.onHashChange();
            if (!this.isListening) {
                this.startListening()
            }
        },
        remove: function () {
            if (this.changeTimeout) {
                clearTimeout(this.changeTimeout)
            }
            if (this.isListening) {
                this.stopListening()
            }
            this.map = null
        },
        onMapMove: function () {
            if (this.movingMap || !this.map._loaded) {
                return false
            }
            var e = this.formatHash(this.map);
            if (this.lastHash != e) {
                location.replace(e);
                this.lastHash = e
            }
        },
        movingMap: false,
        update: function () {
            var e = location.hash;
            if (e === this.lastHash) {
                return
            }
            var t = this.parseHash(e);
            if (t) {
                this.movingMap = true;
                this.map.setView(t.center, t.zoom);
                this.movingMap = false
            } else {
                this.onMapMove(this.map)
            }
        },
        changeDefer: 100,
        changeTimeout: null,
        onHashChange: function () {
            if (!this.changeTimeout) {
                var e = this;
                this.changeTimeout = setTimeout(function () {
                    e.update();
                    e.changeTimeout = null
                }, this.changeDefer)
            }
        },
        isListening: false,
        hashChangeInterval: null,
        startListening: function () {
            this.map.on("moveend", this.onMapMove, this);
            if (t) {
                L.DomEvent.addListener(e, "hashchange", this.onHashChange)
            } else {
                clearInterval(this.hashChangeInterval);
                this.hashChangeInterval = setInterval(this.onHashChange, 50)
            }
            this.isListening = true
        },
        stopListening: function () {
            this.map.off("moveend", this.onMapMove, this);
            if (t) {
                L.DomEvent.removeListener(e, "hashchange", this.onHashChange)
            } else {
                clearInterval(this.hashChangeInterval)
            }
            this.isListening = false
        }
    };
    L.hash = function (e) {
        return new L.Hash(e)
    };
    L.Map.prototype.addHash = function () {
        this._hash = L.hash(this)
    };
    L.Map.prototype.removeHash = function () {
        this._hash.remove()
    }
})(window);
(function () {
    L.labelVersion = "0.2.1-dev", L.Label = L.Class.extend({
        includes: L.Mixin.Events,
        options: {
            className: "",
            clickable: !1,
            direction: "right",
            noHide: !1,
            offset: [12, -15],
            opacity: 1,
            zoomAnimation: !0
        },
        initialize: function (e, t) {
            L.setOptions(this, e), this._source = t, this._animated = L.Browser.any3d && this.options.zoomAnimation, this._isOpen = !1
        },
        onAdd: function (e) {
            this._map = e, this._pane = this._source instanceof L.Marker ? e._panes.markerPane : e._panes.popupPane, this._container || this._initLayout(), this._pane.appendChild(this._container), this._initInteraction(), this._update(), this.setOpacity(this.options.opacity), e.on("moveend", this._onMoveEnd, this).on("viewreset", this._onViewReset, this), this._animated && e.on("zoomanim", this._zoomAnimation, this), L.Browser.touch && !this.options.noHide && L.DomEvent.on(this._container, "click", this.close, this)
        },
        onRemove: function (e) {
            this._pane.removeChild(this._container), e.off({
                zoomanim: this._zoomAnimation,
                moveend: this._onMoveEnd,
                viewreset: this._onViewReset
            }, this), this._removeInteraction(), this._map = null
        },
        setLatLng: function (e) {
            return this._latlng = L.latLng(e), this._map && this._updatePosition(), this
        },
        setContent: function (e) {
            return this._previousContent = this._content, this._content = e, this._updateContent(), this
        },
        close: function () {
            var e = this._map;
            e && (L.Browser.touch && !this.options.noHide && L.DomEvent.off(this._container, "click", this.close), e.removeLayer(this))
        },
        updateZIndex: function (e) {
            this._zIndex = e, this._container && this._zIndex && (this._container.style.zIndex = e)
        },
        setOpacity: function (e) {
            this.options.opacity = e, this._container && L.DomUtil.setOpacity(this._container, e)
        },
        _initLayout: function () {
            this._container = L.DomUtil.create("div", "leaflet-label " + this.options.className + " leaflet-zoom-animated"), this.updateZIndex(this._zIndex)
        },
        _update: function () {
            this._map && (this._container.style.visibility = "hidden", this._updateContent(), this._updatePosition(), this._container.style.visibility = "")
        },
        _updateContent: function () {
            this._content && this._map && this._prevContent !== this._content && "string" == typeof this._content && (this._container.innerHTML = this._content, this._prevContent = this._content, this._labelWidth = this._container.offsetWidth)
        },
        _updatePosition: function () {
            var e = this._map.latLngToLayerPoint(this._latlng);
            this._setPosition(e)
        },
        _setPosition: function (e) {
            var t = this._map,
                n = this._container,
                r = t.latLngToContainerPoint(t.getCenter()),
                i = t.layerPointToContainerPoint(e),
                s = this.options.direction,
                o = this._labelWidth,
                u = L.point(this.options.offset);
            "right" === s || "auto" === s && i.x < r.x ? (L.DomUtil.addClass(n, "leaflet-label-right"), L.DomUtil.removeClass(n, "leaflet-label-left"), e = e.add(u)) : (L.DomUtil.addClass(n, "leaflet-label-left"), L.DomUtil.removeClass(n, "leaflet-label-right"), e = e.add(L.point(-u.x - o, u.y))), L.DomUtil.setPosition(n, e)
        },
        _zoomAnimation: function (e) {
            var t = this._map._latLngToNewLayerPoint(this._latlng, e.zoom, e.center).round();
            this._setPosition(t)
        },
        _onMoveEnd: function () {
            this._animated && "auto" !== this.options.direction || this._updatePosition()
        },
        _onViewReset: function (e) {
            e && e.hard && this._update()
        },
        _initInteraction: function () {
            if (this.options.clickable) {
                var e = this._container,
                    t = ["dblclick", "mousedown", "mouseover", "mouseout", "contextmenu"];
                L.DomUtil.addClass(e, "leaflet-clickable"), L.DomEvent.on(e, "click", this._onMouseClick, this);
                for (var n = 0; t.length > n; n++) L.DomEvent.on(e, t[n], this._fireMouseEvent, this)
            }
        },
        _removeInteraction: function () {
            if (this.options.clickable) {
                var e = this._container,
                    t = ["dblclick", "mousedown", "mouseover", "mouseout", "contextmenu"];
                L.DomUtil.removeClass(e, "leaflet-clickable"), L.DomEvent.off(e, "click", this._onMouseClick, this);
                for (var n = 0; t.length > n; n++) L.DomEvent.off(e, t[n], this._fireMouseEvent, this)
            }
        },
        _onMouseClick: function (e) {
            this.hasEventListeners(e.type) && L.DomEvent.stopPropagation(e), this.fire(e.type, {
                originalEvent: e
            })
        },
        _fireMouseEvent: function (e) {
            this.fire(e.type, {
                originalEvent: e
            }), "contextmenu" === e.type && this.hasEventListeners(e.type) && L.DomEvent.preventDefault(e), "mousedown" !== e.type ? L.DomEvent.stopPropagation(e) : L.DomEvent.preventDefault(e)
        }
    }), L.BaseMarkerMethods = {
        showLabel: function () {
            return this.label && this._map && (this.label.setLatLng(this._latlng), this._map.showLabel(this.label)), this
        },
        hideLabel: function () {
            return this.label && this.label.close(), this
        },
        setLabelNoHide: function (e) {
            this._labelNoHide !== e && (this._labelNoHide = e, e ? (this._removeLabelRevealHandlers(), this.showLabel()) : (this._addLabelRevealHandlers(), this.hideLabel()))
        },
        bindLabel: function (e, t) {
            var n = this.options.icon ? this.options.icon.options.labelAnchor : this.options.labelAnchor,
                r = L.point(n) || L.point(0, 0);
            return r = r.add(L.Label.prototype.options.offset), t && t.offset && (r = r.add(t.offset)), t = L.Util.extend({
                offset: r
            }, t), this._labelNoHide = t.noHide, this.label || (this._labelNoHide || this._addLabelRevealHandlers(), this.on("remove", this.hideLabel, this).on("move", this._moveLabel, this).on("add", this._onMarkerAdd, this), this._hasLabelHandlers = !0), this.label = (new L.Label(t, this)).setContent(e), this
        },
        unbindLabel: function () {
            return this.label && (this.hideLabel(), this.label = null, this._hasLabelHandlers && (this._labelNoHide || this._removeLabelRevealHandlers(), this.off("remove", this.hideLabel, this).off("move", this._moveLabel, this).off("add", this._onMarkerAdd, this)), this._hasLabelHandlers = !1), this
        },
        updateLabelContent: function (e) {
            this.label && this.label.setContent(e)
        },
        getLabel: function () {
            return this.label
        },
        _onMarkerAdd: function () {
            this._labelNoHide && this.showLabel()
        },
        _addLabelRevealHandlers: function () {
            this.on("mouseover", this.showLabel, this).on("mouseout", this.hideLabel, this), L.Browser.touch && this.on("click", this.showLabel, this)
        },
        _removeLabelRevealHandlers: function () {
            this.off("mouseover", this.showLabel, this).off("mouseout", this.hideLabel, this), L.Browser.touch && this.off("click", this.showLabel, this)
        },
        _moveLabel: function (e) {
            this.label.setLatLng(e.latlng)
        }
    }, L.Icon.Default.mergeOptions({
        labelAnchor: new L.Point(9, -20)
    }), L.Marker.mergeOptions({
        icon: new L.Icon.Default
    }), L.Marker.include(L.BaseMarkerMethods), L.Marker.include({
        _originalUpdateZIndex: L.Marker.prototype._updateZIndex,
        _updateZIndex: function (e) {
            var t = this._zIndex + e;
            this._originalUpdateZIndex(e), this.label && this.label.updateZIndex(t)
        },
        _originalSetOpacity: L.Marker.prototype.setOpacity,
        setOpacity: function (e, t) {
            this.options.labelHasSemiTransparency = t, this._originalSetOpacity(e)
        },
        _originalUpdateOpacity: L.Marker.prototype._updateOpacity,
        _updateOpacity: function () {
            var e = 0 === this.options.opacity ? 0 : 1;
            this._originalUpdateOpacity(), this.label && this.label.setOpacity(this.options.labelHasSemiTransparency ? this.options.opacity : e)
        },
        _originalSetLatLng: L.Marker.prototype.setLatLng,
        setLatLng: function (e) {
            return this.label && !this._labelNoHide && this.hideLabel(), this._originalSetLatLng(e)
        }
    }), L.CircleMarker.mergeOptions({
        labelAnchor: new L.Point(0, 0)
    }), L.CircleMarker.include(L.BaseMarkerMethods), L.Path.include({
        bindLabel: function (e, t) {
            return this.label && this.label.options === t || (this.label = new L.Label(t, this)), this.label.setContent(e), this._showLabelAdded || (this.on("mouseover", this._showLabel, this).on("mousemove", this._moveLabel, this).on("mouseout remove", this._hideLabel, this), L.Browser.touch && this.on("click", this._showLabel, this), this._showLabelAdded = !0), this
        },
        unbindLabel: function () {
            return this.label && (this._hideLabel(), this.label = null, this._showLabelAdded = !1, this.off("mouseover", this._showLabel, this).off("mousemove", this._moveLabel, this).off("mouseout remove", this._hideLabel, this)), this
        },
        updateLabelContent: function (e) {
            this.label && this.label.setContent(e)
        },
        _showLabel: function (e) {
            this.label.setLatLng(e.latlng), this._map.showLabel(this.label)
        },
        _moveLabel: function (e) {
            this.label.setLatLng(e.latlng)
        },
        _hideLabel: function () {
            this.label.close()
        }
    }), L.Map.include({
        showLabel: function (e) {
            return this.addLayer(e)
        }
    }), L.FeatureGroup.include({
        clearLayers: function () {
            return this.unbindLabel(), this.eachLayer(this.removeLayer, this), this
        },
        bindLabel: function (e, t) {
            return this.invoke("bindLabel", e, t)
        },
        unbindLabel: function () {
            return this.invoke("unbindLabel")
        },
        updateLabelContent: function (e) {
            this.invoke("updateLabelContent", e)
        }
    })
})(this, document);
(function (e, t) {
    if (typeof exports == "object") module.exports = t();
    else if (typeof define == "function" && define.amd) define(t);
    else e.Spinner = t()
})(this, function () {
    "use strict";

    function r(e, t) {
        var n = document.createElement(e || "div"),
            r;
        for (r in t) n[r] = t[r];
        return n
    }

    function i(e) {
        for (var t = 1, n = arguments.length; t < n; t++) e.appendChild(arguments[t]);
        return e
    }

    function o(e, r, i, o) {
        var u = ["opacity", r, ~~ (e * 100), i, o].join("-"),
            a = .01 + i / o * 100,
            f = Math.max(1 - (1 - e) / r * (100 - a), e),
            l = n.substring(0, n.indexOf("Animation")).toLowerCase(),
            c = l && "-" + l + "-" || "";
        if (!t[u]) {
            s.insertRule("@" + c + "keyframes " + u + "{" + "0%{opacity:" + f + "}" + a + "%{opacity:" + e + "}" + (a + .01) + "%{opacity:1}" + (a + r) % 100 + "%{opacity:" + e + "}" + "100%{opacity:" + f + "}" + "}", s.cssRules.length);
            t[u] = 1
        }
        return u
    }

    function u(t, n) {
        var r = t.style,
            i, s;
        n = n.charAt(0).toUpperCase() + n.slice(1);
        for (s = 0; s < e.length; s++) {
            i = e[s] + n;
            if (r[i] !== undefined) return i
        }
        if (r[n] !== undefined) return n
    }

    function a(e, t) {
        for (var n in t) e.style[u(e, n) || n] = t[n];
        return e
    }

    function f(e) {
        for (var t = 1; t < arguments.length; t++) {
            var n = arguments[t];
            for (var r in n)
                if (e[r] === undefined) e[r] = n[r]
        }
        return e
    }

    function l(e) {
        var t = {
            x: e.offsetLeft,
            y: e.offsetTop
        };
        while (e = e.offsetParent) t.x += e.offsetLeft, t.y += e.offsetTop;
        return t
    }

    function c(e, t) {
        return typeof e == "string" ? e : e[t % e.length]
    }

    function p(e) {
        if (typeof this == "undefined") return new p(e);
        this.opts = f(e || {}, p.defaults, h)
    }

    function d() {
        function e(e, t) {
            return r("<" + e + ' xmlns="urn:schemas-microsoft.com:vml" class="spin-vml">', t)
        }
        s.addRule(".spin-vml", "behavior:url(#default#VML)");
        p.prototype.lines = function (t, n) {
            function o() {
                return a(e("group", {
                    coordsize: s + " " + s,
                    coordorigin: -r + " " + -r
                }), {
                    width: s,
                    height: s
                })
            }

            function h(t, s, u) {
                i(f, i(a(o(), {
                    rotation: 360 / n.lines * t + "deg",
                    left: ~~s
                }), i(a(e("roundrect", {
                    arcsize: n.corners
                }), {
                    width: r,
                    height: n.width,
                    left: n.radius,
                    top: -n.width >> 1,
                    filter: u
                }), e("fill", {
                    color: c(n.color, t),
                    opacity: n.opacity
                }), e("stroke", {
                    opacity: 0
                }))))
            }
            var r = n.length + n.width,
                s = 2 * r;
            var u = -(n.width + n.length) * 2 + "px",
                f = a(o(), {
                    position: "absolute",
                    top: u,
                    left: u
                }),
                l;
            if (n.shadow)
                for (l = 1; l <= n.lines; l++) h(l, -2, "progid:DXImageTransform.Microsoft.Blur(pixelradius=2,makeshadow=1,shadowopacity=.3)");
            for (l = 1; l <= n.lines; l++) h(l);
            return i(t, f)
        };
        p.prototype.opacity = function (e, t, n, r) {
            var i = e.firstChild;
            r = r.shadow && r.lines || 0;
            if (i && t + r < i.childNodes.length) {
                i = i.childNodes[t + r];
                i = i && i.firstChild;
                i = i && i.firstChild;
                if (i) i.opacity = n
            }
        }
    }
    var e = ["webkit", "Moz", "ms", "O"],
        t = {}, n;
    var s = function () {
        var e = r("style", {
            type: "text/css"
        });
        i(document.getElementsByTagName("head")[0], e);
        return e.sheet || e.styleSheet
    }();
    var h = {
        lines: 12,
        length: 7,
        width: 5,
        radius: 10,
        rotate: 0,
        corners: 1,
        color: "#000",
        direction: 1,
        speed: 1,
        trail: 100,
        opacity: 1 / 4,
        fps: 20,
        zIndex: 2e9,
        className: "spinner",
        top: "auto",
        left: "auto",
        position: "relative"
    };
    p.defaults = {};
    f(p.prototype, {
        spin: function (e) {
            this.stop();
            var t = this,
                i = t.opts,
                s = t.el = a(r(0, {
                    className: i.className
                }), {
                    position: i.position,
                    width: 0,
                    zIndex: i.zIndex
                }),
                o = i.radius + i.length + i.width,
                u, f;
            if (e) {
                e.insertBefore(s, e.firstChild || null);
                f = l(e);
                u = l(s);
                a(s, {
                    left: (i.left == "auto" ? f.x - u.x + (e.offsetWidth >> 1) : parseInt(i.left, 10) + o) + "px",
                    top: (i.top == "auto" ? f.y - u.y + (e.offsetHeight >> 1) : parseInt(i.top, 10) + o) + "px"
                })
            }
            s.setAttribute("role", "progressbar");
            t.lines(s, t.opts);
            if (!n) {
                var c = 0,
                    h = (i.lines - 1) * (1 - i.direction) / 2,
                    p, d = i.fps,
                    v = d / i.speed,
                    m = (1 - i.opacity) / (v * i.trail / 100),
                    g = v / i.lines;
                (function y() {
                    c++;
                    for (var e = 0; e < i.lines; e++) {
                        p = Math.max(1 - (c + (i.lines - e) * g) % v * m, i.opacity);
                        t.opacity(s, e * i.direction + h, p, i)
                    }
                    t.timeout = t.el && setTimeout(y, ~~ (1e3 / d))
                })()
            }
            return t
        },
        stop: function () {
            var e = this.el;
            if (e) {
                clearTimeout(this.timeout);
                if (e.parentNode) e.parentNode.removeChild(e);
                this.el = undefined
            }
            return this
        },
        lines: function (e, t) {
            function l(e, n) {
                return a(r(), {
                    position: "absolute",
                    width: t.length + t.width + "px",
                    height: t.width + "px",
                    background: e,
                    boxShadow: n,
                    transformOrigin: "left",
                    transform: "rotate(" + ~~(360 / t.lines * s + t.rotate) + "deg) translate(" + t.radius + "px" + ",0)",
                    borderRadius: (t.corners * t.width >> 1) + "px"
                })
            }
            var s = 0,
                u = (t.lines - 1) * (1 - t.direction) / 2,
                f;
            for (; s < t.lines; s++) {
                f = a(r(), {
                    position: "absolute",
                    top: 1 + ~(t.width / 2) + "px",
                    transform: t.hwaccel ? "translate3d(0,0,0)" : "",
                    opacity: t.opacity,
                    animation: n && o(t.opacity, t.trail, u + s * t.direction, t.lines) + " " + 1 / t.speed + "s linear infinite"
                });
                if (t.shadow) i(f, a(l("#000", "0 0 4px " + "#000"), {
                    top: 2 + "px"
                }));
                i(e, i(f, l(c(t.color, s), "0 0 1px rgba(0,0,0,.1)")))
            }
            return e
        },
        opacity: function (e, t, n) {
            if (t < e.childNodes.length) e.childNodes[t].style.opacity = n
        }
    });
    var v = a(r("group"), {
        behavior: "url(#default#VML)"
    });
    if (!u(v, "transform") && v.adj) d();
    else n = u(v, "animation");
    return p
})