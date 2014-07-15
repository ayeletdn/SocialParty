from django import forms
from django.db import models
from django.forms import ModelForm
from django.contrib.auth.models import User


class Guest(models.Model):
    email = models.EmailField()
    name = models.CharField(max_length=100)
    user = models.ForeignKey(User)


class Product(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    required_quantity = models.IntegerField(default=1)


class Event(models.Model):
    user = models.ForeignKey(User)
    name = models.CharField(max_length=100)
    date = models.DateTimeField()
    place = models.CharField(max_length=1000)
    guest_list = models.ManyToManyField(Guest, through='Attending')


class Attending(models.Model):
    guest = models.ForeignKey(Guest)
    event = models.ForeignKey(Event)
    product = models.ForeignKey(Product)
    quantity = models.IntegerField(default=0)

    class Meta:
        unique_together = (('guest', 'event', 'product',))


class EventForm(ModelForm):
    class Meta:
        model = Event
        fields = ['name', 'date', 'place']#, 'guest_list']