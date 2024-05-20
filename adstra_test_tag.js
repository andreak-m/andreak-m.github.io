var script_tag = document.getElementById("inc");
var LiveRampTagID = script_tag.getAttribute("data-tagId");
var tmsID = script_tag.getAttribute("data-tms");
var dtrafficSource = script_tag.getAttribute("data-trafficSource");
var dreferralChannel = script_tag.getAttribute("data-referralChannel");
var dreferralSource = script_tag.getAttribute("data-referralSource");
var dsearchGroup = script_tag.getAttribute("data-searchGroup");
var drepeatVisitor = script_tag.getAttribute("data-repeatVisitor");
var dDomain = script_tag.getAttribute("data-domain");
var dDeviceType = script_tag.getAttribute("data-deviceType");
var dMapIdType = script_tag.getAttribute("data-mapid");
var dKeyActType = script_tag.getAttribute("data-keyActType");
var urlParams;
(window.onpopstate = function() {
    var match, pl = /\+/g, search = /([^&=]+)=?([^&]*)/g, decode = function(s) {
        return decodeURIComponent(s.replace(pl, " "))
    }, query = window.location.search.substring(1);
    urlParams = {};
    while (match = search.exec(query))
        urlParams[decode(match[1])] = decode(match[2])
}
)();
var LiveRamp_utm_medium = urlParams["utm_medium"] || "";
var LiveRamp_utm_campaign = urlParams["utm_campaign"] || "";
var LiveRamp_utm_source = urlParams["utm_source"] || "";
var LiveRamp_utm_content = urlParams["utm_content"] || "";
var knownTypes = ["guid", "cid", "msclkid", "gclid"];
if (dMapIdType !== null) {
    function arrayUnique(array) {
        var a = array.concat();
        for (var i = 0; i < a.length; ++i) {
            for (var j = i + 1; j < a.length; ++j) {
                if (a[i] === a[j])
                    a.splice(j--, 1)
            }
        }
        return a
    }
    var dlTypes = dMapIdType.split("|");
    var mergedTypes = arrayUnique(knownTypes.concat(dlTypes))
} else {
    mergedTypes = knownTypes
}
var mergedValues = [];
mergedTypes.forEach(function(entry) {
    if (typeof urlParams[entry] === "undefined" || urlParams[entry] == "") {
        mergedValues.push("u")
    } else {
        mergedValues.push(urlParams[entry])
    }
});
var result = {};
var deleteTypes = [];
mergedTypes.forEach(function(key, i) {
    result[key] = mergedValues[i]
});
for (var key in result) {
    if (result[key] == "u") {
        deleteTypes.push(key)
    }
}
deleteTypes.forEach(function(entry) {
    delete result[entry]
});
Object.size = function(obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key))
            size++
    }
    return size
}
;
var pDataTypes = [];
var pDataValues = [];
for (var key in result) {
    pDataTypes.push(key);
    pDataValues.push(result[key])
}
var siteURL = document.location.href;
function chunkString(str, len) {
    if (str == "") {
        return [""]
    }
    var _size = Math.ceil(str.length / len), _ret = new Array(_size), _offset;
    for (var _i = 0; _i < _size; _i++) {
        _offset = _i * len;
        _ret[_i] = str.substring(_offset, _offset + len)
    }
    return _ret
}
function replace_chars(str) {
    str = str.replace(/\|/g, "■");
    str = str.replace(/,/g, "Æ");
    str = str.replace(/=/g, "⌠");
    str = str.replace(/'/g, "Þ");
    str = str.replace(/"/g, "Ð");
    str = str.replace(/%7c/g, "■");
    str = str.replace(/%2c/g, "Æ");
    str = str.replace(/%3d/g, "⌠");
    str = str.replace(/%7C/g, "■");
    str = str.replace(/%2C/g, "Æ");
    str = str.replace(/%3D/g, "⌠");
    str = str.replace(/%27/g, "Þ");
    str = str.replace(/%22/g, "Ð");
    str = str.replace(/%257c/g, "■");
    str = str.replace(/%252c/g, "Æ");
    str = str.replace(/%253d/g, "⌠");
    str = str.replace(/%2527/g, "Þ");
    str = str.replace(/%2522/g, "Ð");
    return str
}
function isURL(str) {
    var regex = /((https|http):\/\/)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/gi;
    return regex.test(str)
}
function isNonLatinCharacters(str) {
    return /[^\u0000-\u00FF]/.test(str)
}
function truncate_url(str) {
    if (str == "" || str == "u" || !isURL(str) || isNonLatinCharacters(str)) {
        return chunkString(str, 125)[0]
    } else if (str.indexOf("http") != 0) {
        str = "https://" + str
    }
    str = "https://" + extractHostname(str);
    return str
}
function extractHostname(urlstr) {
    var hostname;
    if (urlstr.indexOf("//") > -1) {
        hostname = urlstr.split("/")[2]
    } else {
        hostname = urlstr.split("/")[0]
    }
    return hostname
}
var URLparts = chunkString(siteURL, 250);
var docCookies = {
    getItem: function(sKey) {
        if (!sKey) {
            return null
        }
        return decodeURIComponent(document.cookie.replace(new RegExp("(?:(?:^|.*;)\\s*" + encodeURIComponent(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=\\s*([^;]*).*$)|^.*$"), "$1")) || null
    },
    setItem: function(sKey, sValue, vEnd, sPath, sDomain, bSecure) {
        if (!sKey || /^(?:expires|max\-age|path|domain|secure)$/i.test(sKey)) {
            return false
        }
        var sExpires = "";
        if (vEnd) {
            switch (vEnd.constructor) {
            case Number:
                sExpires = vEnd === Infinity ? "; expires=Fri, 31 Dec 9999 23:59:59 GMT" : "; max-age=" + vEnd;
                break;
            case String:
                sExpires = "; expires=" + vEnd;
                break;
            case Date:
                sExpires = "; expires=" + vEnd.toUTCString();
                break
            }
        }
        document.cookie = encodeURIComponent(sKey) + "=" + encodeURIComponent(sValue) + sExpires + (sDomain ? "; domain=" + sDomain : "") + (sPath ? "; path=" + sPath : "") + (bSecure ? "; secure" : "");
        return true
    },
    removeItem: function(sKey, sPath, sDomain) {
        if (!this.hasItem(sKey)) {
            return false
        }
        document.cookie = encodeURIComponent(sKey) + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT" + (sDomain ? "; domain=" + sDomain : "") + (sPath ? "; path=" + sPath : "");
        return true
    },
    hasItem: function(sKey) {
        if (!sKey || /^(?:expires|max\-age|path|domain|secure)$/i.test(sKey)) {
            return false
        }
        return new RegExp("(?:^|;\\s*)" + encodeURIComponent(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=").test(document.cookie)
    },
    keys: function() {
        var aKeys = document.cookie.replace(/((?:^|\s*;)[^\=]+)(?=;|$)|^\s*|\s*(?:\=[^;]*)?(?:\1|$)/g, "").split(/\s*(?:\=[^;]*)?;\s*/);
        for (var nLen = aKeys.length, nIdx = 0; nIdx < nLen; nIdx++) {
            aKeys[nIdx] = decodeURIComponent(aKeys[nIdx])
        }
        return aKeys
    }
};
var setCookieDomain = function() {
    var splitHostname = location.hostname.split(".");
    var removedSubdomain = splitHostname.slice(-2);
    var rootDomain = removedSubdomain.join(".");
    return rootDomain
};
function SendLiveRamp(keyActionOn, callBack) {
    var trafficSource = "u";
    var referralChannel = "u";
    var referralSource = "u";
    var searchGroup = "u";
    var pData = {};
    var pDataString = "";
    var sessionID = "u";
    var version = "1.5.0";
    var setCookiePath = "/";
    var referralExclusionRe = new RegExp(setCookieDomain());
    setSessionID();
    getReferrerData();
    console.log("Hosted Tag Version: " + version);
    trafficSource = dtrafficSource || trafficSource || "u";
    referralChannel = dreferralChannel || referralChannel || "u";
    referralSource = dreferralSource || referralSource || "u";
    searchGroup = dsearchGroup || searchGroup || "u";
    pData.SessionID = sessionID;
    pData.SessionID = chunkString(pData.SessionID, 250)[0];
    pData.RepeatVisitor = drepeatVisitor || checkRepeatVisitor() || "u";
    pData.RepeatVisitor = chunkString(pData.RepeatVisitor, 250)[0];
    pData.Domain = dDomain || document.location.hostname || "u";
    pData.Domain = chunkString(pData.Domain, 250)[0];
    pData.DeviceType = dDeviceType || getDeviceType() || "u";
    pData.DeviceType = chunkString(pData.DeviceType, 250)[0];
    pData.Version = "version " + version;
    pData.Version = chunkString(pData.Version, 250)[0];
    if (Object.size(result) > 0) {
        pData.MapIdType = chunkString(replace_chars(pDataTypes.join("■")), 250)[0];
        pData.MapIdValue = chunkString(replace_chars(pDataValues.join("■")), 250)[0]
    } else {
        pData.MapIdType = "u";
        pData.MapIdValue = "u"
    }
    pData.pageUrl = replace_chars(URLparts[0]);
    if (typeof URLparts[1] !== "undefined") {
        pData.pageurl2 = replace_chars(URLparts[1])
    } else {
        pData.pageurl2 = "u"
    }
    if (typeof URLparts[2] !== "undefined") {
        pData.pageurl3 = replace_chars(URLparts[2])
    } else {
        pData.pageurl3 = "u"
    }
    if (typeof URLparts[3] !== "undefined") {
        pData.pageurl4 = replace_chars(URLparts[3])
    } else {
        pData.pageurl4 = "u"
    }
    pData.TrafficSource = chunkString(replace_chars(trafficSource), 250)[0];
    pData.ReferralChannel = chunkString(replace_chars(referralChannel), 250)[0];
    pData.ReferralSource = chunkString(replace_chars(truncate_url(referralSource)), 250)[0];
    pData.SearchGroup = chunkString(replace_chars(searchGroup), 250)[0];
    var arrKeyActions = [];
    var i;
    for (i = 0; i < 20; i++) {
        arrKeyActions[i] = 0
    }
    pData.KeyActionID = "u";
    if (arguments.length != 0) {
        if (keyActionOn != 0) {
            if (dKeyActType == "KAID") {
                pData.KeyActionID = chunkString(replace_chars(keyActionOn), 250)[0]
            } else {
                arrKeyActions[keyActionOn - 1] = 1
            }
        }
    }
    pData.KeyAct1 = arrKeyActions[0];
    pData.KeyAct2 = arrKeyActions[1];
    pData.KeyAct3 = arrKeyActions[2];
    pData.KeyAct4 = arrKeyActions[3];
    pData.KeyAct5 = arrKeyActions[4];
    pData.KeyAct6 = arrKeyActions[5];
    pData.KeyAct7 = arrKeyActions[6];
    pData.KeyAct8 = arrKeyActions[7];
    pData.KeyAct9 = arrKeyActions[8];
    pData.KeyAct10 = arrKeyActions[9];
    pData.KeyAct11 = arrKeyActions[10];
    pData.KeyAct12 = arrKeyActions[11];
    pData.KeyAct13 = arrKeyActions[12];
    pData.KeyAct14 = arrKeyActions[13];
    pData.KeyAct15 = arrKeyActions[14];
    pData.KeyAct16 = arrKeyActions[15];
    pData.KeyAct17 = arrKeyActions[16];
    pData.KeyAct18 = arrKeyActions[17];
    pData.KeyAct19 = arrKeyActions[18];
    pData.KeyAct20 = arrKeyActions[19];
    for (var key in pData) {
        pDataString += "," + key + "=" + String(pData[key])
    }
    pDataString = pDataString.slice(1);
    var encodedQuery = encodeURIComponent(pDataString.toLowerCase());
    var siteProtocol = document.location.protocol || "https:";
    var arrLiveRampTagID = LiveRampTagID.split("|");
    arrLiveRampTagID.forEach(function(tagID) {
        var elm = document.createElement("img");
        elm.style = "display:none";
        elm.onload = function() {
            var keyAction = keyActionOn || "";
            callBack = callBack || function() {
                return
            }
            ;
            callBack()
        }
        ;
        elm.src = siteProtocol + "//di.rlcdn.com/" + tagID + ".html?pdata=" + encodedQuery
    });
    let adstraDataString = "";
    for (var key in pData) {
        if (key == 'pageUrl') { 
          pData[key] = pData[key].replace(/&/g, "-")  
        }
        adstraDataString += "&" + key + "=" + String(pData[key])
    }
    const astraQuery = adstraDataString.toLowerCase();
    arrLiveRampTagID.forEach(function(tagID) {
        const tagQuery = encodedQuery.replace(/%2C/g, "&").replace(/%3D/g, "=");
        var elm = document.createElement("img");
        elm.style = "display:none";
        elm.onload = function() {
            var keyAction = keyActionOn || "";
            callBack = callBack || function() {
                return
            }
            ;
            callBack()
        }
        ;
        elm.src = siteProtocol + "//sync.graph.bluecava.com/ds.png?p=5b3a0357-db2b-11ee-a2da-4201ac100013&tagId=" + tagID + astraQuery
    });
    function getExpiration() {
        var date = new Date;
        date.setTime(date.getTime() + 1e3 * 60 * 30);
        return date
    }
    function makeReferrerString() {
        return trafficSource + "," + referralChannel + "," + referralSource + "," + searchGroup
    }
    function getReferrerData() {
        var cookie;
        if (LiveRamp_utm_source) {
            if (LiveRamp_utm_source === "swoop") {
                referralChannel = "swoop";
                referralSource = document.referrer;
                searchGroup = LiveRamp_utm_content || "u";
                trafficSource = LiveRamp_utm_campaign || "u";
                docCookies.setItem("liveRampReferrer", makeReferrerString(), getExpiration(), setCookiePath, setCookieDomain())
            } else {
                referralChannel = LiveRamp_utm_medium || "u";
                referralSource = LiveRamp_utm_source;
                trafficSource = LiveRamp_utm_campaign || "u";
                searchGroup = LiveRamp_utm_content || "u";
                if (referralChannel == "u") {
                    if (/https?:\/\/(www.google.com|www.bing.com|search.yahoo.com)/.test(document.referrer)) {
                        referralChannel = "cpc"
                    }
                }
                docCookies.setItem("liveRampReferrer", makeReferrerString(), getExpiration(), setCookiePath, setCookieDomain())
            }
        } else if (/gclid|dclid|gclsrc/.test(document.location.search)) {
            if (/https?:\/\/(www.google.com|www.bing.com|search.yahoo.com)/.test(document.referrer)) {
                referralChannel = "cpc";
                referralSource = document.referrer
            } else {
                referralChannel = "Display";
                referralSource = document.referrer
            }
            trafficSource = LiveRamp_utm_campaign || "u";
            searchGroup = LiveRamp_utm_content || "u";
            docCookies.setItem("liveRampReferrer", makeReferrerString(), getExpiration(), setCookiePath, setCookieDomain())
        } else if (document.referrer) {
            if (/https?:\/\/(www.google.com|www.bing.com|search.yahoo.com)/.test(document.referrer)) {
                referralChannel = "Organic";
                referralSource = document.referrer;
                trafficSource = LiveRamp_utm_campaign || "u";
                searchGroup = LiveRamp_utm_content || "u";
                docCookies.setItem("liveRampReferrer", makeReferrerString(), getExpiration(), setCookiePath, setCookieDomain())
            } else if (/(facebook|twitter|pinterest|instagram|youtube|reddit|linkedin|hubpages|vine|meetup)\.com/.test(document.referrer)) {
                referralChannel = "Social";
                referralSource = document.referrer;
                trafficSource = LiveRamp_utm_campaign || "u";
                searchGroup = LiveRamp_utm_content || "u";
                docCookies.setItem("liveRampReferrer", makeReferrerString(), getExpiration(), setCookiePath, setCookieDomain)
            } else if (referralExclusionRe.test(document.referrer)) {
                if (docCookies.getItem("liveRampReferrer")) {
                    cookie = docCookies.getItem("liveRampReferrer").split(",");
                    trafficSource = cookie[0];
                    referralChannel = cookie[1];
                    referralSource = cookie[2];
                    searchGroup = cookie[3];
                    docCookies.setItem("liveRampReferrer", makeReferrerString(), getExpiration(), setCookiePath, setCookieDomain())
                } else {
                    referralChannel = "None";
                    referralSource = "Direct"
                }
            } else {
                referralChannel = "Referral";
                referralSource = /https?:\/\/([^\/]*)/.exec(document.referrer)[1];
                trafficSource = LiveRamp_utm_campaign || "u";
                searchGroup = LiveRamp_utm_content || "u";
                docCookies.setItem("liveRampReferrer", makeReferrerString(), getExpiration(), setCookiePath, setCookieDomain())
            }
        } else if (docCookies.getItem("liveRampReferrer")) {
            cookie = docCookies.getItem("liveRampReferrer").split(",");
            trafficSource = cookie[0];
            referralChannel = cookie[1];
            referralSource = cookie[2];
            searchGroup = cookie[3];
            docCookies.setItem("liveRampReferrer", makeReferrerString(), getExpiration(), setCookiePath, setCookieDomain())
        } else {
            referralChannel = "None";
            referralSource = "Direct"
        }
    }
    function checkRepeatVisitor() {
        if (docCookies.getItem("liveRampFirstVisit")) {
            docCookies.setItem("liveRampFirstVisit", "true", getExpiration(), setCookiePath, setCookieDomain());
            return "N"
        } else if (docCookies.getItem("_ga")) {
            docCookies.setItem("liveRampRepeatVisitor", "true", false, setCookiePath, setCookieDomain());
            return "Y"
        } else if (docCookies.getItem("liveRampRepeatVisitor")) {
            docCookies.setItem("liveRampRepeatVisitor", "true", false, setCookiePath, setCookieDomain());
            return "Y"
        } else {
            docCookies.setItem("liveRampFirstVisit", "true", getExpiration(), setCookiePath, setCookieDomain());
            docCookies.setItem("liveRampRepeatVisitor", "true");
            return "N"
        }
    }
    function setSessionID() {
        if (docCookies.getItem("liveRampSesssionID")) {
            sessionID = docCookies.getItem("liveRampSesssionID");
            docCookies.setItem("liveRampSesssionID", sessionID, getExpiration(), setCookiePath, setCookieDomain())
        } else {
            sessionID = (new Date).getTime() + "" + Math.random();
            docCookies.setItem("liveRampSesssionID", sessionID, getExpiration(), setCookiePath, setCookieDomain())
        }
    }
    function getDeviceType() {
        if (/phone|iPhone|Android(.*)Mobile/.test(navigator.userAgent) || window.innerWidth < 480) {
            return "Phone"
        } else if (/iPad|Android/.test(navigator.userAgent) || window.innerWidth < 900) {
            return "Tablet"
        } else {
            return "Desktop"
        }
    }
}
