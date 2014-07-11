from django.shortcuts import render

# Create your views here.
from event.models import Event, EventForm


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