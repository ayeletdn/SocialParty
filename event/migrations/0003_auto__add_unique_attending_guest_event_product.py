# -*- coding: utf-8 -*-
from south.utils import datetime_utils as datetime
from south.db import db
from south.v2 import SchemaMigration
from django.db import models


class Migration(SchemaMigration):

    def forwards(self, orm):
        # Adding unique constraint on 'Attending', fields ['guest', 'event', 'product']
        db.create_unique(u'event_attending', ['guest_id', 'event_id', 'product_id'])


    def backwards(self, orm):
        # Removing unique constraint on 'Attending', fields ['guest', 'event', 'product']
        db.delete_unique(u'event_attending', ['guest_id', 'event_id', 'product_id'])


    models = {
        u'event.attending': {
            'Meta': {'unique_together': "(('guest', 'event', 'product'),)", 'object_name': 'Attending'},
            'event': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['event.Event']"}),
            'guest': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['event.Guest']"}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'product': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['event.Product']"}),
            'quantity': ('django.db.models.fields.IntegerField', [], {'default': '0'})
        },
        u'event.event': {
            'Meta': {'object_name': 'Event'},
            'date': ('django.db.models.fields.DateTimeField', [], {}),
            'guest_list': ('django.db.models.fields.related.ManyToManyField', [], {'to': u"orm['event.Guest']", 'through': u"orm['event.Attending']", 'symmetrical': 'False'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '100'}),
            'place': ('django.db.models.fields.CharField', [], {'max_length': '1000'})
        },
        u'event.guest': {
            'Meta': {'object_name': 'Guest'},
            'email': ('django.db.models.fields.EmailField', [], {'max_length': '75'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '100'})
        },
        u'event.product': {
            'Meta': {'object_name': 'Product'},
            'description': ('django.db.models.fields.TextField', [], {'blank': 'True'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '100'}),
            'required_quantity': ('django.db.models.fields.IntegerField', [], {'default': '1'})
        }
    }

    complete_apps = ['event']