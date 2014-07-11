from django.conf.urls import patterns, url
from event import views

urlpatterns  = patterns('',
                            url(r'^$', 'event.views.events_list', name='eventlist'),
                            url(r'^add/$', 'event.views.add_event', name='addevent'),
                        )