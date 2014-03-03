// routing and spinner functions

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

// spinner
//fgnass.github.com/spin.js#v1.3.3

!function(a,b){"object"==typeof exports?module.exports=b():"function"==typeof define&&define.amd?define(b):a.Spinner=b()}(this,function(){"use strict";function a(a,b){var c,d=document.createElement(a||"div");for(c in b)d[c]=b[c];return d}function b(a){for(var b=1,c=arguments.length;c>b;b++)a.appendChild(arguments[b]);return a}function c(a,b,c,d){var e=["opacity",b,~~(100*a),c,d].join("-"),f=.01+c/d*100,g=Math.max(1-(1-a)/b*(100-f),a),h=k.substring(0,k.indexOf("Animation")).toLowerCase(),i=h&&"-"+h+"-"||"";return m[e]||(n.insertRule("@"+i+"keyframes "+e+"{0%{opacity:"+g+"}"+f+"%{opacity:"+a+"}"+(f+.01)+"%{opacity:1}"+(f+b)%100+"%{opacity:"+a+"}100%{opacity:"+g+"}}",n.cssRules.length),m[e]=1),e}function d(a,b){var c,d,e=a.style;for(b=b.charAt(0).toUpperCase()+b.slice(1),d=0;d<l.length;d++)if(c=l[d]+b,void 0!==e[c])return c;return void 0!==e[b]?b:void 0}function e(a,b){for(var c in b)a.style[d(a,c)||c]=b[c];return a}function f(a){for(var b=1;b<arguments.length;b++){var c=arguments[b];for(var d in c)void 0===a[d]&&(a[d]=c[d])}return a}function g(a){for(var b={x:a.offsetLeft,y:a.offsetTop};a=a.offsetParent;)b.x+=a.offsetLeft,b.y+=a.offsetTop;return b}function h(a,b){return"string"==typeof a?a:a[b%a.length]}function i(a){return"undefined"==typeof this?new i(a):(this.opts=f(a||{},i.defaults,o),void 0)}function j(){function c(b,c){return a("<"+b+' xmlns="urn:schemas-microsoft.com:vml" class="spin-vml">',c)}n.addRule(".spin-vml","behavior:url(#default#VML)"),i.prototype.lines=function(a,d){function f(){return e(c("group",{coordsize:k+" "+k,coordorigin:-j+" "+-j}),{width:k,height:k})}function g(a,g,i){b(m,b(e(f(),{rotation:360/d.lines*a+"deg",left:~~g}),b(e(c("roundrect",{arcsize:d.corners}),{width:j,height:d.width,left:d.radius,top:-d.width>>1,filter:i}),c("fill",{color:h(d.color,a),opacity:d.opacity}),c("stroke",{opacity:0}))))}var i,j=d.length+d.width,k=2*j,l=2*-(d.width+d.length)+"px",m=e(f(),{position:"absolute",top:l,left:l});if(d.shadow)for(i=1;i<=d.lines;i++)g(i,-2,"progid:DXImageTransform.Microsoft.Blur(pixelradius=2,makeshadow=1,shadowopacity=.3)");for(i=1;i<=d.lines;i++)g(i);return b(a,m)},i.prototype.opacity=function(a,b,c,d){var e=a.firstChild;d=d.shadow&&d.lines||0,e&&b+d<e.childNodes.length&&(e=e.childNodes[b+d],e=e&&e.firstChild,e=e&&e.firstChild,e&&(e.opacity=c))}}var k,l=["webkit","Moz","ms","O"],m={},n=function(){var c=a("style",{type:"text/css"});return b(document.getElementsByTagName("head")[0],c),c.sheet||c.styleSheet}(),o={lines:12,length:7,width:5,radius:10,rotate:0,corners:1,color:"#000",direction:1,speed:1,trail:100,opacity:.25,fps:20,zIndex:2e9,className:"spinner",top:"auto",left:"auto",position:"relative"};i.defaults={},f(i.prototype,{spin:function(b){this.stop();var c,d,f=this,h=f.opts,i=f.el=e(a(0,{className:h.className}),{position:h.position,width:0,zIndex:h.zIndex}),j=h.radius+h.length+h.width;if(b&&(b.insertBefore(i,b.firstChild||null),d=g(b),c=g(i),e(i,{left:("auto"==h.left?d.x-c.x+(b.offsetWidth>>1):parseInt(h.left,10)+j)+"px",top:("auto"==h.top?d.y-c.y+(b.offsetHeight>>1):parseInt(h.top,10)+j)+"px"})),i.setAttribute("role","progressbar"),f.lines(i,f.opts),!k){var l,m=0,n=(h.lines-1)*(1-h.direction)/2,o=h.fps,p=o/h.speed,q=(1-h.opacity)/(p*h.trail/100),r=p/h.lines;!function s(){m++;for(var a=0;a<h.lines;a++)l=Math.max(1-(m+(h.lines-a)*r)%p*q,h.opacity),f.opacity(i,a*h.direction+n,l,h);f.timeout=f.el&&setTimeout(s,~~(1e3/o))}()}return f},stop:function(){var a=this.el;return a&&(clearTimeout(this.timeout),a.parentNode&&a.parentNode.removeChild(a),this.el=void 0),this},lines:function(d,f){function g(b,c){return e(a(),{position:"absolute",width:f.length+f.width+"px",height:f.width+"px",background:b,boxShadow:c,transformOrigin:"left",transform:"rotate("+~~(360/f.lines*j+f.rotate)+"deg) translate("+f.radius+"px,0)",borderRadius:(f.corners*f.width>>1)+"px"})}for(var i,j=0,l=(f.lines-1)*(1-f.direction)/2;j<f.lines;j++)i=e(a(),{position:"absolute",top:1+~(f.width/2)+"px",transform:f.hwaccel?"translate3d(0,0,0)":"",opacity:f.opacity,animation:k&&c(f.opacity,f.trail,l+j*f.direction,f.lines)+" "+1/f.speed+"s linear infinite"}),f.shadow&&b(i,e(g("#000","0 0 4px #000"),{top:"2px"})),b(d,b(i,g(h(f.color,j),"0 0 1px rgba(0,0,0,.1)")));return d},opacity:function(a,b,c){b<a.childNodes.length&&(a.childNodes[b].style.opacity=c)}});var p=e(a("group"),{behavior:"url(#default#VML)"});return!d(p,"transform")&&p.adj?j():k=d(p,"animation"),i});