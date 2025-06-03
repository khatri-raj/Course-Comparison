from django import forms
from .models import ContactMessage
from django.contrib.auth.models import User
from django.contrib.auth.forms import PasswordChangeForm


class ContactMessageForm(forms.ModelForm):
    class Meta:
        model = ContactMessage
        fields = ['name', 'email', 'subject', 'message']
        
class UserUpdateForm(forms.ModelForm):
    username = forms.CharField(
        max_length=150,
        required=True,
        help_text="Required. 150 characters or fewer. Letters, digits and @/./+/-/_ only."
    )
    email = forms.EmailField(
        required=True,
        help_text="Required. Enter a valid email address."
    )

    class Meta:
        model = User
        fields = ['username', 'email']

    def clean_username(self):
        username = self.cleaned_data['username']
        qs = User.objects.filter(username=username).exclude(pk=self.instance.pk)
        if qs.exists():
            raise forms.ValidationError("Username is already taken.")
        return username

    def clean_email(self):
        email = self.cleaned_data['email']
        qs = User.objects.filter(email=email).exclude(pk=self.instance.pk)
        if qs.exists():
            raise forms.ValidationError("Email is already registered.")
        return email

class CustomPasswordChangeForm(PasswordChangeForm):
    def clean_new_password1(self):
        password = self.cleaned_data.get('new_password1')
        if password and len(password) < 8:
            raise forms.ValidationError("Password must be at least 8 characters long.")
        return password
