/*
 *  /MathJax/extensions/MatchWebFonts.js
 *
 *  Copyright (c) 2009-2015 The MathJax Consortium
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

(function (c, b) {
    var d = "2.5.0";
    var a = MathJax.Hub.CombineConfig("MatchWebFonts", {
        matchFor: {
            "HTML-CSS": true,
            NativeMML: true,
            SVG: true
        }, fontCheckDelay: 500, fontCheckTimeout: 15 * 1000,
    });
    MathJax.Extension.MatchWebFonts = {version: d, config: a};
    c.Register.StartupHook("HTML-CSS Jax Ready", function () {
        var e = MathJax.OutputJax["HTML-CSS"];
        var f = e.postTranslate;
        e.Augment({
            postTranslate: function (h, g) {
                if (!g && a.matchFor["HTML-CSS"] && this.config.matchFontHeight) {
                    b.timer.start(b, ["checkFonts", this, h.jax[this.id]], a.fontCheckDelay, a.fontCheckTimeout)
                }
                return f.apply(this, arguments)
            }, checkFonts: function (k, o) {
                if (k.time(function () {
                    })) {
                    return
                }
                var s = [], p, l, g = false;
                for (p = 0, l = o.length; p < l; p++) {
                    script = o[p];
                    if (script.parentNode && script.MathJax.elementJax) {
                        script.parentNode.insertBefore(this.EmExSpan.cloneNode(true), script)
                    }
                }
                for (p = 0, l = o.length; p < l; p++) {
                    script = o[p];
                    if (!script.parentNode) {
                        continue
                    }
                    g = true;
                    var h = script.MathJax.elementJax;
                    if (!h) {
                        continue
                    }
                    var r = script.previousSibling;
                    var q = r.firstChild.offsetHeight / 60;
                    var j = r.lastChild.lastChild.offsetHeight / 60;
                    if (q === 0 || q === "NaN") {
                        q = this.defaultEx;
                        j = this.defaultEm
                    }
                    if (q !== h.HTMLCSS.ex || j !== h.HTMLCSS.em) {
                        var n = q / this.TeX.x_height / j;
                        n = Math.floor(Math.max(this.config.minScaleAdjust / 100, n) * this.config.scale);
                        if (n / 100 !== h.scale) {
                            s.push(script);
                            o[p] = {}
                        }
                    }
                }
                o = o.concat(s);
                for (p = 0, l = o.length; p < l; p++) {
                    script = o[p];
                    if (script && script.parentNode && script.MathJax.elementJax) {
                        script.parentNode.removeChild(script.previousSibling)
                    }
                }
                if (s.length) {
                    c.Queue(["Rerender", c, [s], {}])
                }
                if (g) {
                    setTimeout(k, k.delay)
                }
            }
        })
    });
    c.Register.StartupHook("SVG Jax Ready", function () {
        var f = MathJax.OutputJax.SVG;
        var e = f.postTranslate;
        f.Augment({
            postTranslate: function (h, g) {
                if (!g && a.matchFor.SVG) {
                    b.timer.start(b, ["checkFonts", this, h.jax[this.id]], a.fontCheckDelay, a.fontCheckTimeout)
                }
                return e.apply(this, arguments)
            }, checkFonts: function (j, l) {
                if (j.time(function () {
                    })) {
                    return
                }
                var q = [], n, k, g = false;
                for (n = 0, k = l.length; n < k; n++) {
                    script = l[n];
                    if (script.parentNode && script.MathJax.elementJax) {
                        script.parentNode.insertBefore(this.ExSpan.cloneNode(true), script)
                    }
                }
                for (n = 0, k = l.length; n < k; n++) {
                    script = l[n];
                    if (!script.parentNode) {
                        continue
                    }
                    g = true;
                    var h = script.MathJax.elementJax;
                    if (!h) {
                        continue
                    }
                    var p = script.previousSibling;
                    var o = p.firstChild.offsetHeight / 60;
                    if (o === 0 || o === "NaN") {
                        o = this.defaultEx
                    }
                    if (o !== h.SVG.ex) {
                        q.push(script);
                        l[n] = {}
                    }
                }
                l = l.concat(q);
                for (n = 0, k = l.length; n < k; n++) {
                    script = l[n];
                    if (script.parentNode && script.MathJax.elementJax) {
                        script.parentNode.removeChild(script.previousSibling)
                    }
                }
                if (q.length) {
                    c.Queue(["Rerender", c, [q], {}])
                }
                if (g) {
                    setTimeout(j, j.delay)
                }
            }
        })
    });
    c.Register.StartupHook("NativeMML Jax Ready", function () {
        var e = MathJax.OutputJax.NativeMML;
        var f = e.postTranslate;
        e.Augment({
            postTranslate: function (g) {
                if (!c.Browser.isMSIE && a.matchFor.NativeMML) {
                    b.timer.start(b, ["checkFonts", this, g.jax[this.id]], a.fontCheckDelay, a.fontCheckTimeout)
                }
                f.apply(this, arguments)
            }, checkFonts: function (A, l) {
                if (A.time(function () {
                    })) {
                    return
                }
                var t = [], q = [], o = [], w, s, B;
                for (w = 0, s = l.length; w < s; w++) {
                    B = l[w];
                    if (B.parentNode && B.MathJax.elementJax) {
                        B.parentNode.insertBefore(this.EmExSpan.cloneNode(true), B)
                    }
                }
                for (w = 0, s = l.length; w < s; w++) {
                    B = l[w];
                    if (!B.parentNode) {
                        continue
                    }
                    var g = B.MathJax.elementJax;
                    if (!g) {
                        continue
                    }
                    var v = document.getElementById(g.inputID + "-Frame");
                    var k = v.getElementsByTagName("math")[0];
                    if (!k) {
                        continue
                    }
                    g = g.NativeMML;
                    var y = B.previousSibling;
                    var z = y.firstChild.offsetWidth / 60;
                    var h = y.lastChild.offsetWidth / 60;
                    if (z === 0 || z === "NaN") {
                        z = this.defaultEx;
                        h = this.defaultMEx
                    }
                    var r = (z !== g.ex);
                    if (r || h != g.mex) {
                        var C = (this.config.matchFontHeight && h > 1 ? z / h : 1);
                        C = Math.floor(Math.max(this.config.minScaleAdjust / 100, C) * this.config.scale);
                        if (C / 100 !== g.scale) {
                            o.push([v.style, C])
                        }
                        g.scale = C / 100;
                        g.fontScale = C + "%";
                        g.ex = z;
                        g.mex = h
                    }
                    if ("scrollWidth" in g && (r || g.scrollWidth !== k.firstChild.scrollWidth)) {
                        g.scrollWidth = k.firstChild.scrollWidth;
                        t.push([k.parentNode.style, g.scrollWidth / g.ex / g.scale])
                    }
                    if (k.MathJaxMtds) {
                        for (var u = 0, p = k.MathJaxMtds.length; u < p; u++) {
                            if (!k.MathJaxMtds[u].parentNode) {
                                continue
                            }
                            if (r || k.MathJaxMtds[u].firstChild.scrollWidth !== g.mtds[u]) {
                                g.mtds[u] = k.MathJaxMtds[u].firstChild.scrollWidth;
                                q.push([k.MathJaxMtds[u], g.mtds[u] / g.ex])
                            }
                        }
                    }
                }
                for (w = 0, s = l.length; w < s; w++) {
                    B = l[w];
                    if (B.parentNode && B.MathJax.elementJax) {
                        B.parentNode.removeChild(B.previousSibling)
                    }
                }
                for (w = 0, s = o.length; w < s; w++) {
                    o[w][0].fontSize = o[w][1] + "%"
                }
                for (w = 0, s = t.length; w < s; w++) {
                    t[w][0].width = t[w][1].toFixed(3) + "ex"
                }
                for (w = 0, s = q.length; w < s; w++) {
                    var x = q[w][0].getAttribute("style");
                    x = x.replace(/(($|;)\s*min-width:).*?ex/, "$1 " + q[w][1].toFixed(3) + "ex");
                    q[w][0].setAttribute("style", x)
                }
                setTimeout(A, A.delay)
            }
        })
    });
    c.Startup.signal.Post("MatchWebFonts Extension Ready");
    b.loadComplete("[MathJax]/extensions/MatchWebFonts.js")
})(MathJax.Hub, MathJax.Ajax);