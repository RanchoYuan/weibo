import json
from enum import (
    Enum,
    auto,
)


class UserRole(Enum):
    guest = auto()
    normal = auto()


class YuanEncoder(json.JSONEncoder):
    prefix = "__enum__"

    def default(self, o):
        if isinstance(o, UserRole):
            return {self.prefix: o.name}
        else:
            return super().default(o)


def yuan_decode(d):
    if YuanEncoder.prefix in d:
        name = d[YuanEncoder.prefix]
        return UserRole[name]
    else:
        return d
