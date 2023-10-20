from django.contrib.auth.decorators import user_passes_test, login_required
from django.contrib.auth import logout


def logout_required(function=None, logout_url=""):
    actual_decorator = user_passes_test(
        lambda u: not u.is_authenticated,
        login_url=logout_url
    )
    if function:
        return actual_decorator(function)
    return actual_decorator


def superuser_required(function=None, redirect_url=""):
    actual_decorator = user_passes_test(
        lambda u: u.is_superuser,
        login_url=redirect_url
    )
    if function:
        return actual_decorator(function)
    return actual_decorator


def staff_required(function=None, redirect_url=""):
    actual_decorator = user_passes_test(
        lambda u: u.is_staff,
        login_url=redirect_url
    )
    if function:
        return actual_decorator(function)
    return actual_decorator


def role_required(function=None, is_login=True, login_url="", is_superuser=False, is_staff=False, is_writer=False, is_blogger=False, is_proofreader=False, redirect_url=""):
    url = None
    if is_login:
        url = redirect_url
    else:
        url = login_url

    if is_superuser:
        def condition(u): return u.is_superuser
    elif is_staff:
        def condition(u): return u.is_staff
    elif is_writer:
        def condition(u): return u.is_writer
    elif is_blogger:
        def condition(u): return u.is_blogger
    elif is_proofreader:
        def condition(u): return u.is_proofreader

    actual_decorator = user_passes_test(
        condition,
        login_url=url
    )

    if function:
        return actual_decorator(function)
    return actual_decorator
