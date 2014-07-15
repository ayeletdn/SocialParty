from django.http import HttpResponse
from rest_framework import serializers
from rest_framework.renderers import JSONRenderer
from models import Event, Guest, Product


class EventSerializer(serializers.HyperlinkedModelSerializer):
    user = serializers.Field(source='user.username')

    class Meta:
        model = Event
        fields = ('user', 'name', 'date', 'place')


class GuestSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Guest
        fields = ('email', 'name')


class ProductSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Product
        fields = ('user', 'name', 'description', 'required_quantity')


class JSONResponse(HttpResponse):
    """
    An HttpResponse that renders its content into JSON.
    """
    def __init__(self, data, **kwargs):
        content = JSONRenderer().render(data)
        kwargs['content_type'] = 'application/json'
        super(JSONResponse, self).__init__(content, **kwargs)