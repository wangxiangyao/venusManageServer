webpackJsonp([2],{"5jvf":function(t,e,a){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var n=a("W3Iv"),i=a.n(n),s=a("BO1k"),o=a.n(s),r=a("d7EF"),l=a.n(r),u=a("pFYg"),c=a.n(u),d=a("Dd8w"),v=a.n(d),h=a("mvHQ"),f=a.n(h),p=a("NYxO"),m=a("8qQG"),g=a.n(m),y={avator:"",desc:"",name:"",tag:[{text:""}],id:""},k={name:"authorList",components:{tools:a("V+FN").a},data:function(){return{imgUpLoadUrl:this.$store.state.uri+"/api/uploadImg",authorList:JSON.parse(f()(this.$store.state.author.byId))}},computed:v()({},Object(p.d)("author",["isLoading","isSave","isChanged"])),created:function(){console.log(JSON.parse(f()(this.$store.state.author)))},methods:v()({},Object(p.b)("author",{addAuthor:"addAuthor",deleteAuthor:"deleteAuthor"}),Object(p.c)("author",["UPDATE_AUTHOR"]),{handleAvatarSuccess:function(t){return function(e,a){console.log(e,a,t),t.avator=e.url}},beforeAvatarUpload:function(){console.log(1)},handleSave:function(){var t=[];for(var e in this.authorList)t.push(this.authorList[e]);this.$apollo.mutate({mutation:g.a,variables:{input:this.queryRemoveTypename(t)}}).then(function(t){console.log(t)})},handleAdd:function(){this.addAuthor(y)},handleDelete:function(t){console.log(t),this.deleteAuthor(t)},handleChange:function(t){this.UPDATE_AUTHOR({id:t,data:this.authorList[t]})},handleTagAdd:function(t){t.tag.push({text:""})},handleTagDelete:function(t,e){t.splice(e,1)},queryRemoveTypename:function(t){var e=void 0;if("object"===(void 0===t?"undefined":c()(t)))if(Array.isArray(t)){e=[];var a=!0,n=!1,s=void 0;try{for(var r,u=o()(t.entries());!(a=(r=u.next()).done);a=!0){var d=r.value,v=l()(d,2),h=v[0],f=v[1];"object"===(void 0===f?"undefined":c()(f))&&(e[h]=this.queryRemoveTypename(f))}}catch(t){n=!0,s=t}finally{try{!a&&u.return&&u.return()}finally{if(n)throw s}}}else{e={};var p=!0,m=!1,g=void 0;try{for(var y,k=o()(i()(t));!(p=(y=k.next()).done);p=!0){var b=y.value,C=l()(b,2),_=C[0],A=C[1];"object"===(void 0===A?"undefined":c()(A))?e[_]=this.queryRemoveTypename(A):"__typename"!==_&&(e[_]=A)}}catch(t){m=!0,g=t}finally{try{!p&&k.return&&k.return()}finally{if(m)throw g}}}return e}}),watch:{isLoading:function(t){this.authorList=JSON.parse(f()(this.$store.state.author.byId))}}},b={render:function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"author-wrapper"},[a("tools",{on:{save:t.handleSave}}),t._v(" "),a("div",{staticClass:"actions"},[a("div",{staticClass:"new"},[a("el-button",{attrs:{type:"primary"},on:{click:t.handleAdd}},[t._v("新增")])],1)]),t._v(" "),t.isLoading?t._e():a("div",{staticClass:"author-list"},t._l(t.authorList,function(e){return a("div",{staticClass:"author"},[a("i",{staticClass:"el-icon-circle-close-outline delete-icon",on:{click:function(a){t.handleDelete(e.id)}}}),t._v(" "),a("div",{staticClass:"info"},[a("div",{staticClass:"avator"},[a("el-upload",{staticClass:"avatar-uploader",attrs:{action:t.imgUpLoadUrl,"show-file-list":!1,"on-success":t.handleAvatarSuccess(e),"before-upload":t.beforeAvatarUpload}},[e?a("img",{staticClass:"avatar",attrs:{src:e.avator}}):a("i",{staticClass:"el-icon-plus avatar-uploader-icon"})])],1),t._v(" "),a("div",{staticClass:"name"},[a("el-input",{attrs:{placeholder:"请输入内容"},on:{change:function(a){t.handleChange(e.id)}},model:{value:e.name,callback:function(a){t.$set(e,"name",a)},expression:"item.name"}})],1)]),t._v(" "),a("div",{staticClass:"desc"},[a("el-input",{attrs:{type:"textarea",rows:2,placeholder:"个性签名"},on:{change:function(a){t.handleChange(e.id)}},model:{value:e.desc,callback:function(a){t.$set(e,"desc",a)},expression:"item.desc"}})],1),t._v(" "),a("div",{staticClass:"tags"},t._l(e.tag,function(n,i){return a("div",{staticClass:"tag"},[a("div",{staticClass:"tag-text"},[a("el-input",{attrs:{size:"mini",placeholder:"标签"},on:{change:function(a){t.handleChange(e.id)}},model:{value:n.text,callback:function(e){t.$set(n,"text",e)},expression:"tag.text"}})],1),t._v(" "),a("div",{staticClass:"tag-delete",on:{click:function(a){t.handleTagDelete(e.tag,i)}}},[a("i",{staticClass:"el-icon-close"})])])})),t._v(" "),a("el-button",{attrs:{size:"mini",type:"primary"},on:{click:function(a){t.handleTagAdd(e)}}},[t._v("新增")])],1)}))],1)},staticRenderFns:[]},C=a("VU/8")(k,b,!1,function(t){a("qOD1")},null,null);e.default=C.exports},"8qQG":function(t,e,a){var n={kind:"Document",definitions:[{kind:"OperationDefinition",operation:"mutation",name:{kind:"Name",value:"setAuthorList"},variableDefinitions:[{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"input"}},type:{kind:"NonNullType",type:{kind:"ListType",type:{kind:"NamedType",name:{kind:"Name",value:"authorInput"}}}}}],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"setAuthorList"},arguments:[{kind:"Argument",name:{kind:"Name",value:"input"},value:{kind:"Variable",name:{kind:"Name",value:"input"}}}],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"FragmentSpread",name:{kind:"Name",value:"author"},directives:[]}]}}]}}],loc:{start:0,end:142}};n.loc.source={body:'#import "./authorFragment.gql"\r\n\r\nmutation setAuthorList ($input: [authorInput]!){\r\n  setAuthorList (input: $input) {\r\n    ...author\r\n  }\r\n}\r\n',name:"GraphQL request",locationOffset:{line:1,column:1}};var i={};n.definitions=n.definitions.concat(function(t){return t.filter(function(t){if("FragmentDefinition"!==t.kind)return!0;var e=t.name.value;return!i[e]&&(i[e]=!0,!0)})}(a("zQ78").definitions)),t.exports=n},"V+FN":function(t,e,a){"use strict";var n={render:function(){var t=this.$createElement,e=this._self._c||t;return e("div",{staticClass:"tools"},[e("div",{staticClass:"counsel"},[this._v("\n    珍爱生命，勤点保存 ——>\n  ")]),this._v(" "),e("div",{staticClass:"save",style:{margin:"0 10px"}},[e("el-button",{attrs:{type:"success"},on:{click:this.handleSave}},[this._v("保存")])],1)])},staticRenderFns:[]},i=a("VU/8")({name:"tools",methods:{handleSave:function(){this.$emit("save")}}},n,!1,function(t){a("wOZ6")},null,null);e.a=i.exports},qOD1:function(t,e){},wOZ6:function(t,e){}});
//# sourceMappingURL=2.e23b22d24fb59cb08a23.js.map