// ==============================================
// File:    jscss.js
// Author:  Leland Richardson <leland@tech.pro>
// License: MIT
// More:    https://github.com/lelandrichardson/jscss
// ==============================================
(function(){
    var
        // the global object
        root = this,

        // the css declarations decl[selector][rule] = value;
        decl = {},

        // hash of the <style> elements (one per selector)
        elem = {};


    // transforms property names to css selectors (ie, "backgroundColor" -> "background-color")
    function camelToDashed (camel) {
        return camel.replace(/[A-Z]/g, function(m){
            return "-" + m.toLowerCase();
        }).replace("_", "-").replace(/[^a-z-]/g, "");
    }

    // compiles a ruleset into "valid" CSS
    function compile (selector, ruleset) {
        var lines = [""], prop;

        lines.push(selector + "{");

        for ( prop in ruleset ) {
            lines.push(compileRule(prop, ruleset[prop]));
        }

        lines.push("}\n");

        return lines.join("\n");
    }

    // compiles a style rule into a "valid" style rule.
    // TODO: should add some logic to convert numbers into pixels, etc.
    function compileRule (left, right) {
        return [
            camelToDashed(left),":",right,";"
        ].join("");
    }

    // returns the <style> element from the corresponding selector. creates it if needed.
    function getStyleEl (selector) {
        if ( !( selector in decl ) ) {
            decl[selector] = {};
            elem[selector] = document.createElement("style");
            document.head.appendChild( elem[selector] );
        }
        return elem[selector];
    }

    // exported "main" function. Has a fluent interface (returns itself).
    function jscss(selector, ruleset) {

        var el = getStyleEl(selector), rule;

        for ( rule in ruleset )
            decl[selector][rule] = ruleset[rule];

        el.innerHTML = compile(selector, decl[selector]);

        return jscss;
    }

    // export to global
    root["jscss"] = jscss;

}());