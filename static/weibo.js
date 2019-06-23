var apiWeiboAll = function(callback) {
    var path = '/api/weibo/all'
    ajax('GET', path, '', callback)
}


var apiWeiboAdd = function(form, callback) {
    var path = '/api/weibo/add'
    ajax('POST', path, form, callback)
}


var apiWeiboDelete = function(weibo_id, callback) {
    var path = `/api/weibo/delete?id=${weibo_id}`
    ajax('GET', path, '', callback)
}


var apiWeiboUpdate = function(form, callback) {
    var path = `/api/weibo/update`
    ajax('POST', path, form, callback)
}


var apiCommentAdd = function(form, callback) {
    var path = '/api/comment/add'
    ajax('POST', path, form, callback)
}


var apiCommentDelete = function(comment_id, callback) {
    var path = `/api/comment/delete?id=${comment_id}`
    ajax('GET', path, '', callback)
}


var apiCommentUpdate = function(form, callback) {
    var path = `/api/comment/update`
    ajax('POST', path, form, callback)
}


var weiboTemplate = function(weibo, comments) {
    var t = `
        <div class="weibo-cell weibo-box" data-id="${weibo.id}">
            <span>
                <span class="weibo-content">${weibo.content}</span>
                from 
                <span class="weibo-user">${weibo.username}</span>
            </span>
            
            <button class="weibo-edit">编辑</button>
            <button class="weibo-delete">删除</button>
            <br>
            <br>
            <div class="comment-list">${comments}
                <input class="input-comment" value="说点什么？">
                <br>
                <button class="comment-add">发布评论</button>
            </div>
        </div>
    `
    return t
}


var weiboUpdateTemplate = function(content) {
    var t = `
        <div class="weibo-update-form">
            <input class="weibo-update-input" value="${content}"/>
            <button class="weibo-update">更新</button>
        </div>
    `
    return t
}


var commentTemplate = function(comment) {
    var t = `
        <div class="comment-cell" data-id="${comment.id}">
            <span>
                <span class="comment-content">${comment.content}</span>
                from 
                <span class="comment-user">${comment.username}</span>
            </span>
            <br>
            <button class="comment-delete">删除评论</button>
            <button class="comment-edit">编辑评论</button>
            <br>
        </div>
    `
    return t
}


var commentUpdateTemplate = function(content) {
    var t = `
        <div class="comment-update-form">
            <input class="comment-update-input" value="${content}"/>
            <button class="comment-update">更新</button>
        </div>
    `
    return t
}


var insertWeibo = function(weibo, comment) {
    var weiboCell = weiboTemplate(weibo, comment)
    // 插入 weibo-list
    var weiboList = e('#id-weibo-list')
    weiboList.insertAdjacentHTML('beforeend', weiboCell)
}

var insertComment = function (commentList, comment) {
    var commentCell = commentTemplate(comment)
    commentList.insertAdjacentHTML('afterbegin', commentCell)
}

var insertUpdateForm = function(content, weiboCell) {
    var updateForm = weiboUpdateTemplate(content)
    weiboCell.insertAdjacentHTML('beforeend', updateForm)
}


var insertUpdateFormComment = function(content, commentCell) {
    var updateForm = commentUpdateTemplate(content)
    commentCell.insertAdjacentHTML('beforeend', updateForm)
}


var loadWeibos = function() {
    apiWeiboAll(function (weibos) {
        log('load all weibos', weibos)
        // 循环添加到页面中
        log('lengthweibo', weibos.length)
        for (var i = 0; i < weibos.length; i++) {
            // 插入微博
            var weibo = weibos[i]
            // insertWeibo(weibo)
            // alert(weiboCell)
            var comments = ''
            for (var j = 0; j < weibo['comments'].length; j++) {
                // alert(j)
                // 插入相应微博的评论
                comments += commentTemplate(weibo['comments'][j])
                // alert('comment')
            }
        insertWeibo(weibo, comments)
        }
    })
}


var bindEventWeiboAdd = function() {
    var b = e('#id-button-add')
    // 注意, 第二个参数可以直接给出定义函数
    b.addEventListener('click', function(){
        var input = e('#id-input-weibo')
        var content = input.value
        log('click add', content)
        var form = {
            content: content,
        }
        apiWeiboAdd(form, function(weibo) {
            // 收到返回的数据, 插入到页面中
            var comment = ''
            insertWeibo(weibo, comment)
        })
    })
}


