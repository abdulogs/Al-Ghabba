from urllib.parse import urlparse


def exact_url(request, value=""):
    get_url = urlparse(request.build_absolute_uri())
    scheme = get_url.scheme
    domain = get_url.netloc
    path = f"{scheme}://{domain}{value}"
    return path


def cleanseparator(value, ch):
    return value.replace(ch, " ")
