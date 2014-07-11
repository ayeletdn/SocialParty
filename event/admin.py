from django.contrib import admin
from event.models import Event, Product, Guest, Attending
# Register your models here.

admin.site.register(Event)
admin.site.register(Product)
admin.site.register(Guest)
admin.site.register(Attending)
