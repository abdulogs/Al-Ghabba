from itsdangerous import Serializer
from rest_framework import serializers
from drf_writable_nested.serializers import WritableNestedModelSerializer
from app.models import *
from django.utils.encoding import smart_str, force_bytes, DjangoUnicodeDecodeError
from django.utils.http import urlsafe_base64_decode, urlsafe_base64_encode
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from email_utils import send_email
from app.helpers import exact_url


class RegistrationSerializer(serializers.ModelSerializer):
    # We are writing this becoz we need confirm password field in our Registratin Request
    password2 = serializers.CharField(
        style={'input_type': 'password'}, write_only=True)

    class Meta:
        model = User
        fields = ['username', 'first_name', 'last_name', 'email', 'password', 'password2',
                  'is_staff', 'is_superuser', 'is_agent', 'is_active']
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
            link = exact_url(
                request, f"/dashboard/password-recover/{uid}/{token}/")
            # Send EMail
            send_email(
                context={
                    "url": exact_url(request),
                    "logo": exact_url(request, "/src/images/logo/logo.png"),
                    "link": link,
                    "message": "Click on the button below to recover your account",
                },
                from_email="",
                recipient_list=[email],
                subject='Password verification link',
                template_name='emails/account-password-verification.html',
            )
            return attrs
        else:
            raise serializers.ValidationError('You are not a registered User')


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


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'first_name', 'last_name', 'username', 'email', 'avatar',"facebook","twitter","mail",
                  'is_superuser', 'is_staff', 'is_agent', 'is_active', 'created_at', 'updated_at')


class CreatedBySerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'first_name', 'last_name',
                  'email', 'username', 'avatar')
        read_only_fields = ('first_name', 'last_name',
                            'email', 'username', 'avatar')


class BlogCategorySerializer(WritableNestedModelSerializer):
    created_by = CreatedBySerializer(many=False,)

    class Meta:
        model = BlogCategory
        fields = ('id', 'name', 'is_active', 'created_by',
                  'created_at', 'updated_at')


class BlogSerializer(WritableNestedModelSerializer):
    created_by = CreatedBySerializer(many=False)
    category = BlogCategorySerializer(many=False, read_only=True)
    category_id = serializers.CharField()

    class Meta:
        model = Blog
        fields = ('id', 'name', 'description', 'category', 'category_id', 'image',
                  'alt', 'is_active', 'created_by', 'created_at', 'updated_at')


class FaqSerializer(WritableNestedModelSerializer):
    created_by = CreatedBySerializer(many=False)

    class Meta:
        model = Faq
        fields = ('id', 'answer', 'question', 'is_active',
                  'created_by', 'created_at', 'updated_at')


class QuerySerializer(WritableNestedModelSerializer):
    class Meta:
        model = Query
        fields = ('id', 'fullname', "email", "phone", "message", "reply", 'document', "is_active",
                  'created_at', 'updated_at')

    def update(self, instance, validated_data):
        request = self.context['request']
        instance.fullname = validated_data.get("fullname")
        instance.email = validated_data.get("email")
        instance.phone = validated_data.get("phone")
        instance.message = validated_data.get("message")
        instance.reply = validated_data.get("reply")
        instance.is_active = validated_data.get("is_active")
        fullname = request.data.get('fullname')
        email = request.data.get('email')
        query = validated_data.get("message")
        reply = request.data.get('reply')

        send_email(
            context={
                "url": exact_url(request),
                "logo": exact_url(request, "/src/images/logo/logo.png"),
                "query": query,
                "reply": reply,
                "fullname": fullname,
            },
            from_email="",
            recipient_list=[email],
            subject=f"",
            template_name='emails/query.html',
        )

        instance.save()
        return instance


class SubscriberSerializer(WritableNestedModelSerializer):
    class Meta:
        model = Query
        fields = ('id',  "email", 'is_active', 'created_at', 'updated_at')


class NewsletterSerializer(WritableNestedModelSerializer):
    class Meta:
        model = Newsletter
        fields = ('id', "name", 'description',
                  'is_active', 'created_at', 'updated_at')

    def create(self, validated_data):
        request = self.context['request']
        name = validated_data.get("name")
        description = validated_data.get("description")
        is_active = validated_data.get("is_active")
        is_email = request.data.get('is_email')

        emails = []
        subscribers = Subscriber.objects.filter(is_active=True)
        for subscriber in subscribers:
            emails.append(subscriber.email)

        if is_email == "true":
            send_email(
                context={
                    "url": exact_url(request),
                    "logo": exact_url(request, "/src/images/logo/logo.png"),
                    "name": name,
                    "description": description,
                },
                from_email="",
                recipient_list=emails,
                subject=name,
                template_name='emails/newsletter.html')

        newsletter = Newsletter.objects.create(
            name=name, description=description, is_active=is_active)

        return newsletter

    def update(self, instance, validated_data):
        request = self.context['request']
        instance.name = validated_data.get("name")
        instance.description = validated_data.get("description")
        instance.is_active = validated_data.get("is_active")
        name = request.data.get('name')
        description = request.data.get('description')
        is_email = request.data.get('is_email')
        emails = []
        subscribers = Subscriber.objects.filter(is_active=True)
        for subscriber in subscribers:
            emails.append(subscriber.email)

        if is_email == "true":
            send_email(
                context={
                    "url": exact_url(request),
                    "logo": exact_url(request, "/src/images/logo/logo.png"),
                    "name": name,
                    "description": description,
                },
                from_email="",
                recipient_list=emails,
                subject=name,
                template_name='emails/newsletter.html',
            )

        instance.save()
        return instance


class ListingSerializer(WritableNestedModelSerializer):
    created_by = CreatedBySerializer(many=False)

    class Meta:
        model = Listing
        fields = ('id', 'name', 'description', 'image', 'bedroom', 'bathroom', 'square_feet', 'price',"purpose", 'address',
                  'is_active', 'created_by', 'created_at', 'updated_at')
