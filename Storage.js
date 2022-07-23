const whereCompare = {
    '=': function (that, value) {
        return that == value
    },
    '!=': function (that, value) {
        return that != value
    },


    '>': function (that, value) {
        return that > value
    },
    '>=': function (that, value) {
        return that >= value
    },

    '<': function (that, value) {
        return that < value
    },
    '<=': function (that, value) {
        return that <= value
    },

    // 模糊查询
    'like': function (that, value) {
        return new RegExp(value, 'i').test(that)
    }
};
export default class Storage {
    constructor(dbName) {
        Object.assign(this, {
            dbName,
            cache: {
                add: {
                    data: []
                }
            }
        })
    }

    // 获取本地数据
    static getDb(dbName) {
        return wx.getStorageSync(dbName) || []
    }

    static getWhere(action) {
        if (this.whereFn) {
            return this.whereFn
        } else {
            throw new Error('请先调用where方法再调用' + action + '方法')
        }
    }

    // 构建查询语句
    where(...data) {
        let [key, compare, value] = data;
        if (value == undefined) {
            value = compare;
            compare = '=';
        }
        // 获取对比函数
        const compareFn = whereCompare[compare];
        if (compareFn) {
            this.whereFn = (item) => {
                return compareFn(item[key], value)
            }
        } else {
            throw new Error('where方法不支持' + compare)
        }
        return this
    }

    // 添加
    add(data) {
        if (Array.isArray(data)) {
            data.forEach(item => {
                this.add(item)
            })
        } else if (/object/.test(data)) {
            this.cache.add.data.push(data)
        } else {
            return new Error('add方法只接受对象参数')
        }

        return this
    }

    // 删除
    del(data) {
        this.cache.del = {
            where: Storage.getWhere.call(this, 'del')
        }
        return this
    }

    // 修改
    update(data) {
        if (/object/.test(data)) {
            this.cache.update = {
                data,
                where: Storage.getWhere.call(this, 'update')
            }
        } else {
            throw new Error('update方法只接受对象为参数')
        }
        return this
    }


    // 查找一条
    find(data) {
        let db = Storage.getDb(this.dbName);
        return db.find(Storage.getWhere.call(this, 'find'))
    }

    // 查找多条
    select() {
        let db = Storage.getDb(this.dbName);
        let data = db.filter(Storage.getWhere.call(this, 'select'))
        this.sortFn && data.sort(this.sortFn)
        return this.limitArg ? data.slice(...this.limitArg) : data
    }

    // 排序sort
    sort(key, sort = 'asc') { // asc正序
        this.sortFn = (a, b) => {
            return /desc/.test(sort) ? b[key] - a[key]
                : a[key] - b[key]
        }
        return this
    }

    // 限制            
    limit(start, end) {
        if (end == undefined) {
            end = start;
            start = 0;
        } else {
            --start;
            end += start;
        }
        this.limitArg = [start, end];
        return this
    }

    // 保存
    save() {
        let db = Storage.getDb(this.dbName);
        // .del().save()
        if (this.cache.del) {
            db = db.filter(item => {
                return !this.cache.del.where(item)
            })
        }
        // update
        if (this.cache.update) {
            db.forEach(item => {
                if (this.cache.update.where(item)) {
                    Object.assign(item, this.cache.update.data)
                }
            })
        }
        // add
        if (this.cache.add) {
            db.push(...this.cache.add.data)
        }

        // 保存在本地存储
        db = wx.setStorageSync(this.dbName, db)
        // 清空类中的缓存
        this.cache.add.data = []

        return this
    }


}