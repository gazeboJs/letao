$(function(){
	queryClassify();//调用一级分类函数
	//一级分类
	function queryClassify(){
		maskShow();//进入显示延迟动画
		$.ajax({
			type:"get",
			url:"/category/queryTopCategory",
			success:function(result){
				var rows=result.rows; //获取数据
				var strArr=[];//定义一个空数组
				for (var i = 0; i < rows.length; i++) {
					//循环遍历拿到所有数据存到空数组中
					strArr.push('<li data-id='+rows[i].id+'><a href="#">'+rows[i].categoryName+'</a></li>');
					$('.lt_menu>ul').html(strArr.join(''));//渲染到UL标签里
				}
				querySecondclassify(rows[0].id);//传入id和一级分类同步显示
				$('.lt_menu>ul>li').eq(0).addClass('active');
				maskClose();//渲染数据完毕隐藏延迟动画
			}
		});
	}
	//二级分类
	function querySecondclassify(id){
		maskShow();//进入显示延迟动画
		$.ajax({
			type:"get",
			url:"/category/querySecondCategory",//通过ID获取2级分类
			data:{'id':id},
			success:function(result){
				var rows=result.rows;//获取数据
				if(rows.length>0){
					var strArr=[];
					for (var i = 0; i < rows.length; i++) {
						//凭借字符串,把遍历到得数据存到数组中
						strArr.push('<li><a href="javascript:;"><img src="'+rows[i].brandLogo+'" alt=""><p>'+rows[i].brandName+'</p></a></li>');
					}
					$('.lt_content>ul').html(strArr.join(''));//渲染到UL标签里
				}else{
					$(".lt_content>ul").html('没有数据了');//没有数据的列,就给用户提示
				}
				maskClose();//渲染数据完毕隐藏延迟动画
			}
		});
	}
	
	
	//给侧边栏注册点击事件,li标签是通过动态生成的,所以使用事件委托注册
	$('.lt_menu').on('tap','li',function(){
		//console.log($(this));
		$(this).addClass('active').siblings().removeClass('active');
	
		var id=$(this).data("id");  //通过id获取当前点击 这里的id是h5自定义属性
		querySecondclassify(id);//同步
		
	})
})
