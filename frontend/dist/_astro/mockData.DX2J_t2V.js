var n={exports:{}},s={};/**
 * @license React
 * react-jsx-runtime.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var u;function d(){if(u)return s;u=1;var p=Symbol.for("react.transitional.element"),R=Symbol.for("react.fragment");function a(E,e,r){var t=null;if(r!==void 0&&(t=""+r),e.key!==void 0&&(t=""+e.key),"key"in e){r={};for(var i in e)i!=="key"&&(r[i]=e[i])}else r=e;return e=r.ref,{$$typeof:p,type:E,key:t,ref:e!==void 0?e:null,props:r}}return s.Fragment=R,s.jsx=a,s.jsxs=a,s}var o;function x(){return o||(o=1,n.exports=d()),n.exports}var l=x();const m={ramesh:{id:"ramesh",name:"Ramesh Kumar",business:"Shree Balaji Chai Stall",type:"Street Food Vendor",gross:42995,expenses:22928,surplus:20067,emi:3200,cv:.043,fhs:86,prob:78.2,tier:"TIER 1 LOW RISK",decision:"ELIGIBLE"},priya:{id:"priya",name:"Priya Sharma",business:"Swiggy & Zomato Delivery",type:"Gig Delivery Partner",gross:28400,expenses:9800,surplus:18600,emi:2100,cv:.12,fhs:79,prob:72.5,tier:"TIER 1 LOW RISK",decision:"ELIGIBLE"},arun:{id:"arun",name:"Arun Verma",business:"Artisan Woodcraft & Carpentry",type:"Independent Artisan",gross:32e3,expenses:14e3,surplus:18e3,emi:6500,cv:.45,fhs:58,prob:54.1,tier:"TIER 3 ELEVATED RISK",decision:"CONDITIONAL APPROVAL"}};export{m as P,l as j};
