from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.pagination import PageNumberPagination
from rest_framework_simplejwt.authentication import JWTAuthentication

authclass = [JWTAuthentication]

def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)
    data = {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
        'user_id': user.id,
        'admin': user.is_superuser,
        'staff': user.is_staff
    }
    return data

class pagination(PageNumberPagination):
    page_size = 5
    page_query_param = "page"
    page_size_query_param = "records"
    max_page_size = 100
    last_page_strings = ('last',)
