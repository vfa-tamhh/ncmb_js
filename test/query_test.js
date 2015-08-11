"use strict";

var config   = require("config");
var expect   = require("chai").expect;

var NCMB = require("../lib/ncmb");

describe("NCMB Query", function(){
  var ncmb = null;
  before(function(){
    ncmb = new NCMB(config.apikey, config.clientkey );
    if(config.apiserver){
      ncmb.set("protocol", config.apiserver.protocol || "http:")
          .set("fqdn", config.apiserver.fqdn)
          .set("port", config.apiserver.port)
          .set("proxy", config.apiserver.proxy || "");
    }
  });

  describe("オブジェクト検索", function(){
    var QueryTest = null;
    describe("fetchAll", function(){
      context("データがあれば、リストが返り", function(){
        before(function(){
          QueryTest = ncmb.DataStore("QueryTest");
        });
        it("callback で取得できる", function(done){
          QueryTest.fetchAll(function(err, objs){
            if(err){
              done(err);
            }else{
              expect(objs.length).to.be.equal(2);
              expect(objs[0].objectId).to.be.equal("fetchAll_object_1");
              expect(objs[1].objectId).to.be.equal("fetchAll_object_2");
              done();
            }
          });
        });
        it("promise で取得できる", function(done){
          QueryTest.fetchAll()
                  .then(function(objs){
                    expect(objs.length).to.be.equal(2);
                    expect(objs[0].objectId).to.be.equal("fetchAll_object_1");
                    expect(objs[1].objectId).to.be.equal("fetchAll_object_2");
                    done();
                  })
                  .catch(function(err){
                    done(err);
                  });
        });
      });
      context("データがなければ、空のリストが返り", function(){
        before(function(){
          QueryTest = ncmb.DataStore("EmptyQueryTest");
        });
        it("callback で取得できる", function(done){
          QueryTest.fetchAll(function(err, objs){
            if(err){
              done(err);
            }else{
              expect(objs.length).to.be.equal(0);
              expect(objs).to.be.eql([]);
              done();
            }
          });
        });
        it("promise で取得できる", function(done){
          QueryTest.fetchAll()
                  .then(function(objs){
                    expect(objs.length).to.be.equal(0);
                    expect(objs).to.be.eql([]);
                    done();
                  })
                  .catch(function(err){
                    done(err);
                  });
        });
      });
    });
    describe("fetch", function(){
      context("データがあれば、オブジェクトが返り", function(){
        before(function(){
          QueryTest = ncmb.DataStore("QueryTestFetch");
        });
        it("callback で取得できる", function(done){
          QueryTest.fetch(function(err, obj){
            if(err){
              done(err);
            }else{
              expect(obj.objectId).to.be.equal("fetch_object_1");
              done();
            }
          });
        });
        it("promise で取得できる", function(done){
          QueryTest.fetch()
                  .then(function(obj){
                    expect(obj.objectId).to.be.equal("fetch_object_1");;
                    done();
                  })
                  .catch(function(err){
                    done(err);
                  });
        });
      });
      context("データがなければ、空のオブジェクトが返り", function(){
        before(function(){
          QueryTest = ncmb.DataStore("EmptyQueryTest");
        });
        it("callback で取得できる", function(done){
          QueryTest.fetch(function(err, obj){
            if(err){
              done(err);
            }else{
              expect(obj).to.be.eql({});
              done();
            }
          });
        });
        it("promise で取得できる", function(done){
          QueryTest.fetch()
                  .then(function(obj){
                    expect(obj).to.be.eql({});
                    done();
                  })
                  .catch(function(err){
                    done(err);
                  });
        });
      });
    });
    describe("fetchById", function(){
      context("データがあれば、オブジェクトが返り", function(){
        before(function(){
          QueryTest = ncmb.DataStore("QueryTest");
        });
        it("callback で取得できる", function(done){
          QueryTest.fetchById("fetchById_object_1", function(err, obj){
            if(err){
              done(err);
            }else{
              expect(obj.objectId).to.be.equal("fetchById_object_1");
              done();
            }
          });
        });
        it("promise で取得できる", function(done){
          QueryTest.fetchById("fetchById_object_1")
                  .then(function(obj){
                    expect(obj.objectId).to.be.equal("fetchById_object_1");
                    done();
                  })
                  .catch(function(err){
                    done(err);
                  });
        });
      });
      context("データがなければ、404エラーが返り", function(){
        before(function(){
          QueryTest = ncmb.DataStore("EmptyQueryTest");
        });
        it("callback で取得できる", function(done){
          QueryTest.fetchById("empty_id",function(err, obj){
            if(err){
              expect(err.text).to.be.equal('{"code":"E404001","error":"No data available."}');
              done();
            }else{
              done(new Error("失敗すべき"));
            }
          });
        });
        it("promise で取得できる", function(done){
          QueryTest.fetchById("empty_id")
                  .then(function(obj){
                    done(new Error("失敗すべき"));
                  })
                  .catch(function(err){
                    expect(err.text).to.be.equal('{"code":"E404001","error":"No data available."}');
                    done();
                  });
        });
      });
    });
  });
  describe("検索条件追加", function(){
    var QueryTest = null;
    describe("where", function(){
      context("検索条件を指定し、データがあれば、リストが返り", function(){
        beforeEach(function(){
          QueryTest = ncmb.DataStore("QueryTestWhere");
        });
        it("callback で取得できる", function(done){
          QueryTest
          .where({number: 1})
          .fetchAll(function(err, objs){
            if(err){
              done(err);
            }else{
              expect(objs.length).to.be.equal(1);
              expect(objs[0].objectId).to.be.equal("where_object_1");
              done();
            }
          });
        });
        it("promise で取得できる", function(done){
          QueryTest
          .where({number: 1})
          .fetchAll()
          .then(function(objs){
            expect(objs.length).to.be.equal(1);
            expect(objs[0].objectId).to.be.equal("where_object_1");
            done();
          })
          .catch(function(err){
            done(err);
          });
        });
      });
      it("検索条件がオブジェクト以外で指定されたとき、エラーが返る", function(done){
        QueryTest = ncmb.DataStore("QueryTestWhere");
        try{
          QueryTest.where("{number: 1}");
          done(new Error("失敗するべき"));
        }catch(err){
          done();
        }
      });
    });
    describe("equalTo", function(){
      context("検索条件を指定し、データがあれば、リストが返り", function(){
        beforeEach(function(){
          QueryTest = ncmb.DataStore("QueryTestEqualTo");
        });
        it("callback で取得できる", function(done){
          QueryTest
          .equalTo("number", 1)
          .fetchAll(function(err, objs){
            if(err){
              done(err);
            }else{
              expect(objs.length).to.be.equal(1);
              expect(objs[0].objectId).to.be.equal("equalTo_object_1");
              done();
            }
          });
        });
        it("promise で取得できる", function(done){
          QueryTest
          .equalTo("number", 1)
          .fetchAll()
          .then(function(objs){
            expect(objs.length).to.be.equal(1);
            expect(objs[0].objectId).to.be.equal("equalTo_object_1");
            done();
          })
          .catch(function(err){
            done(err);
          });
        });
      });
      it("検索キーが文字列で指定されたとき、エラーが返る", function(done){
        QueryTest = ncmb.DataStore("QueryTestEqualTo");
        try{
          QueryTest.equalTo(["number"], 1);
          done(new Error("失敗するべき"));
        }catch(err){
          done();
        }
      });
    });
    describe("notEqualTo", function(){
      context("検索条件を指定し、データがあれば、リストが返り", function(){
        beforeEach(function(){
          QueryTest = ncmb.DataStore("QueryTestNotEqualTo");
        });
        it("callback で取得できる", function(done){
          QueryTest
          .notEqualTo("number", 2)
          .fetchAll(function(err, objs){
            if(err){
              done(err);
            }else{
              expect(objs.length).to.be.equal(1);
              expect(objs[0].objectId).to.be.equal("notEqualTo_object_1");
              done();
            }
          });
        });
        it("promise で取得できる", function(done){
          QueryTest
          .notEqualTo("number", 2)
          .fetchAll()
          .then(function(objs){
            expect(objs.length).to.be.equal(1);
            expect(objs[0].objectId).to.be.equal("notEqualTo_object_1");
            done();
          })
          .catch(function(err){
            done(err);
          });
        });
      });
    });
    describe("lessThan", function(){
      context("検索条件を指定し、データがあれば、リストが返り", function(){
        beforeEach(function(){
          QueryTest = ncmb.DataStore("QueryTestLessThan");
        });
        it("callback で取得できる", function(done){
          QueryTest
          .lessThan("number", 2)
          .fetchAll(function(err, objs){
            if(err){
              done(err);
            }else{
              expect(objs.length).to.be.equal(1);
              expect(objs[0].objectId).to.be.equal("lessThan_object_1");
              done();
            }
          });
        });
        it("promise で取得できる", function(done){
          QueryTest
          .lessThan("number", 2)
          .fetchAll()
          .then(function(objs){
            expect(objs.length).to.be.equal(1);
            expect(objs[0].objectId).to.be.equal("lessThan_object_1");
            done();
          })
          .catch(function(err){
            done(err);
          });
        });
      });
    });
    describe("lessThanOrEqualTo", function(){
      context("検索条件を指定し、データがあれば、リストが返り", function(){
        beforeEach(function(){
          QueryTest = ncmb.DataStore("QueryTestLessThanOrEqualTo");
        });
        it("callback で取得できる", function(done){
          QueryTest
          .lessThanOrEqualTo("number", 2)
          .fetchAll(function(err, objs){
            if(err){
              done(err);
            }else{
              expect(objs.length).to.be.equal(1);
              expect(objs[0].objectId).to.be.equal("lessThanOrEqualTo_object_1");
              done();
            }
          });
        });
        it("promise で取得できる", function(done){
          QueryTest
          .lessThanOrEqualTo("number", 2)
          .fetchAll()
          .then(function(objs){
            expect(objs.length).to.be.equal(1);
            expect(objs[0].objectId).to.be.equal("lessThanOrEqualTo_object_1");
            done();
          })
          .catch(function(err){
            done(err);
          });
        });
      });
    });
    describe("greaterThan", function(){
      context("検索条件を指定し、データがあれば、リストが返り", function(){
        beforeEach(function(){
          QueryTest = ncmb.DataStore("QueryTestGreaterThan");
        });
        it("callback で取得できる", function(done){
          QueryTest
          .greaterThan("number", 0)
          .fetchAll(function(err, objs){
            if(err){
              done(err);
            }else{
              expect(objs.length).to.be.equal(1);
              expect(objs[0].objectId).to.be.equal("greaterThan_object_1");
              done();
            }
          });
        });
        it("promise で取得できる", function(done){
          QueryTest
          .greaterThan("number", 0)
          .fetchAll()
          .then(function(objs){
            expect(objs.length).to.be.equal(1);
            expect(objs[0].objectId).to.be.equal("greaterThan_object_1");
            done();
          })
          .catch(function(err){
            done(err);
          });
        });
      });
    });
    describe("greaterThanOrEqualTo", function(){
      context("検索条件を指定し、データがあれば、リストが返り", function(){
        beforeEach(function(){
          QueryTest = ncmb.DataStore("QueryTestGreaterThanOrEqualTo");
        });
        it("callback で取得できる", function(done){
          QueryTest
          .greaterThanOrEqualTo("number", 1)
          .fetchAll(function(err, objs){
            if(err){
              done(err);
            }else{
              expect(objs.length).to.be.equal(1);
              expect(objs[0].objectId).to.be.equal("greaterThanOrEqualTo_object_1");
              done();
            }
          });
        });
        it("promise で取得できる", function(done){
          QueryTest
          .greaterThanOrEqualTo("number", 1)
          .fetchAll()
          .then(function(objs){
            expect(objs.length).to.be.equal(1);
            expect(objs[0].objectId).to.be.equal("greaterThanOrEqualTo_object_1");
            done();
          })
          .catch(function(err){
            done(err);
          });
        });
      });
    });
    describe("in", function(){
      context("検索条件を指定し、データがあれば、リストが返り", function(){
        beforeEach(function(){
          QueryTest = ncmb.DataStore("QueryTestIn");
        });
        it("callback で取得できる", function(done){
          QueryTest
          .in("number", [1,2,3])
          .fetchAll(function(err, objs){
            if(err){
              done(err);
            }else{
              expect(objs.length).to.be.equal(1);
              expect(objs[0].objectId).to.be.equal("in_object_1");
              done();
            }
          });
        });
        it("promise で取得できる", function(done){
          QueryTest
          .in("number", [1,2,3])
          .fetchAll()
          .then(function(objs){
            expect(objs.length).to.be.equal(1);
            expect(objs[0].objectId).to.be.equal("in_object_1");
            done();
          })
          .catch(function(err){
            done(err);
          });
        });
      });
      it("検索条件が配列以外で指定されたとき、エラーが返る", function(done){
        QueryTest = ncmb.DataStore("QueryTestIn");
        try{
          QueryTest.in("number", 1);
          done(new Error("失敗するべき"));
        }catch(err){
          done();
        }
      });
    });
    describe("notIn", function(){
      context("検索条件を指定し、データがあれば、リストが返り", function(){
        beforeEach(function(){
          QueryTest = ncmb.DataStore("QueryTestNotIn");
        });
        it("callback で取得できる", function(done){
          QueryTest
          .notIn("number", [2,3,4])
          .fetchAll(function(err, objs){
            if(err){
              done(err);
            }else{
              expect(objs.length).to.be.equal(1);
              expect(objs[0].objectId).to.be.equal("notIn_object_1");
              done();
            }
          });
        });
        it("promise で取得できる", function(done){
          QueryTest
          .notIn("number", [2,3,4])
          .fetchAll()
          .then(function(objs){
            expect(objs.length).to.be.equal(1);
            expect(objs[0].objectId).to.be.equal("notIn_object_1");
            done();
          })
          .catch(function(err){
            done(err);
          });
        });
      });
      it("検索条件が配列以外で指定されたとき、エラーが返る", function(done){
        QueryTest = ncmb.DataStore("QueryTestNotIn");
        try{
          QueryTest.notIn("number", 1);
          done(new Error("失敗するべき"));
        }catch(err){
          done();
        }
      });
    });
    describe("exists", function(){
      context("検索条件を指定し、データがあれば、リストが返り", function(){
        beforeEach(function(){
          QueryTest = ncmb.DataStore("QueryTestExists");
        });
        it("callback で取得できる", function(done){
          QueryTest
          .exists("number", true)
          .fetchAll(function(err, objs){
            if(err){
              done(err);
            }else{
              expect(objs.length).to.be.equal(1);
              expect(objs[0].objectId).to.be.equal("exists_object_1");
              done();
            }
          });
        });
        it("promise で取得できる", function(done){
          QueryTest
          .exists("number", true)
          .fetchAll()
          .then(function(objs){
            expect(objs.length).to.be.equal(1);
            expect(objs[0].objectId).to.be.equal("exists_object_1");
            done();
          })
          .catch(function(err){
            done(err);
          });
        });
      });
      context("検索条件を指定し、データがあれば、リストが返り", function(){
        beforeEach(function(){
          QueryTest = ncmb.DataStore("QueryTestExists");
        });
        it("callback で取得できる", function(done){
          QueryTest
          .exists("name", false)
          .fetchAll(function(err, objs){
            if(err){
              done(err);
            }else{
              expect(objs.length).to.be.equal(1);
              expect(objs[0].objectId).to.be.equal("exists_object_1");
              done();
            }
          });
        });
        it("promise で取得できる", function(done){
          QueryTest
          .exists("name", false)
          .fetchAll()
          .then(function(objs){
            expect(objs.length).to.be.equal(1);
            expect(objs[0].objectId).to.be.equal("exists_object_1");
            done();
          })
          .catch(function(err){
            done(err);
          });
        });
      });
      it("検索条件が真偽値以外で指定されたとき、エラーが返る", function(done){
        QueryTest = ncmb.DataStore("QueryTestExists");
        try{
          QueryTest.exists("number", 1);
          done(new Error("失敗するべき"));
        }catch(err){
          done();
        }
      });
    });
    describe("regularExpressionTo", function(){
      context("検索条件を指定し、データがあれば、リストが返り", function(){
        beforeEach(function(){
          QueryTest = ncmb.DataStore("QueryTestRegularExpressionTo");
        });
        it("callback で取得できる", function(done){
          QueryTest
          .regularExpressionTo("name", "obj")
          .fetchAll(function(err, objs){
            if(err){
              done(err);
            }else{
              expect(objs.length).to.be.equal(1);
              expect(objs[0].objectId).to.be.equal("regex_object_1");
              done();
            }
          });
        });
        it("promise で取得できる", function(done){
          QueryTest
          .regularExpressionTo("name", "obj")
          .fetchAll()
          .then(function(objs){
            expect(objs.length).to.be.equal(1);
            expect(objs[0].objectId).to.be.equal("regex_object_1");
            done();
          })
          .catch(function(err){
            done(err);
          });
        });
      });
      context("前方一致を指定し、データがあれば、リストが返り", function(){
        beforeEach(function(){
          QueryTest = ncmb.DataStore("QueryTestRegularExpressionTo");
        });
        it("callback で取得できる", function(done){
          QueryTest
          .regularExpressionTo("name", "^obj")
          .fetchAll(function(err, objs){
            if(err){
              done(err);
            }else{
              expect(objs.length).to.be.equal(1);
              expect(objs[0].objectId).to.be.equal("regex_object_1");
              done();
            }
          });
        });
        it("promise で取得できる", function(done){
          QueryTest
          .regularExpressionTo("name", "^obj")
          .fetchAll()
          .then(function(objs){
            expect(objs.length).to.be.equal(1);
            expect(objs[0].objectId).to.be.equal("regex_object_1");
            done();
          })
          .catch(function(err){
            done(err);
          });
        });
      });
      context("後方一致を指定し、データがあれば、リストが返り", function(){
        beforeEach(function(){
          QueryTest = ncmb.DataStore("QueryTestRegularExpressionTo");
        });
        it("callback で取得できる", function(done){
          QueryTest
          .regularExpressionTo("name", "Name$")
          .fetchAll(function(err, objs){
            if(err){
              done(err);
            }else{
              expect(objs.length).to.be.equal(1);
              expect(objs[0].objectId).to.be.equal("regex_object_1");
              done();
            }
          });
        });
        it("promise で取得できる", function(done){
          QueryTest
          .regularExpressionTo("name", "Name$")
          .fetchAll()
          .then(function(objs){
            expect(objs.length).to.be.equal(1);
            expect(objs[0].objectId).to.be.equal("regex_object_1");
            done();
          })
          .catch(function(err){
            done(err);
          });
        });
      });
      it("検索条件が文字列以外で指定されたとき、エラーが返る", function(done){
        QueryTest = ncmb.DataStore("QueryTestRegularExpressionTo");
        try{
          QueryTest.regularExpressionTo("name", 1);
          done(new Error("失敗するべき"));
        }catch(err){
          done();
        }
      });
    });
    describe("inArray", function(){
      context("検索条件を配列で指定し、データがあれば、リストが返り", function(){
        beforeEach(function(){
          QueryTest = ncmb.DataStore("QueryTestInArray");
        });
        it("callback で取得できる", function(done){
          QueryTest
          .inArray("array", [1,4,5])
          .fetchAll(function(err, objs){
            if(err){
              done(err);
            }else{
              expect(objs.length).to.be.equal(1);
              expect(objs[0].objectId).to.be.equal("inArray_object_1");
              done();
            }
          });
        });
        it("promise で取得できる", function(done){
          QueryTest
          .inArray("array", [1,4,5])
          .fetchAll()
          .then(function(objs){
            expect(objs.length).to.be.equal(1);
            expect(objs[0].objectId).to.be.equal("inArray_object_1");
            done();
          })
          .catch(function(err){
            done(err);
          });
        });
      });
      context("検索条件を配列以外で指定し、データがあれば、リストが返り", function(){
        beforeEach(function(){
          QueryTest = ncmb.DataStore("QueryTestInArray");
        });
        it("callback で取得できる", function(done){
          QueryTest
          .inArray("array", 1)
          .fetchAll(function(err, objs){
            if(err){
              done(err);
            }else{
              expect(objs.length).to.be.equal(1);
              expect(objs[0].objectId).to.be.equal("inArray_object_1");
              done();
            }
          });
        });
        it("promise で取得できる", function(done){
          QueryTest
          .inArray("array", 1)
          .fetchAll()
          .then(function(objs){
            expect(objs.length).to.be.equal(1);
            expect(objs[0].objectId).to.be.equal("inArray_object_1");
            done();
          })
          .catch(function(err){
            done(err);
          });
        });
      });
    });
    describe("notInArray", function(){
      context("検索条件を配列で指定し、データがあれば、リストが返り", function(){
        beforeEach(function(){
          QueryTest = ncmb.DataStore("QueryTestNotInArray");
        });
        it("callback で取得できる", function(done){
          QueryTest
          .notInArray("array", [4,5,6])
          .fetchAll(function(err, objs){
            if(err){
              done(err);
            }else{
              expect(objs.length).to.be.equal(1);
              expect(objs[0].objectId).to.be.equal("notInArray_object_1");
              done();
            }
          });
        });
        it("promise で取得できる", function(done){
          QueryTest
          .notInArray("array", [4,5,6])
          .fetchAll()
          .then(function(objs){
            expect(objs.length).to.be.equal(1);
            expect(objs[0].objectId).to.be.equal("notInArray_object_1");
            done();
          })
          .catch(function(err){
            done(err);
          });
        });
      });
      context("検索条件を配列以外で指定し、データがあれば、リストが返り", function(){
        beforeEach(function(){
          QueryTest = ncmb.DataStore("QueryTestNotInArray");
        });
        it("callback で取得できる", function(done){
          QueryTest
          .notInArray("array", 4)
          .fetchAll(function(err, objs){
            if(err){
              done(err);
            }else{
              expect(objs.length).to.be.equal(1);
              expect(objs[0].objectId).to.be.equal("notInArray_object_1");
              done();
            }
          });
        });
        it("promise で取得できる", function(done){
          QueryTest
          .notInArray("array", 4)
          .fetchAll()
          .then(function(objs){
            expect(objs.length).to.be.equal(1);
            expect(objs[0].objectId).to.be.equal("notInArray_object_1");
            done();
          })
          .catch(function(err){
            done(err);
          });
        });
      });
    });
    describe("allInArray", function(){
      context("検索条件を配列で指定し、データがあれば、リストが返り", function(){
        beforeEach(function(){
          QueryTest = ncmb.DataStore("QueryTestAllInArray");
        });
        it("callback で取得できる", function(done){
          QueryTest
          .allInArray("array", [1,2,3])
          .fetchAll(function(err, objs){
            if(err){
              done(err);
            }else{
              expect(objs.length).to.be.equal(1);
              expect(objs[0].objectId).to.be.equal("allInArray_object_1");
              done();
            }
          });
        });
        it("promise で取得できる", function(done){
          QueryTest
          .allInArray("array", [1,2,3])
          .fetchAll()
          .then(function(objs){
            expect(objs.length).to.be.equal(1);
            expect(objs[0].objectId).to.be.equal("allInArray_object_1");
            done();
          })
          .catch(function(err){
            done(err);
          });
        });
      });
      context("検索条件を配列以外で指定し、データがあれば、リストが返り", function(){
        beforeEach(function(){
          QueryTest = ncmb.DataStore("QueryTestAllInArray");
        });
        it("callback で取得できる", function(done){
          QueryTest
          .allInArray("array", 1)
          .fetchAll(function(err, objs){
            if(err){
              done(err);
            }else{
              expect(objs.length).to.be.equal(1);
              expect(objs[0].objectId).to.be.equal("allInArray_object_1");
              done();
            }
          });
        });
        it("promise で取得できる", function(done){
          QueryTest
          .allInArray("array", 1)
          .fetchAll()
          .then(function(objs){
            expect(objs.length).to.be.equal(1);
            expect(objs[0].objectId).to.be.equal("allInArray_object_1");
            done();
          })
          .catch(function(err){
            done(err);
          });
        });
      });
    });
    describe("near", function(){
      context("検索条件をncmb.GeoPointで指定し、データがあれば、リストが返り", function(){
        var geoPoint = null;
        beforeEach(function(){
          QueryTest = ncmb.DataStore("QueryTestNear");
          geoPoint = new ncmb.GeoPoint(0,0);
        });
        it("callback で取得できる", function(done){
          QueryTest
          .near("location", geoPoint)
          .fetchAll(function(err, objs){
            if(err){
              done(err);
            }else{
              expect(objs.length).to.be.equal(1);
              expect(objs[0].objectId).to.be.equal("near_object_1");
              done();
            }
          });
        });
        it("promise で取得できる", function(done){
          QueryTest
          .near("location", geoPoint)
          .fetchAll()
          .then(function(objs){
            expect(objs.length).to.be.equal(1);
            expect(objs[0].objectId).to.be.equal("near_object_1");
            done();
          })
          .catch(function(err){
            done(err);
          });
        });
      });
      it("検索条件がncmb.GeoPoint以外で指定されたとき、エラーが返る", function(done){
        QueryTest = ncmb.DataStore("QueryTestNear");
        try{
          QueryTest.near("location", [0, 0]);
          done(new Error("失敗するべき"));
        }catch(err){
          done();
        }
      });
    });
    describe("withinKilometers", function(){
      context("検索条件をncmb.GeoPointで指定し、データがあれば、リストが返り", function(){
        var geoPoint = null;
        beforeEach(function(){
          QueryTest = ncmb.DataStore("QueryTestWithinKm");
          geoPoint = new ncmb.GeoPoint(0,0);
        });
        it("callback で取得できる", function(done){
          QueryTest
          .withinKilometers("location", geoPoint, 1000)
          .fetchAll(function(err, objs){
            if(err){
              done(err);
            }else{
              expect(objs.length).to.be.equal(1);
              expect(objs[0].objectId).to.be.equal("withinKm_object_1");
              done();
            }
          });
        });
        it("promise で取得できる", function(done){
          QueryTest
          .withinKilometers("location", geoPoint, 1000)
          .fetchAll()
          .then(function(objs){
            expect(objs.length).to.be.equal(1);
            expect(objs[0].objectId).to.be.equal("withinKm_object_1");
            done();
          })
          .catch(function(err){
            done(err);
          });
        });
      });
      it("検索条件がncmb.GeoPoint以外で指定されたとき、エラーが返る", function(done){
        QueryTest = ncmb.DataStore("QueryTestWithinKm");
        try{
          QueryTest.withinKilometers("location", [0, 0], 1000);
          done(new Error("失敗するべき"));
        }catch(err){
          done();
        }
      });
    });
    describe("withinMiles", function(){
      context("検索条件をncmb.GeoPointで指定し、データがあれば、リストが返り", function(){
        var geoPoint = null;
        beforeEach(function(){
          QueryTest = ncmb.DataStore("QueryTestWithinMile");
          geoPoint = new ncmb.GeoPoint(0,0);
        });
        it("callback で取得できる", function(done){
          QueryTest
          .withinMiles("location", geoPoint, 1000)
          .fetchAll(function(err, objs){
            if(err){
              done(err);
            }else{
              expect(objs.length).to.be.equal(1);
              expect(objs[0].objectId).to.be.equal("withinMile_object_1");
              done();
            }
          });
        });
        it("promise で取得できる", function(done){
          QueryTest
          .withinMiles("location", geoPoint, 1000)
          .fetchAll()
          .then(function(objs){
            expect(objs.length).to.be.equal(1);
            expect(objs[0].objectId).to.be.equal("withinMile_object_1");
            done();
          })
          .catch(function(err){
            done(err);
          });
        });
      });
      it("検索条件がncmb.GeoPoint以外で指定されたとき、エラーが返る", function(done){
        QueryTest = ncmb.DataStore("QueryTestWithinMile");
        try{
          QueryTest.withinMiles("location", [0, 0], 1000);
          done(new Error("失敗するべき"));
        }catch(err){
          done();
        }
      });
    });
    describe("withinRadians", function(){
      context("検索条件をncmb.GeoPointで指定し、データがあれば、リストが返り", function(){
        var geoPoint = null;
        beforeEach(function(){
          QueryTest = ncmb.DataStore("QueryTestWithinRad");
          geoPoint = new ncmb.GeoPoint(0,0);
        });
        it("callback で取得できる", function(done){
          QueryTest
          .withinRadians("location", geoPoint, 0.5)
          .fetchAll(function(err, objs){
            if(err){
              done(err);
            }else{
              expect(objs.length).to.be.equal(1);
              expect(objs[0].objectId).to.be.equal("withinRad_object_1");
              done();
            }
          });
        });
        it("promise で取得できる", function(done){
          QueryTest
          .withinRadians("location", geoPoint, 0.5)
          .fetchAll()
          .then(function(objs){
            expect(objs.length).to.be.equal(1);
            expect(objs[0].objectId).to.be.equal("withinRad_object_1");
            done();
          })
          .catch(function(err){
            done(err);
          });
        });
      });
      it("検索条件がncmb.GeoPoint以外で指定されたとき、エラーが返る", function(done){
        QueryTest = ncmb.DataStore("QueryTestWithinRad");
        try{
          QueryTest.withinRadians("location", [0, 0], 0.5);
          done(new Error("失敗するべき"));
        }catch(err){
          done();
        }
      });
    });
    describe("withinSquare", function(){
      context("検索条件をncmb.GeoPointで指定し、データがあれば、リストが返り", function(){
        var swPoint = null;
        var nePoint = null;
        beforeEach(function(){
          QueryTest = ncmb.DataStore("QueryTestWithinSquare");
          swPoint = new ncmb.GeoPoint(0,0);
          nePoint = new ncmb.GeoPoint(80, 80);
        });
        it("callback で取得できる", function(done){
          QueryTest
          .withinSquare("location", swPoint, nePoint)
          .fetchAll(function(err, objs){
            if(err){
              done(err);
            }else{
              expect(objs.length).to.be.equal(1);
              expect(objs[0].objectId).to.be.equal("withinSquare_object_1");
              done();
            }
          });
        });
        it("promise で取得できる", function(done){
          QueryTest
          .withinSquare("location", swPoint, nePoint)
          .fetchAll()
          .then(function(objs){
            expect(objs.length).to.be.equal(1);
            expect(objs[0].objectId).to.be.equal("withinSquare_object_1");
            done();
          })
          .catch(function(err){
            done(err);
          });
        });
      });
      it("検索条件がncmb.GeoPoint以外で指定されたとき、エラーが返る", function(done){
        QueryTest = ncmb.DataStore("QueryTestWithinSquare");
        try{
          QueryTest.withinSquare("location", [0, 0], [100, 100]);
          done(new Error("失敗するべき"));
        }catch(err){
          done();
        }
      });
    });

    describe("or", function(){
      context("複数の検索条件を配列で指定したとき、検索結果が返り", function(){
        beforeEach(function(){
          QueryTest = ncmb.DataStore("QueryTestOr");
        });
        it("callback で取得できる", function(done){
          QueryTest
          .or([QueryTest.greaterThan("number",0),
               QueryTest.lessThan("number",10)])
          .fetchAll(function(err, objs){
            if(err){
              done(err);
            }else{
              expect(objs.length).to.be.equal(1);
              expect(objs[0].objectId).to.be.equal("or_object_1");
              done();
            }
          });
        });
        it("promise で取得できる", function(done){
          QueryTest
          .or([QueryTest.greaterThan("number",0),
               QueryTest.lessThan("number",10)])
          .fetchAll()
          .then(function(objs){
            expect(objs.length).to.be.equal(1);
            expect(objs[0].objectId).to.be.equal("or_object_1");
            done();
          })
          .catch(function(err){
            done(err);
          });
        });
      });
      context("複数回条件を指定したとき、すべての条件に合致する検索結果が返り", function(){
        beforeEach(function(){
          QueryTest = ncmb.DataStore("QueryTestOr");
        });
        it("callback で取得できる", function(done){
          QueryTest
          .or([QueryTest.greaterThan("number",0)])
          .or([QueryTest.lessThan("number",10)])
          .fetchAll(function(err, objs){
            if(err){
              done(err);
            }else{
              expect(objs.length).to.be.equal(1);
              expect(objs[0].objectId).to.be.equal("or_object_1");
              done();
            }
          });
        });
        it("promise で取得できる", function(done){
          QueryTest
          .or([QueryTest.greaterThan("number",0)])
          .or([QueryTest.lessThan("number",10)])
          .fetchAll()
          .then(function(objs){
            expect(objs.length).to.be.equal(1);
            expect(objs[0].objectId).to.be.equal("or_object_1");
            done();
          })
          .catch(function(err){
            done(err);
          });
        });
      });
      context("単一条件を配列に入れずに直接追加することができ、条件に合う検索結果が返り", function(){
        beforeEach(function(){
          QueryTest = ncmb.DataStore("QueryTestOr");
        });
        it("callback で取得できる", function(done){
          QueryTest
          .or([QueryTest.greaterThan("number",0)])
          .or(QueryTest.lessThan("number",10))
          .fetchAll(function(err, objs){
            if(err){
              done(err);
            }else{
              expect(objs.length).to.be.equal(1);
              expect(objs[0].objectId).to.be.equal("or_object_1");
              done();
            }
          });
        });
        it("promise で取得できる", function(done){
          QueryTest
          .or([QueryTest.greaterThan("number",0)])
          .or(QueryTest.lessThan("number",10))
          .fetchAll()
          .then(function(objs){
            expect(objs.length).to.be.equal(1);
            expect(objs[0].objectId).to.be.equal("or_object_1");
            done();
          })
          .catch(function(err){
            done(err);
          });
        });
      });
      it("検索条件がクエリ以外で指定されたとき、エラーが返る", function(done){
        QueryTest = ncmb.DataStore("QueryTestOr");
        try{
          QueryTest.or({number:1});
          done(new Error("失敗するべき"));
        }catch(err){
          done();
        }
      });
    });
    describe("select", function(){
      var SubQuery = null;
      context("サブクエリの検索結果がsubkeyに持つ値のいずれかと、keyの値が一致するオブジェクトを検索した結果が返り", function(){
        beforeEach(function(){
          SubQuery = ncmb.DataStore("SubQuery");
          QueryTest = ncmb.DataStore("QueryTestSelect");
        });
        it("callback で取得できる", function(done){
          QueryTest
          .select("city", "cityName", SubQuery.greaterThan("population",10000000))
          .fetchAll(function(err, objs){
            if(err){
              done(err);
            }else{
              expect(objs.length).to.be.equal(1);
              expect(objs[0].objectId).to.be.equal("select_object_1");
              done();
            }
          });
        });
        it("promise で取得できる", function(done){
          QueryTest
          .select("city", "cityName", SubQuery.greaterThan("population",10000000))
          .fetchAll()
          .then(function(objs){
            expect(objs.length).to.be.equal(1);
            expect(objs[0].objectId).to.be.equal("select_object_1");
            done();
          })
          .catch(function(err){
            done(err);
          });
        });
      });
      it("検索条件がクエリ以外で指定されたとき、エラーが返る", function(done){
        QueryTest = ncmb.DataStore("QueryTestSelect");
        try{
          QueryTest.select("city", "cityName", {population:10000000});
          done(new Error("失敗するべき"));
        }catch(err){
          done();
        }
      });
    });


    describe("include", function(){
      context("指定したkeyのポインタの中身を含めたオブジェクトが返り", function(){
        beforeEach(function(){
          QueryTest = ncmb.DataStore("QueryTestInclude");
        });
        it("callback で取得できる", function(done){
          QueryTest
          .include("pointer")
          .fetchAll(function(err, objs){
            if(err){
              done(err);
            }else{
              expect(objs.length).to.be.equal(1);
              expect(objs[0].pointer.objectId).to.be.equal("pointer_object_1");
              done();
            }
          });
        });
        it("promise で取得できる", function(done){
          QueryTest
          .include("pointer")
          .fetchAll()
          .then(function(objs){
            expect(objs.length).to.be.equal(1);
            expect(objs[0].pointer.objectId).to.be.equal("pointer_object_1");
            done();
          })
          .catch(function(err){
            done(err);
          });
        });
      });
      context("複数のkeyを指定して検索することができ、", function(){
        beforeEach(function(){
          QueryTest = ncmb.DataStore("QueryTestInclude");
        });
        it("callback で取得できる", function(done){
          QueryTest
          .include("pointer")
          .include("object")
          .fetchAll(function(err, objs){
            if(err){
              done(err);
            }else{
              expect(objs.length).to.be.equal(1);
              expect(objs[0].pointer.objectId).to.be.equal("pointer_object_1");
              done();
            }
          });
        });
        it("promise で取得できる", function(done){
          QueryTest
          .include("pointer")
          .include("object")
          .fetchAll()
          .then(function(objs){
            expect(objs.length).to.be.equal(1);
            expect(objs[0].pointer.objectId).to.be.equal("pointer_object_1");
            done();
          })
          .catch(function(err){
            done(err);
          });
        });
      });
      it("keyが文字列以外で指定されたとき、エラーが返る", function(done){
        QueryTest = ncmb.DataStore("QueryTestInclude");
        try{
          QueryTest.include(["number"]);
          done(new Error("失敗するべき"));
        }catch(err){
          done();
        }
      });
    });
    describe("count", function(){
      context("設定するとリスト共に件数が返り", function(){
        beforeEach(function(){
          QueryTest = ncmb.DataStore("QueryTestCount");
        });
        it("callback で取得できる", function(done){
          QueryTest
          .count()
          .fetchAll(function(err, objs){
            if(err){
              done(err);
            }else{
              expect(objs.length).to.be.equal(1);
              expect(objs.count).to.be.equal(1);
              done();
            }
          });
        });
        it("promise で取得できる", function(done){
          QueryTest
          .count()
          .fetchAll()
          .then(function(objs){
            expect(objs.length).to.be.equal(1);
            expect(objs.count).to.be.equal(1);
            done();
          })
          .catch(function(err){
            done(err);
          });
        });
      });
    });
    describe("order", function(){
      context("指定したkeyの昇順でリストが返り", function(){
        beforeEach(function(){
          QueryTest = ncmb.DataStore("QueryTestOrder");
        });
        it("callback で取得できる", function(done){
          QueryTest
          .order("number")
          .fetchAll(function(err, objs){
            if(err){
              done(err);
            }else{
              expect(objs.length).to.be.equal(2);
              expect(objs[0].objectId).to.be.equal("order_object_1");
              done();
            }
          });
        });
        it("promise で取得できる", function(done){
          QueryTest
          .order("number")
          .fetchAll()
          .then(function(objs){
            expect(objs.length).to.be.equal(2);
            expect(objs[0].objectId).to.be.equal("order_object_1");
            done();
          })
          .catch(function(err){
            done(err);
          });
        });
      });
      context("descendingフラグをtrueにすると降順でリストが返り", function(){
        beforeEach(function(){
          QueryTest = ncmb.DataStore("QueryTestOrder");
        });
        it("callback で取得できる", function(done){
          QueryTest
          .order("number", true)
          .fetchAll(function(err, objs){
            if(err){
              done(err);
            }else{
              expect(objs.length).to.be.equal(2);
              expect(objs[0].objectId).to.be.equal("order_object_2");
              done();
            }
          });
        });
        it("promise で取得できる", function(done){
          QueryTest
          .order("number", true)
          .fetchAll()
          .then(function(objs){
            expect(objs.length).to.be.equal(2);
            expect(objs[0].objectId).to.be.equal("order_object_2");
            done();
          })
          .catch(function(err){
            done(err);
          });
        });
      });
      context("複数の条件を指定して検索するとリストが返り", function(){
        beforeEach(function(){
          QueryTest = ncmb.DataStore("QueryTestOrder");
        });
        it("callback で取得できる", function(done){
          QueryTest
          .order("number")
          .order("createDate")
          .fetchAll(function(err, objs){
            if(err){
              done(err);
            }else{
              expect(objs.length).to.be.equal(3);
              expect(objs[0].objectId).to.be.equal("order_object_1");
              done();
            }
          });
        });
        it("promise で取得できる", function(done){
          QueryTest
          .order("number")
          .order("createDate")
          .fetchAll()
          .then(function(objs){
            expect(objs.length).to.be.equal(3);
            expect(objs[0].objectId).to.be.equal("order_object_1");
            done();
          })
          .catch(function(err){
            done(err);
          });
        });
      });
      it("descendingフラグが真偽値以外で指定されたとき、エラーが返る", function(done){
        QueryTest = ncmb.DataStore("QueryTestOrder");
        try{
          QueryTest.order("number", "true");
          done(new Error("失敗するべき"));
        }catch(err){
          done();
        }
      });
      it("keyが文字列以外で指定されたとき、エラーが返る", function(done){
        QueryTest = ncmb.DataStore("QueryTestOrder");
        try{
          QueryTest.order(["number"]);
          done(new Error("失敗するべき"));
        }catch(err){
          done();
        }
      });
    });
    describe("limit", function(){
      context("指定した件数だけリストが返り", function(){
        beforeEach(function(){
          QueryTest = ncmb.DataStore("QueryTestLimit");
        });
        it("callback で取得できる", function(done){
          QueryTest
          .limit(1)
          .fetchAll(function(err, objs){
            if(err){
              done(err);
            }else{
              expect(objs.length).to.be.equal(1);
              expect(objs[0].objectId).to.be.equal("limit_object_1");
              done();
            }
          });
        });
        it("promise で取得できる", function(done){
          QueryTest
          .limit(1)
          .fetchAll()
          .then(function(objs){
            expect(objs.length).to.be.equal(1);
            expect(objs[0].objectId).to.be.equal("limit_object_1");
            done();
          })
          .catch(function(err){
            done(err);
          });
        });
      });
      context("複数回実行すると最後に設定した件数でリストが返り", function(){
        beforeEach(function(){
          QueryTest = ncmb.DataStore("QueryTestLimit");
        });
        it("callback で取得できる", function(done){
          QueryTest
          .limit(50)
          .limit(1)
          .fetchAll(function(err, objs){
            if(err){
              done(err);
            }else{
              expect(objs.length).to.be.equal(1);
              expect(objs[0].objectId).to.be.equal("limit_object_1");
              done();
            }
          });
        });
        it("promise で取得できる", function(done){
          QueryTest
          .limit(50)
          .limit(1)
          .fetchAll()
          .then(function(objs){
            expect(objs.length).to.be.equal(1);
            expect(objs[0].objectId).to.be.equal("limit_object_1");
            done();
          })
          .catch(function(err){
            done(err);
          });
        });
      });
      it("件数が数字以外で指定されたとき、エラーが返る", function(done){
        QueryTest = ncmb.DataStore("QueryTestLimit");
        try{
          QueryTest.limit("1");
          done(new Error("失敗するべき"));
        }catch(err){
          done();
        }
      });
      it("件数が設定可能範囲より大きく指定されたとき、エラーが返る", function(done){
        QueryTest = ncmb.DataStore("QueryTestLimit");
        try{
          QueryTest.limit(1001);
          done(new Error("失敗するべき"));
        }catch(err){
          done();
        }
      });
      it("件数が設定可能範囲より小さく指定されたとき、エラーが返る", function(done){
        QueryTest = ncmb.DataStore("QueryTestLimit");
        try{
          QueryTest.limit(0);
          done(new Error("失敗するべき"));
        }catch(err){
          done();
        }
      });
    });
    describe("skip", function(){
      context("指定した件数だけ取得開始位置を後ろにしたリストが返り", function(){
        beforeEach(function(){
          QueryTest = ncmb.DataStore("QueryTestSkip");
        });
        it("callback で取得できる", function(done){
          QueryTest
          .skip(1)
          .fetchAll(function(err, objs){
            if(err){
              done(err);
            }else{
              expect(objs.length).to.be.equal(1);
              expect(objs[0].objectId).to.be.equal("skip_object_2");
              done();
            }
          });
        });
        it("promise で取得できる", function(done){
          QueryTest
          .skip(1)
          .fetchAll()
          .then(function(objs){
            expect(objs.length).to.be.equal(1);
            expect(objs[0].objectId).to.be.equal("skip_object_2");
            done();
          })
          .catch(function(err){
            done(err);
          });
        });
      });
      context("複数回実行すると最後に設定した条件でリストが返り", function(){
        beforeEach(function(){
          QueryTest = ncmb.DataStore("QueryTestSkip");
        });
        it("callback で取得できる", function(done){
          QueryTest
          .skip(50)
          .skip(1)
          .fetchAll(function(err, objs){
            if(err){
              done(err);
            }else{
              expect(objs.length).to.be.equal(1);
              expect(objs[0].objectId).to.be.equal("skip_object_2");
              done();
            }
          });
        });
        it("promise で取得できる", function(done){
          QueryTest
          .skip(50)
          .skip(1)
          .fetchAll()
          .then(function(objs){
            expect(objs.length).to.be.equal(1);
            expect(objs[0].objectId).to.be.equal("skip_object_2");
            done();
          })
          .catch(function(err){
            done(err);
          });
        });
      });
      it("引数が負の値で指定されたとき、エラーが返る", function(done){
        QueryTest = ncmb.DataStore("QueryTestSkip");
        try{
          QueryTest.skip(-1);
          done(new Error("失敗するべき"));
        }catch(err){
          done();
        }
      });
      it("引数が数値以外で指定されたとき、エラーが返る", function(done){
        QueryTest = ncmb.DataStore("QueryTestSkip");
        try{
          QueryTest.skip("1");
          done(new Error("失敗するべき"));
        }catch(err){
          done();
        }
      });
    });
  });
});
