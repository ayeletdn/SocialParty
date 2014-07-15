from django.conf.urls import patterns, url, include
from event import views
from rest_framework import routers

router = routers.DefaultRouter()
router.register(r'events', views.EventViewSet)
router.register(r'guests', views.GuestViewSet)
router.register(r'products', views.ProductViewSet)

urlpatterns  = patterns('',
                            url(r'^$', 'event.views.events', name='eventsview'),
                            url(r'^add/$', 'event.views.add_event', name='addevent'),
                            url(r'^', include(router.urls)),


                            url(r'^list/$', 'event.views.events_list', name='eventlist'), #API
                        )