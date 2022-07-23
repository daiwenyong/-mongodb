# -模拟Mongodb的小程序数据库进行本地存储
## example
    db.add({'a',1}).save()
    db.where('a',1).update({a:2}).save()
    db.where('a',1).del().save()
    db.where('a',1).find() 
    db.where('a','>',1).find()
    db.where('a','>=',1).sort('a','asc').select()  
    db.where('a','>=',1).sort('a','asc').limit(x,y).select()  
    
    
