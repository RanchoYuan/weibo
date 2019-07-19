from functools import wraps

from models.comment import Comment
from models.weibo import Weibo
from routes import (
    current_user,
    login_required,

)

from flask import (
    request,
    redirect,
    Blueprint,
    render_template,
    current_app,
    jsonify)
from utils import log

bp = Blueprint('routes_weibo',__name__)

@bp.route('/weibo/index')
@login_required
def index():
    """
    weibo 首页的路由函数
    """
    return render_template('weibo_index.html')


# def same_user_required(route_function):
#     """
#     这个函数看起来非常绕，所以你不懂也没关系
#     就直接拿来复制粘贴就好了
#     """
#     def f(request):
#         log('same_user_required')
#         u = current_user()
#         if 'id' in request.query:
#             weibo_id = request.query['id']
#         else:
#             weibo_id = request.form()['id']
#         w = Weibo.txt.find_by(id=int(weibo_id))
#
#         if w.user_id == u.id:
#             return route_function(request)
#         else:
#             return redirect('/weibo/index')
#
#     return f


def weibo_owner_required(route_function):
    @wraps(route_function)
    def f():
        log('1111')
        log('request args=', request.args)
        log('2222')
        log('request json=', request)
        log('3333')
        if 'id' in request.args:
            weibo_id = int(request.args['id'])
        else:
            weibo_id = int(request.json['id'])
        u = current_user()
        w = Weibo.find_by(id=weibo_id)
        if w.user_id == u.id:
            return route_function()
        else:
            d = dict(
                remove = False,
                message="权限不足"
            )
            return jsonify(d)

    return f


def comment_owner_reuired(route_function):
    @wraps(route_function)
    def f():
        if 'id' in request.args:
            log('if true', request.args)
            comment_id = int(request.args['id'])
        else:
            log('if false')
            form: dict = request.json
            comment_id = int(form.get('id'))
        u = current_user()
        c = Comment.find_by(id=comment_id)
        w = Weibo.find_by(id=c.weibo_id)
        if c.user_id == u.id or w.user_id == u.id:
            return route_function()
        else:
            d = dict(
                remove = False,
                message="权限不足"
            )
            return jsonify(d)

    return f