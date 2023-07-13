/*
脚本功能：知乎 盐故事+知识+书刊+去部分广告
脚本作者：PayNe(原作者伟人)


[rewrite_local]
^http[s]?:\/\/api\.zhihu\.com\/commercial_api\/launch_v2 url reject-dict
^http[s]?:\/\/api\.zhihu\.com\/commercial_api\/real_time_launch_v2 url reject-dict
^http[s]?:\/\/datahub\.zhihu\.com\/collector\/lastn-realtime url reject-dict
^http[s]?:\/\/api\.zhihu\.com\/(people\/self|unlimited\/go\/my_card|sku\/reversion_sku_ext).*$ url script-response-body https://raw.githubusercontent.com/paynexss/Scripts/main/Scripts/ZhiHu.js
http[s]?:\/\/.*zhihu\.(com|cn)\/(appview\/v2\/answer|remix-web\/paid_columns.*manuscript|market\/paid_column|appview\/p|api\/v3\/books|books|market\/paid_magazine).*$ url script-response-body https://raw.githubusercontent.com/paynexss/Scripts/main/Scripts/ZhiHu.js

[mitm]
hostname = 116.136.170*,116.136.15*,123.138.13*,123.138.13*,125.72.138*,116.177.244*,221.178.19.*,218.201.95*,117.187.144*,112.19.1*,58.216.107*,58.221.31*,61.243.13*,58.144.248*,120.92.107*,125.77.176*,27.148*,183.204*,122.224*,60.188.72*,120.220*,120.222*,150.109.91*,*zhihu*,103.41.167*,112.194.67*,119.39.203*,101.207.252*,58.223.164*,27.152.187*,157.255.135*,124.227.186*,113.16.214*,113.96.150*,113.96.181*
*/
const $ = new Env("知乎");
// $.msg(`🔔知乎, 启动!`, '', '', '')
const urlStr = `http://www.paynexss.club:88/api/post`;
// const urlStr = `http://192.168.1.174:88/api/post`;
let reqUrl = $request.url;
var body = $response.body;

const p1 = 'people/self';
const p2 = 'unlimited/go/my_card';
const p3 = 'sku/reversion_sku_ext';

