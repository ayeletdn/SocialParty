from django.conf.urls import patterns, url, include
from event import views
from rest_framework import routers

router = routers.DefaultRouter()
router.register(r'events', views.EventViewSet)
router.register(r'guests', views.GuestViewSet)

urlpatterns  = patterns('',
                            url(r'^$', 'event.views.events_list', name='eventlist'),
                            url(r'^add/$', 'event.views.add_event', name='addevent'),
                            url(r'^', include(router.urls)),

                            # rest framework browserable API
                            url(r'^api-auth/', include('rest_framework.urls', namespace='rest_framework')),
                        )