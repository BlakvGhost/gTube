from django.urls import path
from . import views

urlpatterns = [
    path('',views.index,name='index'),
    path('q/',views.looking_video, name="q"),
]