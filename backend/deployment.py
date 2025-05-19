import os
from .settings import *
from .settings import BASE_DIR

ALLOWED_HOSTS = os.environ['ALLOWED_HOSTS'].split(',')
CSRF_TRUSTED_ORIGINS = ['https://' + host for host in os.environ['CSRF_TRUSTED_ORIGINS'].split(',')]
SECRET_KEY = os.environ['SECRET_KEY']
DEBUG = False

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    'main.middleware.Custom404Middleware'
]

STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')


DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': os.environ['DB_NAME'],
        'USER': os.environ['DB_USER'],
        'PASSWORD': os.environ['DB_PASSWORD'],
        'HOST': os.environ['DB_HOST'],
        'OPTIONS': {
            'init_command': "SET sql_mode='STRICT_TRANS_TABLES'",
        }
    }
}


CLOUDINARY_STORAGE = {
    'CLOUD_NAME': os.environ['CLOUD_NAME'],
    'API_KEY': os.environ['API_KEY'],
    'API_SECRET': os.environ['API_SECRET'],
}

cloudinary.config(
    cloud_name=CLOUDINARY_STORAGE['CLOUD_NAME'],
    api_key=CLOUDINARY_STORAGE['API_KEY'],
    api_secret=CLOUDINARY_STORAGE['API_SECRET']
)

CLOUDINARY_URL = f"cloudinary://{CLOUDINARY_STORAGE['API_KEY']}:{CLOUDINARY_STORAGE['API_SECRET']}@{CLOUDINARY_STORAGE['CLOUD_NAME']}"

DEFAULT_FILE_STORAGE = 'cloudinary_storage.storage.MediaCloudinaryStorage'