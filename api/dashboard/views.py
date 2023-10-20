from app.models import *
from .serializers import *
from rest_framework import viewsets
from rest_framework.permissions import IsAdminUser, IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import OrderingFilter, SearchFilter
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from django.contrib.auth import authenticate, login as login_auth
from api.helpers import get_tokens_for_user, authclass, pagination


class RegistrationApi(APIView):
    def post(self, request, format=None):
        serializer = RegistrationSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        token = get_tokens_for_user(user)
        return Response({'token': token, 'message': 'Registration successfull', 'register': True}, status=status.HTTP_201_CREATED)


class LoginApi(APIView):
    def post(self, request, format=None):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        email = serializer.data.get('email')
        password = serializer.data.get('password')
        user = authenticate(username=email, password=password)
        if user:
            if user.is_active == False:
                return Response({'message': 'Your account is deactivated. Please contact to the admin', 'login': False})
            else:
                token = get_tokens_for_user(user)
                login_auth(request, user)
                online = User.objects.get(pk=user.id)
                online.is_online = True
                online.save()
                return Response({'token': token, 'message': 'Login successfull', 'login': True})
        else:
            return Response({'message': 'Invalid credentials', 'login': False})


class ChangePasswordApi(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, format=None):
        user_id = request.data.get("userid")
        serializer = ChangePasswordSerializer(
            data=request.data, context={'user': user_id})
        serializer.is_valid(raise_exception=True)
        return Response({'message': 'Password changed successfully'}, status=status.HTTP_200_OK)


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
        return Response({'message': 'Password Reset Successfully', 'change': True}, status=status.HTTP_200_OK)


class UserApi(viewsets.ModelViewSet):
    queryset = User.objects.all().select_related()
    serializer_class = UserSerializer
    filter_backends = [DjangoFilterBackend, OrderingFilter, SearchFilter]
    filterset_fields = ["id", "username", "first_name", 'last_name',
                        'email', "is_active", "is_agent", "is_superuser", "is_staff"]
    search_fields = ["id", "username", "first_name", 'last_name',
                     'email', "is_active", "is_agent", "is_superuser", "is_staff"]
    pagination_class = pagination
    authentication_classes = authclass
    permission_classes = [IsAdminUser, IsAuthenticated]


class BlogCategoryApi(viewsets.ModelViewSet):
    queryset = BlogCategory.objects.all().select_related()
    serializer_class = BlogCategorySerializer
    filter_backends = [DjangoFilterBackend, OrderingFilter, SearchFilter]
    filterset_fields = ["id", "name", "created_by__first_name",
                        "created_by__last_name", "created_by__username", "is_active"]
    search_fields = ["id", "name", "created_by__first_name",
                     "created_by__last_name", "created_by__username", "is_active"]
    ordering = ['-id']
    pagination_class = pagination
    authentication_classes = authclass
    permission_classes = [IsAdminUser, IsAuthenticated]


class BlogApi(viewsets.ModelViewSet):
    queryset = Blog.objects.all().select_related()
    serializer_class = BlogSerializer
    filter_backends = [DjangoFilterBackend, OrderingFilter, SearchFilter]
    filterset_fields = ["id", "name", "description", "category__name", "created_by__first_name",
                        "created_by__last_name", "created_by__username", "is_active"]
    search_fields = ["id", "name", "description", "category__name", "created_by__first_name",
                     "created_by__last_name", "created_by__username", "is_active"]
    ordering = ['-id']
    pagination_class = pagination
    authentication_classes = authclass
    permission_classes = [IsAdminUser, IsAuthenticated]


class FaqApi(viewsets.ModelViewSet):
    queryset = Faq.objects.all().select_related()
    serializer_class = FaqSerializer
    filter_backends = [DjangoFilterBackend, OrderingFilter, SearchFilter]
    filterset_fields = ["id", "answer", "question", "is_active", "created_by__first_name",
                        "created_by__last_name", "created_by__username", "is_active"]
    search_fields = ["id", "answer", "question", "is_active", "created_by__first_name",
                     "created_by__last_name", "created_by__username", "is_active"]
    ordering = ['-id']
    pagination_class = pagination
    authentication_classes = authclass
    permission_classes = [IsAdminUser, IsAuthenticated]


class QueryApi(viewsets.ModelViewSet):
    queryset = Query.objects.all().select_related()
    serializer_class = QuerySerializer
    filter_backends = [DjangoFilterBackend, OrderingFilter, SearchFilter]
    filterset_fields = ["id", "fullname", "email",
                        "phone", "reply", "message", "is_active"]
    search_fields = ["id", "fullname", "email",
                     "phone", "reply", "message", "is_active"]
    ordering = ['-id']
    pagination_class = pagination
    authentication_classes = authclass
    permission_classes = [IsAdminUser, IsAuthenticated]


class SubscriberApi(viewsets.ModelViewSet):
    queryset = Subscriber.objects.all().select_related()
    serializer_class = SubscriberSerializer
    filter_backends = [DjangoFilterBackend, OrderingFilter, SearchFilter]
    filterset_fields = ["id", "email", 'is_active']
    search_fields = ["id", "email", 'is_active']
    ordering = ['-id']
    pagination_class = pagination
    authentication_classes = authclass
    permission_classes = [IsAdminUser, IsAuthenticated]


class NewsletterApi(viewsets.ModelViewSet):
    queryset = Newsletter.objects.all().select_related()
    serializer_class = NewsletterSerializer
    filter_backends = [DjangoFilterBackend, OrderingFilter, SearchFilter]
    filterset_fields = ["id", "name", "description", "is_active"]
    search_fields = ["id", "name", "description", "is_active"]
    ordering = ['-id']
    pagination_class = pagination
    authentication_classes = authclass
    permission_classes = [IsAdminUser, IsAuthenticated]


class ListingApi(viewsets.ModelViewSet):
    queryset = Listing.objects.all().select_related()
    serializer_class = ListingSerializer
    filter_backends = [DjangoFilterBackend, OrderingFilter, SearchFilter]
    filterset_fields = ["id", "name", "square_feet",
                        "bedroom", "bathroom", "is_active"]
    search_fields = ["id", "name", "square_feet",
                     "bedroom", "bathroom", "name", "is_active"]
    ordering = ['-id']
    pagination_class = pagination
    authentication_classes = authclass
    permission_classes = [IsAdminUser, IsAuthenticated]
