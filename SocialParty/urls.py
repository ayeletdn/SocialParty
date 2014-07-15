from django.conf.urls import patterns, include, url

from django.contrib import admin
admin.autodiscover()

urlpatterns = patterns('',
    # url(r'^blog/', include('blog.urls')),

    url(r'^event/', include('event.urls')),
    url(r'^admin/', include(admin.site.urls)),


    # rest framework browserable API
    url(r'^api-auth/', include('rest_framework.urls', namespace='rest_framework')),
)