var bindEventWeiboDelete = function() {
    var weiboList = e('#id-weibo-list')
    // 事件响应函数会传入一个参数 就是事件本身
    weiboList.addEventListener('click', function(event) {
    log(event)
    // 我们可以通过 event.target 来得到被点击的对象
    var self = event.target
    log('被点击的元素', self)
    // 通过比较被点击元素的 class
    // 来判断元素是否是我们想要的
    // classList 属性保存了元素所有的 class
    log(self.classList)
    if (self.classList.contains('weibo-delete')) {
        log('点到了删除按钮')
        var weiboId = self.parentElement.dataset['id']
        apiWeiboDelete(weiboId, function(r) {
            log('apiweiboDelete', r.message)
            // 删除 self 的父节点
            if(r.remove == true) {
                self.parentElement.remove()
            }
            alert(r.message)
        })
    } else {
        log('点到了 weibo cell')
    }
})}


var bindEventWeiboEdit = function() {
    var weiboList = e('#id-weibo-list')
    // 事件响应函数会传入一个参数 就是事件本身
    weiboList.addEventListener('click', function(event) {
    log(event)
    // 我们可以通过 event.target 来得到被点击的对象
    var self = event.target
    log('被点击的元素', self)
    // 通过比较被点击元素的 class
    // 来判断元素是否是我们想要的
    // classList 属性保存了元素所有的 class
    log(self.classList)
    if (self.classList.contains('weibo-edit')) {
        log('点到了编辑按钮', self)
        var weiboCell = self.closest('.weibo-cell')
        var weiboId = weiboCell.dataset['id']
        var weiboSpan = e('.weibo-content', weiboCell)
        var content = weiboSpan.innerText
        insertUpdateForm(content, weiboCell)
    } else {
        log('点到了 weibo cell')
    }
})}


var bindEventWeiboUpdate = function() {
    var weiboList = e('#id-weibo-list')
    // 注意, 第二个参数可以直接给出定义函数
    weiboList.addEventListener('click', function(event) {
    log(event)
    // 我们可以通过 event.target 来得到被点击的对象
    var self = event.target
    log('被点击的元素', self)
    // 通过比较被点击元素的 class
    // 来判断元素是否是我们想要的
    // classList 属性保存了元素所有的 class
    log(self.classList)
    if (self.classList.contains('weibo-update')) {
        log('点到了更新按钮')
        var weiboCell = self.closest('.weibo-cell')
        var weiboId = weiboCell.dataset['id']
        var weiboInput = e('.weibo-update-input', weiboCell)
        var content = weiboInput.value
        // 不要这么写
        // var title = e('.todo-update-input', self.closest('.todo-cell')).value
        var form = {
            id: weiboId,
            content: content,
        }

        apiWeiboUpdate(form, function(weibo) {
            log('apiWeiboUpdate', weibo)

            var weiboSpan = e('.weibo-content', weiboCell)
            weiboSpan.innerText = weibo.content
            var updateForm = e('.weibo-update-form', weiboCell)
            updateForm.remove()

            alert('更新成功')
        })
    } else {
        log('点到了 weibo cell')
    }
    // b.addEventListener('click', function(){
    //     var input = e('#id-input-weibo')
    //     var content = input.value
    //     log('click add', content)
    //     var form = {
    //         content: content,
    //     }
    //     apiWeiboAdd(form, function(todo) {
    //         // 收到返回的数据, 插入到页面中
    //         insertWeibo(todo)
    //     })
    // })
})
}


