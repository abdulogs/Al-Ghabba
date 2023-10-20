from django import template
register = template.Library()

@register.filter
def placeholder(value):
    if value == 'avatar.png':
        return "/src/images/placeholders/avatar.png"
    elif value == "placeholder.png":
        return "/src/images/placeholders/placeholder.png"
    else:
        return f'/media/{value}'


@register.filter
def noname(value):
    if value:
        if value.first_name == None and value.last_name == None:
            return "N/A"
        else:
            return value.first_name + " " + value.last_name
    else:
        return "N/A"


@register.filter
def available(value):
    if value:
        if value == None:
            return "N/A"
        else:
            return value
    else:
        return "N/A"


@register.filter
def empty(value):
    if value == "" or value == None or value == "None":
        return ""
    else:
        return value


