from rest_framework import serializers
from app.models import *
from django.utils.encoding import smart_str, force_bytes, DjangoUnicodeDecodeError
from django.utils.http import urlsafe_base64_decode, urlsafe_base64_encode
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from email_utils import send_email


class CreatedBySerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'first_name', 'last_name',
                  'email', 'username', 'avatar')
        read_only_fields = ('first_name', 'last_name',
                            'email', 'username', 'avatar')


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'first_name', 'last_name',
                  'email', 'avatar', 'created_at', 'updated_at')


class RegistrationSerializer(serializers.ModelSerializer):
    password2 = serializers.CharField(
        style={'input_type': 'password'}, write_only=True)

    class Meta:
        model = User
        fields = ['username', 'first_name', 'last_name',
                  'email', 'password', 'password2', 'is_superuser', 'is_staff']
        extra_kwargs = {'password': {'write_only': True}}

    # Validating Password and Confirm Password while Registration
    def validate(self, attrs):
        password = attrs.get('password')
        password2 = attrs.get('password2')
        if password != password2:
            raise serializers.ValidationError(
                "Password and Confirm Password doesn't match")
        return attrs

    def create(self, validate_data):
        return User.objects.create_user(**validate_data)


class LoginSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(max_length=255)

    class Meta:
        model = User
        fields = ['email', 'password']


class PasswordResetEmailSerializer(serializers.Serializer):
    email = serializers.EmailField(max_length=255)

    class Meta:
        fields = ['email']

    def validate(self, attrs):
        request = self.context["request"]
        email = attrs.get('email')
        if User.objects.filter(email=email).exists():
            user = User.objects.get(email=email)
            uid = urlsafe_base64_encode(force_bytes(user.id))
            token = PasswordResetTokenGenerator().make_token(user)
            logo = request.build_absolute_uri("/static/web/images/logo.jpg")
            link = request.build_absolute_uri(
                f"/password-recover/{uid}/{token}")
            url = request.build_absolute_uri()

            # Send EMail
            send_email(
                context={
                    "url": url,
                    "logo": logo,
                    "link": link,
                    "message": "Click on the button below to recover your account",
                },
                from_email="no-reply@gmail.com",
                recipient_list=[email],
                subject='Password verification link',
                template_name='emails/account-password-verification.html',
            )
            return attrs
        else:
            raise serializers.ValidationError('You are not a registered User')


class PasswordResetSerializer(serializers.Serializer):
    password = serializers.CharField(
        max_length=255, style={'input_type': 'password'}, write_only=True)
    password2 = serializers.CharField(
        max_length=255, style={'input_type': 'password'}, write_only=True)

    class Meta:
        fields = ['password', 'password2']

    def validate(self, attrs):
        try:
            password = attrs.get('password')
            password2 = attrs.get('password2')
            uid = self.context.get('uid')
            token = self.context.get('token')
            if password != password2:
                raise serializers.ValidationError(
                    "Password and Confirm Password doesn't match")
            id = smart_str(urlsafe_base64_decode(uid))
            user = User.objects.get(id=id)
            if not PasswordResetTokenGenerator().check_token(user, token):
                raise serializers.ValidationError(
                    'Token is not Valid or Expired')
            user.set_password(password)
            user.save()
            return attrs
        except DjangoUnicodeDecodeError as identifier:
            PasswordResetTokenGenerator().check_token(user, token)
            raise serializers.ValidationError('Token is not Valid or Expired')


class ChangePasswordSerializer(serializers.Serializer):
    password = serializers.CharField(
        max_length=255, style={'input_type': 'password'}, write_only=True)
    password2 = serializers.CharField(
        max_length=255, style={'input_type': 'password'}, write_only=True)

    class Meta:
        fields = ['password', 'password2']

    def validate(self, attrs):
        password = attrs.get('password')
        password2 = attrs.get('password2')
        userid = self.context.get('user')
        user = User.objects.get(id=userid)
        if password != password2:
            raise serializers.ValidationError(
                "Password and Confirm Password doesn't match")
        user.set_password(password)
        user.save()
        return attrs


class QuerySerializer(serializers.ModelSerializer):
    class Meta:
        model = Query
        fields = ('id', 'fullname', "email", "phone", "message",
                  "is_active", 'created_at', 'updated_at')


class BlogCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = BlogCategory
        fields = ('id', 'name', 'is_active')


class BlogSerializer(serializers.ModelSerializer):
    created_by = CreatedBySerializer(many=False, read_only=True)
    category = BlogCategorySerializer(many=False, read_only=True)

    class Meta:
        model = Blog
        fields = ('id', 'name', 'description', 'category', 'image',
                  'alt', 'is_active', 'created_by', 'created_at', 'updated_at')


class AgentSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = ('id', 'username', 'first_name', 'last_name', 'mail', 'facebook', 'twitter', 'avatar')


class ListingSerializer(serializers.ModelSerializer):
    created_by = CreatedBySerializer(many=False, read_only=True)

    class Meta:
        model = Listing
        fields = ('id', 'name', 'description', 'image', "purpose",'bedroom', 'bathroom', 'square_feet', 'price', 'address',
                  'is_active', 'created_by',   'created_at', 'updated_at')