var bindEventCommentAdd = function() {
    var weiboList = e('#id-weibo-list')
    // 事件响应函数会传入一个参数 就是事件本身
    weiboList.addEventListener('click', function(event) {
    log(event)
    // 我们可以通过 event.target 来得到被点击的对象
    var self = event.target
    log('被点击的元素', self)
    // 通过比较被点击元素的 class
    // 来判断元素是否是我们想要的
    // classList 属性保存了元素所有的 class
    log(self.classList)
    if (self.classList.contains('comment-add')) {
        log('点到了评论添加按钮')
        var weiboCell = self.closest('.weibo-cell')
        var commentList = self.closest('.comment-list')
        var weiboId = weiboCell.dataset['id']
        var commentInput = e('.input-comment', weiboCell)
        var content = commentInput.value
        // 不要这么写
        // var title = e('.todo-update-input', self.closest('.todo-cell')).value
        var form = {
            weibo_id: weiboId,
            content: content,
        }
        log('commentList1', commentList)
        apiCommentAdd(form, function(comment) {
            log('apiCommentAdd', comment)
            log('commentList2', commentList)
            insertComment(commentList, comment)
        })
    } else {
        log('点到了 weibo cell')
    }
})}


var bindEventCommentDelete = function() {
    var weiboList = e('#id-weibo-list', )
    // 事件响应函数会传入一个参数 就是事件本身
    weiboList.addEventListener('click', function(event) {
    log(event)
    // 我们可以通过 event.target 来得到被点击的对象
    var self = event.target
    log('被点击的元素', self)
    // 通过比较被点击元素的 class
    // 来判断元素是否是我们想要的
    // classList 属性保存了元素所有的 class
    log(self.classList)
    if (self.classList.contains('comment-delete')) {
        log('点到了删除按钮')
        var commentId = self.parentElement.dataset['id']
        apiCommentDelete(commentId, function(r) {
            log('apiCommentDelete', r.message)
            // 删除 self 的父节点
            if(r.remove == true) {
                self.parentElement.remove()
            }
            alert(r.message)
        })
    } else {
        log('点到了 weibo cell')
    }
})}


var bindEventCommentEdit = function() {
    var weiboList = e('#id-weibo-list')
    // 事件响应函数会传入一个参数 就是事件本身
    weiboList.addEventListener('click', function(event) {
    log(event)
    // 我们可以通过 event.target 来得到被点击的对象
    var self = event.target
    log('被点击的元素', self)
    // 通过比较被点击元素的 class
    // 来判断元素是否是我们想要的
    // classList 属性保存了元素所有的 class
    log(self.classList)
    if (self.classList.contains('comment-edit')) {
        log('点到了编辑按钮', self)
        var commentCell = self.closest('.comment-cell')
        var commentId = commentCell.dataset['id']
        var commentSpan = e('.comment-content', commentCell)
        var content = commentSpan.innerText
        insertUpdateFormComment(content, commentCell)
    } else {
        log('点到了 comment cell')
    }
})}


var bindEventCommentUpdate = function() {
    var weiboList = e('#id-weibo-list')
    // 事件响应函数会传入一个参数 就是事件本身
    weiboList.addEventListener('click', function(event) {
    log(event)
    // 我们可以通过 event.target 来得到被点击的对象
    var self = event.target
    log('被点击的元素', self)
    // 通过比较被点击元素的 class
    // 来判断元素是否是我们想要的
    // classList 属性保存了元素所有的 class
    log(self.classList)
    if (self.classList.contains('comment-update')) {
        log('点到了更新按钮')
        var commentCell = self.closest('.comment-cell')
        var commentId = commentCell.dataset['id']
        var commentInput = e('.comment-update-input', commentCell)
        var content = commentInput.value
        // 不要这么写
        // var title = e('.todo-update-input', self.closest('.todo-cell')).value
        var form = {
            id: commentId,
            content: content,
        }

        apiCommentUpdate(form, function(comment) {
            log('apiCommentUpdate', comment)

            var commentSpan = e('.comment-content', commentCell)
            commentSpan.innerText = comment.content
            var commentSpan = e('.comment-user', commentCell)
            commentSpan.innerText = comment.username
            var updateForm = e('.comment-update-form', commentCell)
            updateForm.remove()

            alert(comment.message)
        })
    } else {
        log('点到了 comment cell')
    }
})}


var bindEvents = function() {
    bindEventWeiboAdd()
    bindEventWeiboDelete()
    bindEventWeiboEdit()
    bindEventWeiboUpdate()
    bindEventCommentAdd()
    bindEventCommentDelete()
    bindEventCommentEdit()
    bindEventCommentUpdate()
}

var __main = function() {
    bindEvents()
    loadWeibos()
}

__main()