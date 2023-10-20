from .serializers import *
from rest_framework import viewsets
from rest_framework.permissions import IsAdminUser, IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import OrderingFilter, SearchFilter
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from django.contrib.auth import authenticate, login as login_auth
from api.helpers import pagination, authclass, get_tokens_for_user


class RegistrationApi(APIView):
    def post(self, request, format=None):
        serializer = RegistrationSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({'register': True}, status=status.HTTP_201_CREATED)


class LoginApi(APIView):
    def post(self, request, format=None):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        email = serializer.data.get('email')
        password = serializer.data.get('password')
        user = authenticate(username=email, password=password)
        if user:
            token = get_tokens_for_user(user)
            login_auth(request, user)
            return Response({'token': token, 'message': 'Login successfull', 'login': True})
        else:
            return Response({'message': 'Invalid credentials', 'login': False})


class PasswordResetEmailApi(APIView):
    def post(self, request, format=None):
        serializer = PasswordResetEmailSerializer(
            data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        return Response({'message': 'Password Reset link send. Please check your Email'}, status=status.HTTP_200_OK)


class PasswordResetApi(APIView):
    def post(self, request, uid, token, format=None):
        serializer = PasswordResetSerializer(
            data=request.data, context={'uid': uid, 'token': token})
        serializer.is_valid(raise_exception=True)
        return Response({'message': 'Password Reset Successfully'}, status=status.HTTP_200_OK)


class ChangePasswordApi(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, format=None):
        user_id = request.data.get("userid")
        serializer = ChangePasswordSerializer(
            data=request.data, context={'user': user_id})
        serializer.is_valid(raise_exception=True)
        return Response({'message': 'Password changed successfully'}, status=status.HTTP_200_OK)


class BlogCategoryApi(viewsets.ReadOnlyModelViewSet):
    queryset = BlogCategory.objects.filter(is_active=True).select_related()
    serializer_class = BlogCategorySerializer
    filter_backends = [DjangoFilterBackend, OrderingFilter, SearchFilter]
    filterset_fields = ["id", "name", "is_active"]
    ordering = ['-id']
    pagination_class = pagination


class BlogApi(viewsets.ReadOnlyModelViewSet):
    queryset = Blog.objects.filter(is_active=True).select_related()
    serializer_class = BlogSerializer
    filter_backends = [DjangoFilterBackend, OrderingFilter, SearchFilter]
    filterset_fields = ["id", "name", "description",
                        "category__name", "is_active"]
    ordering = ['-id']
    pagination_class = pagination


class QueryApi(viewsets.ModelViewSet):
    queryset = Query.objects.all().select_related()
    serializer_class = QuerySerializer
    ordering = ['-id']


class AgentApi(viewsets.ReadOnlyModelViewSet):
    queryset = User.objects.filter(
        is_active=True, is_agent=True).select_related()
    serializer_class = AgentSerializer
    filter_backends = [DjangoFilterBackend, OrderingFilter, SearchFilter]
    filterset_fields = ["id", "is_active", ]
    search_fields = ["id", "is_active"]
    ordering = ['-id']
    pagination_class = pagination


class ListingApi(viewsets.ReadOnlyModelViewSet):
    queryset = Listing.objects.all().select_related()
    serializer_class = ListingSerializer
    filter_backends = [DjangoFilterBackend, OrderingFilter, SearchFilter]
    filterset_fields = ["id",  "purpose",
                        "bedroom", "bathroom", "created_by_id"]
    search_fields = ["id",  "purpose", "bedroom", "bathroom"]
    ordering = ['-id']
    pagination_class = pagination
