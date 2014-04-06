(function (e) {
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