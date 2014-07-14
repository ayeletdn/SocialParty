from django.shortcuts import render

# Create your views here.
from event.models import Event, EventForm, Guest
from rest_framework import viewsets
from serializers import EventSerializer


def events_list(request):
    return render(request, 'event/EventList.html', {
        'events': [ #Event.objects.order_by('name')
            {'id': 1, 'name': 'Simon'},
            {'id': 2, 'name': 'Alvin'},
            {'id': 3, 'name': 'Theodore'}
        ]
    })


def add_event(request):
    # if request.method == 'GET':
    return render(request, 'event/AddEvent.html', {
        'form': EventForm()
    })


class EventViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows events to be viewed or edited.
    """
    queryset = Event.objects.all()
    serializer_class = EventSerializer




class GuestViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows events to be viewed or edited.
    """
    model = Guest