from utils import log
from routes import current_user, login_required
from routes.routes_weibo import weibo_owner_required, comment_owner_reuired
from models.weibo import Weibo
from models.comment import Comment
from models.user import User

from flask import (
    request,
    redirect,
    jsonify,
    Blueprint,
    current_app
)

# endpoint
bp = Blueprint('api_weibo', __name__)

# 本文件只返回 json 格式的数据
# 而不是 html 格式的数据
@bp.route('/api/weibo/all')
@login_required
def all():
    # log('request=======', request.__dict__)
    u = current_user()
    weibos = Weibo.all()
    for w in weibos:
        weibo_id = w.id
        weibo_owner_id = w.user_id
        w.username = User.find_by(id=weibo_owner_id).username
        comments = Comment.find_all(weibo_id=weibo_id)
        for c in comments:
            comment_owner_id = c.user_id
            c.username = User.find_by(id=comment_owner_id).username
        # 将 comments 对象转换成列表
        comments_js = [t.json() for t in comments]
        w.comments = comments_js
    # 序列化 weibo 对象
    weibos_js = [t.json() for t in weibos]
    return jsonify(weibos_js)


@bp.route('/api/weibo/add', methods=['POST'])
@login_required
def add():
    # 得到浏览器发送的表单, 浏览器用 ajax 发送 json 格式的数据过来
    # 所以这里我们用新增加的 json 函数来获取格式化后的 json 数据
    form = request.json
    # 创建一个 weibo
    u = current_user()
    t = Weibo.add(form, u.id)
    t.username = u.username
    # 把创建好的 todo 返回给浏览器
    return jsonify(t.json())


@bp.route('/api/weibo/delete')
@login_required
@weibo_owner_required
def delete():
    log('delete start')
    weibo_id = int(request.args['id'])
    Weibo.delete(weibo_id)
    comments = Comment.find_all(weibo_id=weibo_id)
    for c in comments:
        log('c.id', c.id)
        Comment.delete(c.id)
    d = dict(
        remove = True,
        message="成功删除 weibo"
    )
    return jsonify(d)


@bp.route('/api/weibo/update', methods=['POST'])
@login_required
@weibo_owner_required
def update():
    form: dict = request.json
    weibo_id = int(form.pop('id'))
    t = Weibo.update(weibo_id, **form)
    return jsonify(t.json())


@bp.route('/api/comment/add', methods=['POST'])
@login_required
def comment_add():
    # 得到浏览器发送的表单, 浏览器用 ajax 发送 json 格式的数据过来
    # 所以这里我们用新增加的 json 函数来获取格式化后的 json 数据
    form = request.json
    # 创建一个 comment
    u = current_user()
    t = Comment.add(form, u.id)
    t.username = u.username
    # 把创建好的 todo 返回给浏览器
    return jsonify(t.json())


@bp.route('/api/comment/delete')
@login_required
@comment_owner_reuired
def comment_delete():
    log('start delete')
    comment_id = int(request.args['id'])
    Comment.delete(comment_id)
    d = dict(
        remove = True,
        message="成功删除 comment"
    )
    return jsonify(d)

@bp.route('/api/comment/update', methods=['POST'])
@login_required
@comment_owner_reuired
def comment_update():
    form: dict = request.json
    comment_id = int(form.pop('id'))
    t = Comment.update(comment_id, **form)
    comment_user_id = Comment.find_by(id=comment_id).user_id
    comment_user = User.find_by(id=comment_user_id).username
    t.username = comment_user
    t.message = '更新成功'
    return jsonify(t.json())


# def login_required(route_function):
#     """
#     这个函数看起来非常绕，所以你不懂也没关系
#     就直接拿来复制粘贴就好了
#     """
#
#     def f():
#         log('login_required')
#         u = current_user()
#         if u.is_guest():
#             log('游客用户')
#             d = dict(
#                 remove = False,
#                 message="权限不足"
#             )
#             return json_response(d)
#         else:
#             log('登录用户', route_function)
#             return route_function()
#
#     return f





# def route_dict():
#     d = {
#         '/api/weibo/all': login_required(all),
#         # '/api/weibo/all': all,
#         '/api/weibo/add': login_required(add),
#         '/api/weibo/delete': login_required(weibo_owner_required(delete)),
#         '/api/weibo/update': login_required(weibo_owner_required(update)),
#         '/api/comment/add': login_required(comment_add),
#         '/api/comment/delete': login_required(comment_onwer_reuired(comment_delete)),
#         '/api/comment/update': login_required(comment_onwer_reuired(comment_update)),
#     }
#     return d