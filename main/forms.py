from django import forms
from django.contrib.auth.forms import UserCreationForm
from .models import User, Book


class UserRegistrationForm(forms.ModelForm):
    password = forms.CharField(widget=forms.PasswordInput())
    email = forms.EmailField(required=True)
    is_admin = forms.BooleanField(required=False)

    class Meta:
        model = User
        fields = ('username', 'email', 'password', 'is_admin')


class LoginForm(forms.Form):
    email = forms.EmailField(
        required=True,
        widget=forms.EmailInput(attrs={
            'placeholder': 'Enter email',
            'class': 'form-control'
        })
    )
    password = forms.CharField(
        widget=forms.PasswordInput(attrs={
            'placeholder': 'Enter password',
            'class': 'form-control'
        })
    )


class AddBookForm(forms.ModelForm):
    title = forms.CharField(
        required=True,
        widget=forms.TextInput(attrs={
            'id': 'Add_title',
            'class': 'Add_inputField',
            'placeholder': 'Enter book name'
        })
    )
    author = forms.CharField(
        required=True,
        widget=forms.TextInput(attrs={
            'id': 'Add_Author',
            'class': 'Add_inputField',
            'placeholder': 'Enter author'
        })
    )
    category = forms.CharField(
        required=True,
        widget=forms.TextInput(attrs={
            'id': 'Add_Category',
            'class': 'Add_inputField',
            'placeholder': 'Enter category'
        })
    )
    description = forms.CharField(
        required=True,
        widget=forms.TextInput(attrs={
            'id': 'Add_Description',
            'class': 'Add_inputField',
            'placeholder': 'Enter description'
        })
    )
    image = forms.ImageField(
        required=True,
        widget=forms.ClearableFileInput(attrs={
            'id': 'coverImage',
            'accept': 'image/*',
            'style': 'display: none;'
        })
    )

    class Meta:
        model = Book
        fields = ('title', 'description', 'author', 'category', 'image')



class EditBookForm(forms.ModelForm):
    title = forms.CharField(
        required=False,
        widget=forms.TextInput(attrs={
            'id': 'Book_TitleInput',
            'class': 'EditBookForm_BookIdInput',
            'placeholder': 'Book Name'
        })
    )

    author = forms.CharField(
        required=False,
        widget=forms.TextInput(attrs={
            'id': 'Book_AuthorInput',
            'class': 'EditBookForm_BookIdInput',
            'placeholder': 'Author'
        })
    )

    category = forms.CharField(
        required=False,
        widget=forms.TextInput(attrs={
            'id': 'Book_CategoryInput',
            'class': 'EditBookForm_BookIdInput',
            'placeholder': 'Category'
        })
    )

    description = forms.CharField(
        required=False,
        widget=forms.TextInput(attrs={
            'id': 'Book_DescriptionInput',
            'class': 'EditBookForm_BookIdInput',
            'placeholder': 'Description'
        })
    )

    image = forms.ImageField(
        required=False,
        widget=forms.ClearableFileInput(attrs={
            'id': 'coverImage',
            'accept': 'image/*',
            'style': 'display: none;'
        })
    )

    class Meta:
        model = Book
        fields = ('title', 'description', 'author', 'category', 'image')

    def __init__(self, *args, **kwargs):
        super(EditBookForm, self).__init__(*args, **kwargs)
        # Set placeholders dynamically from instance
        if self.instance:
            self.fields['title'].widget.attrs['placeholder'] = self.instance.title or 'Enter book name'
            self.fields['author'].widget.attrs['placeholder'] = self.instance.author or 'Enter author'
            self.fields['category'].widget.attrs['placeholder'] = self.instance.category or 'Enter category'
            self.fields['description'].widget.attrs['placeholder'] = self.instance.description or 'Enter description'
