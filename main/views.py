import json
from django.shortcuts import render, redirect
from django.contrib.auth import login as auth_login, authenticate, logout
from django.templatetags.static import static


from .forms import UserRegistrationForm, LoginForm, AddBookForm, EditBookForm
from django.http import JsonResponse
from django.views.decorators.csrf import ensure_csrf_cookie
from django.contrib.auth.decorators import user_passes_test
from .models import User, Book


def index(request):
    return render(request, 'main/index.html')


@ensure_csrf_cookie
def register(request):
    if request.method == 'POST':
        form = UserRegistrationForm({
            'username': request.POST.get('username'),
            'email': request.POST.get('email'),
            'password': request.POST.get('password'),
            'is_admin': request.POST.get('is_admin') == 'true'
        })
        if form.is_valid():
            user = form.save(commit=False)
            user.set_password(form.cleaned_data['password'])
            user.save()
            return JsonResponse({'success': True})
        return JsonResponse({'errors': form.errors}, status=400)
    form = UserRegistrationForm()
    return render(request, 'main/register.html', {'form': form})


def login(request):
    if request.method == 'POST':
        email = request.POST.get('email')
        password = request.POST.get('password')

        try:
            user = User.objects.get(email=email)
            if user.check_password(password):
                auth_login(request, user)
                return JsonResponse({
                    'success': True,
                    'role': 'admin' if user.is_admin else 'user',
                    'userId': user.id,
                    'username': user.username
                })
            return JsonResponse({
                'success': False,
                'error': 'Invalid credentials'
            }, status=400)
        except User.DoesNotExist:
            return JsonResponse({
                'success': False,
                'error': 'No account found with this email'
            }, status=400)
        except Exception as e:
            return JsonResponse({
                'success': False,
                'error': str(e)
            }, status=400)

    form = LoginForm()
    return render(request, 'main/login.html', {'form': form})


def logout_view(request):
    logout(request)
    return JsonResponse({'success': True})


def view_books(request):
    return render(request, 'main/ViewBooks.html')


def borrowed_books_list(request):
    return render(request, 'main/BorrowedBooksList.html')


def add_new_book(request):
    if not request.user.is_authenticated:
        return redirect('login')
    if not CheckUserIsAdmin(request.user):
        return redirect('view_books')
    if request.method == "POST":
        try:
            formResult = AddBookForm(request.POST, request.FILES)
            if not formResult.is_valid():
                return JsonResponse({'success': False}, status=400)

            book = formResult.save()

            return JsonResponse({'success': True}, status=200)
        except Exception as e:
            return JsonResponse({'success': False}, status=500)

    form = AddBookForm()
    context = {'form': form}
    return render(request, 'main/AddNewBook.html', context)


def deleteBook(request, book_id):
    print(book_id)
    if not request.user.is_authenticated:
        return redirect('login')
    if not CheckUserIsAdmin(request.user):
        return redirect('view_books')
    if request.method == "DELETE":
        try:
            if not Book.objects.filter(id=book_id).exists():
                return JsonResponse({'success': False}, status=404)
            book = Book.objects.get(book_id)
            book.delete()
            return JsonResponse({'success': True}, status=200)
        except:
            return JsonResponse({'success': False}, status=500)

    return JsonResponse({'success': False}, status=400)


def view_book_details_user(request):
    if request.method == "POST":
        data = json.loads(request.body)
        bookId = data.get('bookId')

        try:
            book = Book.objects.get(pk=bookId)
            return JsonResponse({
                'id': book.id,
                'title': book.title,
                'author': book.author,
                'category': book.category,
                'imageUrl': str(book.image),
                'description': book.description,
            }, status=200)
        except Exception as e:
            return JsonResponse({'error':'book not found'}, status=404)
    return render(request, 'main/ViewBookDetailsUser.html')


def view_book_details_admin(request):
    return render(request, 'main/ViewBookDetailsAdmin.html')

def edit_book(request):
    if not request.user.is_authenticated:
        return redirect('login')
    if not CheckUserIsAdmin(request.user):
        return redirect('view_books')

    if request.method == "POST":
        try:
            bookId = request.POST.get("id")
            if not Book.objects.filter(pk=bookId).exists():
                return JsonResponse({'success': False}, status=404)

            book = Book.objects.get(pk=bookId)
            form = EditBookForm(request.POST, request.FILES, instance=book)

            if not form.is_valid():
                return JsonResponse({'success': False}, status=400)

            for field in form.cleaned_data:
                value = form.cleaned_data[field]
                if value not in [None, '', []]:
                    setattr(book, field, value)

            book.save()
            return JsonResponse({'success': True}, status=200)
        except Exception as e:
            print("Error:", e)
            return JsonResponse({'success': False}, status=500)

    bookId = request.GET.get("id")
    if not Book.objects.filter(pk=bookId).exists():
        return redirect('view_books')

    book = Book.objects.get(pk=bookId)
    form = EditBookForm(instance=book)
    image_url = book.image.url if book.image else '/static/img/testImage.jpeg'
    context = {'form': form, 'image_url': image_url}
    return render(request, 'main/EditBook.html', context)


def CheckUserIsAdmin(user):
    return User.objects.get(pk=user.pk).is_admin
