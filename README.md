# -模拟Momongodb的小程序数据库进行本地存储
    类型mongodb的api：增删改查 排序 限制
    暴露一个class类
    db.add({'a',1}).save()
    db.where('a',1).find()  db.where('a','>',1).find()  
    
      升序a属性   降序desc  第二个参数不传默认是asc
          db.where('a','>=',1).sort('a','asc').select()  
      limit：选取第x 个到y个   第二个参数不传则从第一个选取x个
          db.where('a','>=',1).sort('a','asc').limit(x,y).select()  
    find方法查找一条，select方法查找多条
    
    db.where('a',1).update({a:2})
    db.where('a',1).del()
