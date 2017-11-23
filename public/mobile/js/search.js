$(function() {
	loadHistory();
	function loadHistory() {
		var ls = localStorage; //设置本地存储变量
		//有数据就获取数据,没有数据就获取空的数组
		//parse转换对象
		var arr = (ls.getItem('lthis') && JSON.parse(ls.getItem('lthis'))) || [];
		//判断用户有没有输入查询数据
		if(arr.length < 1) {
			$('.history_list').html(''); //如果没有就给一个空
			return;
		}
		var strArr = []; //定义空数组
		//遍历循环列表
		for(var i = 0; i < arr.length; i++) {
			strArr.push('<div class="hl_item mui-clearfix"> <span class="item_font">' + arr[i] + '</span> <span class="item_close mui-icon mui-icon-closeempty"></span> </div>')
		} //push往数组的尾部加数据
		$('.history_list').html(strArr.join(''));//渲染列表数据
	}
	
	//点击搜索按钮
	$('.searchBtn').on('tap',function(){
		var val=$('.searchTxt').val();//获取用户输入的查询字符串
		
		//去掉用户输入的字符串中的前后空格
		if(!$.trim(val)){
			return false;
		}
		var ls = localStorage; 
		var arr = (ls.getItem('lthis') && JSON.parse(ls.getItem('lthis'))) || [];
		//去除重复搜索的记录
		for (var i = 0; i < arr.length; i++) {
			if(arr[i]==val){
				arr.splice(i,1);//删除旧的记录,添加新的记录  splice:1要删除的值,2要删除几个
			}
		}
		arr.unshift(val);//往数组的头部加数据;
		ls.setItem('lthis',JSON.stringify(arr));
		//刷新加载localstorage的数据
		//loadHistory();
		//改成跳转页面
		location.href='searchlist.html?key='+val;
	})
  		//清空数据
     	$('.clearBtn').on('tap',function(){
     		localStorage.setItem('lthis',JSON.stringify([]));
     		loadHistory();
     	})
     	
     	//事件委托
     	$('body').on('tap','.item_close',function(){
     		var index=$(this).parent().index();//获取父元素的索引
     		var ls=localStorage;
     		var arr=(ls.getItem('lthis')&&JSON.parse(ls.getItem('lthis'))) ||[];
     		arr.splice(index,1);//删除数组中的元素
     		ls.setItem('lthis',JSON.stringify(arr));//存值
     		loadHistory();
     	})
})