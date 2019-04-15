let http = require("http"),
   url = require("url"),
   fs = require("fs");

let lesson = http.createServer(function (req, res) {
  
   res.setHeader("Access-Control-Allow-Origin", "*");

   let urlObj = url.parse(req.url, true),
      pathName = urlObj.pathname,
      query = urlObj.query;

   let reg = /\.(HTML|CSS|JS|ICO)/i;

   if (reg.test(pathName)) {
      let suffix = reg.exec(pathName[1].toUpperCase()),
         suffixMI = "text/html";
      switch (suffix) {
         case "CSS":
            suffixMI = "text/css";
            break;
         case "JS":
            suffixMI = "text/javascript";
            break;
      }
      try {
         let conFile = fs.readFileSync("." + pathName, "utf-8");
         res.writeHead(200, { "content-type": suffixMI + ';charset=utf-8' });
         res.end(conFile);
      } catch (e) {
         res.writeHead(404, { "content-type": "text/plain;charset=utf-8" });
         res.end("file in not found~")
      }
      return;
   }

   let con = null, result = null, couInfo = null, customPath = "./json/cousom.json",BannerImg="./json/Banner.json";
   con = fs.readFileSync(customPath, "utf-8");
   con.length == 0 ? "[]" : null;
   con = JSON.parse(con);

   //获取所有客户信息
   if (pathName === "/getList") {
      result = {
         code: 1,
         msg: "没有数据",
         data: null
      }
      if (con.length > 0) {
         result = {
            code: 0,
            msg: "ok",
            data: con
         }
         res.writeHead(200, { "content-type": 'application/json;charset=utf-8' })
         res.end(JSON.stringify(result));
         return;
      }
   }

   //获取指定客户信息
   if (pathName === "/getInfo") {
      couInfo = query["id"];
      result = {
         code: 1,
         msg: "获取客户信息失败",
         data: null
      }
      con = con.filter((item) => {
         if (item["id"] == couInfo) {
            return result = {
               code: 0,
               msg: "成功",
               data: item
            }
         }
      })
      res.writeHead(200, { "content-type": 'application/json;charset=utf-8' })
      res.end(JSON.stringify(result));
      return;
   }

   //删除指定客户信息
   if (pathName == "/removeInfo") {
      couInfo = query["id"];
      let flag = false;
      result = {
         code: 1,
         msg: "删除失败"
      }
      for (var i = 0; i < con.length; i++) {
         if (con[i]["id"] == couInfo) {
            flag = true;
            con.splice(i, 1);
            break;
         }
      }
      if (flag) {
         result = {
            code: 0,
            msg: "删除成功"
         }
         fs.writeFileSync(customPath, JSON.stringify(con), "utf-8")
      }
      res.writeHead(200, { "content-type": 'application/json;charset=utf-8' })
      res.end(JSON.stringify(result));
      return;
   }

   //增加客户信息
   if (pathName == "/addInfo") {
      let str = "";
      req.on("data", function (thnck) {
         str += thnck
      });
      req.on("end", function () {
         if (str.length === 0) {
            res.writeHead(200, { "content-type": 'application/json;charset=utf-8' })
            res.end(JSON.stringify({
               code: 1,
               msg: "增加用户失败"
            }));
            return;
         }
         var data = JSON.parse(str);
         data["id"] = con.length === 0 ? 1 : parseFloat(con[con.length - 1["id"]]) + 1;
         con.push(data);
         fs.writeFileSync(customPath, JSON.stringify(con), "utf-8");
         res.end(JSON.stringify({ code: 0, msg: "增加用户成功" }));
      })
   }

   //修改客户信息
   if (pathName == "/updataInfo") {
      str = "";
      req.on("data", function (thnck) {
         str += thnck
      })
      req.on("end", function () {
         if (str.length === 0) {
            res.writeHead(200, { "content-type": 'application/json;charset=utf-8' })
            res.end(JSON.stringify({
               code: 1,
               msg: "修改客户失败"
            }));
            return;
         }
         let data = JSON.parse(str),
            flag = false;
         con = con.filter(function (item) {
            if (item["id"] == data["id"]) {
               item = data;
               flag = true;
               break;
            }
         })
         result.msg = "失败";
         if (flag) {
            fs.writeFileSync(customPath, JSON.stringify(con), "utf-8");
            result = {
               code: 0,
               msg: "成功"
            }
         }
         res.writeHead(200, { "content-type": 'application/json;charset=utf-8' })
         res.end(JSON.stringify(result));
      });
      return;
   }

   //获取Banner图片
   if(pathName=="/getImage"){
      con = fs.readFileSync(BannerImg, "utf-8");
      con.length == 0 ? "[]" : null;
      con = JSON.parse(con);
      result = {
         code: 1,
         msg: "没有数据",
         data: null
      }
      if (con.length > 0) {
         result = {
            code: 0,
            msg: "ok",
            data: con
         }
         res.writeHead(200, { "content-type": 'application/json;charset=utf-8' })
         res.end(JSON.stringify(result));
         return;
      }
   }

   //接口失败
   res.writeHead(404, { "content-type": 'text/plain;charset=utf-8' })
   res.end("~~~~请求的接口不存在！");
})

lesson.listen(8888, function () {
   console.log("lesson 8888 端口 已启动")
})