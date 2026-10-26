from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User, Contact, SOSRequest


@admin.register(User)
class CustomUserAdmin(UserAdmin):
    list_display = ('username', 'email', 'phone', 'is_police', 'is_staff')
    fieldsets = UserAdmin.fieldsets + (
        ('Extra Info', {'fields': ('phone', 'is_police')}),
    )


@admin.register(Contact)
class ContactAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'phone', 'relation', 'user')
    search_fields = ('name', 'phone')


@admin.register(SOSRequest)
class SOSRequestAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'lat', 'lng', 'status', 'created_at')
    list_filter = ('status',)
    search_fields = ('user__username',)