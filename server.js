
var cheerio = require('cheerio');
var request = require("request");
var fs = require('fs');
var async = require('async');
var format = require('util').format;
var page = ["1","2","3","4","5"];

function category_init(ca,co,n){
	this.category = ca,
	this.news_count = co,
	this.news = n;
}

function news_init(title,url,time,video){
	this.title = title;
	this.url = url;
	this.time = time;
	this.video = video;
}

var finalarr = [];
var greatest = 0;
var secondgreatest = 0;

var category = 

["動物","FUN","瘋啥","搜奇","正妹","體育","臉團","娛樂","時尚","生活","社會","國際","財經","地產","政治","論壇"]

for(var i=0;i<16;i++){
	var j = new category_init(category[i],0,[])
	finalarr.push(j);
}

//console.log(finalarr);
var counter = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
// counter[0]+=1;
// console.log(counter[0]);




// console.log(JSON.stringify(arr));
async.eachLimit(page, 1, function (page, next){
	var url = format('http://www.appledaily.com.tw/realtimenews/section/new/%s', page);
	//console.log(url);
	request( url , function (err, res, body) {
	    if (err) throw err;
	    //console.log(body);
	    var $ = cheerio.load(body);
	    $('.rtddt').each(function () {
	    	

	    	for(var i=0;i<16;i++){
	    		var news = new news_init($(this).children('a').children('h1').text(),$(this).children('a').attr('href'),$(this).children('a').children('time').text(),$(this).hasClass('hsv'))
	    		if($(this).children('a').children('h2').text()===category[i]){
	    			counter[i]+=1;
	    			//console.log($(this).children('a').children('h2').text());
	    			finalarr[i].news.push(news);
	    			break;
	    		}
	    	}
	        //console.log($(this).children('a').attr('href'));//href
	        //console.log($(this).hasClass('hsv'));
	        //console.log($(this).children('a').children('time').text());//time
	        //console.log($(this).children('a').children('h2').text());
	        //console.log($(this).children('a').children('h1').text());
	    });

		// console.log(counter);
		
		next();
	});

	for(var j=0;j<16;j++){ // store counter into final array
		finalarr[j].news_count = counter[j];
	}
	//console.log(counter);
	greatest = counter.indexOf(Math.max.apply(Math, counter));
	// console.log(counter.indexOf(Math.max.apply(Math, counter)));
	counter.splice(counter.indexOf(Math.max.apply(Math, counter)),1,0);
	// console.log(counter);
	secondgreatest = counter.indexOf(Math.max.apply(Math, counter));
	// console.log(counter.indexOf(Math.max.apply(Math, counter)));
	
	fs.writeFile('appledaily.json',JSON.stringify(finalarr),function(err, data){
		  if (err) throw err;
	});
	console.log(category[greatest],category[secondgreatest]);
});
