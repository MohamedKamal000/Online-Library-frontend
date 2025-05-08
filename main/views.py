from django.shortcuts import render

def index(request):
    return render(request, 'main/index.html')

def register(request):
    return render(request, 'main/register.html')

def login(request):
    return render(request, 'main/login.html')

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