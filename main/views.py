from django.shortcuts import render, redirect
from django.contrib.auth import login as auth_login, authenticate, logout
from .forms import UserRegistrationForm, LoginForm
from django.http import JsonResponse
from django.views.decorators.csrf import ensure_csrf_cookie
from .models import User 

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
    return render(request, 'main/AddNewBook.html') 

def view_book_details_user(request):
    return render(request, 'main/ViewBookDetailsUser.html')  

def view_book_details_admin(request):
    return render(request, 'main/ViewBookDetailsAdmin.html')  

def edit_book(request):
    return render(request, 'main/EditBook.html')