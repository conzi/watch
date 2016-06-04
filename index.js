 var fs = require('fs')


 /**
  *  @params path  filepath or directory
  *  @params [conf], config: {encode:'utf8', ignore:'ignore files pattern', filter:"focus files pattern" , events:['change' ,'create', 'delete'] }
  *  @params callback : function(event , filename)
  *
  *
  * */
 module.exports = function watch( path , conf , callback ){
     var stat = fs.statSync(path);
     callback = callback || null;
     if (conf && typeof conf == 'function') {
         callback = conf
         conf = null
     }
     if(!callback){
         throw new Error('no callback set ');
     }
     conf = conf ||{};

     var opt ={};
     if(conf['charset'] ){
         opt['charset'] = conf['charset']
     }
     if(stat.isDirectory()){
         opt['recursive' ] = true;
     }
     fs.watch(path , opt , (event , filename){
         if (event == 'rename'){
             if (fs.existsSync(path+"/" + filename)){
                 event = 'create'
             }else {
                 event = 'delete'
             }
         }
         if(conf.events && !conf.events.includes(event)){
             return ;
         }

         if(stat.isDirectory()){
             if(conf.ignore && conf.ignore.match(filename)){
                 return ;
             }
             if(conf.filter &&  !conf.filter.match(filename)){
                 return ;
             }
         }
         callback(event , filename);
     })
 }