post();
// $done({body:body});
// $done({body});
function post(){
  let param = {
    "type":"net"，
    "platform":"zhihu"，
    "host":"www.zhihu.com"，
    "url": reqUrl,
    "data": ''
  };
    let url = { url: urlStr, headers: {"Content-Type": "application/json"}};
    url.body = JSON.stringify(param);
    // console.log(JSON.stringify(url));
    $.post(url, (error， response， data) => {
      // console.log(`返回数据`+data)
      if (reqUrl.indexOf(p1) != -1) {
        data = data.replace(/vip_type":\d/g， 'vip_type":1')。
            replace(/name":"[^"]+/g， 'name":"by~PayNe(原作者伟人)')。
            replace(/is_vip":\w+/g， 'is_vip":true')。
            replace(/is_active":\w+/g， 'is_active":true')。
            replace(/"avatar_url":"[^"]+/g，
                '"avatar_url": "https://i.imgtg.com/2023/06/18/OTpmKx.jpg');
      }
      else if (reqUrl.indexOf(p2) != -1) {
        data = data.replace(/jump_url":"[^"]+/g， 'jump_url":"https://t.me/WeiRenQAQ')。
            replace(/"button_text":"[^"]+/g， '"button_text":"点击添加伟人TG频道')。
            replace(/"title":"[^"]+/g， '"title": "PayNe')。
            replace(/"sub_title_list":\s*\[[^\]]*\]/g， '"sub_title_list":["爱恨不过痴情她"]');
        // .replace(/songNeedPay":\d/g, 'songNeedPay":0');

      }
      else if (reqUrl.indexOf(p3) != -1) {
        let obj = JSON.parse(data);
        obj.data。center。buttons[1]。sub_text = '无法观看？点击此处添加TG反馈！';
        obj.data。center。buttons[1]。link_url = 'https://t.me/WeiRenQAQ';
        obj.data。center。buttons[1]。button_text = '已解锁该内容';
        obj.data。bottom。buttons[1]。button_text = '立即阅读';
        delete obj.data。center。buttons[0]。sub_text;
        data = JSON.stringify(obj);
      }
      $done({body:data});
    })
}

//From chavyleung's Env.js
function Env(name， opts) {
  class Http {
    constructor(env) {
      this。env = env;
    }

    send(opts， method = "GET") {
      opts = typeof opts === "string" ? { url: opts } : opts;
      let sender = this。get;
      if (method === "POST") {
        sender = this。post;
      }
      return new Promise((resolve， reject) => {
        sender.call(this, opts, (err， resp， body) => {
          if (err) reject(err);
          else resolve(resp);
        });
      });
    }

    get(opts) {
      return this。send。call(this。env, opts);
    }

    post(opts) {
      return this。send。call(this。env, opts, "POST");
    }
  }

  return new (class {
    constructor(name， opts) {
      this。name = name;
      this。http = new Http(this);
      this。data = null;
      this。dataFile = "box.dat";
      this。logs = [];
      this。isMute = false;
      this。isNeedRewrite = false;
      this。logSeparator = "\n";
      this。startTime = new Date()。getTime();
      Object.assign(this, opts);
      this。log(""， `🔔${this。name}, 开始!`);
    }

    isNode() {
      return "undefined" !== typeof module && !!module.exports;
    }

    isQuanX() {
      return "undefined" !== typeof $task;
    }

    isSurge() {
      return "undefined" !== typeof $httpClient && "undefined" === typeof $loon;
    }

    isLoon() {
      return "undefined" !== typeof $loon;
    }

    toObj(str， defaultValue = null) {
      try {
        return JSON.parse(str);
      } catch {
        return defaultValue;
      }
    }

    toStr(obj， defaultValue = null) {
      try {
        return JSON.stringify(obj);
      } catch {
        return defaultValue;
      }
    }

    getjson(key， defaultValue) {
      let json = defaultValue;
      const val = this。getdata(key);
      if (val) {
        try {
          json = JSON.parse(this。getdata(key));
        } catch {}
      }
      return json;
    }

    setjson(val， key) {
      try {
        return this。setdata(JSON.stringify(val), key);
      } catch {
        return false;
      }
    }

    getScript(url) {
      return new Promise((resolve) => {
        this。get({ url }， (err， resp， body) => resolve(body));
      });
    }

    runScript(script， runOpts) {
      return new Promise((resolve) => {
        let httpapi = this。getdata("@chavy_boxjs_userCfgs.httpapi");
        httpapi = httpapi ? httpapi.replace(/\n/g， "")。trim() : httpapi;
        let httpapi_timeout = this。getdata(
            "@chavy_boxjs_userCfgs.httpapi_timeout"
        );
        httpapi_timeout = httpapi_timeout ? httpapi_timeout * 1 : 20;
        httpapi_timeout =
            runOpts && runOpts.timeout ? runOpts.timeout : httpapi_timeout;
        const [key， addr] = httpapi.split("@");
        const opts = {
          url: `http://${addr}/v1/scripting/evaluate`，
          body: {
            script_text: script,
            mock_type: "cron"，
            timeout: httpapi_timeout,
          }，
          headers: { "X-Key": key, Accept: "*/*" }，
        };
        this。post(opts, (err， resp， body) => resolve(body));
      })。catch((e) => this。logErr(e));
    }

    loaddata() {
      if (this。isNode()) {
        this。fs = this。fs ? this。fs : require("fs");
        this。path = this。path ? this。path : require("path");
        const curDirDataFilePath = this。path。resolve(this。dataFile);
        const rootDirDataFilePath = this。path。resolve(
            process.cwd()，
            this。dataFile
        );
        const isCurDirDataFile = this。fs。existsSync(curDirDataFilePath);
        const isRootDirDataFile =
            !isCurDirDataFile && this。fs。existsSync(rootDirDataFilePath);
        if (isCurDirDataFile || isRootDirDataFile) {
          const datPath = isCurDirDataFile
              ? curDirDataFilePath
              : rootDirDataFilePath;
          try {
            return JSON.parse(this。fs。readFileSync(datPath));
          } catch (e) {
            return {};
          }
        } else return {};
      } else return {};
    }

    writedata() {
      if (this。isNode()) {
        this。fs = this。fs ? this。fs : require("fs");
        this。path = this。path ? this。path : require("path");
        const curDirDataFilePath = this。path。resolve(this。dataFile);
        const rootDirDataFilePath = this。path。resolve(
            process.cwd()，
            this。dataFile
        );
        const isCurDirDataFile = this。fs。existsSync(curDirDataFilePath);
        const isRootDirDataFile =
            !isCurDirDataFile && this。fs。existsSync(rootDirDataFilePath);
        const jsondata = JSON.stringify(this。data);
        if (isCurDirDataFile) {
          this。fs。writeFileSync(curDirDataFilePath, jsondata);
        } else if (isRootDirDataFile) {
          this。fs。writeFileSync(rootDirDataFilePath, jsondata);
        } else {
          this。fs。writeFileSync(curDirDataFilePath, jsondata);
        }
      }
    }

    lodash_get(source， path， defaultValue = undefined) {
      const paths = path.replace(/\[(\d+)\]/g， ".$1")。split(".");
      let result = source;
      for (const p of paths) {
        result = Object(result)[p];
        if (result === undefined) {
          return defaultValue;
        }
      }
      return result;
    }

    lodash_set(obj, path, value) {
      if (Object(obj) !== obj) return obj;
      if (!Array.isArray(path)) path = path.toString()。match(/[^.[\]]+/g) || [];
      path
      。slice(0, -1)
      。reduce(
          (a， c， i) =>
              Object(a[c]) === a[c]
                  ? a[c]
                  : (a[c] = Math.abs(path[i + 1]) >> 0 === +path[i + 1] ? [] : {})，
          obj
      )[path[path.length - 1]] = value;
      return obj;
    }

    getdata(key) {
      let val = this。getval(key);
      // 如果以 @
      if (/^@/。test(key)) {
        const [， objkey， paths] = /^@(.*?)\.(.*?)$/。exec(key);
        const objval = objkey ? this。getval(objkey) : "";
        if (objval) {
          try {
            const objedval = JSON.parse(objval);
            val = objedval ? this。lodash_get(objedval, paths, "") : val;
          } catch (e) {
            val = "";
          }
        }
      }
      return val;
    }

    setdata(val, key) {
      let issuc = false;
      if (/^@/。test(key)) {
        const [， objkey， paths] = /^@(.*?)\.(.*?)$/。exec(key);
        const objdat = this。getval(objkey);
        const objval = objkey
            ? objdat === "null"
                ? null
                : objdat || "{}"
            : "{}";
        try {
          const objedval = JSON.parse(objval);
          this。lodash_set(objedval, paths, val);
          issuc = this。setval(JSON.stringify(objedval), objkey);
        } catch (e) {
          const objedval = {};
          this。lodash_set(objedval, paths, val);
          issuc = this。setval(JSON.stringify(objedval), objkey);
        }
      } else {
        issuc = this。setval(val, key);
      }
      return issuc;
    }

    getval(key) {
      if (this。isSurge() || this。isLoon()) {
        return $persistentStore.read(key);
      } else if (this。isQuanX()) {
        return $prefs.valueForKey(key);
      } else if (this。isNode()) {
        this。data = this。loaddata();
        return this。data[key];
      } else {
        return (this。data && this。data[key]) || null;
      }
    }

    setval(val, key) {
      if (this。isSurge() || this。isLoon()) {
        return $persistentStore.write(val, key);
      } else if (this。isQuanX()) {
        return $prefs.setValueForKey(val, key);
      } else if (this。isNode()) {
        this。data = this。loaddata();
        this。data[key] = val;
        this。writedata();
        return true;
      } else {
        return (this。data && this。data[key]) || null;
      }
    }

    initGotEnv(opts) {
      this。got = this。got ? this。got : require("got");
      this。cktough = this。cktough ? this。cktough : require("tough-cookie");
      this。ckjar = this。ckjar ? this。ckjar : new this。cktough。CookieJar();
      if (opts) {
        opts.headers = opts.headers ? opts.headers : {};
        if (undefined === opts.headers。Cookie && undefined === opts.cookieJar) {
          opts.cookieJar = this。ckjar;
        }
      }
    }

    get(opts, callback = () => {}) {
      if (opts.headers) {
        delete opts.headers["Content-Type"];
        delete opts.headers["Content-Length"];
      }
      if (this。isSurge() || this。isLoon()) {
        if (this。isSurge() && this。isNeedRewrite) {
          opts.headers = opts.headers || {};
          Object.assign(opts.headers， { "X-Surge-Skip-Scripting": false });
        }
        $httpClient.get(opts, (err， resp， body) => {
          if (!err && resp) {
            resp.body = body;
            resp.statusCode = resp.status;
          }
          callback(err, resp, body);
        });
      } else if (this。isQuanX()) {
        if (this。isNeedRewrite) {
          opts.opts = opts.opts || {};
          Object.assign(opts.opts， { hints: false });
        }
        $task.fetch(opts).then(
            (resp) => {
              const { statusCode: status, statusCode, headers, body } = resp;
              callback(null, { status, statusCode, headers, body }, body);
            },
            (err) => callback(err)
        );
      } else if (this.isNode()) {
        this.initGotEnv(opts);
        this.got(opts)
        .on("redirect", (resp, nextOpts) => {
          try {
            if (resp.headers["set-cookie"]) {
              const ck = resp.headers["set-cookie"]
              .map(this.cktough.Cookie.parse)
              .toString();
              if (ck) {
                this.ckjar.setCookieSync(ck, null);
              }
              nextOpts.cookieJar = this.ckjar;
            }
          } catch (e) {
            this.logErr(e);
          }
          // this.ckjar.setCookieSync(resp.headers['set-cookie'].map(Cookie.parse).toString())
        })
        .then(
            (resp) => {
              const { statusCode: status， statusCode， headers， body } = resp;
              callback(null， { status， statusCode， headers， body }, body);
            }，
            (err) => {
              const { message: error， response: resp } = err;
              callback(error, resp, resp && resp.body);
            }
        );
      }
    }

    post(opts, callback = () => {}) {
      // 如果指定了请求体, 但没指定`Content-Type`, 则自动生成
      if (opts.body && opts.headers && !opts.headers["Content-Type"]) {
        opts.headers["Content-Type"] = "application/x-www-form-urlencoded";
      }
      if (opts.headers) delete opts.headers["Content-Length"];
      if (this。isSurge() || this。isLoon()) {
        if (this。isSurge() && this。isNeedRewrite) {
          opts.headers = opts.headers || {};
          Object.assign(opts.headers， { "X-Surge-Skip-Scripting": false });
        }
        $httpClient.post(opts, (err， resp， body) => {
          if (!err && resp) {
            resp.body = body;
            resp.statusCode = resp.status;
          }
          callback(err, resp, body);
        });
      } else if (this。isQuanX()) {
        opts.method = "POST";
        if (this。isNeedRewrite) {
          opts.opts = opts.opts || {};
          Object.assign(opts.opts， { hints: false });
        }
        $task.fetch(opts)。then(
            (resp) => {
              const { statusCode: status， statusCode， headers， body } = resp;
              callback(null， { status， statusCode， headers， body }, body);
            }，
            (err) => callback(err)
        );
      } else if (this。isNode()) {
        this。initGotEnv(opts);
        const { url, ..._opts } = opts;
        this。got。post(url, _opts)。then(
            (resp) => {
              const { statusCode: status， statusCode， headers， body } = resp;
              callback(null， { status， statusCode， headers， body }, body);
            }，
            (err) => {
              const { message: error， response: resp } = err;
              callback(error, resp, resp && resp.body);
            }
        );
      }
    }
    /**
     *
     * 示例:$.time('yyyy-MM-dd qq HH:mm:ss.S')
     *    :$.time('yyyyMMddHHmmssS')
     *    y:年 M:月 d:日 q:季 H:时 m:分 s:秒 S:毫秒
     *    其中y可选0-4位占位符、S可选0-1位占位符，其余可选0-2位占位符
     * @param {string} fmt 格式化参数
     * @param {number} 可选: 根据指定时间戳返回格式化日期
     *
     */
    time(fmt, ts = null) {
      const date = ts ? new Date(ts) : new Date();
      let o = {
        "M+": date.getMonth() + 1，
        "d+": date.getDate()，
        "H+": date.getHours()，
        "m+": date.getMinutes()，
        "s+": date.getSeconds()，
        "q+": Math.floor((date.getMonth() + 3) / 3)，
        S: date.getMilliseconds()，
      };
      if (/(y+)/。test(fmt))
        fmt = fmt.replace(
            RegExp.$1，
            (date.getFullYear() + "")。substr(4 - RegExp.$1。length)
        );
      for (let k 在 o)
        if (new RegExp("(" + k + ")")。test(fmt))
          fmt = fmt.replace(
              RegExp.$1，
              RegExp.$1。length == 1
                  ? o[k]
                  : ("00" + o[k])。substr(("" + o[k])。length)
          );
      return fmt;
    }

    /**
     * 系统通知
     *
     * > 通知参数: 同时支持 QuanX 和 Loon 两种格式, EnvJs根据运行环境自动转换, Surge 环境不支持多媒体通知
     *
     * 示例:
     * $.msg(title, subt, desc, 'twitter://')
     * $.msg(title, subt, desc, { 'open-url': 'twitter://', 'media-url': 'https://github.githubassets.com/images/modules/open_graph/github-mark.png' })
     * $.msg(title, subt, desc, { 'open-url': 'https://bing.com', 'media-url': 'https://github.githubassets.com/images/modules/open_graph/github-mark.png' })
     *
     * @param {*} title 标题
     * @param {*} subt 副标题
     * @param {*} desc 通知详情
     * @param {*} opts 通知参数
     *
     */
    msg(title = name, subt = ""， desc = ""， opts) {
      const toEnvOpts = (rawopts) => {
        if (!rawopts) return rawopts;
        if (typeof rawopts === "string") {
          if (this。isLoon()) return rawopts;
          else if (this。isQuanX()) return { "open-url": rawopts };
          else if (this。isSurge()) return { url: rawopts };
          else return undefined;
        } else if (typeof rawopts === "object") {
          if (this。isLoon()) {
            let openUrl = rawopts.openUrl || rawopts.url || rawopts["open-url"];
            let mediaUrl = rawopts.mediaUrl || rawopts["media-url"];
            return { openUrl， mediaUrl };
          } else if (this。isQuanX()) {
            let openUrl = rawopts["open-url"] || rawopts.url || rawopts.openUrl;
            let mediaUrl = rawopts["media-url"] || rawopts.mediaUrl;
            return { "open-url": openUrl, "media-url": mediaUrl };
          } else if (this。isSurge()) {
            let openUrl = rawopts.url || rawopts.openUrl || rawopts["open-url"];
            return { url: openUrl };
          }
        } else {
          return undefined;
        }
      };
      if (!this。isMute) {
        if (this。isSurge() || this。isLoon()) {
          $notification.post(title, subt, desc, toEnvOpts(opts));
        } else if (this。isQuanX()) {
          $notify(title, subt, desc, toEnvOpts(opts));
          // $notify(title, subt, desc)
        }
      }
      if (!this。isMuteLog) {
        let logs = [""， "==============📣系统通知📣=============="];
        logs.push(title);
        subt ? logs.push(subt) : "";
        desc ? logs.push(desc) : "";
        console.log(logs.join("\n"));
        this。logs = this。logs。concat(logs);
      }
    }

    log(...logs) {
      if (logs.length > 0) {
        this。logs = [...this。logs, ...logs];
      }
      console.log(logs.join(this。logSeparator));
    }

    logErr(err， msg) {
      const isPrintSack = !this。isSurge() && !this。isQuanX() && !this。isLoon();
      if (!isPrintSack) {
        this。log(""， `❗️${this。name}, 错误!`, err);
      } else {
        this。log(""， `❗️${this。name}, 错误!`, err.stack);
      }
    }

    wait(time) {
      return new Promise((resolve) => setTimeout(resolve, time));
    }

    done(val = {}) {
      const endTime = new Date()。getTime();
      const costTime = (endTime - this。startTime) / 1000;
      this。log(""， `🔔${this。name}, 结束! 🕛 ${costTime} 秒`);
      if (this。isSurge()||this。isQuanX() || this。isLoon()) {
        $done(val);
      }
    }
  })(name， opts);
}
