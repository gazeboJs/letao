$(function() {

	//全局参数查询对象
	var queryObj = {
		proName: '',
		brandId: '',
		price: '',
		num: '',
		page: 1,
		pageSize: 6
	};
	queryObj.proName = getURLParams('key'); //获取URL上的参数
	//var cnt; //设置总条数
	mui.init({
		pullRefresh: {
			container: "#refreshContainer", //下拉刷新容器标识，querySelector能定位的css选择器均可，比如：id、.class等
			down: {
				height: 50, //可选,默认50.触发下拉刷新拖动距离,
				auto: true, //可选,默认false.首次加载自动下拉刷新一次
				contentdown: "下拉可以刷新", //可选，在下拉可刷新状态时，下拉刷新控件上显示的标题内容
				contentover: "释放立即刷新", //可选，在释放可刷新状态时，下拉刷新控件上显示的标题内容
				contentrefresh: "正在刷新...", //可选，正在刷新状态时，下拉刷新控件上显示的标题内容
				callback: function() {
					setTimeout(function() {
						queryObj.page = 1;//定死显示第1页
						 queryRequest(function (result) {
							cnt = result.count;//条数
							var html = template("prolist", result)
							$(".lt_product_list").html(html);
							//结束时下拉刷新	
							mui('#refreshContainer').pullRefresh().endPulldownToRefresh(false);	
							//重置上拉控件的用户提示
							mui('#refreshContainer').pullRefresh().refresh(true);
						});
					}, 1000)

				}
			},
			up: {//向上拉,向下加载
				height: 50, //可选.默认50.触发上拉加载拖动距离
				auto: true, //可选,默认false.自动上拉加载一次
				contentrefresh: "正在加载...", //可选，正在加载状态时，上拉加载控件上显示的标题内容
				contentnomore: '没有更多数据了', //可选，请求完毕若没有更多数据时显示的提醒内容；
				callback: function() {
					var totalPage = Math.ceil(cnt / queryObj.pageSize); //计算一共有多少页,

					// 判断
					if(queryObj.page < totalPage) {
						// 继续请求数据
						queryObj.page++;
						queryRequest(function(result) {
							var html = template("prolist", result);//把数据写入到模板,定义一个html变量接收
							$(".lt_product_list").append(html);//把接收到的数据追加商品列表标签内,不会覆盖以前的内容,html()会覆盖以前的内容
							//有数据传入false,则无其他显示
							mui('#refreshContainer').pullRefresh().endPullupToRefresh(false);
						})

					} else {
						//没有数据就传入true ,给用户提示没有数据了
					mui('#refreshContainer').pullRefresh().endPullupToRefresh(true);
					}

				}
			}
		}
	})
	//发送AJAX请求
	function queryRequest(callback) {
		$.ajax({
			type: "get",
			url: "/product/queryProduct",
			data: queryObj,
			success: function(result) {
				callback && callback(result);
			}
		});
	}
	//点击搜索
	$('.searchBtn').on('tap',function(){
		var val=$('.searchTxt').val();
		if(!$.trim(val)){ //trim去除字符串两边的空格
			mui.toast('请输入关键字');//mui提示组件
		}else{
			queryObj.proName=val;
			//手动触发下拉
			 mui("#refreshContainer").pullRefresh().pulldownLoading();
             
		}
	})
	
	
	//点击排序
	$('.lt_sort_bar>a').on('tap',function(){
		//单击当前项,添加颜色类,兄弟元素删除类
		$(this).addClass('active').siblings().removeClass('active');
		//改变箭头方向
		$(this).find('.mui-icon').toggleClass('mui-icon-arrowdown mui-icon-arrowup');
		var sort=-1;
		if($(this).find('.mui-icon').hasClass('mui-icon-arrowup')){
			sort=1;
		}else{
			sort=2;
		}
		//获取要排序的关键字
		//sortname h5自定义属性	
		//data()获取自定义属性
		if($(this).data('sortname')=='price'){
			//console.log($(this).data('sortname'));
			queryObj.price=sort;
			queryObj.num='';
		}
		if($(this).data('sortname')=='num'){
			queryObj.num=sort;
			queryObj.price='';
		}
		// 手动触发下拉 
   		 mui("#refreshContainer").pullRefresh().pulldownLoading();
	})  

	// 获取url上的参数的 
	function getURLParams(name) {
		var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
		var r = window.location.search.substr(1).match(reg);
		if(r != null) {
			return unescape(r[2]);
		}
		return null;
	}
	
	
})